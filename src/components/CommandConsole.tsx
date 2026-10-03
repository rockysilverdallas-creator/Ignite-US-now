import React, { useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, Share2, Radio, CheckCircle2, AlertTriangle } from "lucide-react";

type AgentId = "manus" | "social";
interface ChatMsg { role: "user" | "agent"; text: string }
interface OutMsg { id: string; to: string; body: string; status: string; channel?: string; error?: string; targetId?: string }

const AGENTS: Record<AgentId, { label: string; hint: string }> = {
  manus: { label: "Ignitus Manus", hint: "Campaign, outreach, Evolve Now, getsalesure.com" },
  social: { label: "Social Operator", hint: "Posts, carousels, 'comment INSIDER' hooks, pipeline" },
};

export const CommandConsole: React.FC = () => {
  const [agent, setAgent] = useState<AgentId>("manus");
  const [threads, setThreads] = useState<Record<AgentId, ChatMsg[]>>({ manus: [], social: [] });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const SR: any = typeof window !== "undefined" ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

  // RCS console state
  const [rcs, setRcs] = useState<any>(null);
  const [queue, setQueue] = useState<OutMsg[]>([]);
  const [to, setTo] = useState("");
  const [body, setBody] = useState("");
  const [rcsNote, setRcsNote] = useState<string | null>(null);

  const messages = threads[agent];
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, agent]);

  const refreshRcs = async () => {
    try {
      const [s, q] = await Promise.all([fetch("/api/command/rcs/status"), fetch("/api/command/rcs/queue")]);
      setRcs(await s.json());
      setQueue((await q.json()).messages || []);
    } catch { /* server offline */ }
  };
  useEffect(() => { refreshRcs(); }, []);

  const speak = (text: string) => {
    if (!speakReplies || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/[*#`_]/g, "")));
  };

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    setError(null);
    setInput("");
    const prior = threads[agent];
    setThreads((p) => ({ ...p, [agent]: [...p[agent], { role: "user", text: t }] }));
    setBusy(true);
    try {
      const r = await fetch("/api/command/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent, message: t, history: prior }),
      });
      const data = await r.json();
      if (!r.ok || !data.success) throw new Error(data.error || `HTTP ${r.status}`);
      setThreads((p) => ({ ...p, [agent]: [...p[agent], { role: "agent", text: data.reply }] }));
      speak(data.reply);
    } catch (e: any) {
      setError(e?.message || "Request failed");
    } finally {
      setBusy(false);
    }
  };

  const toggleMic = () => {
    if (!SR) { setError("Voice input isn't supported in this browser. Use Chrome or Edge."); return; }
    if (listening) { recRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e: any) => { const said = e.results[0][0].transcript; setListening(false); send(said); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const queueMsg = async () => {
    setRcsNote(null);
    const r = await fetch("/api/command/rcs/queue", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, body }),
    });
    const d = await r.json();
    if (!r.ok) { setRcsNote(d.error); return; }
    setTo(""); setBody(""); refreshRcs();
  };

  const approveSend = async (id: string) => {
    setRcsNote(null);
    const r = await fetch("/api/command/rcs/send", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approvedBy: "operator" }),
    });
    const d = await r.json();
    if (!r.ok) setRcsNote(d.error || d.message?.error || "Send failed");
    refreshRcs();
  };

  const canSend = useMemo(() => rcs?.canSend, [rcs]);

  return (
    <div className="grid lg:grid-cols-2 gap-5">
      {/* CHAT + VOICE */}
      <section className="rounded-xl border border-cyan-500/30 bg-[#0e1217] flex flex-col h-[640px]">
        <div className="flex gap-2 p-3 border-b border-[#242b35]">
          {(Object.keys(AGENTS) as AgentId[]).map((id) => (
            <button
              key={id}
              onClick={() => setAgent(id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${
                agent === id ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50" : "text-gray-400 border-[#242b35] hover:text-white"
              }`}
            >
              {id === "manus" ? <Bot className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {AGENTS[id].label}
            </button>
          ))}
          <button
            onClick={() => { setSpeakReplies((s) => !s); window.speechSynthesis?.cancel(); }}
            className="ml-auto text-gray-400 hover:text-white p-1.5"
            title={speakReplies ? "Mute spoken replies" : "Speak replies"}
          >
            {speakReplies ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
        <p className="px-4 pt-2 text-[11px] text-gray-500 font-mono">{AGENTS[agent].hint}</p>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-gray-500">Type or tap the mic and talk to {AGENTS[agent].label}.</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[88%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
              m.role === "user" ? "ml-auto bg-cyan-600/20 text-cyan-100" : "bg-[#171c23] text-gray-200 border border-[#242b35]"
            }`}>{m.text}</div>
          ))}
          {busy && <div className="text-xs text-gray-500 font-mono animate-pulse">thinking…</div>}
          <div ref={endRef} />
        </div>

        {error && (
          <div className="mx-4 mb-2 flex items-start gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-md p-2">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> <span>{error}</span>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t border-[#242b35] flex gap-2">
          <button type="button" onClick={toggleMic}
            className={`p-2.5 rounded-md border ${listening ? "bg-red-500/20 border-red-500/50 text-red-300 animate-pulse" : "border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"}`}
            title="Voice chat">
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${AGENTS[agent].label}…`}
            className="flex-1 bg-[#12151a] border border-[#242b35] rounded-md px-3 text-sm text-white outline-none focus:border-cyan-500/50" />
          <button type="submit" disabled={busy || !input.trim()}
            className="p-2.5 rounded-md bg-cyan-600 text-white disabled:opacity-40"><Send className="w-4 h-4" /></button>
        </form>
      </section>

      {/* RCS CONSOLE */}
      <section className="rounded-xl border border-emerald-500/30 bg-[#0e1217] flex flex-col h-[640px]">
        <div className="flex items-center gap-2 p-3 border-b border-[#242b35]">
          <Radio className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-emerald-300">RCS / SMS Console</h2>
          <span className={`ml-auto text-[11px] font-mono px-2 py-0.5 rounded ${canSend ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
            {canSend ? "READY TO SEND" : "NOT CONFIGURED"}
          </span>
        </div>

        {rcs && !canSend && (
          <p className="m-3 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-md p-2">
            Sending is off until the server has TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and a sender
            (TWILIO_MESSAGING_SERVICE_SID for RCS, or TWILIO_PHONE_NUMBER for SMS).
          </p>
        )}

        <div className="p-3 space-y-2 border-b border-[#242b35]">
          <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="+12145550123 (E.164)"
            className="w-full bg-[#12151a] border border-[#242b35] rounded-md px-3 py-2 text-sm text-white outline-none" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Message body (opt-out line is added automatically)"
            className="w-full bg-[#12151a] border border-[#242b35] rounded-md px-3 py-2 text-sm text-white outline-none resize-none" />
          <button onClick={queueMsg} disabled={!to || !body}
            className="w-full py-2 rounded-md bg-emerald-600/80 text-white text-xs font-bold disabled:opacity-40">Add to queue</button>
          {rcsNote && <p className="text-xs text-amber-300">{rcsNote}</p>}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {queue.length === 0 && <p className="text-sm text-gray-500">Queue is empty. Each message needs your approval before it sends.</p>}
          {queue.map((m) => (
            <div key={m.id} className="rounded-lg border border-[#242b35] bg-[#12151a] p-3 text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-gray-300">{m.to}</span>
                <span className={`ml-auto font-mono ${m.status === "SENT" ? "text-emerald-400" : m.status === "FAILED" ? "text-red-400" : "text-amber-300"}`}>{m.status}</span>
              </div>
              <p className="text-gray-400 whitespace-pre-wrap">{m.body}</p>
              {m.error && <p className="text-red-400 mt-1">{m.error}</p>}
              {m.status === "SENT" && <p className="text-emerald-400 mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {m.channel}</p>}
              {m.status !== "SENT" && (
                <button onClick={() => approveSend(m.id)} disabled={!canSend}
                  className="mt-2 px-3 py-1 rounded bg-emerald-600 text-white font-bold disabled:opacity-40">Approve & send</button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
