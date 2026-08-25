import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, ArrowRight, ShieldAlert, TrendingUp, Zap, Gauge, Award } from "lucide-react";
import { AuditResponse } from "../types";

interface ClientPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditData: AuditResponse;
}

export const ClientPresentationModal: React.FC<ClientPresentationModalProps> = ({
  isOpen,
  onClose,
  auditData,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);

  const totalSlides = 5;
  const { clientInfo, proposal, calculatedLeak } = auditData;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setCurrentSlide((prev) => Math.min(totalSlides, prev + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(1, prev - 1));
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col overflow-hidden animate-fadeIn text-white font-mono selection:bg-red-500 selection:text-white">
      {/* Top Deck Navigation */}
      <div className="bg-[#12151a] border-b border-[#242b35] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-red-950/60">
            I
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-black tracking-wider uppercase text-white">IGNITUS CORE</span>
              <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                EXECUTIVE PRESENTER DECK
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Target: <span className="text-white font-bold">{clientInfo.clientName}</span> ({clientInfo.targetDomain})
            </p>
          </div>
        </div>

        {/* Slide Tracker */}
        <div className="flex items-center space-x-3 bg-[#0d0f12] px-4 py-2 rounded-xl border border-[#242b35]">
          <span className="text-xs text-gray-400">Slide {currentSlide} of {totalSlides}</span>
          <div className="flex space-x-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx + 1)}
                className={`h-2.5 rounded-full cursor-pointer transition-all ${
                  currentSlide === idx + 1 ? "bg-red-500 w-7 shadow-md shadow-red-500/50" : "bg-gray-700 hover:bg-gray-500 w-2.5"
                }`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white bg-[#1f2630] rounded-xl border border-[#2a323d] transition-colors"
          title="Close Presentation (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Slide Presentation Body */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-12 max-w-7xl mx-auto w-full flex flex-col justify-center relative">
        {/* SLIDE 1: REVENUE LEAK DIAGNOSTIC */}
        {currentSlide === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2 max-w-3xl mx-auto">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded border border-red-500/30">
                SLIDE 1 • REVENUE LEAK DIAGNOSTIC
              </span>
              <h2 className="text-3xl sm:text-6xl font-black text-white uppercase tracking-tight">
                Capital Actively Bleeding
              </h2>
              <p className="text-sm text-gray-300">
                Projected loss for <strong className="text-white">{clientInfo.targetDomain}</strong> due to passive digital condition.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-[#161a1f] border-2 border-red-500 rounded-2xl p-8 text-center space-y-4 shadow-2xl bg-red-950/20 relative overflow-hidden">
                <div className="text-xs font-bold uppercase tracking-widest text-red-400">🚨 ESTIMATED MONTHLY REVENUE LEAK</div>
                <div className="text-5xl sm:text-7xl font-black text-red-500 tracking-tight">
                  ${calculatedLeak.monthlyLeak.toLocaleString()}
                </div>
                <div className="text-sm font-bold text-gray-200">
                  ANNUAL PIPELINE LOSS: ${calculatedLeak.annualLeak.toLocaleString()}
                </div>
                <p className="text-xs text-gray-400 pt-3 border-t border-red-500/30">
                  Uncaptured contracts actively leaking to local competitors with 60s scoping funnels.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#12151a] border border-emerald-500/40 rounded-2xl p-6 space-y-2 bg-emerald-950/20">
                  <span className="text-xs text-emerald-400 uppercase font-bold tracking-wider">Projected Efficiency Lift</span>
                  <div className="text-3xl font-black text-emerald-300">
                    +{calculatedLeak.efficiencyLiftPct || 180}% Conversion
                  </div>
                  <div className="text-xs text-emerald-400/80 font-bold">
                    Scalable Annual Target: ${(calculatedLeak.optimizedMonthlyRev * 12).toLocaleString()}/yr
                  </div>
                </div>

                <div className="bg-[#12151a] border border-amber-500/40 rounded-2xl p-6 space-y-2 bg-amber-950/20">
                  <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">Direct-to-SMS Response Velocity</span>
                  <div className="text-3xl font-black text-amber-300">
                    {calculatedLeak.velocityMultiplier || 3.2}x Speed Multiplier
                  </div>
                  <div className="text-xs text-amber-400/80 font-bold">
                    60-Second Autonomic Phone Routing to Cell Phone
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: THE FRICTION DIAGNOSTIC */}
        {currentSlide === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2 max-w-3xl mx-auto">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded border border-amber-500/30">
                SLIDE 2 • WHAT YOU HAVE vs. WHAT IS MISSING
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                The Friction Audit
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#161a1f] border border-red-500/30 rounded-2xl p-6 space-y-4 bg-red-950/10">
                <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                  <span className="text-sm font-bold text-red-400 uppercase">Current State (Passive Site)</span>
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {proposal.theHook.whatYouHave}
                </p>
              </div>

              <div className="bg-[#161a1f] border border-emerald-500/30 rounded-2xl p-6 space-y-4 bg-emerald-950/10">
                <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
                  <span className="text-sm font-bold text-emerald-400 uppercase">Ignitus State (Autonomic Engine)</span>
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  {proposal.theHook.whatYouDontHave}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: THE 3-PAGE BLUEPRINT SHOWCASE */}
        {currentSlide === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-2 max-w-3xl mx-auto">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded border border-red-500/30">
                SLIDE 3 • VISUAL AUTHORITY BLUEPRINTS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                The Architectural Shift
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#12151a] border border-gray-800 rounded-2xl p-6 space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase bg-gray-800 px-2.5 py-1 rounded">PAGE 1</span>
                <div className="text-base font-bold text-white">Static Brochure</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Static photo, zero interactivity, generic phone number. Leaks mobile traffic to local competitors.
                </p>
              </div>

              <div className="bg-[#12151a] border border-amber-500/40 rounded-2xl p-6 space-y-3 bg-amber-950/10">
                <span className="text-xs font-bold text-amber-400 uppercase bg-amber-500/20 px-2.5 py-1 rounded border border-amber-500/30">PAGE 2</span>
                <div className="text-base font-bold text-white">Immersive Showcase</div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  HD project headers, interactive before/after craftsmanship slider, OSHA & licensing compliance badges.
                </p>
              </div>

              <div className="bg-[#12151a] border border-emerald-500/40 rounded-2xl p-6 space-y-3 bg-emerald-950/20">
                <span className="text-xs font-bold text-emerald-400 uppercase bg-emerald-500/20 px-2.5 py-1 rounded border border-emerald-500/30">PAGE 3</span>
                <div className="text-base font-bold text-white">60s Action Engine</div>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Scope & budget selector, square footage calculator, autonomic 60s direct-to-SMS routing to cell phone.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 4: THE WEAPON (4 PROPOSAL SECTIONS) */}
        {currentSlide === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded border border-red-500/30">
                SLIDE 4 • THE GLADIATOR WEAPONRY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                What We Give You
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">1. Front Door Overhaul</span>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {proposal.frontDoorOverhaul.ignitusDigitalFace}
                </p>
              </div>

              <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">2. Interactive Scoping Funnel</span>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {proposal.theWeapon.interactiveScoping}
                </p>
              </div>

              <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">3. Google MUM Intent Ingestion</span>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {proposal.theWeapon.intentIngestion}
                </p>
              </div>

              <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">4. Autonomic Direct-to-SMS CRM Routing</span>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {proposal.theWeapon.autonomicRouting}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 5: 72-HOUR STAGING EXECUTION */}
        {currentSlide === 5 && (
          <div className="space-y-8 text-center max-w-3xl mx-auto animate-fadeIn">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
              SLIDE 5 • 72-HOUR DEPLOYMENT COMMITMENT
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              Ready to Plug The Leak By Friday?
            </h2>

            <div className="bg-[#12151a] border border-red-500/40 rounded-2xl p-8 space-y-4 shadow-2xl text-left bg-gradient-to-r from-[#12151a] via-[#1a1013] to-[#12151a]">
              <div className="text-xs font-bold text-red-400 uppercase tracking-wider">
                Execution Steps:
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-200">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>1. Asset Extraction:</strong> We pull existing brand logos, licensing, and media with zero manual effort required from you.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>2. Staging Build:</strong> Full Ignitus Core scoping engine built on private staging server in under 72 hours.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>3. Mobile Approval & Go-Live:</strong> You test the 60-second SMS scoping on your cell phone and give final approval.</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black uppercase text-base px-10 py-4 rounded-xl shadow-2xl shadow-red-950/60 inline-flex items-center justify-center space-x-2 transition-all transform hover:scale-105"
            >
              <span>Commit to 72-Hour Staging Build Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Control Footer */}
      <div className="bg-[#12151a] border-t border-[#242b35] px-6 py-4 flex items-center justify-between">
        <button
          disabled={currentSlide === 1}
          onClick={() => setCurrentSlide((prev) => Math.max(1, prev - 1))}
          className="flex items-center space-x-2 text-xs font-bold text-gray-300 hover:text-white disabled:opacity-30 bg-[#1f2630] px-4 py-2 rounded-xl border border-[#2a323d] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Slide</span>
        </button>

        <span className="text-xs text-gray-400 hidden sm:inline">Use Arrow Keys or Click Dots to Navigate</span>

        <button
          disabled={currentSlide === totalSlides}
          onClick={() => setCurrentSlide((prev) => Math.min(totalSlides, prev + 1))}
          className="flex items-center space-x-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-30 px-5 py-2 rounded-xl transition-colors shadow-lg shadow-red-950/60"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
