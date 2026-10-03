import React, { useState } from 'react';
import {
  MapPin,
  Crosshair,
  ShieldAlert,
  Zap,
  Layers,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Flame,
  Share2,
  Users,
  Radio,
  Eye,
  ShieldCheck,
  MessageSquare,
  Send,
  Check,
  Bot,
} from 'lucide-react';
import {
  CobraTrojanEngine,
  CompetitorNode,
  NodeChartGravity,
  TrojanDisplacementPlan,
  CobraSocialSwarmTarget,
} from '../services/cobraTrojanEngine';
import { playSound } from '../utils/audio';

interface CobraTrojanDeckProps {
  clientName: string;
  domain: string;
  niche?: string;
  location?: string;
}

export const CobraTrojanDeck: React.FC<CobraTrojanDeckProps> = ({
  clientName,
  domain,
  niche = 'Commercial & Residential Contracting',
  location = 'Regional Metro',
}) => {
  const [competitors] = useState<CompetitorNode[]>(
    CobraTrojanEngine.captureCompetitorMap(domain, niche, location)
  );
  const [nodeGravity] = useState<NodeChartGravity>(
    CobraTrojanEngine.chartCompetitorNodes(competitors)
  );
  const [trojanPlan] = useState<TrojanDisplacementPlan>(
    CobraTrojanEngine.decomposeTrojanDisplacement(clientName, domain, competitors)
  );
  const [selectedNode, setSelectedNode] = useState<CompetitorNode>(competitors[0]);
  const [socialSwarm, setSocialSwarm] = useState<CobraSocialSwarmTarget>(
    CobraTrojanEngine.getSocialSwarmForCompetitor(competitors[0])
  );
  const [dispatchedLeads, setDispatchedLeads] = useState<Record<string, boolean>>({});
  const [swarmAlert, setSwarmAlert] = useState<string | null>(null);

  const handleSelectNode = (comp: CompetitorNode) => {
    setSelectedNode(comp);
    setSocialSwarm(CobraTrojanEngine.getSocialSwarmForCompetitor(comp));
    playSound('click');
  };

  const handleDispatchTrojanLead = (leadId: string, prospectName: string) => {
    setDispatchedLeads((prev) => ({ ...prev, [leadId]: true }));
    playSound('success');
    setSwarmAlert(`[AGENT SHAH] Contrast Hook & 72-Hour Staging Scoper dispatched to ${prospectName}. Competitor response latency bypassed.`);
    setTimeout(() => setSwarmAlert(null), 6000);
  };

  const handleFireSwarmSweep = () => {
    playSound('bell');
    const swept = CobraTrojanEngine.executeLiveCompetitorSweep(selectedNode);
    setSocialSwarm(swept);
    setSwarmAlert(`[AGENT SHAH] Live Social Swarm Sweep engaged for ${selectedNode.name}. Third-party human stealth mask active.`);
    setTimeout(() => setSwarmAlert(null), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: AGENT SHAH COBRA Strike & Displacement Status */}
      <div className="rounded-2xl border border-rose-900/60 bg-gradient-to-br from-neutral-950 via-neutral-900 to-rose-950/30 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500/20 to-red-600/30 border border-rose-500/50 text-rose-400 shadow-lg shadow-rose-950/50">
              <Crosshair className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide font-mono uppercase">
                  AGENT SHAH: COBRA TROJAN STRIKE & SOCIAL SWARM MATRIX
                </h2>
                <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-300 uppercase">
                  SHAH Battle Unit Operative
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-sans mt-0.5">
                Supreme Commander coordinating Competitor Map Capture, Network Gravity Charting, 4-Phase Trojan Displacement, and Real-Time Social Swarm Siphoning.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div className="rounded-xl bg-neutral-950 px-3 py-1.5 border border-neutral-800 text-neutral-300">
              Target: <span className="text-rose-400 font-bold">{domain}</span>
            </div>
            <div className="rounded-xl bg-cyan-950/80 px-3 py-1.5 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Third-Party Stealth Mask Active</span>
            </div>
          </div>
        </div>

        {/* Real-Time Gravity Stats */}
        <div className="mt-4 pt-4 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="rounded-xl bg-neutral-950/90 p-3 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">Map Nodes Captured</div>
            <div className="text-white font-bold text-base mt-0.5 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-rose-400" />
              <span>{nodeGravity.totalCompetitorsAnalyzed} Regional Nodes</span>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-950/90 p-3 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">Market Response Bleed</div>
            <div className="text-rose-400 font-bold text-base mt-0.5 flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{nodeGravity.averageMarketLatencyMins}m Latency</span>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-950/90 p-3 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">Interactive Scoper Adoption</div>
            <div className="text-amber-400 font-bold text-base mt-0.5 flex items-center gap-1.5">
              <Smartphone className="h-4 w-4" />
              <span>{nodeGravity.interactiveAdoptionRatePct}% (0 / 3)</span>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-950/90 p-3 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">Displacement Advantage</div>
            <div className="text-emerald-400 font-bold text-base mt-0.5 flex items-center gap-1.5">
              <Flame className="h-4 w-4" />
              <span>3.2x Speed Lift</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Swarm Alert Banner if fired */}
      {swarmAlert && (
        <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-200 text-xs font-mono flex items-center justify-between shadow-lg shadow-cyan-950/50 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-cyan-400 animate-pulse" />
            <span>{swarmAlert}</span>
          </div>
          <button
            onClick={() => setSwarmAlert(null)}
            className="text-cyan-400 hover:text-white text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Competitor Map Nodes & Node Charting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Captured Competitor Map Nodes */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-400" />
                <h3 className="font-bold text-sm text-white font-mono uppercase">
                  1. Regional Competitor Map Nodes
                </h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">15-Mile Radius</span>
            </div>

            <div className="space-y-3">
              {competitors.map((comp) => {
                const isSelected = selectedNode.id === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => handleSelectNode(comp)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-rose-950/30 border-rose-500/50 shadow-md shadow-rose-950/30'
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                          #{comp.mapRank}
                        </span>
                        <span className="font-bold text-xs text-white truncate max-w-[190px]">
                          {comp.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {comp.distanceMiles} mi
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400">
                      <div>Reviews: <strong className="text-neutral-200">{comp.reviewCount} ({comp.avgRating}★)</strong></div>
                      <div>Response: <strong className="text-rose-400">{comp.speedToLeadLatencyMins}m</strong></div>
                    </div>

                    <div className="mt-2 text-[11px] font-sans text-rose-300/90 font-medium">
                      ⚠️ {comp.vulnerabilityNode}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] font-mono text-neutral-400">
            Selected for Displacement: <strong className="text-rose-400">{selectedNode.name}</strong>
          </div>
        </div>

        {/* Center & Right: Node Charting & Trojan Decomposition */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 2: Node Charting Network Vulnerabilities */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white font-mono uppercase">
                  2. Competitive Node Charting & Vulnerability Matrix
                </h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-400">Network Surface</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {nodeGravity.vulnerabilityHeatmap.map((node, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">{node.nodeIndex}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        {node.competitorFailureRate}% Failure
                      </span>
                    </div>
                    <div className="font-bold text-xs text-white mt-1">{node.vectorName}</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-neutral-900 text-[11px] text-neutral-300 font-sans">
                    <strong className="text-emerald-400">Displacement Lever:</strong> {node.trojanDisplacementLever}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Decomposition for Trojan Displacement Plan */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <h3 className="font-bold text-sm text-white font-mono uppercase">
                  3. 4-Phase Trojan Displacement Battle Plan
                </h3>
              </div>
              <span className="text-[11px] font-mono text-amber-400">Zero-Friction Infiltration</span>
            </div>

            <div className="space-y-3">
              {trojanPlan.phases.map((phase) => (
                <div key={phase.phaseNumber} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
                    P{phase.phaseNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-white">{phase.phaseName}</h4>
                      <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                        {phase.tacticalPillar}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-1">{phase.action}</p>
                    <p className="text-[11px] text-emerald-400 mt-1 font-mono">
                      ✓ Outcome: {phase.displacementOutcome}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* The Staging Trojan Weapon Box */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-rose-950/40 border border-rose-500/30">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                <Sparkles className="h-4 w-4" />
                <span>THE TROJAN HORSE WEAPON</span>
              </div>
              <div className="mt-2 text-xs text-neutral-200 italic leading-relaxed">
                {trojanPlan.stagingTrojanWeapon.openingLine}
              </div>
              <div className="mt-2 text-xs font-mono text-amber-300 font-semibold">
                {trojanPlan.stagingTrojanWeapon.closingAnchor}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Section 4: Agent SHAH — COBRA Social Swarm Infiltration & Competitor Siphon Engine */}
      <div className="rounded-2xl border border-cyan-900/60 bg-gradient-to-br from-neutral-950 via-neutral-900 to-cyan-950/20 p-5 shadow-2xl backdrop-blur-md">
        
        {/* Swarm Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-950/50">
              <Users className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide font-mono uppercase">
                  4. AGENT SHAH: COBRA SOCIAL SWARM INFILTRATION & SIPHON ENGINE
                </h3>
                <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-[9px] font-mono font-bold text-cyan-300 uppercase">
                  Swarm Mesh Active
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-sans mt-0.5">
                Surveillance and rapid siphon of inquiries targeting <strong className="text-cyan-400">{selectedNode.name}</strong> across LinkedIn, X, Meta & TikTok.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleFireSwarmSweep}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-950/50 transition-all active:scale-95"
            >
              <Radio className="h-4 w-4 animate-spin text-white" />
              <span>Engage Swarm Sweep</span>
            </button>
          </div>
        </div>

        {/* 3 Swarm Attack Vectors Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {socialSwarm.swarmAttackVectors.map((vector, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-neutral-950/90 border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400">
                    {vector.vector}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {vector.status}
                  </span>
                </div>
                <div className="font-mono text-xs text-neutral-300 mt-1 font-semibold">
                  Unit: <span className="text-amber-400">{vector.agentCallsign}</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 font-sans leading-relaxed">
                  {vector.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Monitored Competitor Channels & Live Intercepted Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Left: Monitored Social Channels of the Competitor */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-3">
                <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-cyan-400" />
                  Target Channel Surveillance
                </span>
                <span className="text-[10px] font-mono text-neutral-500">Live Feeds</span>
              </div>

              <div className="space-y-3">
                {socialSwarm.socialChannels.map((channel, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300">{channel.platform}</span>
                      <span className="text-neutral-400">{channel.followers} flwrs</span>
                    </div>
                    <div className="text-neutral-300 text-[11px] mt-0.5">{channel.handle}</div>
                    <div className="mt-2 text-[10px] text-rose-400 flex items-center gap-1 font-sans">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                      {channel.unansweredInquiriesCount} unanswered inquiries ({channel.detectedVulnerability})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-900 text-[10px] font-mono text-neutral-400 flex items-center justify-between">
              <span>Third-Party Mask: <strong className="text-emerald-400">Chrome 133 Desktop</strong></span>
              <span>Window: <strong className="text-cyan-400">CST Daylight</strong></span>
            </div>
          </div>

          {/* Right 2 cols: Intercepted Inquiries & Trojan Contrast Siphon */}
          <div className="lg:col-span-2 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-3">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-rose-400" />
                Live Inquiries Intercepted From {selectedNode.name}
              </span>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                Speed-to-Lead Siphon (&lt;60s)
              </span>
            </div>

            <div className="space-y-3.5">
              {socialSwarm.interceptedLeads.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-400 font-mono text-xs">
                  <Radio className="h-6 w-6 text-neutral-500 mx-auto mb-2 animate-pulse" />
                  <p className="text-white font-bold">Zero active inquiries intercepted for {selectedNode.name}.</p>
                  <p className="text-[11px] text-neutral-500 mt-1">Click "Engage Swarm Sweep" above to scan live competitor channels.</p>
                </div>
              ) : (
                socialSwarm.interceptedLeads.map((lead) => {
                const isDispatched = dispatchedLeads[lead.id];
                return (
                  <div key={lead.id} className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{lead.prospectName}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isDispatched
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {isDispatched ? 'TROJAN STRIKE DISPATCHED' : lead.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-300 font-mono mt-0.5">
                          Scope: <span className="text-cyan-300">{lead.inquiryTopic}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs">
                        <div className="rounded-lg bg-neutral-950 px-2.5 py-1 border border-neutral-800 text-[11px]">
                          Competitor Latency: <strong className="text-rose-400">{lead.competitorDelayMins}m</strong>
                        </div>
                      </div>
                    </div>

                    {/* Contrast Hook */}
                    <div className="mt-2.5 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-200 font-sans italic leading-relaxed">
                      "{lead.trojanContrastHook}"
                    </div>

                    {/* Action Bar */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-[10px] font-mono text-neutral-500">
                        Pillar: <strong className="text-amber-400">ECHO_BLAZE + KING_TAKER</strong> • Zero Robotic Cadence
                      </div>

                      <button
                        onClick={() => handleDispatchTrojanLead(lead.id, lead.prospectName)}
                        disabled={isDispatched}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                          isDispatched
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 cursor-default'
                            : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-950/40 active:scale-95'
                        }`}
                      >
                        {isDispatched ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Staging Dispatched</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>Dispatch Trojan Hook</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              }))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

