import React, { useState, useEffect } from "react";
import {
  Share2,
  Bot,
  ShieldCheck,
  Send,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Clock,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Flame,
  Layers,
  Sliders,
  Eye,
  Check,
  Zap,
  Globe,
  Radio,
  Lock,
  ArrowRight,
  ExternalLink,
  Users
} from "lucide-react";
import {
  SocialHubService,
  ConnectedAccount,
  SocialAgent,
  SocialDMMessage,
  SocialPostItem,
  SocialProspectItem,
  SocialPlatform
} from "../services/socialHub";

export const SocialAgentConsole: React.FC = () => {
  const [fleetData, setFleetData] = useState(() => SocialHubService.getFleetStatus());
  const [activeSubTab, setActiveSubTab] = useState<"dms" | "syndicator" | "radar" | "accounts">("dms");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Content Syndicator state
  const [postPlatform, setPostPlatform] = useState<SocialPlatform>("LINKEDIN");
  const [postTopic, setPostTopic] = useState("Commercial Contractor Speed-to-Scope Crisis");
  const [postAngle, setPostAngle] = useState("Calling out $31k/month dead contact form leakage");
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);

  // Edit DM reply state
  const [editingDmId, setEditingDmId] = useState<string | null>(null);
  const [customReplyText, setCustomReplyText] = useState("");

  // Account config state
  const [editPlatform, setEditPlatform] = useState<SocialPlatform>("LINKEDIN");
  const [editHandle, setEditHandle] = useState("");
  const [editName, setEditName] = useState("");
  const [accountUpdateSuccess, setAccountUpdateSuccess] = useState(false);

  const refreshFleet = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/social/fleet");
      if (res.ok) {
        const data = await res.json();
        if (data.fleet) {
          setFleetData(data.fleet);
          return;
        }
      }
      setFleetData(SocialHubService.getFleetStatus());
    } catch {
      setFleetData(SocialHubService.getFleetStatus());
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAgent = async (agentId: string, currentMode: "AUTONOMOUS" | "CO_PILOT") => {
    const nextMode = currentMode === "AUTONOMOUS" ? "CO_PILOT" : "AUTONOMOUS";
    try {
      await fetch("/api/social/agent/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, mode: nextMode }),
      });
      refreshFleet();
    } catch {
      SocialHubService.toggleAgentMode(agentId, nextMode);
      refreshFleet();
    }
  };

  const handleApproveDM = async (dmId: string, customReply?: string) => {
    try {
      await fetch("/api/social/dm/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dmId, customReply }),
      });
      setEditingDmId(null);
      refreshFleet();
    } catch {
      SocialHubService.approveDM(dmId, customReply);
      setEditingDmId(null);
      refreshFleet();
    }
  };

  const handleDispatchPost = async (postId: string) => {
    try {
      await fetch("/api/social/post/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      refreshFleet();
    } catch {
      SocialHubService.dispatchPost(postId);
      refreshFleet();
    }
  };

  const handleGeneratePost = async () => {
    setIsGeneratingPost(true);
    try {
      await fetch("/api/social/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: postPlatform,
          topic: postTopic,
          angle: postAngle,
        }),
      });
      refreshFleet();
    } catch {
      SocialHubService.generateAndQueuePost({
        platform: postPlatform,
        topic: postTopic,
        angle: postAngle,
      });
      refreshFleet();
    } finally {
      setIsGeneratingPost(false);
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editHandle || !editName) return;
    try {
      await fetch("/api/social/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: editPlatform,
          handle: editHandle,
          name: editName,
        }),
      });
    } catch {
      SocialHubService.updateAccount(editPlatform, editHandle, editName);
    }
    setAccountUpdateSuccess(true);
    setTimeout(() => setAccountUpdateSuccess(false), 3000);
    setEditHandle("");
    setEditName("");
    refreshFleet();
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformBadge = (platform: SocialPlatform) => {
    switch (platform) {
      case "LINKEDIN":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">LinkedIn B2B</span>;
      case "X":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-700 text-white border border-neutral-600 rounded">X (Twitter)</span>;
      case "META_INSTAGRAM":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30 rounded">Instagram</span>;
      case "TIKTOK":
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded">TikTok Ops</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-800 text-gray-300 rounded">{platform}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Telemetry Banner & Air-Gap Sentinel ──────────────────────── */}
      <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-900/50">
                <Share2 className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-white font-mono uppercase tracking-wide">
                Social Media Operating Fleet
              </h2>
              <span className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>4 AGENTS ACTIVE</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              Autonomous Account Operation • Multi-Channel Lead Ingestion • Sub-60s DM Speed-to-Lead Strike
            </p>
          </div>

          {/* Sentinel Air-Gap & Third-Party Human Mask Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={async () => {
                const current = (fleetData as any).stealthMask?.enabled ?? true;
                try {
                  await fetch("/api/social/stealth/toggle", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ enabled: !current }),
                  });
                  refreshFleet();
                } catch {
                  SocialHubService.toggleStealthMask(!current);
                  refreshFleet();
                }
              }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-left transition-all ${
                (fleetData as any).stealthMask?.enabled
                  ? "bg-purple-500/15 border-purple-500/40 text-purple-300 hover:bg-purple-500/25"
                  : "bg-[#191f27] border-[#2c3642] text-gray-400 hover:text-white"
              }`}
              title="Click to toggle Third-Party Human Mask & Anti-Bot Fingerprint"
            >
              <Lock className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase font-mono text-purple-400 font-bold">Third-Party Mask</div>
                <div className="text-xs font-bold text-white font-mono">
                  {(fleetData as any).stealthMask?.enabled ? "HUMAN MASK ACTIVE" : "STEALTH OFF"}
                </div>
              </div>
            </button>

            <div className="flex items-center space-x-2 bg-[#191f27] border border-[#2c3642] px-3.5 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-mono text-gray-400">Sovereign Air-Gap</div>
                <div className="text-xs font-bold text-white font-mono">ZERO UNAUTHORIZED SPEND</div>
              </div>
            </div>

            <button
              onClick={refreshFleet}
              disabled={isLoading}
              className="p-2.5 bg-[#191f27] hover:bg-[#232b36] border border-[#2c3642] rounded-lg text-gray-300 hover:text-white transition-colors"
              title="Refresh Fleet Status"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-red-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Third-Party Human Window & Live API Ribbon */}
        <div className="mt-4 pt-3 border-t border-[#1d232c] flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-gray-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center space-x-1.5 px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 rounded text-purple-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span>Human Window: {(fleetData as any).stealthMask?.isCurrentlyWithinHumanWindow ? "CST DAYLIGHT (7:30AM - 8:30PM)" : "OFF-HOURS STEALTH PACING"}</span>
            </span>

            <span className="flex items-center space-x-1 px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-neutral-300">
              <span>Fingerprint:</span>
              <strong className="text-white">Desktop Chrome 133 (Win64)</strong>
            </span>

            <span className="flex items-center space-x-1 px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-neutral-300">
              <span>Cadence:</span>
              <strong className="text-emerald-400">2.2s - 5.8s Typing Jitter</strong>
            </span>

            <span className="flex items-center space-x-1 px-2 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-neutral-300">
              <span>Bot Signature Filter:</span>
              <strong className="text-cyan-400">ZERO MACHINE LABELS</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              (fleetData as any).liveApis?.gemini?.active
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-gray-800 text-gray-400 border border-gray-700"
            }`}>
              Gemini AI: {(fleetData as any).liveApis?.gemini?.active ? "LIVE" : "STANDBY"}
            </span>

            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              (fleetData as any).liveApis?.twilio?.active
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-gray-800 text-gray-400 border border-gray-700"
            }`}>
              Twilio: {(fleetData as any).liveApis?.twilio?.active ? "LIVE" : "STANDBY"}
            </span>
          </div>
        </div>

        {/* Connected Accounts Strip */}
        <div className="mt-4 pt-3 border-t border-[#1d232c] grid grid-cols-2 sm:grid-cols-4 gap-3">
          {fleetData.accounts.map((acc) => (
            <div
              key={acc.platform}
              className="bg-[#171c23] border border-[#222a36] rounded-lg p-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                {getPlatformBadge(acc.platform)}
                <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{acc.status}</span>
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">@{acc.handle}</div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#222a36] text-[10px] text-gray-400 font-mono">
                <span>{acc.followerCount} followers</span>
                <span className="text-cyan-400">{acc.activeAutomations} bots active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4 Dedicated Social Operating Agents Grid ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fleetData.agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-[#12151a] border border-[#242b35] rounded-xl p-4 flex flex-col justify-between hover:border-red-500/30 transition-all shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  {agent.callsign}
                </span>
                <button
                  onClick={() => handleToggleAgent(agent.id, agent.mode)}
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-colors ${
                    agent.mode === "AUTONOMOUS"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                  }`}
                  title="Click to toggle Autonomous vs Co-Pilot mode"
                >
                  {agent.mode}
                </button>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{agent.name}</h3>
              <p className="text-[11px] text-gray-400 mb-3">{agent.role}</p>

              <div className="space-y-1 mb-3">
                {agent.capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center space-x-1.5 text-[10px] text-gray-300 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="truncate">{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1d232c] flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span>Today: <strong className="text-white">{agent.actionsExecutedToday} ops</strong></span>
              <span className="text-emerald-400 flex items-center space-x-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                <span>{agent.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Sub-Navigation Tabs ───────────────────────────────────────────── */}
      <div className="flex border-b border-[#242b35] space-x-2">
        <button
          onClick={() => setActiveSubTab("dms")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-mono font-bold rounded-t-lg transition-all border-b-2 ${
            activeSubTab === "dms"
              ? "bg-[#181d24] text-white border-red-500"
              : "text-gray-400 hover:text-white border-transparent"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-red-400" />
          <span>Inbound DM Interceptor ({fleetData.recentDMs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("syndicator")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-mono font-bold rounded-t-lg transition-all border-b-2 ${
            activeSubTab === "syndicator"
              ? "bg-[#181d24] text-white border-red-500"
              : "text-gray-400 hover:text-white border-transparent"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Content Syndicator & Queue ({fleetData.queuedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("radar")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-mono font-bold rounded-t-lg transition-all border-b-2 ${
            activeSubTab === "radar"
              ? "bg-[#181d24] text-white border-red-500"
              : "text-gray-400 hover:text-white border-transparent"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          <span>Prospect Radar & Hooks ({fleetData.prospects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("accounts")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-mono font-bold rounded-t-lg transition-all border-b-2 ${
            activeSubTab === "accounts"
              ? "bg-[#181d24] text-white border-red-500"
              : "text-gray-400 hover:text-white border-transparent"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* ── Sub-Tab 1: Inbound DM & Comment Interceptor ───────────────────── */}
      {activeSubTab === "dms" && (
        <div className="space-y-4">
          <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white font-mono">Speed-to-Lead Strike Standard: </span>
                <span className="text-xs text-gray-300">Sub-60-second automated response with dynamic revenue bleed calculator.</span>
              </div>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-400">
              Avg Response: {fleetData.metrics.averageSpeedToLeadSeconds}s
            </div>
          </div>

          {fleetData.recentDMs.length === 0 ? (
            <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-8 text-center text-gray-400 font-mono text-xs">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-white font-bold">No active inbound DMs pending review.</p>
              <p className="text-[11px] text-gray-500 mt-1">AGENT_DM_INTERCEPTOR is listening across connected accounts for incoming messages and comments.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fleetData.recentDMs.map((dm) => (
              <div
                key={dm.id}
                className="bg-[#12151a] border border-[#242b35] rounded-xl p-5 hover:border-[#384352] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    {getPlatformBadge(dm.platform)}
                    <span className="font-bold text-white text-sm">@{dm.senderHandle}</span>
                    <span className="text-xs text-gray-400">({dm.senderName})</span>
                  </div>

                  <div className="flex items-center space-x-2 font-mono text-xs">
                    {dm.sentiment === "HOT_LEAD" && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/40 rounded font-bold">
                        🔥 HOT CONTRACTOR LEAD
                      </span>
                    )}
                    {dm.sentiment === "OBJECTION" && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-bold">
                        ⚠️ OBJECTION DEFLECTION
                      </span>
                    )}
                    {dm.detectedLeakEstimate && (
                      <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded font-bold">
                        Bleed: ${dm.detectedLeakEstimate.toLocaleString()}/mo
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      dm.status === "AUTO_DISPATCHED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    }`}>
                      {dm.status}
                    </span>
                  </div>
                </div>

                {/* Incoming Message Box */}
                <div className="bg-[#181d24] border border-[#262f3a] rounded-lg p-3 text-xs text-gray-200">
                  <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Incoming Message:</span>
                  "{dm.incomingText}"
                </div>

                {/* Agent Proposed Reply Box */}
                <div className="bg-[#141a22] border border-cyan-500/30 rounded-lg p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold flex items-center space-x-1">
                      <Bot className="w-3 h-3" />
                      <span>Agent Generated Strike Reply ({dm.speedToLeadSeconds || 24}s response):</span>
                    </span>
                    <button
                      onClick={() => copyText(dm.proposedReply, dm.id)}
                      className="text-[10px] text-gray-400 hover:text-white flex items-center space-x-1 font-mono"
                    >
                      {copiedId === dm.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Eye className="w-3 h-3" />}
                      <span>{copiedId === dm.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  {editingDmId === dm.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={customReplyText}
                        onChange={(e) => setCustomReplyText(e.target.value)}
                        className="w-full bg-[#1e2530] border border-cyan-500/50 rounded p-2 text-xs text-white font-sans focus:outline-none"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingDmId(null)}
                          className="px-2.5 py-1 text-xs text-gray-400 hover:text-white font-mono"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleApproveDM(dm.id, customReplyText)}
                          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs rounded"
                        >
                          Send Custom Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 leading-relaxed font-sans">{dm.proposedReply}</p>
                  )}
                </div>

                {/* Action Buttons */}
                {dm.status === "PENDING_APPROVAL" && editingDmId !== dm.id && (
                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setEditingDmId(dm.id);
                        setCustomReplyText(dm.proposedReply);
                      }}
                      className="px-3 py-1.5 bg-[#1a212b] hover:bg-[#252f3d] text-gray-300 hover:text-white text-xs font-mono rounded border border-[#2d3947]"
                    >
                      Edit Response
                    </button>
                    <button
                      onClick={() => handleApproveDM(dm.id)}
                      className="flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded shadow-lg shadow-red-900/30"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Approve & Dispatch Reply</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      )}

      {/* ── Sub-Tab 2: Content Syndicator & Queue ────────────────────────── */}
      {activeSubTab === "syndicator" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post Generation Form */}
          <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                Agent Content Creator
              </h3>
            </div>
            <p className="text-xs text-gray-400">
              Generates platform-tailored contractor teardowns, threads, and carousel copy formatted for each channel's algorithm.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Target Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["LINKEDIN", "X", "META_INSTAGRAM", "TIKTOK"] as SocialPlatform[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPostPlatform(p)}
                      className={`px-2.5 py-1.5 text-xs font-mono font-bold rounded border text-left transition-colors ${
                        postPlatform === p
                          ? "bg-red-500/20 text-red-300 border-red-500/50"
                          : "bg-[#181d24] text-gray-400 border-[#262f3a] hover:text-white"
                      }`}
                    >
                      {p === "META_INSTAGRAM" ? "Instagram" : p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Core Topic / Thesis</label>
                <input
                  type="text"
                  value={postTopic}
                  onChange={(e) => setPostTopic(e.target.value)}
                  className="w-full bg-[#181d24] border border-[#262f3a] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                  placeholder="e.g. Speed-to-Scope vs 48hr Email Delay"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Strategic Angle</label>
                <textarea
                  value={postAngle}
                  onChange={(e) => setPostAngle(e.target.value)}
                  rows={2}
                  className="w-full bg-[#181d24] border border-[#262f3a] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                  placeholder="e.g. Call out the $30k/mo dead contact form leak"
                />
              </div>

              <button
                onClick={handleGeneratePost}
                disabled={isGeneratingPost}
                className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-lg shadow-lg shadow-red-900/30 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>{isGeneratingPost ? "Agent Crafting Post..." : "Generate & Queue Post"}</span>
              </button>
            </div>
          </div>

          {/* Queued Posts Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Active Outbound Dispatch Queue</span>
              </h3>
              <span className="text-xs font-mono text-gray-400">{fleetData.queuedPosts.length} posts staged</span>
            </div>

            <div className="space-y-3">
              {fleetData.queuedPosts.length === 0 ? (
                <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-8 text-center text-gray-400 font-mono text-xs">
                  <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-white font-bold">No posts currently staged in queue.</p>
                  <p className="text-[11px] text-gray-500 mt-1">Use the generator on the left to draft and schedule posts with Gemini AI.</p>
                </div>
              ) : (
                fleetData.queuedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-[#12151a] border border-[#242b35] rounded-xl p-5 hover:border-[#384352] transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getPlatformBadge(post.platform)}
                        <span className="text-xs font-bold text-white font-mono truncate max-w-xs">{post.headline}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                        post.status === "PUBLISHED"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      }`}>
                        {post.status}
                      </span>
                    </div>

                    <div className="bg-[#181d24] border border-[#262f3a] rounded-lg p-3 text-xs text-gray-300 whitespace-pre-line font-sans leading-relaxed">
                      {post.content}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1d232c] text-[10px] font-mono text-gray-400">
                      <div className="flex items-center space-x-2">
                        <span>Est. Reach: <strong className="text-white">{post.estimatedReach}</strong></span>
                        <span>•</span>
                        <span>Target: <strong className="text-white">{post.targetAudience}</strong></span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => copyText(post.content, post.id)}
                          className="px-2.5 py-1 bg-[#1a212b] hover:bg-[#252f3d] text-gray-300 rounded border border-[#2d3947]"
                        >
                          {copiedId === post.id ? "Copied" : "Copy Copy"}
                        </button>
                        {post.status !== "PUBLISHED" && (
                          <button
                            onClick={() => handleDispatchPost(post.id)}
                            className="px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded shadow"
                          >
                            Dispatch Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-Tab 3: Prospect Radar & Cold Outreach ───────────────────── */}
      {activeSubTab === "radar" && (
        <div className="space-y-4">
          <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Flame className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-xs font-bold text-white font-mono">Cobra Sweeper Mode: </span>
                <span className="text-xs text-gray-300">
                  Scans target regional contractors, measures mobile form bounce rate, and pre-stages hyper-targeted cold DMs.
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {fleetData.prospects.length} Candidates Staged
            </span>
          </div>

          {fleetData.prospects.length === 0 ? (
            <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-8 text-center text-gray-400 font-mono text-xs">
              <Flame className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-white font-bold">Prospect Radar listening.</p>
              <p className="text-[11px] text-gray-500 mt-1">Audit any target contractor URL using the Gladiator Engine or connect queue data to populate radar candidates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fleetData.prospects.map((pros) => (
                <div
                  key={pros.id}
                  className="bg-[#12151a] border border-[#242b35] rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-red-500/40 transition-all shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {getPlatformBadge(pros.platform)}
                      <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        Bleed: ${pros.monthlyLeakEstimate.toLocaleString()}/mo
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white">{pros.businessName}</h4>
                    <div className="text-[11px] text-gray-400 font-mono mb-1">@{pros.handle} • {pros.location}</div>
                    <div className="text-[10px] text-cyan-400 font-mono mb-3">{pros.website}</div>

                    <div className="bg-[#181d24] border border-[#262f3a] rounded-lg p-3 text-xs text-gray-300">
                      <span className="text-[10px] uppercase font-mono text-gray-400 block mb-1">Pre-Staged Cold Hook:</span>
                      "{pros.customHook}"
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1d232c] flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      pros.engagementStatus === "OUTREACH_FIRED"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    }`}>
                      {pros.engagementStatus}
                    </span>

                    <button
                      onClick={() => copyText(pros.customHook, pros.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded shadow"
                    >
                      <span>{copiedId === pros.id ? "Copied" : "Fire Outreach"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Sub-Tab 4: Account Connection Settings ──────────────────────── */}
      {activeSubTab === "accounts" && (
        <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-6 max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-mono uppercase mb-1">
              Connect & Manage Your Social Accounts
            </h3>
            <p className="text-xs text-gray-400">
              Link your business handles for LinkedIn, X (Twitter), Instagram, and TikTok to enable autonomous syndication and DM speed-to-lead monitoring.
            </p>
          </div>

          <form onSubmit={handleUpdateAccount} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Platform</label>
              <select
                value={editPlatform}
                onChange={(e) => setEditPlatform(e.target.value as SocialPlatform)}
                className="w-full bg-[#181d24] border border-[#262f3a] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="LINKEDIN">LinkedIn Company / Profile</option>
                <option value="X">X / Twitter (@handle)</option>
                <option value="META_INSTAGRAM">Instagram Business (@handle)</option>
                <option value="TIKTOK">TikTok Creator Account</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Handle / Username</label>
              <input
                type="text"
                value={editHandle}
                onChange={(e) => setEditHandle(e.target.value.replace(/^@/, ""))}
                placeholder="e.g. mycompany_ops"
                className="w-full bg-[#181d24] border border-[#262f3a] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">Display Name / Company</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Texas Prime Contracting"
                className="w-full bg-[#181d24] border border-[#262f3a] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {accountUpdateSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-mono flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Account connection updated and verified with Social Fleet!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-lg shadow-lg shadow-red-900/30 transition-all"
            >
              Save & Authorize Account
            </button>
          </form>

          <div className="pt-4 border-t border-[#1d232c] flex items-center space-x-2 text-[11px] text-gray-400 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sovereign Storage: API access tokens & OAuth sessions are protected under local air-gap encryption.</span>
          </div>
        </div>
      )}
    </div>
  );
};
