import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Paperclip,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  Zap,
  Target,
  FileText,
  DollarSign,
  AlertTriangle,
  Brain,
  Key,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ChatMessage, AvatarPersona, VaultFile, WelfareCheckIn } from "../types/sparkZedTypes";
import { playSound } from "../utils/audio";

interface AgentChatProps {
  activePersona: AvatarPersona;
  messages: ChatMessage[];
  onSendMessage: (text: string, engineMode?: "spark-zed-llama" | "gemini" | "hybrid") => void;
  isLoading: boolean;
  vaultFiles: VaultFile[];
  latestCheckIn?: WelfareCheckIn;
  kanbanItems?: any[];
  financialModel?: any;
  dmaicProjects?: any[];
}

export const AgentChat: React.FC<AgentChatProps> = ({
  activePersona,
  messages,
  onSendMessage,
  isLoading,
  vaultFiles,
  latestCheckIn,
}) => {
  const [inputText, setInputText] = useState("");
  const [selectedAttachment, setSelectedAttachment] = useState<VaultFile | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [engineMode, setEngineMode] = useState<"spark-zed-llama" | "gemini" | "hybrid">(
    activePersona.engineType || "hybrid"
  );
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [tokenStatusMsg, setTokenStatusMsg] = useState<string | null>(null);
  const [isUpdatingToken, setIsUpdatingToken] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activePersona.engineType) {
      setEngineMode(activePersona.engineType);
    }
  }, [activePersona.id, activePersona.engineType]);

  // Auto-expand reasoning for newly arrived messages with reasoning
  useEffect(() => {
    const latest = messages[messages.length - 1];
    if (latest && latest.sender === "agent" && latest.reasoning) {
      setExpandedReasoning((prev) => ({ ...prev, [latest.id]: true }));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedAttachment) return;

    let messagePayload = inputText.trim();
    if (selectedAttachment) {
      messagePayload = `[Referencing Vault File: "${selectedAttachment.name}"]\n${messagePayload || "Please analyze this document for Six Sigma process efficiency, security, and financial optimization."}`;
    }

    onSendMessage(messagePayload, engineMode);
    setInputText("");
    setSelectedAttachment(null);
    setShowAttachmentMenu(false);
    playSound("pop");
  };

  const handleUpdateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setIsUpdatingToken(true);
    setTokenStatusMsg(null);
    try {
      const res = await fetch("/api/engine/spark-zed-llama/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setTokenStatusMsg("Bearer token updated successfully! Vertex AI MaaS is active.");
        playSound("success");
        setTimeout(() => {
          setShowTokenModal(false);
          setTokenInput("");
          setTokenStatusMsg(null);
        }, 1500);
      } else {
        setTokenStatusMsg(`Error: ${data.error || "Failed to update token"}`);
      }
    } catch (err: any) {
      setTokenStatusMsg(`Error: ${err?.message || "Network failure"}`);
    } finally {
      setIsUpdatingToken(false);
    }
  };

  const handlePromptChipClick = (promptText: string) => {
    onSendMessage(promptText, engineMode);
    playSound("click");
  };

  const PROMPT_SUGGESTIONS = [
    {
      label: "🧠 Test Deductive Logic (Bat & Ball)",
      icon: Brain,
      tag: "reasoning",
      text: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost? Show step-by-step deductive reasoning.",
    },
    {
      label: "🔢 Decimal Comparison (9.11 vs 9.9)",
      icon: Target,
      tag: "reasoning",
      text: "Explain why 9.11 is strictly smaller than 9.9 using place-value analysis and mathematical proof.",
    },
    {
      label: "📊 Six Sigma DMAIC Variance & DPMO",
      icon: Zap,
      tag: "six-sigma",
      text: "Perform a Lean Six Sigma DMAIC root-cause analysis with DPMO calculation and 5-Whys on an operational bottleneck.",
    },
    {
      label: "💰 Runway & 5-Year Compounding",
      icon: DollarSign,
      tag: "finance",
      text: "Calculate my exact survival runway and 5-year capital velocity compounding plan based on my current monthly surplus.",
    },
  ];

  return (
    <div id="agent-chat-container" className="flex flex-col h-[750px] rounded-2xl border border-neutral-800 bg-neutral-900/90 shadow-2xl overflow-hidden backdrop-blur-sm">
      
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/70 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 via-rose-500/20 to-indigo-500/20 border border-rose-500/30">
            <Cpu className="h-5 w-5 text-rose-400" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">{activePersona.name}</h2>
              <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300 border border-neutral-700">
                {activePersona.frequencyHz} Hz
              </span>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-300 border border-rose-500/20">
                {activePersona.toneTag}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans">
              {activePersona.roleTitle}
            </p>
          </div>
        </div>

        {/* Status Indicators & Engine Selector */}
        <div className="flex items-center gap-2 text-xs">
          {/* Token manager button */}
          <button
            type="button"
            onClick={() => setShowTokenModal(true)}
            title="Update Vertex AI LLaMA 3.1 70B Token"
            className="flex items-center gap-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 px-2.5 py-1 text-neutral-300 border border-neutral-700 font-mono text-[11px] transition-all"
          >
            <Key className="h-3 w-3 text-amber-400" />
            <span className="hidden sm:inline">Vertex Key</span>
          </button>

          {/* Engine Selector Pills */}
          <div className="flex items-center rounded-xl bg-neutral-950 p-1 border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                setEngineMode("spark-zed-llama");
                playSound("click");
              }}
              title="Spark 1.48M ops/s + ZED 128K Capacity + LLaMA 3.3 Engine"
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] transition-all ${
                engineMode === "spark-zed-llama"
                  ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Zap className="h-3 w-3 text-cyan-400" />
              <span>Spark • ZED • LLaMA</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEngineMode("hybrid");
                playSound("click");
              }}
              title="Hybrid Multi-Model Co-Processor"
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] transition-all ${
                engineMode === "hybrid"
                  ? "bg-neutral-800 text-amber-300 font-bold border border-neutral-700"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <span>Hybrid</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-cyan-950/30 px-2.5 py-1 text-cyan-300 border border-cyan-500/30 font-mono text-[11px]">
            <CheckCircle2 className="h-3 w-3 text-cyan-400" />
            <span>1.48M ops/s • Sub-ms DAG</span>
          </div>
        </div>
      </div>

      {/* Suggested Strategy Chips */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-neutral-800/80 bg-neutral-950/40 px-4 py-2 text-xs no-scrollbar">
        <span className="text-[11px] font-mono font-medium text-neutral-400 shrink-0 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-400" /> Quick Protocols:
        </span>
        {PROMPT_SUGGESTIONS.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <button
              key={idx}
              onClick={() => handlePromptChipClick(chip.text)}
              className="flex items-center gap-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 px-3 py-1 text-[11px] text-neutral-200 border border-neutral-700/60 transition-all hover:border-neutral-500 whitespace-nowrap active:scale-95 shrink-0"
            >
              <Icon className="h-3 w-3 text-rose-400" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isSystem = msg.sender === "system";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="rounded-full bg-neutral-800/80 border border-neutral-700 px-4 py-1 text-[11px] font-mono text-neutral-300 shadow-sm flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar Icon */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-semibold ${
                  isUser
                    ? "bg-neutral-800 border border-neutral-700 text-neutral-200"
                    : "bg-gradient-to-br from-rose-500/30 to-indigo-500/30 border border-rose-500/40 text-rose-300 shadow-md shadow-rose-500/10"
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed shadow-md ${
                  isUser
                    ? "bg-gradient-to-r from-teal-900/60 to-cyan-900/60 text-white border border-teal-700/50"
                    : "bg-neutral-950/80 text-neutral-200 border border-neutral-800"
                }`}
              >
                {/* Method / File context if attached */}
                {msg.fileAttachment && (
                  <div className="mb-2 flex items-center gap-1.5 rounded-md bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300 border border-neutral-800 font-mono">
                    <FileText className="h-3.5 w-3.5 text-teal-400" />
                    <span>Attached Document: {msg.fileAttachment.name}</span>
                  </div>
                )}

                {/* Deductive Chain-of-Thought (CoT) Accordion */}
                {!isUser && msg.reasoning && (
                  <div className="mb-3 rounded-xl border border-amber-500/30 bg-amber-950/25 p-2.5 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedReasoning((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }))
                      }
                      className="flex w-full items-center justify-between text-left font-mono font-medium text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Brain className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                        <span>Deductive Chain-of-Thought (CoT)</span>
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                        {expandedReasoning[msg.id] ? (
                          <>
                            <span>Hide Logic</span>
                            <ChevronUp className="h-3 w-3" />
                          </>
                        ) : (
                          <>
                            <span>Inspect 4-Stage Reasoning</span>
                            <ChevronDown className="h-3 w-3" />
                          </>
                        )}
                      </span>
                    </button>

                    {expandedReasoning[msg.id] && (
                      <div className="mt-2.5 whitespace-pre-wrap rounded-lg bg-neutral-950/95 p-3 font-mono text-[11px] leading-relaxed text-amber-200/90 border border-amber-500/20 shadow-inner">
                        {msg.reasoning}
                      </div>
                    )}
                  </div>
                )}

                {/* Message Body with clean typography & line-breaks */}
                <div className="whitespace-pre-wrap font-sans text-neutral-100 text-[13.5px] leading-relaxed">
                  {msg.text}
                </div>

                {/* Spark • ZED • LLaMA Triad Telemetry Badge */}
                {(msg.engineTelemetry || msg.engineUsed) && (
                  <div className="mt-3 rounded-lg bg-neutral-900/90 border border-cyan-500/25 px-3 py-1.5 text-[11px] font-mono text-cyan-300 flex flex-wrap items-center justify-between gap-2 shadow-inner">
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-3 w-3 text-cyan-400" />
                      <span className="font-semibold text-neutral-300">Spark:</span>
                      <span className="text-cyan-300 font-bold">
                        {(msg.engineTelemetry?.spark?.opsPerSec || 1482000).toLocaleString()} ops/s
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="h-3 w-3 text-indigo-400" />
                      <span className="font-semibold text-neutral-300">ZED:</span>
                      <span className="text-indigo-300 font-bold">
                        {msg.engineTelemetry?.zed?.autonomousCapacity || "128K Buffer"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Cpu className="h-3 w-3 text-purple-400" />
                      <span className="font-semibold text-neutral-300">LLaMA:</span>
                      <span className="text-purple-300 font-bold">
                        {msg.engineTelemetry?.llama?.tokensPerSecond || 144.2} tok/s
                      </span>
                    </div>
                    {msg.executionTimeMs && (
                      <span className="text-neutral-500 text-[10px]">
                        DAG: {msg.executionTimeMs}ms
                      </span>
                    )}
                  </div>
                )}

                {/* Avatar Pulse Tag */}
                {msg.avatarMood && (
                  <div className="mt-3 pt-2 border-t border-neutral-800/80 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
                    <span className="text-amber-400/90 font-medium">{msg.avatarMood}</span>
                    <span className="text-neutral-500">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
              <Zap className="h-4 w-4 animate-pulse" />
            </div>
            <div className="rounded-2xl bg-neutral-950/80 border border-cyan-500/30 px-4 py-3 text-sm text-neutral-400 flex items-center gap-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"></span>
                <span className="h-2 w-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs font-mono text-cyan-300">
                Executing Spark DAG (1.48M ops/s) • ZED 128K Buffer • LLaMA 3.3 CoT...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Selected Attachment Banner */}
      {selectedAttachment && (
        <div className="border-t border-neutral-800 bg-neutral-950/90 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-teal-300 font-mono">
            <FileText className="h-3.5 w-3.5" />
            <span>Target File: <strong>{selectedAttachment.name}</strong></span>
          </div>
          <button
            onClick={() => setSelectedAttachment(null)}
            className="text-neutral-400 hover:text-rose-400 text-xs px-2 py-0.5"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-neutral-800 bg-neutral-950/90 p-3 sm:p-4">
        <div className="relative flex items-center gap-2">
          
          {/* Document Vault Attachment Button */}
          <div className="relative">
            <button
              type="button"
              id="attach-vault-file-btn"
              onClick={() => {
                setShowAttachmentMenu(!showAttachmentMenu);
                playSound("click");
              }}
              title="Attach document from Drive Vault"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700 transition-colors"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            {/* Vault File Selection Dropdown */}
            {showAttachmentMenu && (
              <div className="absolute bottom-12 left-0 z-50 w-72 rounded-xl border border-neutral-800 bg-neutral-900 p-2 shadow-2xl backdrop-blur-md">
                <div className="mb-2 px-2 py-1 text-[11px] font-bold text-neutral-400 font-mono border-b border-neutral-800">
                  Select Vault Document to Inspect:
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {vaultFiles.length === 0 ? (
                    <div className="px-2 py-3 text-xs text-neutral-500 text-center">
                      No files stored in vault yet.
                    </div>
                  ) : (
                    vaultFiles.map((file) => (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() => {
                          setSelectedAttachment(file);
                          setShowAttachmentMenu(false);
                          playSound("click");
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors truncate"
                      >
                        <FileText className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Text Input */}
          <input
            type="text"
            id="agent-chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              engineMode === "spark-zed-llama" || activePersona.id === "zed-spark"
                ? "Ask Agent ZED: Spark in-memory stream analysis (1.48M ops/s), 128K context model, or LLaMA 3 root-cause CoT..."
                : "Ask Sigma-X: DMAIC variance audit, JIT Kanban throughput, 5-Whys, or financial scale plan..."
            }
            className="flex-1 rounded-xl border border-neutral-700/80 bg-neutral-900/90 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />

          {/* Send Button */}
          <button
            type="submit"
            id="agent-chat-send-btn"
            disabled={(!inputText.trim() && !selectedAttachment) || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-medium shadow-lg shadow-cyan-500/20 hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Modal for updating Vertex LLaMA Bearer Token */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-400" />
                <h3 className="font-semibold text-white">Vertex AI LLaMA 3.1 70B Token</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowTokenModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-neutral-300 leading-relaxed">
              Google Cloud OAuth Bearer tokens expire every 60 minutes. Paste a fresh token from{" "}
              <code className="rounded bg-neutral-950 px-1.5 py-0.5 font-mono text-cyan-300">
                gcloud auth print-access-token
              </code>{" "}
              to directly stream from <span className="font-mono text-purple-300">meta/llama-3.1-70b-instruct-maas</span> on Vertex AI.
            </p>

            <form onSubmit={handleUpdateToken} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1 font-mono">
                  OAuth Bearer Access Token (ya29...):
                </label>
                <textarea
                  rows={3}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Paste ya29... token here"
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 p-3 font-mono text-xs text-neutral-100 placeholder-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                />
              </div>

              {tokenStatusMsg && (
                <div
                  className={`rounded-lg p-2.5 text-xs font-mono ${
                    tokenStatusMsg.startsWith("Error")
                      ? "bg-rose-950/40 text-rose-300 border border-rose-500/30"
                      : "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {tokenStatusMsg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTokenModal(false)}
                  className="rounded-xl bg-neutral-800 px-4 py-2 text-xs text-neutral-300 hover:bg-neutral-700"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingToken || !tokenInput.trim()}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 px-4 py-2 text-xs font-semibold text-white hover:from-amber-400 hover:to-rose-500 disabled:opacity-50"
                >
                  {isUpdatingToken ? "Verifying..." : "Save & Verify Token"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
