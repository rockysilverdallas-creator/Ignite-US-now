import React, { useState } from 'react';
import {
  Code,
  Terminal,
  Layers,
  Cpu,
  Zap,
  Play,
  CheckCircle2,
  Copy,
  ExternalLink,
  Users,
  ShieldCheck,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { playSound } from '../utils/audio';

interface FileBuffer {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
}

const SAMPLE_BUFFERS: FileBuffer[] = [
  {
    id: 'buf-1',
    name: 'shahBattleUnit.ts',
    path: 'src/services/shahBattleUnit.ts',
    language: 'typescript',
    content: `// Agent SHAH — Battle Unit Matrix (4 Pillars • 20 Ephemeral Subagents)
// Integrated with Delta Multiplayer Environment (https://delta.dev/)
export class ShahBattleUnit {
  public static readonly DOCTRINE = "What one agent learns, all learn.";
  public static readonly STATUS = "BATTLE_UNIT_ONLINE";

  public static getZedBattleUnitMatrix() {
    return {
      unitName: "ZED-SPARK-01",
      deltaProtocol: {
        spec: "https://delta.dev/",
        multiplayerAgentThreads: "OPERATIVE",
        sharedContextAST: "SYNCHRONIZED",
      },
      coreCoderUnit: { status: "OPERATIVE", astSynthesisActive: true },
      adaptiveLayer: { status: "OPERATIVE", heuristicAcuityPct: 99.8 },
      penetrationLayerDelta: { status: "OPERATIVE", channelPenetrationScore: 98.6 },
    };
  }
}`,
  },
  {
    id: 'buf-2',
    name: 'RevenueLeakCalculator.tsx',
    path: 'src/components/RevenueLeakCalculator.tsx',
    language: 'typescript',
    content: `// Modern Contact Modality Revenue Leak Calculator
// Replaces obsolete single-metric phone calls with speed-to-lead, web scoper, GBP & social DMs
export const MODERN_LEAK_SURFACES = [
  { name: 'Speed-to-Lead Delay (>5m)', typicalBleedMonthly: 12500 },
  { name: 'Static Web Form Drop-off', typicalBleedMonthly: 9800 },
  { name: 'Google Maps / GBP Chat Latency', typicalBleedMonthly: 7400 },
  { name: 'Social Media Inbound DM Silence', typicalBleedMonthly: 6200 },
  { name: 'After-Hours & Weekend Blackout', typicalBleedMonthly: 11000 },
];`,
  },
  {
    id: 'buf-3',
    name: 'sparkZedLlama.ts',
    path: 'src/services/sparkZedLlama.ts',
    language: 'typescript',
    content: `// Spark 1.48M ops/s • ZED 128K Context Buffer • LLaMA 3.3 CoT Engine
export function getSparkZedLlamaLiveTelemetry(): SparkZedLlamaTelemetry {
  return {
    engineName: "Spark-ZED-LLaMA Triad High-Throughput Engine",
    spark: { opsPerSec: 1482000, pipelineLatencyMs: 0.42 },
    zed: {
      autonomousCapacity: "128K High-Context Decoupled Buffer (Delta Operative)",
      deltaEngine: { status: "OPERATIVE", varianceCorrectionPct: 99.7 },
      coreCoderUnit: { status: "OPERATIVE", onUnitPatching: true },
    },
  };
}`,
  },
];

export const ZedEditorDeck: React.FC = () => {
  const [activeBuffer, setActiveBuffer] = useState<FileBuffer>(SAMPLE_BUFFERS[0]);
  const [editorCode, setEditorCode] = useState<string>(activeBuffer.content);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[ZED_DELTA_DAEMON] Initialized Delta multiplayer protocol v0.9 (https://delta.dev/).',
    '[CORE_CODER] AST synthesis unit active on unit. 4 worker threads idling at 0.08ms.',
    '[ADAPTIVE_LAYER] Heuristic acuity calibrated at 99.8%.',
    '[SOVEREIGN_AIRGAP] Verified zero outgoing spend permitted without explicit human approval.',
  ]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectBuffer = (buf: FileBuffer) => {
    setActiveBuffer(buf);
    setEditorCode(buf.content);
    playSound('click');
  };

  const handleRunCoreCoderVerify = () => {
    playSound('pop');
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [
      ...prev,
      `[${timestamp}] [ZED_RUNNER] Verified buffer "${activeBuffer.name}". Syntax valid. 0 errors, 0 warnings.`,
      `[${timestamp}] [DELTA_SYNC] Synchronized code diff to shared multiplayer context thread.`,
    ]);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorCode);
    setCopied(true);
    playSound('pop');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: ZED Editor & Delta Status */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-500/40 text-cyan-400">
              <Code className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide font-mono">
                  ZED CORE CODER & DELTA MULTIPLAYER
                </h2>
                <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 uppercase">
                  Delta Operative
                </span>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-300 uppercase">
                  On-Unit Core Coder
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                First-class editor protocol here in our IDE and live across the sovereign portal. Shared threads, sub-ms AST execution, and zero bloat.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://delta.dev/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 px-3 py-1.5 text-xs text-neutral-300 border border-neutral-700 font-mono transition-all"
            >
              <span>delta.dev</span>
              <ExternalLink className="h-3 w-3 text-cyan-400" />
            </a>

            <button
              onClick={handleRunCoreCoderVerify}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-cyan-900/40 transition-all active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Verify on Unit</span>
            </button>
          </div>
        </div>

        {/* Real-Time Operational Badges */}
        <div className="mt-4 pt-4 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="rounded-xl bg-neutral-950 p-2.5 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">Delta Multiplayer</div>
            <div className="text-cyan-400 font-bold flex items-center gap-1.5 mt-0.5">
              <Users className="h-3 w-3" />
              <span>SHAH • ZED • Sovereign</span>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-950 p-2.5 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">Core Coder Unit</div>
            <div className="text-indigo-400 font-bold flex items-center gap-1.5 mt-0.5">
              <Cpu className="h-3 w-3" />
              <span>In-Memory AST (Active)</span>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-950 p-2.5 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">Adaptive Heuristics</div>
            <div className="text-purple-400 font-bold flex items-center gap-1.5 mt-0.5">
              <Zap className="h-3 w-3" />
              <span>99.8% Self-Tuned Acuity</span>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-950 p-2.5 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">Penetration Layer</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-3 w-3" />
              <span>98.6 Multi-Channel Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor & Terminal Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: ZED Code Editor Workspace */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl flex flex-col h-[580px]">
          {/* Editor Header: Multi-Buffer Tabs */}
          <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/70 px-3 py-2">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {SAMPLE_BUFFERS.map((buf) => (
                <button
                  key={buf.id}
                  onClick={() => handleSelectBuffer(buf)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    activeBuffer.id === buf.id
                      ? 'bg-neutral-800 text-cyan-300 font-semibold border border-neutral-700 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{buf.name}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              title="Copy code buffer"
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[11px] font-mono">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Buffer Path Strip */}
          <div className="bg-neutral-950 px-4 py-1.5 border-b border-neutral-900 text-[11px] font-mono text-neutral-500 flex items-center justify-between">
            <span>{activeBuffer.path}</span>
            <span className="text-neutral-600">{editorCode.split('\n').length} lines • UTF-8</span>
          </div>

          {/* Code Textarea / Viewer */}
          <div className="flex-1 relative flex">
            {/* Line numbers gutter */}
            <div className="w-12 bg-neutral-950/60 border-r border-neutral-900 py-3 select-none text-right pr-3 font-mono text-[12px] text-neutral-600 leading-relaxed overflow-hidden">
              {editorCode.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable code surface */}
            <textarea
              value={editorCode}
              onChange={(e) => setEditorCode(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full bg-neutral-950 p-3 font-mono text-[12.5px] leading-relaxed text-neutral-200 resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/30 selection:text-white"
            />
          </div>
        </div>

        {/* Right Col: ZED Live Terminal & Delta Mesh Console */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-2xl flex flex-col h-[580px]">
          <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                ZED Sub-ms Terminal
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Node
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-[11px] leading-relaxed text-neutral-300 bg-neutral-950">
            {consoleLogs.map((log, idx) => (
              <div key={idx} className="border-b border-neutral-900/80 pb-1.5">
                <span className={log.includes('ZED') ? 'text-cyan-400' : log.includes('SOVEREIGN') ? 'text-amber-400' : 'text-neutral-400'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-neutral-800 bg-neutral-900/50">
            <button
              onClick={() => {
                const ts = new Date().toLocaleTimeString();
                setConsoleLogs((prev) => [
                  ...prev,
                  `[${ts}] [HEARTBEAT] ZED Unit active at 1.48M ops/sec. Latency: 0.38ms. Delta thread nominal.`,
                ]);
                playSound('click');
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 py-2 text-xs font-mono text-neutral-200 transition-colors border border-neutral-700"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Ping ZED DAG Telemetry</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
