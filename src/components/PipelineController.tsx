import React, { useState, useEffect } from "react";
import {
  Activity,
  Zap,
  Flame,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Database,
  Copy,
  Check,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Send
} from "lucide-react";
import { AuditResponse } from "../types";
import { PipelineAuditRecord, LeadEngagementState } from "../types/pipeline";
import { PipelineEngineService } from "../services/pipelineEngine";

interface PipelineControllerProps {
  auditData: AuditResponse;
}

export const PipelineController: React.FC<PipelineControllerProps> = ({ auditData }) => {
  const [currentRecord, setCurrentRecord] = useState<PipelineAuditRecord>(() =>
    PipelineEngineService.createRecordFromAudit(auditData)
  );
  const [allRecords, setAllRecords] = useState<PipelineAuditRecord[]>([]);
  const [copiedHandoff, setCopiedHandoff] = useState(false);
  const [selectedEnergy, setSelectedEnergy] = useState<number>(3);
  const [selectedOutcome, setSelectedOutcome] = useState<"CONVERTED" | "PIPELINE_WARM" | "BOUNCED" | "HARD_NO">("PIPELINE_WARM");

  useEffect(() => {
    // Sync current audit into state store
    const rec = PipelineEngineService.createRecordFromAudit(auditData);
    PipelineEngineService.saveRecord(rec);
    setCurrentRecord(rec);
    setAllRecords(PipelineEngineService.getAllRecords());
  }, [auditData]);

  const handleStateTransition = (nextState: LeadEngagementState) => {
    const updated = PipelineEngineService.transitionState(currentRecord.recordId, nextState, {
      energyExpendedScore: selectedEnergy,
      outcomeStatus: selectedOutcome,
    });
    if (updated) {
      setCurrentRecord(updated);
      setAllRecords(PipelineEngineService.getAllRecords());
    }
  };

  const copyAgentPackage = () => {
    const payload = PipelineEngineService.exportAgentHandoff(currentRecord);
    navigator.clipboard.writeText(payload);
    setCopiedHandoff(true);
    setTimeout(() => setCopiedHandoff(false), 2000);
  };

  const STATES: { state: LeadEngagementState; label: string; desc: string }[] = [
    { state: "INGESTED", label: "1. Ingested", desc: "Domain parsed, metrics locked." },
    { state: "DIAGNOSED", label: "2. Diagnosed", desc: "Bleed quantified and validated." },
    { state: "STAGED_72HR", label: "3. 72hr Staged", desc: "Interactive build deployed." },
    { state: "DISPATCHED_SMS", label: "4. Dispatched", desc: "SMS / Video dropped." },
    { state: "ENGAGED_WALKIN", label: "5. Walk-In Close", desc: "Face-to-face pitch completed." },
    { state: "PROPOSAL_SENT", label: "6. Docs Sent", desc: "Gladiator proposal out." },
    { state: "RETAINED", label: "7. Monetized", desc: "Contract signed, deposit in." },
  ];

  return (
    <div className="space-y-6 font-mono animate-fadeIn">
      {/* Control Banner */}
      <div className="bg-[#12151a] border border-[#242b35] p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-red-400 font-bold uppercase">
              <Activity className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Production Pipeline Controller & Agent Memory Store</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              State Machine & EOE Telemetry
            </h2>
            <p className="text-xs text-gray-400">
              Active Record: <span className="text-emerald-400">{currentRecord.recordId}</span> | Domain: <span className="text-white">{currentRecord.domain}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={copyAgentPackage}
              className="bg-[#1e232d] hover:bg-[#252c38] text-white border border-[#3b4454] px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer"
            >
              {copiedHandoff ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Agent Handoff Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Export Agent Payload</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* State Transitions Track */}
      <div className="bg-[#161a1f] border border-[#242b35] p-5 rounded-2xl space-y-4">
        <div className="text-xs uppercase text-gray-400 font-bold flex items-center justify-between">
          <span>Pipeline State Machine Progression</span>
          <span className="text-red-400">Current: {currentRecord.currentState}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
          {STATES.map((s, idx) => {
            const isCurrent = currentRecord.currentState === s.state;
            return (
              <button
                key={s.state}
                onClick={() => handleStateTransition(s.state)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-red-950/40 border-red-500 text-white shadow-lg scale-[1.02]"
                    : "bg-[#12151a] border-[#242b35] text-gray-400 hover:border-gray-600 hover:text-white"
                }`}
              >
                <div>
                  <div className={`text-xs font-bold ${isCurrent ? "text-red-400" : "text-gray-300"}`}>
                    {s.label}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 leading-tight">{s.desc}</div>
                </div>
                {isCurrent && (
                  <div className="mt-2 text-[10px] text-emerald-400 flex items-center space-x-1 font-bold">
                    <CheckCircle className="w-3 h-3" />
                    <span>LOCKED</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* EOE (End Of Engagement) Telemetry & Metric Capture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#12151a] border border-[#242b35] p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#242b35] pb-3">
            <h3 className="text-xs font-bold uppercase text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>EOE (End of Engagement) Telemetry</span>
            </h3>
            <span className="text-[11px] text-yellow-400">Energy & Outcome Tracker</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Energy Expended Score (1 = Fast Drop, 10 = High Burn):</label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedEnergy(num);
                      handleStateTransition(currentRecord.currentState);
                    }}
                    className={`w-8 h-8 rounded-lg font-bold border transition-all ${
                      selectedEnergy === num
                        ? "bg-yellow-500 text-black border-yellow-400"
                        : "bg-[#161a1f] border-[#242b35] text-gray-400 hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Session Outcome Status:</label>
              <div className="grid grid-cols-2 gap-2">
                {(["PIPELINE_WARM", "CONVERTED", "BOUNCED", "HARD_NO"] as const).map((outcome) => (
                  <button
                    key={outcome}
                    onClick={() => {
                      setSelectedOutcome(outcome);
                      handleStateTransition(currentRecord.currentState);
                    }}
                    className={`py-2 px-3 rounded-lg border font-bold text-[11px] text-left transition-all ${
                      selectedOutcome === outcome
                        ? "bg-emerald-950/50 border-emerald-500 text-emerald-300"
                        : "bg-[#161a1f] border-[#242b35] text-gray-400 hover:text-white"
                    }`}
                  >
                    {outcome}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Persistent Store Inspection */}
        <div className="bg-[#12151a] border border-[#242b35] p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#242b35] pb-3">
            <h3 className="text-xs font-bold uppercase text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Multi-Agent Memory Store ({allRecords.length} Active Records)</span>
            </h3>
            <span className="text-[11px] text-emerald-400 font-bold">Zero-Loss Local Sync</span>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs">
            {allRecords.length === 0 ? (
              <div className="text-gray-500 text-center py-6">No records in memory buffer.</div>
            ) : (
              allRecords.map((r) => (
                <div
                  key={r.recordId}
                  className={`p-2.5 rounded-xl border flex items-center justify-between ${
                    r.recordId === currentRecord.recordId
                      ? "bg-[#1a202c] border-emerald-500/50 text-white"
                      : "bg-[#161a1f] border-[#242b35] text-gray-400"
                  }`}
                >
                  <div>
                    <div className="font-bold text-white text-xs">{r.clientName} ({r.domain})</div>
                    <div className="text-[10px] text-gray-400">
                      Bleed: ${r.monthlyLeakEstimate.toLocaleString()}/mo | State: <strong className="text-red-400">{r.currentState}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-[#12151a] px-2 py-1 rounded border border-[#242b35] text-emerald-400">
                      EOE: {r.eoeSummary.outcomeStatus} ({r.eoeSummary.energyExpendedScore}/10)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
