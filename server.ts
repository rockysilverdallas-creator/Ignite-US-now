import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Clean and sanitize incoming domain URLs (strips tracking query strings like ?fbclid=...)
function cleanUrl(rawUrl: string): { cleanDomain: string; rawUrlScrubbed: string } {
  let cleaned = (rawUrl || "").trim();
  // Remove protocols
  cleaned = cleaned.replace(/^https?:\/\//i, "");
  // Remove www.
  cleaned = cleaned.replace(/^www\./i, "");
  // Remove query params and hash anchors
  cleaned = cleaned.split("?")[0].split("#")[0];
  // Remove trailing slashes
  cleaned = cleaned.replace(/\/+$/, "");

  const cleanDomain = cleaned.toLowerCase() || "viscong.com";
  return {
    cleanDomain,
    rawUrlScrubbed: `https://${cleanDomain}`,
  };
}

// Calculate revenue leak and efficiency math locally on server
function calculateLeakMath(jobValue: number, currentLeads: number, closeRatePct: number) {
  const closeRate = Math.max(0.01, closeRatePct / 100);
  const optimizedLeads = currentLeads * 2.5;
  const currentRevenue = currentLeads * closeRate * jobValue;
  const optimizedRevenue = optimizedLeads * (closeRate * 1.25) * jobValue;
  const monthlyLeak = Math.max(0, optimizedRevenue - currentRevenue);
  const annualLeak = monthlyLeak * 12;

  const efficiencyLiftPct = Math.round(((optimizedRevenue - currentRevenue) / (currentRevenue || 1)) * 100);
  const velocityMultiplier = 3.2; // 3.2x faster response & lead capture velocity
  const projectedScalingOutput = Math.round(optimizedRevenue * 12);

  return {
    currentMonthlyRev: Math.round(currentRevenue),
    optimizedMonthlyRev: Math.round(optimizedRevenue),
    monthlyLeak: Math.round(monthlyLeak),
    annualLeak: Math.round(annualLeak),
    efficiencyLiftPct: Math.max(120, efficiencyLiftPct),
    velocityMultiplier,
    projectedScalingOutput,
  };
}

// API Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Audit Endpoint
app.post("/api/audit", async (req, res) => {
  try {
    const rawInputUrl = req.body.url || "https://viscong.com/";
    const { cleanDomain } = cleanUrl(rawInputUrl);

    // Inputs are fully optional! If missing or empty, AI automatically projects baseline conditions.
    let clientName = (req.body.clientName || "").trim();
    let niche = (req.body.niche || "").trim();
    let location = (req.body.location || "").trim();
    let avgJobValue = Number(req.body.avgJobValue) || 0;
    let currentLeads = Number(req.body.currentLeads) || 0;
    let closeRate = Number(req.body.closeRate) || 0;

    // Use baseline defaults if no user overrides are provided
    if (!avgJobValue || avgJobValue <= 0) avgJobValue = 20000;
    if (!currentLeads || currentLeads <= 0) currentLeads = 45;
    if (!closeRate || closeRate <= 0) closeRate = 18;

    const mathResults = calculateLeakMath(avgJobValue, currentLeads, closeRate);

    const systemInstruction = `You are the Lead Campaign Orchestrator for Ignitus Core, operating under the Gladiator Protocol.
Your mission is to perform a deep technical sweep and audit of a client's domain URL: "${cleanDomain}".

CRITICAL INSTRUCTIONS FOR DOMAIN AUDIT:
1. EXAMINE THE TARGET DOMAIN ("${cleanDomain}") CAREFULLY.
   - If the domain is "viscong.com", the business is Viscon General Contracting / Viscon Group (Commercial Contracting & Construction).
   - DEDUCE the exact brand name from the domain string if no client name was explicitly provided by the user. DO NOT use generic placeholder names like "Bob, Concrete & Drywall Contractor" unless the domain literally contains "bobconcrete"!
   - DEDUCE the actual industry/niche from the domain name (e.g. Commercial Construction, General Contracting, Roofing, HVAC).

2. NO REQUIRED USER METRICS:
   - The user does NOT need to provide monthly web leads or close rates. You must sweep the domain condition, identify the site's structural gaps (no instant scoping, static contact form, slow mobile layout), and project what percentage increase in efficiency, velocity, and output scaling will look like.

3. PROPOSE A CLINICAL 4-PART GLADIATOR PROPOSAL:
   1. [THE FRONT DOOR OVERHAUL] - Compare current passive site with high-impact "digital face".
   2. [THE HOOK: WHAT YOU HAVE vs. WHAT YOU DON'T HAVE] - Explicitly state projected monthly leak ($${mathResults.monthlyLeak.toLocaleString()}/mo), efficiency lift (+${mathResults.efficiencyLiftPct}%), and velocity boost (${mathResults.velocityMultiplier}x).
   3. [THE WEAPON: WHAT WE GIVE YOU] - Detail AI components: 60s Interactive Scoping, Intent Ingestion (Google MUM), Autonomic Direct-to-SMS CRM Routing.
   4. [THE RESULT: HOW WE DO IT] - Define 4-step execution: Asset extraction, 72h staging build, owner approval, live deployment.

4. SALES PLAYBOOK:
   - Provide custom opening hook, single-job value anchoring, objection handlers, closing script, and guarantee terms customized to this specific business brand (${cleanDomain}).`;

    const prompt = `Perform a full Gladiator Protocol Audit & Efficiency Scaling Analysis for:
Target Domain: ${cleanDomain}
User Provided Name: ${clientName || "None (Infer from domain " + cleanDomain + ")"}
User Provided Niche: ${niche || "None (Infer from domain " + cleanDomain + ")"}
Location context: ${location || "Regional Metro Area"}
Projected Benchmark Job Value: $${avgJobValue}
Projected Benchmark Leads: ${currentLeads}/mo
Projected Close Rate: ${closeRate}%
Calculated Leak: $${mathResults.monthlyLeak.toLocaleString()}/mo ($${mathResults.annualLeak.toLocaleString()}/yr)`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clientInfo: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                clientName: { type: Type.STRING },
                targetDomain: { type: Type.STRING },
                niche: { type: Type.STRING },
                location: { type: Type.STRING },
                avgJobValue: { type: Type.NUMBER },
                currentLeads: { type: Type.NUMBER },
                closeRate: { type: Type.NUMBER },
                auditedTechStack: { type: Type.STRING },
                pageSpeed: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: ["clientName", "targetDomain", "niche", "avgJobValue", "currentLeads", "closeRate"],
            },
            technicalDetails: {
              type: Type.OBJECT,
              properties: {
                hosting: { type: Type.STRING },
                cms: { type: Type.STRING },
                pixels: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                mobileSpeedSec: { type: Type.NUMBER },
                sslSecure: { type: Type.BOOLEAN },
                touchCtaPresent: { type: Type.BOOLEAN },
                missedLeadsScore: { type: Type.NUMBER },
                headlineCopy: { type: Type.STRING },
                identifiedGaps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                competitiveDisadvantages: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                "hosting",
                "cms",
                "pixels",
                "mobileSpeedSec",
                "sslSecure",
                "touchCtaPresent",
                "missedLeadsScore",
                "headlineCopy",
                "identifiedGaps",
                "competitiveDisadvantages",
              ],
            },
            proposal: {
              type: Type.OBJECT,
              properties: {
                frontDoorOverhaul: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    currentGravestone: { type: Type.STRING },
                    ignitusDigitalFace: { type: Type.STRING },
                    craftsmanshipImpact: { type: Type.STRING },
                  },
                  required: ["title", "currentGravestone", "ignitusDigitalFace", "craftsmanshipImpact"],
                },
                theHook: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    currentPassiveState: { type: Type.STRING },
                    ignitusState: { type: Type.STRING },
                    leakSummaryText: { type: Type.STRING },
                    monthlyLeakAmount: { type: Type.NUMBER },
                    annualLeakAmount: { type: Type.NUMBER },
                  },
                  required: [
                    "title",
                    "currentPassiveState",
                    "ignitusState",
                    "leakSummaryText",
                    "monthlyLeakAmount",
                    "annualLeakAmount",
                  ],
                },
                theWeapon: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    interactiveScoping: { type: Type.STRING },
                    intentIngestion: { type: Type.STRING },
                    autonomicRouting: { type: Type.STRING },
                  },
                  required: ["title", "interactiveScoping", "intentIngestion", "autonomicRouting"],
                },
                theResult: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    step1AssetExtraction: { type: Type.STRING },
                    step2StagingBuild: { type: Type.STRING },
                    step3OwnerApproval: { type: Type.STRING },
                    step4LiveDeployment: { type: Type.STRING },
                  },
                  required: [
                    "title",
                    "step1AssetExtraction",
                    "step2StagingBuild",
                    "step3OwnerApproval",
                    "step4LiveDeployment",
                  ],
                },
              },
              required: ["frontDoorOverhaul", "theHook", "theWeapon", "theResult"],
            },
            playbook: {
              type: Type.OBJECT,
              properties: {
                openingHook: { type: Type.STRING },
                valueAnchoring: { type: Type.STRING },
                objectionHandlers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      objection: { type: Type.STRING },
                      response: { type: Type.STRING },
                    },
                    required: ["objection", "response"],
                  },
                },
                closingScript: { type: Type.STRING },
                guaranteeTerms: { type: Type.STRING },
              },
              required: ["openingHook", "valueAnchoring", "objectionHandlers", "closingScript", "guaranteeTerms"],
            },
          },
          required: ["clientInfo", "technicalDetails", "proposal", "playbook"],
        },
      },
    });

    const parsedData = JSON.parse(response.text || "{}");

    // Dynamic extraction: prioritize inferred client name if user didn't specify
    const finalClientName =
      clientName ||
      parsedData.clientInfo?.clientName ||
      (cleanDomain.includes("viscon") ? "Viscon General Contracting / Viscon Group" : cleanDomain);

    const finalNiche =
      niche ||
      parsedData.clientInfo?.niche ||
      (cleanDomain.includes("viscon") ? "General Commercial Contractor" : "Contractor Operations");

    // Construct final audit payload with strict domain accuracy
    const resultPayload = {
      ...parsedData,
      clientInfo: {
        ...parsedData.clientInfo,
        id: `audit-${Date.now()}`,
        clientName: finalClientName,
        targetDomain: cleanDomain,
        niche: finalNiche,
        avgJobValue: Number(avgJobValue),
        currentLeads: Number(currentLeads),
        closeRate: Number(closeRate),
        autoInferred: !req.body.clientName || !req.body.currentLeads,
      },
      proposal: {
        ...parsedData.proposal,
        theHook: {
          ...parsedData.proposal.theHook,
          monthlyLeakAmount: mathResults.monthlyLeak,
          annualLeakAmount: mathResults.annualLeak,
        },
      },
      calculatedLeak: mathResults,
    };

    res.json(resultPayload);
  } catch (error: any) {
    console.error("Audit API Error:", error);
    res.status(500).json({
      error: "Failed to perform Gladiator Protocol audit",
      message: error?.message || "Internal server error",
    });
  }
});

async function startServer() {
  // Vite middleware in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ignitus Core Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
