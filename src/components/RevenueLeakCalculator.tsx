import React, { useState, useEffect } from "react";
import { AlertTriangle, TrendingUp, DollarSign, Calculator, Zap, ArrowRight, ShieldAlert } from "lucide-react";
import { AuditResponse } from "../types";

interface RevenueLeakCalculatorProps {
  auditData: AuditResponse;
  onUpdateMetrics?: (jobValue: number, currentLeads: number, closeRate: number) => void;
}

export const RevenueLeakCalculator: React.FC<RevenueLeakCalculatorProps> = ({
  auditData,
  onUpdateMetrics,
}) => {
  const [jobValue, setJobValue] = useState(auditData.clientInfo.avgJobValue || 15000);
  const [currentLeads, setCurrentLeads] = useState(auditData.clientInfo.currentLeads || 60);
  const [closeRate, setCloseRate] = useState(auditData.clientInfo.closeRate || 15);

  useEffect(() => {
    setJobValue(auditData.clientInfo.avgJobValue);
    setCurrentLeads(auditData.clientInfo.currentLeads);
    setCloseRate(auditData.clientInfo.closeRate);
  }, [auditData]);

  // Math logic specified in the prompt:
  // Ignitus state assumes 2.5x increase in qualified inbound lead traffic through dynamic UX/UI & autonomous routing.
  // Close rate increases by 25% (closeRate * 1.25) due to high-intent qualifiers & 60s direct SMS scoping.
  const closeRateDecimal = closeRate / 100;
  const currentMonthlyRevenue = currentLeads * closeRateDecimal * jobValue;
  const optimizedLeads = currentLeads * 2.5;
  const optimizedCloseRate = closeRateDecimal * 1.25;
  const optimizedMonthlyRevenue = optimizedLeads * optimizedCloseRate * jobValue;

  const monthlyLeak = Math.max(0, optimizedMonthlyRevenue - currentMonthlyRevenue);
  const annualLeak = monthlyLeak * 12;

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
              <span>Ignitus Core • Value Leak Calculator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
              REVENUE LEAK CALCULATOR
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 font-mono">
              Calculated live for $2M/yr contractor operations • Target: {auditData.clientInfo.clientName}
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-right">
            <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block">
              ESTIMATED ANNUAL LEAK
            </span>
            <span className="text-xl sm:text-2xl font-black text-red-500 font-mono">
              ${Math.round(annualLeak).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Sliders (480px width styled card matching HTML snippet) */}
        <div className="lg:col-span-6 bg-[#161a1f] border border-[#242b35] rounded-xl p-6 shadow-2xl space-y-6">
          <div className="border-b border-red-500/40 pb-3">
            <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-red-500" />
              <span>Input Contract & Pipeline Variables</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Adjust sliders below to match {auditData.clientInfo.clientName}'s actual job tickets and lead traffic.
            </p>
          </div>

          {/* Slider 1: Job Value */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-gray-400">
                Average Job/Contract Value ($)
              </label>
              <span className="font-mono font-bold text-base text-white bg-[#0d0f12] px-3 py-1 rounded border border-[#242b35]">
                ${jobValue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={jobValue}
                onChange={(e) => handleJobValueChange(Number(e.target.value))}
                className="w-full h-2 bg-[#242b35] rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>$5,000 (Small Jobs)</span>
              <span>$25,000</span>
              <span>$50,000+ (Commercial)</span>
            </div>
          </div>

          {/* Slider 2: Current Qualified Leads */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-gray-400">
                Current Qualified Web Leads/Month
              </label>
              <span className="font-mono font-bold text-base text-white bg-[#0d0f12] px-3 py-1 rounded border border-[#242b35]">
                {currentLeads} leads
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="150"
                step="5"
                value={currentLeads}
                onChange={(e) => handleCurrentLeadsChange(Number(e.target.value))}
                className="w-full h-2 bg-[#242b35] rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>0 (Dead Site)</span>
              <span>75 leads/mo</span>
              <span>150+ leads/mo</span>
            </div>
          </div>

          {/* Slider 3: Close Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase text-gray-400">
                Current Booking/Close Rate (%)
              </label>
              <span className="font-mono font-bold text-base text-white bg-[#0d0f12] px-3 py-1 rounded border border-[#242b35]">
                {closeRate}%
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={closeRate}
                onChange={(e) => handleCloseRateChange(Number(e.target.value))}
                className="w-full h-2 bg-[#242b35] rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500">
              <span>5% (Low Qualification)</span>
              <span>25%</span>
              <span>50% (High Trust)</span>
            </div>
          </div>

          {/* Results Box matching the prompt snippet style */}
          <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-5 text-center space-y-2 shadow-lg shadow-red-950/40">
            <div className="text-xs font-mono font-bold uppercase text-red-400 tracking-wider flex items-center justify-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>🚨 Estimated Monthly Revenue Leak</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-red-500 font-mono tracking-tight">
              ${Math.round(monthlyLeak).toLocaleString()}
            </div>
            <p className="text-xs font-bold text-gray-200 uppercase tracking-wide pt-1">
              This is capital actively draining out of your current site.
            </p>
          </div>
        </div>

        {/* State Comparison & Breakdown Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 shadow-xl">
            <h3 className="text-base font-black text-white uppercase tracking-wider font-mono border-b border-[#242b35] pb-3 mb-4">
              Pipeline Comparison: Current vs. Ignitus State
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Passive State */}
              <div className="bg-[#0d0f12] border border-[#242b35] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#242b35] pb-2">
                  <span className="text-xs font-mono font-bold uppercase text-gray-400">Current Site (Brochure)</span>
                  <span className="text-[10px] font-mono uppercase bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                    Passive
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-500">Inbound Leads</span>
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
                  <span className="text-xs font-mono font-bold uppercase text-red-400">Ignitus Core Engine</span>
                  <span className="text-[10px] font-mono uppercase bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded border border-red-500/30">
                    Gladiator Protocol
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">Optimized Inbound Leads</span>
                  <div className="text-sm font-mono font-bold text-emerald-400">
                    {Math.round(optimizedLeads)} leads/mo <span className="text-[10px] text-gray-400">(2.5x traffic)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">Qualified Close Rate</span>
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
              <span>Why Ignitus Core Recovers This Capital</span>
            </h4>
            <ul className="text-xs text-gray-300 space-y-2 font-mono">
              <li className="flex items-start space-x-2">
                <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>2.5x Qualified Lead Multiplier:</strong> Dynamic UX/UI, high-resolution before/after craftsmanship sliders, and instant square footage estimation stop mobile bounce rates.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>+25% Close Rate Uplift:</strong> The 60-second scoping engine qualifies project intent and budget upfront before the prospect ever speaks to Bob.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <ArrowRight className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Autonomic 60-Sec SMS Routing:</strong> Bypasses email inboxes. High-intent scope details arrive as a text on Bob's cell phone while the prospect is still hot.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
