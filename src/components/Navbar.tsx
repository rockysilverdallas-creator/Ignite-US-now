import React from "react";
import { ShieldAlert, Presentation, Sparkles, RefreshCw, Layers, Monitor, HardDrive, FileText, Video, Rss, MessageSquare, Activity, Globe, Bot, Zap, Code, Crosshair, ShieldCheck, Share2 } from "lucide-react";

interface NavbarProps {
  clientName: string;
  domain: string;
  monthlyLeak: number;
  onOpenPresentation: () => void;
  onResetToDefault: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  clientName,
  domain,
  monthlyLeak,
  onOpenPresentation,
  onResetToDefault,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="bg-[#12151a] border-b border-[#242b35] sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Protocol Status */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-900/40">
              I
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-wider text-sm sm:text-base text-white uppercase font-mono">
                  IGNITUS CORE
                </span>
                <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  GLADIATOR PROTOCOL
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block font-mono">
                Sales & Campaign Orchestrator • $2M/yr Contractor Audits
              </p>
            </div>
          </div>

          {/* Active Target Banner */}
          <div className="hidden lg:flex items-center bg-[#1a1f26] border border-[#2a323d] rounded-lg px-3 py-1.5 space-x-3">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-gray-400">Audited Target</span>
              <span className="text-xs font-bold text-white truncate max-w-[180px]">
                {clientName || "Unspecified Client"}
              </span>
            </div>
            <div className="h-6 w-px bg-[#2a323d]" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono text-gray-400">Target Domain</span>
              <span className="text-xs font-mono font-semibold text-red-400 truncate max-w-[140px]">
                {domain || "domain.com"}
              </span>
            </div>
            {monthlyLeak > 0 && (
              <>
                <div className="h-6 w-px bg-[#2a323d]" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-mono text-red-400 font-bold">Monthly Leak</span>
                  <span className="text-xs font-black text-red-500 font-mono">
                    ${monthlyLeak.toLocaleString()}/mo
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onResetToDefault}
              title="Reset to Sample Contractor (Bob's Concrete)"
              className="p-2 text-gray-400 hover:text-white hover:bg-[#1a1f26] rounded-lg transition-colors border border-transparent hover:border-[#2a323d]"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenPresentation}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-lg shadow-md shadow-red-900/30 transition-all transform hover:-translate-y-0.5"
            >
              <Presentation className="w-4 h-4" />
              <span className="hidden sm:inline">Presenter Deck</span>
              <span className="sm:hidden">Present</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-t border-[#1d232c] overflow-x-auto py-2 no-scrollbar">
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "audit"
                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                : "text-gray-400 hover:text-white hover:bg-[#1a1f26]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>URL Audit Engine</span>
          </button>

          <button
            onClick={() => setActiveTab("deck")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "deck"
                ? "bg-red-500/15 text-red-400 border border-red-500/30 font-bold"
                : "text-gray-400 hover:text-white hover:bg-[#1a1f26]"
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-red-400" />
            <span>Executive Slide Deck</span>
          </button>

          <button
            onClick={() => setActiveTab("calculator")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "calculator"
                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                : "text-gray-400 hover:text-white hover:bg-[#1a1f26]"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Revenue Leak Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab("cobra")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "cobra"
                ? "bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold shadow-md shadow-rose-950/40"
                : "text-rose-400 hover:text-white hover:bg-[#1a1f26] border border-rose-500/20"
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-rose-400" />
            <span>COBRA Trojan Strike</span>
          </button>

          <button
            onClick={() => setActiveTab("shield")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "shield"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold shadow-md shadow-emerald-950/40"
                : "text-emerald-400 hover:text-white hover:bg-[#1a1f26] border border-emerald-500/20"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dispatch Shield ($550 / $5 a day)</span>
          </button>

          <button
            onClick={() => setActiveTab("proposal")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "proposal"
                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                : "text-gray-400 hover:text-white hover:bg-[#1a1f26]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Gladiator Proposal</span>
          </button>

          <button
            onClick={() => setActiveTab("showcase")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "showcase"
                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                : "text-gray-400 hover:text-white hover:bg-[#1a1f26]"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>3-Page Visual Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab("playbook")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "playbook"
                ? "bg-red-500/15 text-red-400 border border-red-500/30"
                : "text-gray-400 hover:text-white hover:bg-[#1a1f26]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Closing Playbook</span>
          </button>

          <button
            onClick={() => setActiveTab("outputs")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "outputs"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-md shadow-red-900/40"
                : "text-red-400 hover:text-white hover:bg-[#1a1f26] border border-red-500/30"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Output Hub (Video / Slides / Docs / Feeds)</span>
          </button>

          <button
            onClick={() => setActiveTab("positioning")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "positioning"
                ? "bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold"
                : "text-purple-400 hover:text-white hover:bg-[#1a1f26] border border-purple-500/20"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Captioning & Social Positioning</span>
          </button>

          <button
            onClick={() => setActiveTab("social-fleet")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "social-fleet"
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-md shadow-cyan-950/40"
                : "text-cyan-400 hover:text-white hover:bg-[#1a1f26] border border-cyan-500/20"
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Social Fleet Agents</span>
          </button>

          <button
            onClick={() => setActiveTab("command")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "command"
                ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-500/50 font-bold shadow-md shadow-emerald-950/40"
                : "text-emerald-400 hover:text-white hover:bg-[#1a1f26] border border-emerald-500/20"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>Command: Voice Chat + RCS</span>
          </button>

          <button
            onClick={() => setActiveTab("workspace")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "workspace"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold"
                : "text-gray-300 hover:text-white hover:bg-[#1a1f26] border border-blue-500/20"
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Workspace (Docs/Slides/Drive/Picker)</span>
          </button>

          <button
            onClick={() => setActiveTab("pipeline")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "pipeline"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold"
                : "text-emerald-400 hover:text-white hover:bg-[#1a1f26] border border-emerald-500/20"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Pipeline State & EOE</span>
          </button>

          <button
            onClick={() => setActiveTab("gateway")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "gateway"
                ? "bg-red-500/20 text-red-400 border border-red-500/40 font-bold"
                : "text-red-400 hover:text-white hover:bg-[#1a1f26] border border-red-500/20"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Ignitus Core (Live Gateway)</span>
          </button>

          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-md shadow-cyan-900/30"
                : "text-cyan-400 hover:text-white hover:bg-[#1a1f26] border border-cyan-500/20"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Agent SHAH / ZED Chat</span>
          </button>

          <button
            onClick={() => setActiveTab("zed")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === "zed"
                ? "bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-cyan-300 border border-cyan-400/50 font-bold shadow-md shadow-cyan-900/30"
                : "text-neutral-400 hover:text-white hover:bg-[#1a1f26] border border-neutral-700/50"
            }`}
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>ZED Editor (Delta)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
