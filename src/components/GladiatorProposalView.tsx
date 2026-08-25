import React, { useState } from "react";
import { Copy, Check, Edit3, Save, Layers, ShieldAlert, Wrench, TrendingUp, Sparkles, FileText, Loader2, ExternalLink } from "lucide-react";
import { ProposalSections, ClientInfo } from "../types";
import { createProposalGoogleDoc } from "../services/workspaceService";
import { getAccessToken, googleSignIn } from "../services/googleAuth";

interface GladiatorProposalViewProps {
  proposal: ProposalSections;
  clientInfo: ClientInfo;
  monthlyLeak: number;
}

export const GladiatorProposalView: React.FC<GladiatorProposalViewProps> = ({
  proposal,
  clientInfo,
  monthlyLeak,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProposal, setEditableProposal] = useState<ProposalSections>(proposal);
  const [isExportingDoc, setIsExportingDoc] = useState(false);
  const [docExportResult, setDocExportResult] = useState<{ url: string; title: string } | null>(null);

  const handleExportDoc = async () => {
    setIsExportingDoc(true);
    try {
      let token = await getAccessToken();
      if (!token) {
        const res = await googleSignIn();
        token = res?.accessToken || null;
      }
      if (!token) return;

      const dummyAudit = {
        clientInfo,
        proposal: editableProposal,
        playbook: {
          openingHook: "",
          valueAnchoring: "",
          objectionHandlers: [],
          closingScript: "",
          guaranteeTerms: "72-Hour private staging link before any DNS shift.",
        },
        technicalDetails: {
          hosting: "Modern Cloud",
          cms: "Custom Engine",
          pixels: [],
          mobileSpeedSec: 1.2,
          sslSecure: true,
          touchCtaPresent: true,
          missedLeadsScore: 85,
          headlineCopy: "",
          identifiedGaps: [],
          competitiveDisadvantages: [],
        },
        calculatedLeak: {
          currentMonthlyRev: clientInfo.currentLeads * (clientInfo.closeRate / 100) * clientInfo.avgJobValue,
          optimizedMonthlyRev: clientInfo.currentLeads * 2.5 * (clientInfo.closeRate / 100 * 1.25) * clientInfo.avgJobValue,
          monthlyLeak,
          annualLeak: monthlyLeak * 12,
        },
      };

      const res = await createProposalGoogleDoc(dummyAudit, token);
      setDocExportResult({ url: res.webViewLink, title: res.title });
    } catch (err: any) {
      console.error("Docs export failed:", err);
      alert(err.message || "Failed to create Google Doc proposal.");
    } finally {
      setIsExportingDoc(false);
    }
  };

  const handleCopyProposal = () => {
    const markdownOutput = `
GLADIATOR PROTOCOL PROPOSAL — IGNITUS CORE
Client: ${clientInfo.clientName}
Target Domain: ${clientInfo.targetDomain}
Calculated Monthly Revenue Leak: $${monthlyLeak.toLocaleString()}/mo

==================================================
1. 🔘 [THE FRONT DOOR OVERHAUL]
==================================================
Current Gravestone:
${editableProposal.frontDoorOverhaul.currentGravestone}

Ignitus Digital Face:
${editableProposal.frontDoorOverhaul.ignitusDigitalFace}

Craftsmanship Impact:
${editableProposal.frontDoorOverhaul.craftsmanshipImpact}

==================================================
2. 🚨 [THE HOOK: WHAT YOU HAVE vs. WHAT YOU DON'T HAVE]
==================================================
What You Have Today:
${editableProposal.theHook.currentPassiveState}

What You Get With Ignitus:
${editableProposal.theHook.ignitusState}

Revenue Leak Breakdown:
${editableProposal.theHook.leakSummaryText}

==================================================
3. 🛠️ [THE WEAPON: WHAT WE GIVE YOU]
==================================================
${editableProposal.theWeapon.interactiveScoping}

${editableProposal.theWeapon.intentIngestion}

${editableProposal.theWeapon.autonomicRouting}

==================================================
4. 📈 [THE RESULT: HOW WE DO IT]
==================================================
${editableProposal.theResult.step1AssetExtraction}

${editableProposal.theResult.step2StagingBuild}

${editableProposal.theResult.step3OwnerApproval}

${editableProposal.theResult.step4LiveDeployment}
`;

    navigator.clipboard.writeText(markdownOutput.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar & Actions */}
      <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Clinical Proposal Output • Gladiator Protocol</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
            What You Have / What You Don't Have / What We Give You
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Target Client: <strong className="text-white">{clientInfo.clientName}</strong> ({clientInfo.targetDomain})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {docExportResult ? (
            <a
              href={docExportResult.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-mono font-bold px-3 py-2 rounded-lg border border-blue-500/40 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Open in Google Docs ↗</span>
            </a>
          ) : (
            <button
              onClick={handleExportDoc}
              disabled={isExportingDoc}
              className="flex items-center space-x-1.5 bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 text-xs font-mono font-bold px-3 py-2 rounded-lg border border-blue-500/30 transition-all disabled:opacity-50"
            >
              {isExportingDoc ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              <span>{isExportingDoc ? "Exporting Doc..." : "Export to Google Docs"}</span>
            </button>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 bg-[#1f2630] hover:bg-[#2a3340] text-gray-200 text-xs font-mono font-bold px-3 py-2 rounded-lg border border-[#2a323d] transition-colors"
          >
            {isEditing ? <Save className="w-4 h-4 text-emerald-400" /> : <Edit3 className="w-4 h-4 text-gray-400" />}
            <span>{isEditing ? "Done Editing" : "Edit Proposal"}</span>
          </button>

          <button
            onClick={handleCopyProposal}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-mono font-black uppercase px-4 py-2 rounded-lg shadow-lg shadow-red-950/40 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Proposal Copied!" : "Copy Proposal Text"}</span>
          </button>
        </div>
      </div>

      {/* The 4 Gladiator Protocol Sections Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Section 1: Front Door Overhaul */}
        <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-6 shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center space-x-3 border-b border-[#242b35] pb-3">
            <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 font-mono font-black flex items-center justify-center text-sm">
              01
            </span>
            <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">
              🔘 [THE FRONT DOOR OVERHAUL]
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#0d0f12] border border-[#242b35] rounded-lg p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-gray-500">
                Current "Sterile Digital Gravestone"
              </span>
              {isEditing ? (
                <textarea
                  value={editableProposal.frontDoorOverhaul.currentGravestone}
                  onChange={(e) =>
                    setEditableProposal({
                      ...editableProposal,
                      frontDoorOverhaul: {
                        ...editableProposal.frontDoorOverhaul,
                        currentGravestone: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#161a1f] text-xs text-gray-300 p-2 border border-[#2a3340] rounded font-mono"
                  rows={4}
                />
              ) : (
                <p className="text-xs text-gray-300 font-mono leading-relaxed">
                  {editableProposal.frontDoorOverhaul.currentGravestone}
                </p>
              )}
            </div>

            <div className="bg-[#0d0f12] border border-red-500/30 rounded-lg p-4 space-y-2 bg-red-950/10">
              <span className="text-[10px] font-mono uppercase font-bold text-red-400">
                Ignitus High-Impact "Digital Face"
              </span>
              {isEditing ? (
                <textarea
                  value={editableProposal.frontDoorOverhaul.ignitusDigitalFace}
                  onChange={(e) =>
                    setEditableProposal({
                      ...editableProposal,
                      frontDoorOverhaul: {
                        ...editableProposal.frontDoorOverhaul,
                        ignitusDigitalFace: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#161a1f] text-xs text-gray-200 p-2 border border-red-500/40 rounded font-mono"
                  rows={4}
                />
              ) : (
                <p className="text-xs text-gray-200 font-mono leading-relaxed font-medium">
                  {editableProposal.frontDoorOverhaul.ignitusDigitalFace}
                </p>
              )}
            </div>
          </div>

          <div className="bg-[#12151a] p-3.5 rounded-lg border border-[#2a3340] text-xs text-gray-300 font-mono">
            <strong className="text-red-400 uppercase">Craftsmanship & Authority Impact: </strong>
            {editableProposal.frontDoorOverhaul.craftsmanshipImpact}
          </div>
        </div>

        {/* Section 2: The Hook (What You Have vs What You Don't Have) */}
        <div className="bg-[#161a1f] border border-red-500/30 rounded-xl p-6 shadow-xl space-y-4 bg-gradient-to-b from-[#161a1f] to-[#1a1215]">
          <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 font-mono font-black flex items-center justify-center text-sm">
                02
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">
                🚨 [THE HOOK: WHAT YOU HAVE vs. WHAT YOU DON'T HAVE]
              </h3>
            </div>
            <span className="text-xs font-black font-mono text-red-500 bg-red-500/10 px-3 py-1 rounded border border-red-500/30">
              ${monthlyLeak.toLocaleString()}/mo Leak
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0d0f12] border border-[#242b35] rounded-lg p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-500">
                WHAT YOU HAVE TODAY (PASSIVE STATE)
              </span>
              {isEditing ? (
                <textarea
                  value={editableProposal.theHook.currentPassiveState}
                  onChange={(e) =>
                    setEditableProposal({
                      ...editableProposal,
                      theHook: { ...editableProposal.theHook, currentPassiveState: e.target.value },
                    })
                  }
                  className="w-full bg-[#161a1f] text-xs text-gray-300 p-2 border border-[#2a3340] rounded font-mono"
                  rows={3}
                />
              ) : (
                <p className="text-xs text-gray-300 font-mono leading-relaxed">
                  {editableProposal.theHook.currentPassiveState}
                </p>
              )}
            </div>

            <div className="bg-[#0d0f12] border border-emerald-500/30 rounded-lg p-4 space-y-2 bg-emerald-950/10">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                WHAT YOU GET WITH IGNITUS (ACTIVE ENGINE)
              </span>
              {isEditing ? (
                <textarea
                  value={editableProposal.theHook.ignitusState}
                  onChange={(e) =>
                    setEditableProposal({
                      ...editableProposal,
                      theHook: { ...editableProposal.theHook, ignitusState: e.target.value },
                    })
                  }
                  className="w-full bg-[#161a1f] text-xs text-emerald-200 p-2 border border-emerald-500/40 rounded font-mono"
                  rows={3}
                />
              ) : (
                <p className="text-xs text-emerald-200 font-mono leading-relaxed font-semibold">
                  {editableProposal.theHook.ignitusState}
                </p>
              )}
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-4 text-xs font-mono text-red-200 space-y-1">
            <div className="font-bold uppercase text-red-400">Exact Operational Capital Drain:</div>
            <p className="leading-relaxed">{editableProposal.theHook.leakSummaryText}</p>
          </div>
        </div>

        {/* Section 3: The Weapon (What We Give You) */}
        <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#242b35] pb-3">
            <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 font-mono font-black flex items-center justify-center text-sm">
              03
            </span>
            <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">
              🛠️ [THE WEAPON: WHAT WE GIVE YOU]
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0d0f12] border border-[#242b35] rounded-lg p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-white uppercase flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-red-500" />
                <span>1. Interactive Scoping</span>
              </div>
              <p className="text-xs text-gray-300 font-mono leading-relaxed">
                {editableProposal.theWeapon.interactiveScoping}
              </p>
            </div>

            <div className="bg-[#0d0f12] border border-[#242b35] rounded-lg p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-white uppercase flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>2. Intent Ingestion (Google MUM)</span>
              </div>
              <p className="text-xs text-gray-300 font-mono leading-relaxed">
                {editableProposal.theWeapon.intentIngestion}
              </p>
            </div>

            <div className="bg-[#0d0f12] border border-[#242b35] rounded-lg p-4 space-y-2">
              <div className="text-xs font-mono font-bold text-white uppercase flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>3. Autonomic 60s CRM Routing</span>
              </div>
              <p className="text-xs text-gray-300 font-mono leading-relaxed">
                {editableProposal.theWeapon.autonomicRouting}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: The Result (How We Do It) */}
        <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 border-b border-[#242b35] pb-3">
            <span className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 font-mono font-black flex items-center justify-center text-sm">
              04
            </span>
            <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">
              📈 [THE RESULT: HOW WE DO IT]
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0d0f12] border border-[#2a323d] rounded-lg p-3.5 space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-red-400">Phase 1</div>
              <p className="text-xs text-gray-200 font-mono leading-relaxed">
                {editableProposal.theResult.step1AssetExtraction}
              </p>
            </div>

            <div className="bg-[#0d0f12] border border-[#2a323d] rounded-lg p-3.5 space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-red-400">Phase 2</div>
              <p className="text-xs text-gray-200 font-mono leading-relaxed">
                {editableProposal.theResult.step2StagingBuild}
              </p>
            </div>

            <div className="bg-[#0d0f12] border border-[#2a323d] rounded-lg p-3.5 space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-red-400">Phase 3</div>
              <p className="text-xs text-gray-200 font-mono leading-relaxed">
                {editableProposal.theResult.step3OwnerApproval}
              </p>
            </div>

            <div className="bg-[#0d0f12] border border-emerald-500/40 rounded-lg p-3.5 space-y-2 bg-emerald-950/10">
              <div className="text-[10px] font-mono font-bold uppercase text-emerald-400">Phase 4</div>
              <p className="text-xs text-emerald-200 font-mono leading-relaxed font-semibold">
                {editableProposal.theResult.step4LiveDeployment}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
