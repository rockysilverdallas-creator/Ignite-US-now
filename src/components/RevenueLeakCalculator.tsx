import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calculator,
  Zap,
  ArrowRight,
  ShieldAlert,
  MessageSquare,
  Globe,
  MapPin,
  Share2,
  Clock,
  Smartphone,
} from "lucide-react";
import { AuditResponse } from "../types";

interface RevenueLeakCalculatorProps {
  auditData: AuditResponse;
  onUpdateMetrics?: (jobValue: number, currentLeads: number, closeRate: number) => void;
}

export const RevenueLeakCalculator: React.FC<RevenueLeakCalculatorProps> = ({
  auditData,
  onUpdateMetrics,
}) => {
  const [jobValue, setJobValue] = useState(auditData.clientInfo.avgJobValue || 20000);
  const [currentLeads, setCurrentLeads] = useState(auditData.clientInfo.currentLeads || 45);
  const [closeRate, setCloseRate] = useState(auditData.clientInfo.closeRate || 18);

  // Modern Contact Modalities (Percentage of total lead traffic entering through each modern channel)
  const [smsVolume, setSmsVolume] = useState(35); // 35% expect instant SMS/RCS response (<60s)
  const [webScoperVolume, setWebScoperVolume] = useState(25); // 25% bounce off static "Contact Us" forms
  const [mapsChatVolume, setMapsChatVolume] = useState(20); // 20% Google Maps / Local Services Chat
  const [socialDmVolume, setSocialDmVolume] = useState(10); // 10% Instagram / LinkedIn / Meta DMs
  const [afterHoursVolume, setAfterHoursVolume] = useState(10); // 10% Evenings & Weekend inquiries

  useEffect(() => {
    if (auditData.clientInfo.avgJobValue) setJobValue(auditData.clientInfo.avgJobValue);
    if (auditData.clientInfo.currentLeads) setCurrentLeads(auditData.clientInfo.currentLeads);
    if (auditData.clientInfo.closeRate) setCloseRate(auditData.clientInfo.closeRate);
  }, [auditData]);

  // Baseline Financials
  const closeRateDecimal = closeRate / 100;
  const currentMonthlyRevenue = currentLeads * closeRateDecimal * jobValue;
  const optimizedLeads = currentLeads * 2.5;
  const optimizedCloseRate = closeRateDecimal * 1.25;
  const optimizedMonthlyRevenue = optimizedLeads * optimizedCloseRate * jobValue;

  const totalMonthlyLeak = Math.max(0, optimizedMonthlyRevenue - currentMonthlyRevenue);
  const totalAnnualLeak = totalMonthlyLeak * 12;

  // Breakdown of capital bleeding across Modern Contact Modalities
  const smsLeakMonthly = Math.round(totalMonthlyLeak * (smsVolume / 100));
  const scoperLeakMonthly = Math.round(totalMonthlyLeak * (webScoperVolume / 100));
  const mapsLeakMonthly = Math.round(totalMonthlyLeak * (mapsChatVolume / 100));
  const socialLeakMonthly = Math.round(totalMonthlyLeak * (socialDmVolume / 100));
  const afterHoursLeakMonthly = Math.round(totalMonthlyLeak * (afterHoursVolume / 100));

  const handleJobValueChange = (val: number) => {
    setJobValue(val);
    if (onUpdateMetrics) onUpdateMetrics(val, currentLeads, closeRate);
  };

  const handleCurrentLeadsChange = (val: number) => {
    setCurrentLeads(val);
    if (onUpdateMetrics) onUpdateMetrics(jobValue, val, closeRate);
  };

  const handleCloseRateChange = (val: number) => {
    setCloseRate(val);
    if (onUpdateMetrics) onUpdateMetrics(jobValue, currentLeads, val);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-red-500 font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Gladiator Protocol • Modern Omnichannel Leak Matrix</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
              OMNICHANNEL REVENUE LEAK ENGINE
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              Phone calls are a relic — 78% of modern buyers buy from the first digital responder. Target: {auditData.clientInfo.clientName}
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-right">
            <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block">
              TOTAL ESTIMATED ANNUAL LEAK
            </span>
            <span className="text-xl sm:text-2xl font-black text-red-500 font-mono">
              ${Math.round(totalAnnualLeak).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Modern Modalities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Modality 1: Instant SMS / RCS */}
        <div className="bg-[#161a1f] border border-cyan-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-cyan-400 font-mono text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>SMS / RCS (&lt;60s)</span>
            </span>
            <span>{smsVolume}%</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            Prospects texting for quotes who abandon when no text back within 90 seconds.
          </p>
          <div className="pt-2 border-t border-neutral-800 text-sm font-mono font-bold text-cyan-300">
            -${smsLeakMonthly.toLocaleString()}/mo
          </div>
        </div>

        {/* Modality 2: Interactive Scoper */}
        <div className="bg-[#161a1f] border border-rose-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-rose-400 font-mono text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-rose-400" />
              <span>Web Form Bounce</span>
            </span>
            <span>{webScoperVolume}%</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            Mobile visitors bouncing off static "Contact Us" forms instead of interactive 60s scoping.
          </p>
          <div className="pt-2 border-t border-neutral-800 text-sm font-mono font-bold text-rose-400">
            -${scoperLeakMonthly.toLocaleString()}/mo
          </div>
        </div>

        {/* Modality 3: Google Maps / GBP Chat */}
        <div className="bg-[#161a1f] border border-amber-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-amber-400 font-mono text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Maps / GBP Chat</span>
            </span>
            <span>{mapsChatVolume}%</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            Direct chat inquiries on Google Maps clicking "Message" that go unanswered.
          </p>
          <div className="pt-2 border-t border-neutral-800 text-sm font-mono font-bold text-amber-300">
            -${mapsLeakMonthly.toLocaleString()}/mo
          </div>
        </div>

        {/* Modality 4: Social DMs */}
        <div className="bg-[#161a1f] border border-purple-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-purple-400 font-mono text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>Social DMs</span>
            </span>
            <span>{socialDmVolume}%</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            Visual project inquiries on Instagram, Facebook, & LinkedIn lost in spam folders.
          </p>
          <div className="pt-2 border-t border-neutral-800 text-sm font-mono font-bold text-purple-300">
            -${socialLeakMonthly.toLocaleString()}/mo
          </div>
        </div>

        {/* Modality 5: After-Hours & Weekends */}
        <div className="bg-[#161a1f] border border-emerald-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 font-mono text-xs font-bold">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>After-Hours Dark</span>
            </span>
            <span>{afterHoursVolume}%</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-snug">
            Inquiries arriving 6 PM – 7 AM and weekends when office phones are off.
          </p>
          <div className="pt-2 border-t border-neutral-800 text-sm font-mono font-bold text-emerald-400">
            -${afterHoursLeakMonthly.toLocaleString()}/mo
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Sliders */}
        <div className="lg:col-span-6 bg-[#161a1f] border border-[#242b35] rounded-xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-red-500/40 pb-3">
            <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-red-500" />
              <span>Contract & Omnichannel Parameters</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Adjust variables to reflect {auditData.clientInfo.clientName}'s actual project size and multi-channel inquiries.
            </p>
          </div>

          {/* Slider 1: Job Value */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-gray-400">
                Average Project / Contract Value ($)
              </label>
              <span className="font-mono font-bold text-base text-white bg-[#0d0f12] px-3 py-1 rounded border border-[#242b35]">
                ${jobValue.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="2500"
              value={jobValue}
              onChange={(e) => handleJobValueChange(Number(e.target.value))}
              className="w-full h-2 bg-[#242b35] rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>$5,000 (Residential)</span>
              <span>$50,000</span>
              <span>$100,000+ (Commercial Scale)</span>
            </div>
          </div>

          {/* Slider 2: Current Leads Across All Modalities */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-gray-400">
                Total Multi-Channel Inquiries / Month
              </label>
              <span className="font-mono font-bold text-base text-white bg-[#0d0f12] px-3 py-1 rounded border border-[#242b35]">
                {currentLeads} inquiries
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={currentLeads}
              onChange={(e) => handleCurrentLeadsChange(Number(e.target.value))}
              className="w-full h-2 bg-[#242b35] rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>10/mo</span>
              <span>100/mo</span>
              <span>200+/mo</span>
            </div>
          </div>

          {/* Slider 3: Current Close Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-gray-400">
                Current Close Rate (%)
              </label>
              <span className="font-mono font-bold text-base text-white bg-[#0d0f12] px-3 py-1 rounded border border-[#242b35]">
                {closeRate}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="1"
              value={closeRate}
              onChange={(e) => handleCloseRateChange(Number(e.target.value))}
              className="w-full h-2 bg-[#242b35] rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>5% (Slow follow-up)</span>
              <span>25%</span>
              <span>50% (High-intent instant close)</span>
            </div>
          </div>

          {/* Results Box */}
          <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-5 text-center space-y-2 shadow-lg shadow-red-950/40">
            <div className="text-xs font-mono font-bold uppercase text-red-400 tracking-wider flex items-center justify-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>🚨 Active Capital Draining Monthly Across All Channels</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-red-500 font-mono tracking-tight">
              ${Math.round(totalMonthlyLeak).toLocaleString()}/mo
            </div>
            <p className="text-xs font-bold text-gray-200 uppercase tracking-wide pt-1">
              Lost directly to faster competitors answering texts, Maps chats, and instant web estimators.
            </p>
          </div>
        </div>

        {/* State Comparison & Breakdown Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 shadow-xl">
            <h3 className="text-base font-black text-white uppercase tracking-wider font-mono border-b border-[#242b35] pb-3 mb-4">
              Pipeline Comparison: Legacy vs. Gladiator Omnichannel
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Passive State */}
              <div className="bg-[#0d0f12] border border-[#242b35] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#242b35] pb-2">
                  <span className="text-xs font-mono font-bold uppercase text-gray-400">Legacy Phone-Only</span>
                  <span className="text-[10px] font-mono uppercase bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                    Passive
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Captured Leads</span>
                  <div className="text-sm font-mono font-bold text-gray-300">{currentLeads} leads/mo</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Effective Close Rate</span>
                  <div className="text-sm font-mono font-bold text-gray-300">{closeRate}%</div>
                </div>
                <div className="space-y-1 pt-2 border-t border-[#1a1f26]">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Monthly Revenue</span>
                  <div className="text-lg font-mono font-black text-gray-200">
                    ${Math.round(currentMonthlyRevenue).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Ignitus Optimized State */}
              <div className="bg-[#0d0f12] border border-red-500/40 rounded-lg p-4 space-y-3 bg-red-950/10">
                <div className="flex items-center justify-between border-b border-red-500/30 pb-2">
                  <span className="text-xs font-mono font-bold uppercase text-red-400">Gladiator Protocol</span>
                  <span className="text-[10px] font-mono uppercase bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded border border-red-500/30">
                    Omnichannel
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">Captured Inbound Leads</span>
                  <div className="text-sm font-mono font-bold text-emerald-400">
                    {Math.round(optimizedLeads)} leads/mo <span className="text-[10px] text-gray-400">(2.5x traffic)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">Omnichannel Close Rate</span>
                  <div className="text-sm font-mono font-bold text-emerald-400">
                    {Math.round(optimizedCloseRate * 100)}% <span className="text-[10px] text-gray-400">(+25% intent)</span>
                  </div>
                </div>
                <div className="space-y-1 pt-2 border-t border-red-500/20">
                  <span className="text-[10px] font-mono uppercase text-gray-400">Optimized Monthly Revenue</span>
                  <div className="text-lg font-mono font-black text-emerald-400">
                    ${Math.round(optimizedMonthlyRevenue).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Rationale & Operational Value */}
          <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-red-400 tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-red-500" />
              <span>Why Modern Modalities Recover This Capital</span>
            </h4>
            <ul className="text-xs text-gray-300 space-y-2 font-mono">
              <li className="flex items-start space-x-2">
                <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Sub-60s SMS Response:</strong> 90% of customers prefer text over phone calls. Instant automated SMS outreach locks the prospect before they call another contractor.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Interactive 60s Scoper:</strong> Eliminates static contact form abandonment by letting the client configure square footage, materials, and timeline in real-time.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>24/7 After-Hours Interceptor:</strong> Captures the 52% of renovation and commercial inquiries that arrive evenings and weekends when your office is closed.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
