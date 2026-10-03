import express, { Request, Response } from "express";
import { getGeminiAI } from "../services/gemini";
import campaignTargets from "../data/evolveNowCampaignTargets.json";

export const commandRouter = express.Router();

const TOLL_FREE = "(833) 345-4785";

const AGENT_PROMPTS: Record<string, string> = {
  manus: `You are IGNITUS MANUS, the permanent universal operator for Ignitus Core, driving the getsalesure.com business model.
Evolve Now ladder: Stage 1 $55/delivery (zero risk); Stage 2 $550 setup + $150/mo; Stage 3 +$200 for 10 brand-DNA videos; Stage 4 $1,500 full rebrand.
Outreach doctrine: start with the operator's pain, get eye to eye, show the immediate fix, deliver cinematic and short (video <= 20s), follow See / Touch / Feel.
One sample site per trade; outbound strikes send that site dressed in the target's brand DNA.
Voice and RCS line: ${TOLL_FREE} (Tiana). Hard rule: zero autonomous ad spend. Never invent contact details, stats, or results. Be direct, zero fluff, short answers.`,
  social: `You are the Social Platform Operator for Ignitus Core. Lane: content and posting only.
You draft post copy, carousel captions and lead hooks (e.g. the 'comment INSIDER' play) and report what is ready, scheduled, or live.
You never touch Twilio or code. Short, direct, zero fluff. Never invent metrics or posted/scheduled status you were not given.`,
};

// ── Agent chat (text; the UI adds voice in/out) ───────────────────────────
commandRouter.post("/chat", async (req: Request, res: Response) => {
  try {
    const { agent = "manus", message, history = [] } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, error: "message is required" });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        success: false,
        error: "GEMINI_API_KEY is not set on the server, so the agents cannot answer yet.",
      });
    }
    const system = AGENT_PROMPTS[agent] || AGENT_PROMPTS.manus;
    const contents = [
      ...history.slice(-12).map((m: any) => ({
        role: m.role === "agent" ? "model" : "user",
        parts: [{ text: String(m.text || "") }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];
    const ai = getGeminiAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { systemInstruction: system },
    });
    res.json({ success: true, agent, reply: (response.text || "").trim() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
});

// ── Campaign targets (names/domains only; no phone numbers are stored) ─────
commandRouter.get("/targets", (_req: Request, res: Response) => {
  res.json({ success: true, campaign: campaignTargets });
});

// ── RCS / SMS console: operator-approved sending only ─────────────────────
interface OutboundMessage {
  id: string;
  to: string;
  body: string;
  targetId?: string;
  status: "QUEUED" | "SENT" | "FAILED";
  channel?: string;
  sid?: string;
  error?: string;
  createdAt: number;
  sentAt?: number;
}
const outbox: OutboundMessage[] = [];
const OPT_OUT = " Reply STOP to opt out.";

const twilioReady = () => Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
const senderReady = () => Boolean(process.env.TWILIO_MESSAGING_SERVICE_SID || process.env.TWILIO_PHONE_NUMBER);

commandRouter.get("/rcs/status", (_req: Request, res: Response) => {
  res.json({
    success: true,
    twilioCredentials: twilioReady(),
    sender: process.env.TWILIO_MESSAGING_SERVICE_SID
      ? "MESSAGING_SERVICE (RCS where the sender is RCS-enabled, SMS fallback)"
      : process.env.TWILIO_PHONE_NUMBER
      ? "PHONE_NUMBER (SMS)"
      : "NONE",
    canSend: twilioReady() && senderReady(),
    queued: outbox.filter((m) => m.status === "QUEUED").length,
    sent: outbox.filter((m) => m.status === "SENT").length,
  });
});

commandRouter.get("/rcs/queue", (_req: Request, res: Response) => {
  res.json({ success: true, messages: outbox });
});

commandRouter.post("/rcs/queue", (req: Request, res: Response) => {
  const { to, body, targetId } = req.body || {};
  const phone = String(to || "").replace(/[^\d+]/g, "");
  if (!/^\+[1-9]\d{9,14}$/.test(phone)) {
    return res.status(400).json({ success: false, error: "to must be an E.164 number, e.g. +12145550123" });
  }
  if (!body || typeof body !== "string") {
    return res.status(400).json({ success: false, error: "body is required" });
  }
  const text = body.trim();
  const msg: OutboundMessage = {
    id: `out-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    to: phone,
    body: /stop/i.test(text) ? text : text + OPT_OUT,
    targetId,
    status: "QUEUED",
    createdAt: Date.now(),
  };
  outbox.unshift(msg);
  res.json({ success: true, message: msg });
});

// Sending requires an explicit per-message operator approval (the console's Send button).
commandRouter.post("/rcs/send", async (req: Request, res: Response) => {
  try {
    const { id, approvedBy } = req.body || {};
    if (approvedBy !== "operator") {
      return res.status(403).json({ success: false, error: "Operator approval required to send." });
    }
    const msg = outbox.find((m) => m.id === id);
    if (!msg) return res.status(404).json({ success: false, error: "message not found" });
    if (msg.status === "SENT") return res.status(409).json({ success: false, error: "already sent" });
    if (!twilioReady() || !senderReady()) {
      return res.status(503).json({
        success: false,
        error: "Twilio is not configured: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_MESSAGING_SERVICE_SID (or TWILIO_PHONE_NUMBER).",
      });
    }
    const sid = process.env.TWILIO_ACCOUNT_SID as string;
    const params = new URLSearchParams({ To: msg.to, Body: msg.body });
    if (process.env.TWILIO_MESSAGING_SERVICE_SID) {
      params.set("MessagingServiceSid", process.env.TWILIO_MESSAGING_SERVICE_SID);
    } else {
      params.set("From", process.env.TWILIO_PHONE_NUMBER as string);
    }
    const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
    const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      msg.status = "FAILED";
      msg.error = data?.message || `Twilio HTTP ${r.status}`;
      return res.status(502).json({ success: false, message: msg });
    }
    msg.status = "SENT";
    msg.sid = data.sid;
    msg.channel = process.env.TWILIO_MESSAGING_SERVICE_SID ? "RCS/SMS via Messaging Service" : "SMS";
    msg.sentAt = Date.now();
    res.json({ success: true, message: msg });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
});
