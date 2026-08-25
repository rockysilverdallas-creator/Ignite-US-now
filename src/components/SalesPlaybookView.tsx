import React, { useState } from "react";
import { MessageSquare, ShieldCheck, DollarSign, Award, ChevronDown, ChevronUp, Copy, Check, Sparkles } from "lucide-react";
import { PlaybookData, ClientInfo } from "../types";

interface SalesPlaybookViewProps {
  playbook: PlaybookData;
  clientInfo: ClientInfo;
  monthlyLeak: number;
}

export const SalesPlaybookView: React.FC<SalesPlaybookViewProps> = ({
  playbook,
  clientInfo,
  monthlyLeak,
}) => {
  const [openObjection, setOpenObjection] = useState<number | null>(0);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopyFullScript = () => {
    const fullText = `
SALES BATTLECARD & CLOSING PLAYBOOK FOR ${clientInfo.clientName}
Target Domain: ${clientInfo.targetDomain}
Estimated Monthly Leak: $${monthlyLeak.toLocaleString()}/mo

==================================================
OPENING PITCH HOOK:
${playbook.openingHook}

==================================================
VALUE ANCHORING:
${playbook.valueAnchoring}

==================================================
OBJECTION HANDLERS:
${playbook.objectionHandlers.map((obj) => `\nOBJECTION: ${obj.objection}\nRESPONSE: ${obj.response}`).join("\n")}

==================================================
CLOSING SCRIPT:
${playbook.closingScript}

==================================================
GUARANTEE TERMS:
${playbook.guaranteeTerms}
`;

    navigator.clipboard.writeText(fullText.trim());
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Gladiator Closing Battlecards</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
            Contractor Sales Playbook & Objection Handlers
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Tailored script for <strong className="text-white">{clientInfo.clientName}</strong> • $2M/yr Operations
          </p>
        </div>

        <button
          onClick={handleCopyFullScript}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-black text-xs uppercase px-4 py-2.5 rounded-lg shadow-lg shadow-red-950/40 transition-all"
        >
          {copiedScript ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
          <span>{copiedScript ? "Playbook Copied!" : "Copy Full Pitch Script"}</span>
        </button>
      </div>

      {/* Grid of Pitch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Opening Hook */}
        <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-[#242b35] pb-2 text-red-400 font-mono font-bold text-xs uppercase">
            <MessageSquare className="w-4 h-4 text-red-500" />
            <span>1. The 30-Second Opening Hook</span>
          </div>
          <p className="text-xs text-gray-200 font-mono leading-relaxed bg-[#0d0f12] p-4 rounded-lg border border-[#242b35]">
            "{playbook.openingHook}"
          </p>
        </div>

        {/* Card 2: Value Anchoring */}
        <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-[#242b35] pb-2 text-emerald-400 font-mono font-bold text-xs uppercase">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>2. Single-Job Value Anchoring</span>
          </div>
          <p className="text-xs text-emerald-200 font-mono leading-relaxed bg-emerald-950/20 p-4 rounded-lg border border-emerald-500/30 font-medium">
            "{playbook.valueAnchoring}"
          </p>
        </div>
      </div>

      {/* Objection Handlers Accordion */}
      <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-4 shadow-xl">
        <div className="border-b border-[#242b35] pb-3">
          <h3 className="text-base font-black text-white uppercase tracking-wider font-mono flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <span>3. Contractor Objection Rebuttals ($2M/yr Mindset)</span>
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Click any objection below to reveal the clinical Gladiator response.
          </p>
        </div>

        <div className="space-y-3">
          {playbook.objectionHandlers.map((item, idx) => {
            const isOpen = openObjection === idx;
            return (
              <div
                key={idx}
                className="bg-[#0d0f12] border border-[#242b35] rounded-lg overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenObjection(isOpen ? null : idx)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#161a1f] transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-red-400 uppercase">
                    Objection #{idx + 1}: {item.objection}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#1a1f26] bg-[#12151a]">
                    <span className="text-[10px] font-mono uppercase text-gray-500 font-bold block mb-1">
                      Gladiator Clinical Rebuttal:
                    </span>
                    <p className="text-xs text-gray-200 font-mono leading-relaxed">
                      "{item.response}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Closing Script & Guarantee */}
      <div className="bg-[#161a1f] border border-red-500/40 rounded-xl p-6 shadow-2xl space-y-4 bg-gradient-to-r from-[#161a1f] via-[#1c1216] to-[#161a1f]">
        <div className="flex items-center space-x-3 border-b border-red-500/30 pb-3">
          <Award className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-black text-white uppercase tracking-wider font-mono">
            4. The Closing Ask & 72-Hour Guarantee
          </h3>
        </div>

        <div className="space-y-3 font-mono">
          <div className="bg-[#0d0f12] p-4 rounded-lg border border-red-500/30">
            <span className="text-[10px] font-mono uppercase text-red-400 font-bold block mb-1">
              Final Closing Script:
            </span>
            <p className="text-xs sm:text-sm text-gray-100 leading-relaxed font-bold">
              "{playbook.closingScript}"
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-xs text-red-300 font-bold flex items-center justify-between">
            <span>GUARANTEE: {playbook.guaranteeTerms}</span>
            <span className="text-[10px] uppercase bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/40">
              Zero Risk
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
