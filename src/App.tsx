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
import { PipelineController } from "./components/PipelineController";
import { IgnitusCoreGateway } from "./components/IgnitusCoreGateway";
import { DEFAULT_BOB_PRESET } from "./presets";
import { AuditResponse } from "./types";
import { ArrowRight, ShieldAlert, Layers, Presentation, Sparkles, Building, Globe, HardDrive, FileText, Video, Rss, MessageSquare } from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<string>("audit");
  const [auditData, setAuditData] = useState<AuditResponse>(DEFAULT_BOB_PRESET);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [auditError, setAuditError] = useState<string | null>(null);

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

      setAuditData({
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
      });
      setActiveTab("deck");
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
