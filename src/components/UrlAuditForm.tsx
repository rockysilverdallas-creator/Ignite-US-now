import React, { useState } from "react";
import { Search, Globe, DollarSign, Users, Percent, Loader2, ArrowRight, Building, CheckCircle, Zap, SlidersHorizontal, ChevronDown, ChevronUp, Sparkles, TrendingUp, Gauge, Shield, Stethoscope, Sparkle, Truck, Briefcase, UserCheck, Factory } from "lucide-react";
import { TARGET_ICPS, ICPPreset } from "../presets";
import { AuditResponse } from "../types";

interface UrlAuditFormProps {
  onRunAudit: (inputs: {
    url: string;
    clientName?: string;
    niche?: string;
    avgJobValue?: number;
    currentLeads?: number;
    closeRate?: number;
    location?: string;
  }) => Promise<void>;
  isLoading: boolean;
  currentData: AuditResponse;
  onLoadPreset: (preset: AuditResponse) => void;
}

export const UrlAuditForm: React.FC<UrlAuditFormProps> = ({
  onRunAudit,
  isLoading,
  currentData,
  onLoadPreset,
}) => {
  const [url, setUrl] = useState(currentData.clientInfo.targetDomain || "https://viscong.com/");
  const [showOverrides, setShowOverrides] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Optional overrides
  const [clientName, setClientName] = useState(currentData.clientInfo.autoInferred ? "" : currentData.clientInfo.clientName);
  const [niche, setNiche] = useState(currentData.clientInfo.autoInferred ? "" : currentData.clientInfo.niche);
  const [avgJobValue, setAvgJobValue] = useState<string>(currentData.clientInfo.avgJobValue ? String(currentData.clientInfo.avgJobValue) : "");
  const [currentLeads, setCurrentLeads] = useState<string>(currentData.clientInfo.currentLeads ? String(currentData.clientInfo.currentLeads) : "");
  const [closeRate, setCloseRate] = useState<string>(currentData.clientInfo.closeRate ? String(currentData.clientInfo.closeRate) : "");
  const [location, setLocation] = useState(currentData.clientInfo.location || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRunAudit({
      url,
      clientName: clientName || undefined,
      niche: niche || undefined,
      avgJobValue: avgJobValue ? Number(avgJobValue) : undefined,
      currentLeads: currentLeads ? Number(currentLeads) : undefined,
      closeRate: closeRate ? Number(closeRate) : undefined,
      location: location || undefined,
    });
  };

  const handleSelectIcp = (icp: ICPPreset) => {
    setUrl(icp.url);
    setClientName(icp.clientName);
    setNiche(icp.niche);
    setAvgJobValue(String(icp.avgJobValue));
    setCurrentLeads(String(icp.currentLeads));
    setCloseRate(String(icp.closeRate));

    onRunAudit({
      url: icp.url,
      clientName: icp.clientName,
      niche: icp.niche,
      avgJobValue: icp.avgJobValue,
      currentLeads: icp.currentLeads,
      closeRate: icp.closeRate,
      location: "In-State Metro & Commercial Corridor",
    });
  };

  const filteredIcps = selectedCategory === "ALL" 
    ? TARGET_ICPS 
    : TARGET_ICPS.filter(i => i.category === selectedCategory);

  const getCategoryIcon = (category: ICPPreset["category"]) => {
    switch (category) {
      case "HEALTHCARE": return <Stethoscope className="w-3.5 h-3.5 text-blue-400" />;
      case "SPECIALTY_SPA": return <Sparkle className="w-3.5 h-3.5 text-pink-400" />;
      case "LOGISTICS": return <Truck className="w-3.5 h-3.5 text-yellow-400" />;
      case "LEGAL": return <Briefcase className="w-3.5 h-3.5 text-indigo-400" />;
      case "STAFFING": return <UserCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case "MANUFACTURING": return <Factory className="w-3.5 h-3.5 text-orange-400" />;
      default: return <Building className="w-3.5 h-3.5 text-red-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Ingestion Panel */}
      <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#242b35]">
          <div>
            <div className="flex items-center space-x-2 text-red-500 font-mono text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-red-500" />
              <span>Gladiator Domain Ingestion & Growth Projection Engine</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
              Plug In Any Domain — Zero Manual Metrics Required
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Our automated sweep inspects domain conditions, extracts company branding, and projects percentage efficiency gains, lead capture velocity, and scaling output without needing manual lead counts.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] uppercase font-mono text-gray-400">Target Monetization ICPs ($2M - $20M Base Rev):</span>
              <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
                {["ALL", "HEALTHCARE", "SPECIALTY_SPA", "LOGISTICS", "LEGAL", "STAFFING", "MANUFACTURING", "COMMERCIAL_CONSTRUCTION"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded transition-all ${
                      selectedCategory === cat
                        ? "bg-red-600 text-white font-bold"
                        : "bg-[#161a1f] text-gray-400 hover:text-white"
                    }`}
                  >
                    {cat.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredIcps.map((icp) => {
                const isSelected = url.includes(icp.url);
                return (
                  <button
                    key={icp.id}
                    type="button"
                    onClick={() => handleSelectIcp(icp)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? "bg-red-500/15 border-red-500 text-white shadow-lg"
                        : "bg-[#1f2630] border-[#2a3340] text-gray-300 hover:border-red-500/40 hover:text-white"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1 text-xs font-bold font-mono text-white">
                          {getCategoryIcon(icp.category)}
                          <span className="truncate">{icp.label}</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/40">
                          {icp.annualRevRange}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono truncate">
                        {icp.coreServiceLines.slice(0, 2).join(" • ")}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#2a3340] text-[10px] font-mono">
                      <span className="text-gray-400">Avg Job: <strong className="text-white">${icp.avgJobValue.toLocaleString()}</strong></span>
                      <span className="text-red-400 font-bold">~${(icp.leakEstimateMonthly).toLocaleString()}/mo Bleed</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary URL Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold uppercase text-red-400 tracking-wider">
                Paste Client Domain or Full URL (e.g. viscong.com)
              </label>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Auto-Extracts Brand & Projects Efficiency Gains</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Globe className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://viscong.com/?fbclid=..."
                  className="w-full bg-[#0d0f12] border-2 border-red-500/40 focus:border-red-500 rounded-xl pl-11 pr-4 py-3 text-sm sm:text-base text-white font-mono focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-inner transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black uppercase text-sm px-8 py-3.5 rounded-xl shadow-xl shadow-red-950/60 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Sweeping Domain & Projecting...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Execute Gladiator Audit</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Toggle Optional Custom Overrides */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowOverrides(!showOverrides)}
              className="flex items-center space-x-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-red-400" />
              <span>{showOverrides ? "Hide Optional Manual Parameter Overrides" : "Optional Manual Parameter Overrides (Click to expand)"}</span>
              {showOverrides ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showOverrides && (
              <div className="mt-3 p-4 bg-[#0d0f12] border border-[#242b35] rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">
                    Override Business / Owner Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Auto-inferred from URL if blank"
                    className="w-full bg-[#161a1f] border border-[#2a3340] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">
                    Override Industry Niche
                  </label>
                  <input
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="Auto-inferred from URL if blank"
                    className="w-full bg-[#161a1f] border border-[#2a3340] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">
                    Avg Contract Value ($)
                  </label>
                  <input
                    type="number"
                    value={avgJobValue}
                    onChange={(e) => setAvgJobValue(e.target.value)}
                    placeholder="Auto-projected if blank ($20,000)"
                    className="w-full bg-[#161a1f] border border-[#2a3340] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">
                    Estimated Monthly Leads
                  </label>
                  <input
                    type="number"
                    value={currentLeads}
                    onChange={(e) => setCurrentLeads(e.target.value)}
                    placeholder="Auto-projected if blank (45)"
                    className="w-full bg-[#161a1f] border border-[#2a3340] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">
                    Close Rate (%)
                  </label>
                  <input
                    type="number"
                    value={closeRate}
                    onChange={(e) => setCloseRate(e.target.value)}
                    placeholder="Auto-projected if blank (18%)"
                    className="w-full bg-[#161a1f] border border-[#2a3340] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono font-bold text-gray-400 uppercase">
                    Location Context
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Auto-projected if blank"
                    className="w-full bg-[#161a1f] border border-[#2a3340] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Live Audited Overview Profile */}
      {currentData && (
        <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242b35] pb-3 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-mono font-bold uppercase text-white">
                  Audited Domain: <span className="text-red-400">{currentData.clientInfo.targetDomain}</span>
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Target Entity: <strong className="text-white">{currentData.clientInfo.clientName}</strong> ({currentData.clientInfo.niche})
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/40 self-start sm:self-auto">
              {currentData.clientInfo.autoInferred ? "⚡ AI Auto-Projected Domain Conditions" : "Custom Parameters Active"}
            </span>
          </div>

          {/* Efficiency, Velocity, and Output Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0d0f12] p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/10">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Projected Efficiency Lift</span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                +{currentData.calculatedLeak.efficiencyLiftPct || 180}%
              </div>
              <div className="text-[11px] text-gray-400 mt-1">Conversion Efficiency Expansion</div>
            </div>

            <div className="bg-[#0d0f12] p-4 rounded-xl border border-amber-500/30 bg-amber-950/10">
              <div className="flex items-center space-x-2 text-amber-400 font-mono text-[10px] font-bold uppercase">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>Inbound Lead Velocity</span>
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                {currentData.calculatedLeak.velocityMultiplier || 3.2}x Faster
              </div>
              <div className="text-[11px] text-gray-400 mt-1">60s Autonomic Direct-to-SMS Speed</div>
            </div>

            <div className="bg-[#0d0f12] p-4 rounded-xl border border-red-500/30 bg-red-950/10">
              <div className="flex items-center space-x-2 text-red-400 font-mono text-[10px] font-bold uppercase">
                <Zap className="w-3.5 h-3.5 text-red-500" />
                <span>Monthly Revenue Leak</span>
              </div>
              <div className="text-2xl font-black text-red-500 font-mono mt-1">
                ${currentData.calculatedLeak.monthlyLeak.toLocaleString()}/mo
              </div>
              <div className="text-[11px] text-red-400 font-semibold mt-1">
                ${currentData.calculatedLeak.annualLeak.toLocaleString()}/yr Annual Loss
              </div>
            </div>

            <div className="bg-[#0d0f12] p-4 rounded-xl border border-[#242b35]">
              <div className="flex items-center space-x-2 text-gray-400 font-mono text-[10px] font-bold uppercase">
                <Building className="w-3.5 h-3.5 text-gray-400" />
                <span>Scalable Output Capacity</span>
              </div>
              <div className="text-2xl font-black text-white font-mono mt-1">
                ${(currentData.calculatedLeak.optimizedMonthlyRev * 12).toLocaleString()}/yr
              </div>
              <div className="text-[11px] text-gray-400 mt-1">Target Annual Revenue Velocity</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
