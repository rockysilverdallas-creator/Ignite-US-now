import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { UrlAuditForm } from "./components/UrlAuditForm";
import { RevenueLeakCalculator } from "./components/RevenueLeakCalculator";
import { GladiatorProposalView } from "./components/GladiatorProposalView";
import { VisualShowcasePresentation } from "./components/VisualShowcasePresentation";
import { SalesPlaybookView } from "./components/SalesPlaybookView";
import { ExecutiveDeckView } from "./components/ExecutiveDeckView";
import { ClientPresentationModal } from "./components/ClientPresentationModal";
import { WorkspaceHub } from "./components/WorkspaceHub";
import { MultiFormatOutputHub } from "./components/MultiFormatOutputHub";
import { CaptioningSocialPositioning } from "./components/CaptioningSocialPositioning";
import { SocialAgentConsole } from "./components/SocialAgentConsole";
import { CommandConsole } from "./components/CommandConsole";
import { PipelineController } from "./components/PipelineController";
import { IgnitusCoreGateway } from "./components/IgnitusCoreGateway";
import { AgentChat } from "./components/AgentChat";
import { ZedEditorDeck } from "./components/ZedEditorDeck";
import { CobraTrojanDeck } from "./components/CobraTrojanDeck";
import { CommercialSettlementVehicle } from "./components/CommercialSettlementVehicle";
import { DEFAULT_BOB_PRESET } from "./presets";
import {
  AVATAR_PERSONAS,
  INITIAL_VAULT_FILES,
  INITIAL_CHECKINS,
  INITIAL_KANBAN_ITEMS,
  INITIAL_DMAIC_PROJECTS,
  INITIAL_FINANCIAL_MODEL,
} from "./presets/sparkZedPresets";
import { AuditResponse } from "./types";
import { ChatMessage, AvatarPersona, VaultFile } from "./types/sparkZedTypes";
import { ArrowRight, ShieldAlert, Layers, Presentation, Sparkles, Building, Globe, HardDrive, FileText, Video, Rss, MessageSquare, Bot } from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("audit");
  const [auditData, setAuditData] = useState<AuditResponse>(DEFAULT_BOB_PRESET);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Agent Chat & Sovereign Battle Unit State
  const [activePersona, setActivePersona] = useState<AvatarPersona>(AVATAR_PERSONAS[0]);
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>(INITIAL_VAULT_FILES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "agent",
      text: "Agent SHAH online. Supreme Battle Unit Commander operational across the 4 Specific SHAH Agents: SHAH_COBRA_STRIKE, SHAH_SWARM_INFILTRATOR, SHAH_SPEED_DISPATCH, and SHAH_SOVEREIGN_CLOSER. COBRA Trojan Strike & Competitor Map Capture is fully unified. All outgoing disbursements are strictly air-gapped to you alone. Standing by for directives.",
      timestamp: Date.now(),
      avatarMood: "Strategic Commander",
      reasoning: "Stage 1: Verified 4 Command Pillars engaged.\nStage 2: COBRA Trojan Strike & Competitor Map Capture active across regional market nodes.\nStage 3: Social Swarm Infiltration Mesh engaged across LinkedIn, X, Meta & TikTok with Third-Party Human Stealth Masking (Chrome 133 Desktop).\nStage 4: Verified SOVEREIGN AIR-GAP: Zero unauthorized outgoing funds allowed without explicit signature.\nStage 5: Triad Engine (Spark DAG 1.48M ops/s + ZED 128K context + LLaMA 3.3 CoT) ready.",
      engineUsed: "Spark • ZED • LLaMA Hybrid",
      executionTimeMs: 12,
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const handleSendChatMessage = async (
    text: string,
    engineMode?: "spark-zed-llama" | "gemini" | "hybrid"
  ) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/welfare/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          personaId: activePersona.id,
          engineMode: engineMode || activePersona.engineType || "hybrid",
          context: {
            financialState: INITIAL_FINANCIAL_MODEL,
            kanbanState: {
              itemCount: INITIAL_KANBAN_ITEMS.length,
              stages: INITIAL_KANBAN_ITEMS.map((k) => ({ title: k.title, stage: k.stage, muda: k.mudaType })),
            },
            vaultSummary: {
              fileCount: vaultFiles.length,
              categories: vaultFiles.map((v) => v.category),
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API responded with ${response.status}`);
      }

      const data = await response.json();
      const agentMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: "agent",
        text: data.reply || data.text || "Directive acknowledged and logged into sovereign command register.",
        timestamp: Date.now(),
        reasoning: data.reasoning,
        avatarMood: data.avatarMood || activePersona.toneTag,
        engineTelemetry: data.telemetry,
        engineUsed: data.engineUsed || (engineMode === "spark-zed-llama" ? "Spark • ZED • LLaMA" : "Hybrid Co-Processor"),
        executionTimeMs: data.executionTimeMs || 48,
      };

      setChatMessages((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      const fallbackAgentMsg: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: "agent",
        text: `Directive received: "${text.slice(0, 100)}...". 4 Command Pillars synchronized. No outgoing disbursements authorized. Operating in sovereign offline mode.`,
        timestamp: Date.now(),
        reasoning: "Local deterministic fallback route engaged.",
        avatarMood: "Resolute",
        engineUsed: "Local Fallback",
        executionTimeMs: 5,
      };
      setChatMessages((prev) => [...prev, fallbackAgentMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // ── Fire-and-forget BigQuery audit log ──────────────────────────────────
  const logAuditToBigQuery = async (payload: AuditResponse) => {
    try {
      await fetch("/api/log-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Silent — BigQuery write failure must never surface to the user
      console.warn("[log-audit] Non-critical BigQuery write failed:", err);
    }
  };

  // Handle live URL audit fetch to Express server
  const handleRunAudit = async (inputs: {
    url: string;
    clientName?: string;
    niche?: string;
    avgJobValue?: number;
    currentLeads?: number;
    closeRate?: number;
    location?: string;
  }) => {
    setIsLoading(true);
    setAuditError(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error(`Audit server responded with status: ${response.status}`);
      }

      const data: AuditResponse = await response.json();
      setAuditData(data);
      setActiveTab("deck"); // Default to Executive Slide Deck tab for instant consumable presentation

      // Log audit result to BigQuery (non-blocking)
      logAuditToBigQuery(data);
    } catch (err: any) {
      console.error("Audit execution error:", err);
      setAuditError("Failed to reach server audit engine. Loaded intelligent fallback analysis.");

      const fallbackJobValue = inputs.avgJobValue || 20000;
      const fallbackLeads = inputs.currentLeads || 45;
      const fallbackRate = inputs.closeRate || 18;
      
      const closeRateDecimal = fallbackRate / 100;
      const currentRev = fallbackLeads * closeRateDecimal * fallbackJobValue;
      const optimizedLeads = fallbackLeads * 2.5;
      const optimizedRev = optimizedLeads * (closeRateDecimal * 1.25) * fallbackJobValue;
      const monthlyLeak = Math.max(0, optimizedRev - currentRev);
      const annualLeak = monthlyLeak * 12;

      const fallbackData: AuditResponse = {
        ...DEFAULT_BOB_PRESET,
        clientInfo: {
          ...DEFAULT_BOB_PRESET.clientInfo,
          clientName: inputs.clientName || inputs.url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split('/')[0] || DEFAULT_BOB_PRESET.clientInfo.clientName,
          targetDomain: inputs.url || DEFAULT_BOB_PRESET.clientInfo.targetDomain,
          niche: inputs.niche || "Contractor Operations",
          avgJobValue: fallbackJobValue,
          currentLeads: fallbackLeads,
          closeRate: fallbackRate,
          autoInferred: !inputs.clientName || !inputs.currentLeads,
        },
        proposal: {
          ...DEFAULT_BOB_PRESET.proposal,
          theHook: {
            ...DEFAULT_BOB_PRESET.proposal.theHook,
            monthlyLeakAmount: Math.round(monthlyLeak),
            annualLeakAmount: Math.round(annualLeak),
            leakSummaryText: `Based on projected conditions for ${inputs.url}, your current passive site is bleeding approximately $${Math.round(monthlyLeak).toLocaleString()} per month in uncaptured contract pipeline.`,
          },
        },
        calculatedLeak: {
          currentMonthlyRev: Math.round(currentRev),
          optimizedMonthlyRev: Math.round(optimizedRev),
          monthlyLeak: Math.round(monthlyLeak),
          annualLeak: Math.round(annualLeak),
          efficiencyLiftPct: 180,
          velocityMultiplier: 3.2,
          projectedScalingOutput: Math.round(optimizedRev * 12),
        },
      };

      setAuditData(fallbackData);
      setActiveTab("deck");

      // Log fallback audit to BigQuery (non-blocking)
      logAuditToBigQuery(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  // Recalculate leak from interactive sliders
  const handleUpdateMetricsFromCalculator = (jobValue: number, leads: number, closeRatePct: number) => {
    const closeRate = closeRatePct / 100;
    const currentRev = leads * closeRate * jobValue;
    const optimizedLeads = leads * 2.5;
    const optimizedRev = optimizedLeads * (closeRate * 1.25) * jobValue;
    const monthlyLeak = Math.max(0, optimizedRev - currentRev);
    const annualLeak = monthlyLeak * 12;

    setAuditData((prev) => ({
      ...prev,
      clientInfo: {
        ...prev.clientInfo,
        avgJobValue: jobValue,
        currentLeads: leads,
        closeRate: closeRatePct,
      },
      calculatedLeak: {
        currentMonthlyRev: Math.round(currentRev),
        optimizedMonthlyRev: Math.round(optimizedRev),
        monthlyLeak: Math.round(monthlyLeak),
        annualLeak: Math.round(annualLeak),
        efficiencyLiftPct: Math.round(((optimizedRev - currentRev) / (currentRev || 1)) * 100),
        velocityMultiplier: 3.2,
        projectedScalingOutput: Math.round(optimizedRev * 12),
      },
      proposal: {
        ...prev.proposal,
        theHook: {
          ...prev.proposal.theHook,
          monthlyLeakAmount: Math.round(monthlyLeak),
          annualLeakAmount: Math.round(annualLeak),
          leakSummaryText: `At an average contract value of $${jobValue.toLocaleString()} with ${leads} monthly leads and a ${closeRatePct}% close rate, your business leaks $${Math.round(monthlyLeak).toLocaleString()} every single month.`,
        },
      },
    }));
  };

  const handleResetToDefault = () => {
    setAuditData(DEFAULT_BOB_PRESET);
    setActiveTab("audit");
    setAuditError(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f3f4f6] flex flex-col font-mono selection:bg-red-500 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar
        clientName={auditData.clientInfo.clientName}
        domain={auditData.clientInfo.targetDomain}
        monthlyLeak={auditData.calculatedLeak.monthlyLeak}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onResetToDefault={handleResetToDefault}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification banner if any */}
        {auditError && (
          <div className="bg-amber-950/80 border border-amber-500 text-amber-200 text-xs font-mono p-3 rounded-xl flex items-center justify-between">
            <span>{auditError}</span>
            <button onClick={() => setAuditError(null)} className="font-bold underline text-amber-100">
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Audit Ingestion Engine */}
        {activeTab === "audit" && (
          <div className="space-y-6 animate-fadeIn">
            <UrlAuditForm
              onRunAudit={handleRunAudit}
              isLoading={isLoading}
              currentData={auditData}
              onLoadPreset={(preset) => {
                setAuditData(preset);
                setActiveTab("deck");
              }}
            />

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <button
                onClick={() => setActiveTab("deck")}
                className="bg-[#161a1f] border border-red-500/40 hover:border-red-500 p-4 rounded-xl text-left space-y-2 transition-all hover:-translate-y-0.5 group bg-gradient-to-b from-[#161a1f] to-[#1c1215]"
              >
                <div className="flex items-center justify-between text-red-400">
                  <Presentation className="w-5 h-5" />
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-bold text-white font-mono">1. Executive Slide Deck</div>
                <p className="text-xs text-gray-400 font-mono">
                  Consumable 5-slide pitch deck with wasabi sharpness & delicate French-cuisine layout.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("calculator")}
                className="bg-[#161a1f] border border-[#242b35] hover:border-red-500/50 p-4 rounded-xl text-left space-y-2 transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center justify-between text-amber-400">
                  <ShieldAlert className="w-5 h-5" />
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-bold text-white font-mono">2. Revenue Leak Calculator</div>
                <p className="text-xs text-gray-400 font-mono">
                  Calculate exact monthly & annual pipeline leakage on live sliders.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("proposal")}
                className="bg-[#161a1f] border border-[#242b35] hover:border-red-500/50 p-4 rounded-xl text-left space-y-2 transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center justify-between text-rose-400">
                  <Layers className="w-5 h-5" />
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-bold text-white font-mono">3. Gladiator Proposal</div>
                <p className="text-xs text-gray-400 font-mono">
                  Clinical 4-section What You Have / Don't Have / What We Give You proposal.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("showcase")}
                className="bg-[#161a1f] border border-[#242b35] hover:border-red-500/50 p-4 rounded-xl text-left space-y-2 transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center justify-between text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-bold text-white font-mono">4. 3-Page Visual Showcase</div>
                <p className="text-xs text-gray-400 font-mono">
                  Interactive side-by-side Page 1 brochure vs Page 2 showcase vs Page 3 engine.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("workspace")}
                className="bg-[#161a1f] border border-blue-500/40 hover:border-blue-400 p-4 rounded-xl text-left space-y-2 transition-all hover:-translate-y-0.5 group bg-gradient-to-b from-[#161a1f] to-[#101724]"
              >
                <div className="flex items-center justify-between text-blue-400">
                  <HardDrive className="w-5 h-5" />
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-bold text-white font-mono">5. Google Workspace Hub</div>
                <p className="text-xs text-gray-400 font-mono">
                  Create Google Docs, build Google Slides decks, archive to Drive, and use Google Picker.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("outputs")}
                className="bg-[#161a1f] border border-red-500/40 hover:border-red-400 p-4 rounded-xl text-left space-y-2 transition-all hover:-translate-y-0.5 group bg-gradient-to-b from-[#161a1f] to-[#200d11]"
              >
                <div className="flex items-center justify-between text-red-400">
                  <Video className="w-5 h-5" />
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-bold text-white font-mono">6. Video & Multi-Output Hub</div>
                <p className="text-xs text-gray-400 font-mono">
                  Generate instant client pitch videos, slide decks, docs, and JSON/RSS data feeds.
                </p>
              </button>

              <button
                onClick={() => setActiveTab("positioning")}
                className="bg-[#161a1f] border border-purple-500/40 hover:border-purple-400 p-4 rounded-xl text-left space-y-2 transition-all hover:-translate-y-0.5 group bg-gradient-to-b from-[#161a1f] to-[#1e1026]"
              >
                <div className="flex items-center justify-between text-purple-400">
                  <MessageSquare className="w-5 h-5" />
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-sm font-bold text-white font-mono">7. Captioning & Social Positioning</div>
                <p className="text-xs text-gray-400 font-mono">
                  Bike walk-in SMS scripts, LinkedIn authority case studies, TikTok/Reel street hooks.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Executive Slide Deck */}
        {activeTab === "deck" && (
          <div className="animate-fadeIn">
            <ExecutiveDeckView
              auditData={auditData}
              onLaunchFullScreen={() => setIsPresentationOpen(true)}
            />
          </div>
        )}

        {/* Tab 3: Revenue Leak Calculator */}
        {activeTab === "calculator" && (
          <div className="animate-fadeIn">
            <RevenueLeakCalculator
              auditData={auditData}
              onUpdateMetrics={handleUpdateMetricsFromCalculator}
            />
          </div>
        )}

        {/* Tab 3.5: COBRA Competitor Map Capture & Trojan Displacement */}
        {activeTab === "cobra" && (
          <div className="animate-fadeIn">
            <CobraTrojanDeck
              clientName={auditData.clientInfo.clientName}
              domain={auditData.clientInfo.targetDomain}
              niche={auditData.clientInfo.niche}
              location={auditData.clientInfo.location}
            />
          </div>
        )}

        {/* Tab 3.7: Dispatch Shield Commercial Settlement Vehicle ($550 setup + $150/mo) */}
        {activeTab === "shield" && (
          <div className="animate-fadeIn">
            <CommercialSettlementVehicle
              clientName={auditData.clientInfo.clientName}
              domain={auditData.clientInfo.targetDomain}
            />
          </div>
        )}

        {/* Tab 4: Gladiator Protocol Proposal */}
        {activeTab === "proposal" && (
          <div className="animate-fadeIn">
            <GladiatorProposalView
              proposal={auditData.proposal}
              clientInfo={auditData.clientInfo}
              monthlyLeak={auditData.calculatedLeak.monthlyLeak}
            />
          </div>
        )}

        {/* Tab 5: 3-Page Visual Showcase */}
        {activeTab === "showcase" && (
          <div className="animate-fadeIn">
            <VisualShowcasePresentation clientInfo={auditData.clientInfo} />
          </div>
        )}

        {/* Tab 6: Closing Playbook */}
        {activeTab === "playbook" && (
          <div className="animate-fadeIn">
            <SalesPlaybookView
              playbook={auditData.playbook}
              clientInfo={auditData.clientInfo}
              monthlyLeak={auditData.calculatedLeak.monthlyLeak}
            />
          </div>
        )}

        {/* Tab 7: Multi-Format Output Hub (Video / Slides / Docs / Feeds) */}
        {activeTab === "outputs" && (
          <div className="animate-fadeIn">
            <MultiFormatOutputHub
              auditData={auditData}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {/* Tab 8: Captioning & Social Positioning */}
        {activeTab === "positioning" && (
          <div className="animate-fadeIn">
            <CaptioningSocialPositioning auditData={auditData} />
          </div>
        )}

        {/* Tab 8B: Autonomous Social Operating Fleet */}
        {activeTab === "social-fleet" && (
          <div className="animate-fadeIn">
            <SocialAgentConsole />
          </div>
        )}

        {/* Command Console: Manus + Social voice chat and RCS queue */}
        {activeTab === "command" && (
          <div className="animate-fadeIn">
            <CommandConsole />
          </div>
        )}

        {/* Tab 9: Google Workspace Hub (Docs / Slides / Drive / Picker) */}
        {activeTab === "workspace" && (
          <div className="animate-fadeIn">
            <WorkspaceHub auditData={auditData} />
          </div>
        )}

        {/* Tab 10: Pipeline State & EOE Telemetry */}
        {activeTab === "pipeline" && (
          <div className="animate-fadeIn">
            <PipelineController auditData={auditData} />
          </div>
        )}

        {/* Tab 11: Ignitus Core Sovereign Gateway View */}
        {activeTab === "gateway" && (
          <div className="animate-fadeIn">
            <IgnitusCoreGateway onEnterApplet={() => setActiveTab("audit")} />
          </div>
        )}

        {/* Tab 12: Agent SHAH / ZED Chat */}
        {activeTab === "chat" && (
          <div className="animate-fadeIn">
            <AgentChat
              activePersona={activePersona}
              messages={chatMessages}
              onSendMessage={handleSendChatMessage}
              isLoading={isChatLoading}
              vaultFiles={vaultFiles}
              latestCheckIn={INITIAL_CHECKINS[0]}
              kanbanItems={INITIAL_KANBAN_ITEMS}
              financialModel={INITIAL_FINANCIAL_MODEL}
              dmaicProjects={INITIAL_DMAIC_PROJECTS}
            />
          </div>
        )}

        {/* Tab 13: ZED Core Coder & Delta Multiplayer Environment */}
        {activeTab === "zed" && (
          <div className="animate-fadeIn">
            <ZedEditorDeck />
          </div>
        )}
      </main>

      {/* Fullscreen Presentation Modal */}
      <ClientPresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        auditData={auditData}
      />

      {/* Footer */}
      <footer className="bg-[#12151a] border-t border-[#242b35] py-6 px-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>IGNITUS CORE • Gladiator Ingestion Engine Active</span>
          </div>
          <div className="text-gray-400">
            Automated Audit & Proposal Orchestrator for $2M/yr Contractor Operations
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
