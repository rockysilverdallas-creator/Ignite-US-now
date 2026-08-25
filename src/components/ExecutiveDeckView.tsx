import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Gauge,
  Zap,
  ShieldAlert,
  Layers,
  Award,
  CheckCircle2,
  Copy,
  Check,
  Building,
  ArrowRight,
  Maximize2,
  Presentation as PresentationIcon,
  ExternalLink,
  Loader2
} from "lucide-react";
import { AuditResponse } from "../types";
import { createPitchDeckGoogleSlides } from "../services/workspaceService";
import { getAccessToken, googleSignIn } from "../services/googleAuth";

interface ExecutiveDeckViewProps {
  auditData: AuditResponse;
  onLaunchFullScreen?: () => void;
}

export const ExecutiveDeckView: React.FC<ExecutiveDeckViewProps> = ({
  auditData,
  onLaunchFullScreen,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExportingSlides, setIsExportingSlides] = useState<boolean>(false);
  const [slidesExportResult, setSlidesExportResult] = useState<{ url: string; title: string } | null>(null);

  const totalSlides = 5;
  const { clientInfo, proposal, calculatedLeak } = auditData;

  const handleExportSlides = async () => {
    setIsExportingSlides(true);
    try {
      let token = await getAccessToken();
      if (!token) {
        const res = await googleSignIn();
        token = res?.accessToken || null;
      }
      if (!token) return;

      const result = await createPitchDeckGoogleSlides(auditData, token);
      setSlidesExportResult({ url: result.webViewLink, title: result.title });
    } catch (err: any) {
      console.error("Slides export failed:", err);
      alert(err.message || "Failed to export presentation to Google Slides.");
    } finally {
      setIsExportingSlides(false);
    }
  };

  // Keyboard arrow navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => Math.min(totalSlides, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(1, prev - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCopySlideContent = () => {
    const text = `
IGNITUS EXECUTIVE SLIDE DECK - SLIDE ${currentSlide}/${totalSlides}
Target: ${clientInfo.clientName} (${clientInfo.targetDomain})

Monthly Leak: $${calculatedLeak.monthlyLeak.toLocaleString()}/mo
Annual Leak: $${calculatedLeak.annualLeak.toLocaleString()}/yr
Efficiency Lift: +${calculatedLeak.efficiencyLiftPct || 180}%
Velocity Multiplier: ${calculatedLeak.velocityMultiplier || 3.2}x
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#161a1f] border border-[#242b35] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Executive Pitch Deck • Wasabi Precision</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1 font-mono">
            {clientInfo.clientName}
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">
            Target Domain: <strong className="text-red-400">{clientInfo.targetDomain}</strong> • {clientInfo.niche}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {slidesExportResult ? (
            <a
              href={slidesExportResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-xs px-3 py-2 rounded-lg border border-amber-500/40 transition-all"
            >
              <PresentationIcon className="w-3.5 h-3.5" />
              <span>Open in Google Slides ↗</span>
            </a>
          ) : (
            <button
              onClick={handleExportSlides}
              disabled={isExportingSlides}
              className="flex items-center space-x-1.5 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 font-mono text-xs px-3 py-2 rounded-lg border border-amber-500/30 transition-all disabled:opacity-50"
            >
              {isExportingSlides ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <PresentationIcon className="w-3.5 h-3.5" />
              )}
              <span>{isExportingSlides ? "Exporting..." : "Export to Google Slides"}</span>
            </button>
          )}

          <button
            onClick={handleCopySlideContent}
            className="flex items-center space-x-1.5 bg-[#0d0f12] hover:bg-[#1f2630] text-gray-300 font-mono text-xs px-3 py-2 rounded-lg border border-[#2a323d] transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Slide Copied" : "Copy Slide Data"}</span>
          </button>

          {onLaunchFullScreen && (
            <button
              onClick={onLaunchFullScreen}
              className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-500 text-white font-mono font-black text-xs uppercase px-4 py-2 rounded-lg shadow-lg shadow-red-950/50 transition-all"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Presenter Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Slide Card Display */}
      <div className="bg-[#12151a] border-2 border-[#242b35] rounded-2xl p-6 sm:p-10 shadow-2xl relative min-h-[480px] flex flex-col justify-between overflow-hidden">
        {/* Subtle Ambient Background Accent */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Slide Counter & Header Badge */}
        <div className="flex items-center justify-between border-b border-[#242b35] pb-4 mb-6 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-500/40 px-3 py-1 rounded-full">
              SLIDE {currentSlide} OF {totalSlides}
            </span>
            <span className="text-xs text-gray-400 font-mono hidden sm:inline">
              Press Left/Right Arrow Keys to Navigate
            </span>
          </div>

          <div className="flex space-x-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx + 1)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx + 1
                    ? "w-8 bg-red-500 shadow-md shadow-red-500/50"
                    : "w-2 bg-gray-700 hover:bg-gray-500"
                }`}
                title={`Go to Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* SLIDE CONTENT AREA */}
        <div className="flex-1 flex flex-col justify-center relative z-10 py-2">
          {/* SLIDE 1: THE CAPITAL DIAGNOSTIC */}
          {currentSlide === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center space-y-2 max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded border border-red-500/30">
                  SLIDE 1 • CAPITAL DIAGNOSTIC & LEAK AUDIT
                </span>
                <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
                  ${calculatedLeak.monthlyLeak.toLocaleString()}
                  <span className="text-red-500 text-2xl sm:text-3xl"> / MONTH</span>
                </h3>
                <p className="text-sm text-gray-300 font-mono">
                  Projected capital actively draining from <strong className="text-white">{clientInfo.targetDomain}</strong> due to passive digital architecture.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#161a1f] border border-red-500/40 rounded-xl p-5 text-center space-y-1 bg-gradient-to-b from-[#161a1f] to-[#1c1215]">
                  <div className="text-[10px] font-mono uppercase text-red-400 font-bold">Annual Leak Loss</div>
                  <div className="text-2xl font-black text-red-500 font-mono">
                    ${calculatedLeak.annualLeak.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono">Uncaptured Contract Value</div>
                </div>

                <div className="bg-[#161a1f] border border-emerald-500/40 rounded-xl p-5 text-center space-y-1 bg-gradient-to-b from-[#161a1f] to-[#111e18]">
                  <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Projected Efficiency Lift</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    +{calculatedLeak.efficiencyLiftPct || 180}%
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono">Inbound Lead Conversion</div>
                </div>

                <div className="bg-[#161a1f] border border-amber-500/40 rounded-xl p-5 text-center space-y-1 bg-gradient-to-b from-[#161a1f] to-[#1e1a12]">
                  <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">Direct-to-SMS Velocity</div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {calculatedLeak.velocityMultiplier || 3.2}x Speed
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono">60s Autonomic Response</div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: WHAT YOU HAVE VS WHAT IS MISSING */}
          {currentSlide === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1 max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded border border-amber-500/30">
                  SLIDE 2 • WHAT YOU HAVE vs. WHAT IS MISSING
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
                  The Friction Diagnostic
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#161a1f] border border-red-500/30 rounded-xl p-5 space-y-3 bg-red-950/10">
                  <div className="flex items-center justify-between border-b border-red-500/30 pb-2">
                    <span className="text-xs font-mono font-bold text-red-400 uppercase">Current State (Passive Site)</span>
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="text-xs text-gray-300 font-mono leading-relaxed">
                    {proposal.theHook.whatYouHave}
                  </p>
                  <div className="p-3 bg-[#0d0f12] rounded-lg text-xs font-mono text-red-300 border border-red-500/20">
                    ⚠️ Consequence: High bounce rates on mobile and delayed follow-ups allow local competitors to win contracts.
                  </div>
                </div>

                <div className="bg-[#161a1f] border border-emerald-500/30 rounded-xl p-5 space-y-3 bg-emerald-950/10">
                  <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Ignitus State (Autonomic Engine)</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-gray-200 font-mono leading-relaxed">
                    {proposal.theHook.whatYouDontHave}
                  </p>
                  <div className="p-3 bg-[#0d0f12] rounded-lg text-xs font-mono text-emerald-300 border border-emerald-500/20">
                    ✅ Impact: Converts high-intent commercial and residential prospects into scoped phone notifications in 60s.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: THE 3-PAGE ARCHITECTURAL SHIFT */}
          {currentSlide === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1 max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded border border-red-500/30">
                  SLIDE 3 • THE 3-PAGE ARCHITECTURAL SHIFT
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
                  Visual Authority & Scoping Blueprint
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="bg-[#161a1f] border border-gray-800 rounded-xl p-5 space-y-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-800 px-2 py-0.5 rounded">
                    PAGE 1
                  </span>
                  <div className="text-sm font-bold text-white">Static Brochure</div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Basic static site, contact form wall, missing interactive calculators or instant quote capability.
                  </p>
                </div>

                <div className="bg-[#161a1f] border border-amber-500/40 rounded-xl p-5 space-y-3 bg-amber-950/10">
                  <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                    PAGE 2
                  </span>
                  <div className="text-sm font-bold text-white">Immersive Showcase</div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    HD project galleries, interactive before/after craftsmanship sliders, licensing & insurance trust badges.
                  </p>
                </div>

                <div className="bg-[#161a1f] border border-emerald-500/40 rounded-xl p-5 space-y-3 bg-emerald-950/20">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                    PAGE 3
                  </span>
                  <div className="text-sm font-bold text-white">60s Action Engine</div>
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    Interactive scope & budget selector, square-footage estimator, and instant direct-to-SMS owner notification.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: THE WEAPON (AI COMPONENTS) */}
          {currentSlide === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center space-y-1 max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded border border-red-500/30">
                  SLIDE 4 • WHAT WE GIVE YOU (THE WEAPON)
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
                  Autonomic Intelligence Suite
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-2">
                  <div className="text-xs font-bold text-red-400 uppercase flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-red-500" />
                    <span>1. Interactive Scoping Funnel</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {proposal.theWeapon.interactiveScoping}
                  </p>
                </div>

                <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-2">
                  <div className="text-xs font-bold text-red-400 uppercase flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <span>2. Google MUM Intent Ingestion</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {proposal.theWeapon.intentIngestion}
                  </p>
                </div>

                <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-2">
                  <div className="text-xs font-bold text-red-400 uppercase flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-red-500" />
                    <span>3. Autonomic 60s CRM Routing</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {proposal.theWeapon.autonomicRouting}
                  </p>
                </div>

                <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-2">
                  <div className="text-xs font-bold text-red-400 uppercase flex items-center space-x-2">
                    <Award className="w-4 h-4 text-red-500" />
                    <span>4. Front Door Authority Facade</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {proposal.frontDoorOverhaul.ignitusDigitalFace}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: 72-HOUR ZERO RISK COMMITMENT */}
          {currentSlide === 5 && (
            <div className="space-y-6 text-center max-w-3xl mx-auto animate-fadeIn">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
                SLIDE 5 • 72-HOUR STAGING EXECUTION
              </span>

              <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight font-mono">
                Plug The Leak By Friday
              </h3>

              <div className="bg-[#161a1f] border border-red-500/40 rounded-xl p-6 text-left space-y-3 font-mono bg-gradient-to-r from-[#161a1f] via-[#1a1013] to-[#161a1f]">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  The 3-Step Zero-Risk Protocol:
                </div>
                <ul className="space-y-2 text-xs text-gray-200">
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>1. Asset Extraction:</strong> We extract existing brand logos, licensing, and media from {clientInfo.targetDomain} automatically.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>2. 72h Staging Build:</strong> Full Ignitus Core scoping engine built on private staging link in under 72 hours.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>3. Mobile Cell Approval:</strong> Test the 60-second SMS scoping directly on your cell phone before taking live.</span>
                  </li>
                </ul>
              </div>

              {onLaunchFullScreen && (
                <button
                  onClick={onLaunchFullScreen}
                  className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-mono font-black uppercase text-sm px-8 py-3.5 rounded-xl shadow-2xl shadow-red-950/60 inline-flex items-center space-x-2 transition-all transform hover:scale-105"
                >
                  <span>Launch Fullscreen Presentation Mode</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Control Footer */}
        <div className="flex items-center justify-between border-t border-[#242b35] pt-4 mt-6 relative z-10 font-mono">
          <button
            disabled={currentSlide === 1}
            onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
            className="flex items-center space-x-2 text-xs font-bold text-gray-300 hover:text-white disabled:opacity-30 bg-[#161a1f] px-4 py-2 rounded-lg border border-[#2a323d] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev Slide</span>
          </button>

          <span className="text-xs text-gray-500 hidden sm:inline">
            Slide {currentSlide} of {totalSlides}
          </span>

          <button
            disabled={currentSlide === totalSlides}
            onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
            className="flex items-center space-x-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-30 px-5 py-2 rounded-lg transition-colors shadow-lg shadow-red-950/50"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
