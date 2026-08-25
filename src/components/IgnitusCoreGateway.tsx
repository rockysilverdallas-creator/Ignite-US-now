import React, { useState } from "react";
import {
  Shield,
  Activity,
  Zap,
  Flame,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  BarChart3,
  Globe,
  Terminal,
  Clock,
  Server,
  Code2,
  Copy,
  Check
} from "lucide-react";

interface IgnitusCoreGatewayProps {
  onEnterApplet?: () => void;
}

export const IgnitusCoreGateway: React.FC<IgnitusCoreGatewayProps> = ({ onEnterApplet }) => {
  const [domainInput, setDomainInput] = useState("");
  const [copiedState, setCopiedState] = useState(false);

  const copyCoreSpec = () => {
    navigator.clipboard.writeText(
      JSON.stringify(
        {
          infrastructure: "Ignitus Autonomic Revenue Ingestion OS",
          targetCorridor: "$2,000,000 to $20,000,000 Base Revenue",
          slaLatency: "< 60 seconds direct-to-mobile dispatch",
          deliverySLA: "72-hour fixed-state staging deployment",
          telemetryStandard: "Zero-loss deterministic binary handoffs",
        },
        null,
        2
      )
    );
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e1e7ec] font-sans antialiased selection:bg-red-500/30 selection:text-white">
      {/* Precision Grid Header */}
      <header className="border-b border-[#1f2633] bg-[#0c0f15]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-black text-sm tracking-wider text-white">IGNITUS CORE</span>
              <span className="font-mono text-[9px] text-gray-400 tracking-tight">AUTONOMIC REVENUE INFRASTRUCTURE</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-[11px] font-mono bg-[#141a24] border border-[#232c3d] px-3 py-1 rounded-full text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SYSTEM ONLINE • $2M-$20M CORRIDOR</span>
            </div>

            {onEnterApplet && (
              <button
                onClick={onEnterApplet}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-md shadow-red-600/30 cursor-pointer"
              >
                <span>LAUNCH DIAGNOSTIC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero: Sovereign Positioning */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-[#1b222e]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(239,68,68,0.15),rgba(255,255,255,0))]"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 font-mono text-xs bg-red-950/60 border border-red-500/40 text-red-400 px-3.5 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span>ENTERPRISE & COMMERCIAL REVENUE ARCHITECTURE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Stop Bleeding High-Ticket Pipeline on Passive Digital Facades.
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
            We replace static websites with autonomic 60-second scoping engines for operators in the{" "}
            <span className="text-white font-semibold font-mono">$2M to $20M revenue corridor</span>. Deployed live in 72 hours.
          </p>

          {/* Quick Domain Diagnostic Trigger */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="bg-[#121722] border border-[#232c3d] p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex-1 flex items-center space-x-2 px-3 w-full">
                <Globe className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="Enter target domain (e.g. viscong.com)"
                  className="bg-transparent text-white font-mono text-xs w-full focus:outline-none placeholder:text-gray-600"
                />
              </div>
              <button
                onClick={onEnterApplet}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all whitespace-nowrap cursor-pointer shadow-lg shadow-red-600/30"
              >
                <span>QUANTIFY CAPITAL LEAK</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] font-mono text-gray-400 mt-2">
              Deterministic 60-second audit • Zero token drop • Verifiable SLA
            </p>
          </div>
        </div>
      </section>

      {/* The 3 Architectural Pillars */}
      <section className="py-20 border-b border-[#1b222e] bg-[#0c1017]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-xs font-mono font-bold text-red-400 tracking-wider uppercase">
              // INFRASTRUCTURE STANDARDS
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Built for Commercial Operators, Not Freelance Marketers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-[#121620] border border-[#212938] p-8 rounded-2xl space-y-4 hover:border-red-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400">
                <Zap className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Sub-60s Intent Ingestion</h3>
                <p className="text-xs font-mono text-red-400">ZERO LATENCY LEAD DROP</p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                When a high-value commercial project manager or patient lands on mobile, our autonomic scoping engine extracts intent, square footage, and budget parameters in under 60 seconds.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-[#121620] border border-[#212938] p-8 rounded-2xl space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">72-Hour Rapid Staging SLA</h3>
                <p className="text-xs font-mono text-emerald-400">FIXED-TIME DEPLOYMENT</p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                No 6-month agency cycles. We extract brand assets, construct the interactive conversion weapon, and deploy a private staging build to your cell phone in 72 hours flat.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-[#121620] border border-[#212938] p-8 rounded-2xl space-y-4 hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Deterministic Pipeline OS</h3>
                <p className="text-xs font-mono text-purple-400">VERIFIABLE TELEMETRY</p>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Full-stack state persistence and EOE telemetry logging. Zero token bleed across multi-agent handoffs, producing empirical historical records for enterprise scaling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Revenue Corridor Specification */}
      <section className="py-20 border-b border-[#1b222e] bg-[#0a0c10]">
        <div className="max-w-6xl mx-auto px-6 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-red-400 uppercase">// TARGET SERVICE CORRIDORS</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Engineered for $2M – $20M Base Revenue Operators
              </h2>
            </div>
            <button
              onClick={copyCoreSpec}
              className="inline-flex items-center space-x-2 bg-[#141a24] hover:bg-[#1c2331] border border-[#232c3d] px-3.5 py-2 rounded-lg text-xs font-mono text-gray-300 transition-all cursor-pointer w-fit"
            >
              {copiedState ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Specification Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copy System Spec (JSON)</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                sector: "Healthcare Providers & Surgical Clinics",
                rev: "$2M - $20M",
                ticket: "$12,500 Avg Procedure",
                weapon: "HIPAA-Compliant Triage & Surgical Scoper",
              },
              {
                sector: "Specialty MedSpas & Aesthetics",
                rev: "$2M - $20M",
                ticket: "$3,800 Avg Package",
                weapon: "VIP Treatment Calculator & Direct Chair Booking",
              },
              {
                sector: "Freight Logistics & 3PL Warehouses",
                rev: "$2M - $20M",
                ticket: "$32,000 Avg Dedicated Lane",
                weapon: "Instant Freight Rate & Pallet Space Estimator",
              },
              {
                sector: "Commercial & Corporate Legal",
                rev: "$2M - $20M",
                ticket: "$25,000 Avg Retainer",
                weapon: "Confidential Case Exposure & Retainer Scoper",
              },
              {
                sector: "In-State Staffing Agencies",
                rev: "$2M - $20M",
                ticket: "$18,500 Avg Placement",
                weapon: "Headcount Wage Multiplier & Shift Fill Alert",
              },
              {
                sector: "Precision CNC & Manufacturing",
                rev: "$2M - $20M",
                ticket: "$65,000 Production Run",
                weapon: "CAD/Spec Upload & Instant Run Estimator",
              },
            ].map((v, i) => (
              <div key={i} className="bg-[#11151e] border border-[#212938] p-5 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white font-bold">{v.sector}</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    {v.rev}
                  </span>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  Ticket Value: <strong className="text-gray-200">{v.ticket}</strong>
                </div>
                <div className="text-[11px] text-red-400 font-mono bg-red-950/30 p-2 rounded border border-red-900/30">
                  {v.weapon}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1b222e] py-12 bg-[#090b0e]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-400">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span className="text-white font-bold">IGNITUS CORE REVENUE SYSTEMS</span>
            <span>• © 2026</span>
          </div>
          <div>All Systems Deterministic • 8-Month Historical Hardening Run Active</div>
        </div>
      </footer>
    </div>
  );
};
