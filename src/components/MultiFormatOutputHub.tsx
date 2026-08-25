import React, { useState, useRef, useEffect } from "react";
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  Volume2,
  VolumeX,
  Radio,
  FileText,
  Presentation,
  Rss,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sliders,
  Send,
  User,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Maximize2
} from "lucide-react";
import { AuditResponse } from "../types";

interface MultiFormatOutputHubProps {
  auditData: AuditResponse;
  onNavigateTab: (tab: string) => void;
}

interface VideoScene {
  id: number;
  duration: number; // in seconds
  title: string;
  tag: string;
  headline: string;
  subheadline: string;
  accentMetric: string;
  accentMetricLabel: string;
  voiceoverScript: string;
  visualType: "radar" | "leak" | "comparison" | "weapon" | "closing";
}

export const MultiFormatOutputHub: React.FC<MultiFormatOutputHubProps> = ({
  auditData,
  onNavigateTab,
}) => {
  const { clientInfo, calculatedLeak, proposal, playbook } = auditData;
  const [activeOutputTab, setActiveOutputTab] = useState<"video" | "slides" | "docs" | "feeds">("video");

  // Video Generator State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0); // 0 to 100
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(1);
  const [selectedVoice, setSelectedVoice] = useState<string>("Male - Authority Executive");
  const [isGeneratingExport, setIsGeneratingExport] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [copiedFeed, setCopiedFeed] = useState<string | null>(null);

  // Scenes generated dynamically for the audited client
  const scenes: VideoScene[] = [
    {
      id: 1,
      duration: 7,
      tag: "SCENE 01 • THE AUDIT RADAR",
      title: "Diagnostic Radar Initialized",
      headline: `Executive Revenue Audit for ${clientInfo.clientName}`,
      subheadline: `Live analysis of ${clientInfo.targetDomain} reveals critical mobile funnel leakage.`,
      accentMetric: `$${calculatedLeak.monthlyLeak.toLocaleString()}`,
      accentMetricLabel: "Monthly Capital Leak Detected",
      voiceoverScript: `Hello team at ${clientInfo.clientName}. We executed an architectural deep audit of ${clientInfo.targetDomain}, and your digital pipeline is currently losing an estimated $${calculatedLeak.monthlyLeak.toLocaleString()} every month.`,
      visualType: "radar",
    },
    {
      id: 2,
      duration: 8,
      tag: "SCENE 02 • THE BLEED RATE",
      title: "Where The Capital Leaks",
      headline: "78% of Commercial Decision Makers Bounce",
      subheadline: "Static contact forms and slow mobile quote times cause immediate contractor churn.",
      accentMetric: `$${calculatedLeak.annualLeak.toLocaleString()}/yr`,
      accentMetricLabel: "Annual Lost Contract Volume",
      voiceoverScript: `Because modern developers and general contractors shop on mobile, passive email contact forms force them to wait 24 to 48 hours for estimates. By that time, competitors have already scoped the job.`,
      visualType: "leak",
    },
    {
      id: 3,
      duration: 8,
      tag: "SCENE 03 • THE GLADIATOR ENGINE",
      title: "60-Second Mobile Scoping Engine",
      headline: "From Passive Brochure to Autonomic Lead Engine",
      subheadline: "Interactive sliders calculate square footage and deliver immediate pre-qualified scope tickets.",
      accentMetric: "3.2x",
      accentMetricLabel: "Average Commercial Intent Conversion",
      voiceoverScript: `With the Ignitus Gladiator Engine, prospects can select their square footage, project tier, and budget in under 60 seconds, capturing their purchase intent before they ever leave your page.`,
      visualType: "weapon",
    },
    {
      id: 4,
      duration: 7,
      tag: "SCENE 04 • AUTONOMIC SMS ROUTING",
      title: "Zero Lead Decay Direct-to-Cell",
      headline: "Full Scoped Bid Transmitted in 60 Seconds",
      subheadline: "Direct SMS notification to your executive phone with job value and client specifications.",
      accentMetric: "< 60s",
      accentMetricLabel: "Instant Mobile Lead Dispatch",
      voiceoverScript: `The moment a prospect completes their scope, the complete project ticket with estimated contract value lands directly on your executive cell phone via instant SMS.`,
      visualType: "comparison",
    },
    {
      id: 5,
      duration: 8,
      tag: "SCENE 05 • ZERO RISK STAGING COMMITMENT",
      title: "72-Hour Private Staging Build",
      headline: "We Build It First. You Inspect It Live.",
      subheadline: `${playbook.guaranteeTerms || "Private staging link provided before any DNS changes or commitments."}`,
      accentMetric: "72 Hours",
      accentMetricLabel: "Private Staging Deployment",
      voiceoverScript: `We will build a complete private staging preview for ${clientInfo.clientName} in 72 hours. Test it on your own phone with zero risk, zero downtime, and absolute authority. Let's ignite your pipeline.`,
      visualType: "closing",
    },
  ];

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  // Video playback loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSceneProgress((prev) => {
          const currentScene = scenes[currentSceneIndex];
          const increment = (100 / (currentScene.duration * 10)) * voiceSpeed;

          if (prev + increment >= 100) {
            // Next scene or loop end
            if (currentSceneIndex < scenes.length - 1) {
              setCurrentSceneIndex((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + increment;
        });

        setTotalElapsedTime((prev) => {
          if (prev >= totalDuration) return totalDuration;
          return prev + 0.1 * voiceSpeed;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentSceneIndex, voiceSpeed, scenes, totalDuration]);

  // Handle Voice Synthesis (Browser Web Speech API if supported)
  const speakCurrentScene = (sceneIndex: number) => {
    if (isMuted || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const textToSpeak = scenes[sceneIndex].voiceoverScript;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = voiceSpeed * 1.05;
    utterance.pitch = 0.95;

    // Pick a good English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.includes("en-US") || v.lang.includes("en-GB")
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (isPlaying) {
      speakCurrentScene(currentSceneIndex);
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [currentSceneIndex, isPlaying]);

  const handlePlayToggle = () => {
    if (sceneProgress >= 100 && currentSceneIndex === scenes.length - 1) {
      // restart
      setCurrentSceneIndex(0);
      setSceneProgress(0);
      setTotalElapsedTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentSceneIndex(0);
    setSceneProgress(0);
    setTotalElapsedTime(0);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSelectScene = (index: number) => {
    setCurrentSceneIndex(index);
    setSceneProgress(0);
    const elapsedPrior = scenes.slice(0, index).reduce((acc, s) => acc + s.duration, 0);
    setTotalElapsedTime(elapsedPrior);
    if (isPlaying) {
      speakCurrentScene(index);
    }
  };

  const handleSimulateRenderExport = () => {
    setIsGeneratingExport(true);
    setExportComplete(false);
    setTimeout(() => {
      setIsGeneratingExport(false);
      setExportComplete(true);
    }, 2400);
  };

  const activeScene = scenes[currentSceneIndex];

  // Feed Generator Data
  const webhookJsonFeed = JSON.stringify(
    {
      version: "ignitus.v1",
      client: {
        name: clientInfo.clientName,
        domain: clientInfo.targetDomain,
        niche: clientInfo.niche,
        avgJobValue: clientInfo.avgJobValue,
      },
      audit: {
        timestamp: new Date().toISOString(),
        monthlyBleed: calculatedLeak.monthlyLeak,
        annualBleed: calculatedLeak.annualLeak,
        score: auditData.technicalDetails.missedLeadsScore,
        efficiencyMultiplier: calculatedLeak.velocityMultiplier || 2.5,
      },
      actionableEndpoints: {
        scopingEngineUrl: `https://${clientInfo.targetDomain}/#scope`,
        smsWebhook: "https://api.ignituscore.com/v1/sms/dispatch",
        calendarBooking: `https://calendar.google.com/calendar/u/0/r?text=Ignitus+Staging+Demo+for+${encodeURIComponent(clientInfo.clientName)}`,
      },
    },
    null,
    2
  );

  const rssXmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:ignitus="https://ignituscore.com/schema">
  <channel>
    <title>Gladiator Audit Feed — ${clientInfo.clientName}</title>
    <link>https://${clientInfo.targetDomain}</link>
    <description>Autonomic Real-Time Lead Diagnostic and Scoping Stream</description>
    <language>en-us</language>
    <pubDate>${new Date().toUTCString()}</pubDate>
    
    <item>
      <title>Capital Leak Diagnostic: $${calculatedLeak.monthlyLeak.toLocaleString()}/mo Identified</title>
      <link>https://${clientInfo.targetDomain}/audit</link>
      <guid>${clientInfo.targetDomain}-leak-${new Date().toISOString().slice(0, 10)}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>${proposal.theHook.leakSummaryText}</description>
      <ignitus:monthlyBleed>${calculatedLeak.monthlyLeak}</ignitus:monthlyBleed>
      <ignitus:targetTier>Commercial General Contracting</ignitus:targetTier>
    </item>
  </channel>
</rss>`;

  const copyToClipboard = (text: string, feedKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFeed(feedKey);
    setTimeout(() => setCopiedFeed(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Multi-Modal Output Orchestrator</span>
              </span>
              <span className="text-gray-400 text-xs font-mono">
                Target: <strong className="text-white">{clientInfo.clientName}</strong> ({clientInfo.targetDomain})
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              4 Engine Output Channels
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-mono leading-relaxed">
              Instantly generate, render, and broadcast client deliverables across 4 formats:
              <span className="text-red-400 font-bold"> Video Generator</span>,
              <span className="text-amber-400 font-bold"> Slides</span>,
              <span className="text-blue-400 font-bold"> Docs</span>, and
              <span className="text-emerald-400 font-bold"> Live Feeds</span> (JSON & RSS).
            </p>
          </div>

          {/* Format Selector Tabs */}
          <div className="flex flex-wrap items-center bg-[#161a1f] border border-[#242b35] p-1.5 rounded-xl gap-1.5 shadow-inner">
            <button
              onClick={() => setActiveOutputTab("video")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                activeOutputTab === "video"
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/40"
                  : "text-gray-400 hover:text-white hover:bg-[#1f2630]"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Generator</span>
            </button>

            <button
              onClick={() => setActiveOutputTab("slides")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                activeOutputTab === "slides"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-900/40"
                  : "text-gray-400 hover:text-white hover:bg-[#1f2630]"
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slides Deck</span>
            </button>

            <button
              onClick={() => setActiveOutputTab("docs")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                activeOutputTab === "docs"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                  : "text-gray-400 hover:text-white hover:bg-[#1f2630]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Docs Proposal</span>
            </button>

            <button
              onClick={() => setActiveOutputTab("feeds")}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                activeOutputTab === "feeds"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40"
                  : "text-gray-400 hover:text-white hover:bg-[#1f2630]"
              }`}
            >
              <Rss className="w-3.5 h-3.5" />
              <span>Feeds (JSON/RSS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. VIDEO GENERATOR FORMAT */}
      {/* ========================================================================= */}
      {activeOutputTab === "video" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Viewport (7 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#0b0d10] border-2 border-[#242b35] rounded-2xl overflow-hidden shadow-2xl relative aspect-video flex flex-col justify-between p-6 sm:p-8 group">
              {/* Dynamic Animated Scene Backgrounds */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-[#12151a] to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                {isPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-pulse" />
                )}
              </div>

              {/* Scene Top Bar */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                        isPlaying ? "bg-red-400 opacity-75" : "bg-gray-400 opacity-25"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        isPlaying ? "bg-red-500" : "bg-gray-500"
                      }`}
                    />
                  </span>
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/40">
                    {activeScene.tag}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-gray-400 bg-[#161a1f]/90 px-3 py-1 rounded-full border border-[#242b35] flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-red-400" />
                  <span>
                    {totalElapsedTime.toFixed(1)}s / {totalDuration}s
                  </span>
                </div>
              </div>

              {/* Scene Dynamic Center Stage Content */}
              <div className="relative z-10 my-auto space-y-4 max-w-2xl">
                <div className="inline-block bg-gradient-to-r from-red-600 to-rose-600 text-white font-mono text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                  Target: {clientInfo.targetDomain}
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                  {activeScene.headline}
                </h3>

                <p className="text-xs sm:text-base text-gray-300 font-mono leading-relaxed">
                  {activeScene.subheadline}
                </p>

                {/* Big Metric Punch Callout */}
                <div className="pt-2 flex items-center space-x-4">
                  <div className="bg-[#161a1f]/90 border border-red-500/40 px-4 py-2.5 rounded-xl flex items-center space-x-3 shadow-lg">
                    <div className="text-xl sm:text-3xl font-black text-red-500 font-mono">
                      {activeScene.accentMetric}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-300 font-mono uppercase font-bold leading-tight">
                      {activeScene.accentMetricLabel}
                    </div>
                  </div>
                </div>
              </div>

              {/* Scene Bottom Audio & Progress Status */}
              <div className="relative z-10 space-y-3">
                {/* Voiceover Script Subtitle Card */}
                <div className="bg-[#12151a]/95 border border-[#242b35] rounded-xl p-3 flex items-start space-x-2.5 backdrop-blur-md">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[9px] uppercase font-mono text-gray-400 font-bold">
                      Narrator Script (AI Executive Voice)
                    </div>
                    <p className="text-xs text-gray-200 font-mono italic leading-snug">
                      "{activeScene.voiceoverScript}"
                    </p>
                  </div>
                </div>

                {/* Segmented Timeline Bar */}
                <div className="flex space-x-1.5">
                  {scenes.map((scene, idx) => (
                    <div
                      key={scene.id}
                      onClick={() => handleSelectScene(idx)}
                      className="flex-1 h-1.5 bg-[#1f2630] rounded-full overflow-hidden cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <div
                        className="h-full bg-red-500 transition-all duration-100"
                        style={{
                          width:
                            idx < currentSceneIndex
                              ? "100%"
                              : idx === currentSceneIndex
                              ? `${sceneProgress}%`
                              : "0%",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePlayToggle}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 shadow-md shadow-red-900/40 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? "Pause Video" : "Play Executive Video"}</span>
                </button>

                <button
                  onClick={handleReset}
                  className="bg-[#161a1f] hover:bg-[#1f2630] text-gray-300 p-2.5 rounded-lg border border-[#242b35] transition-colors"
                  title="Restart Video from Scene 1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-lg border transition-colors ${
                    isMuted
                      ? "bg-rose-950/40 border-rose-500/40 text-rose-400"
                      : "bg-[#161a1f] hover:bg-[#1f2630] border-[#242b35] text-gray-300"
                  }`}
                  title={isMuted ? "Unmute Voiceover" : "Mute Voiceover"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Speed & Voice Selector */}
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-gray-400">Speed:</span>
                {[1, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setVoiceSpeed(rate)}
                    className={`px-2 py-1 rounded text-[11px] font-bold ${
                      voiceSpeed === rate
                        ? "bg-red-600 text-white"
                        : "bg-[#161a1f] text-gray-400 hover:text-white border border-[#242b35]"
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Scene Navigator & Quick Send (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Dispatch Action Card */}
            <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#242b35] pb-3">
                <div className="flex items-center space-x-2 text-white font-bold font-mono text-sm">
                  <Send className="w-4 h-4 text-red-400" />
                  <span>Immediate Client Video Send</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-bold">
                  Ready to Dispatch
                </span>
              </div>

              <p className="text-xs text-gray-400 font-mono leading-relaxed">
                Render and package this customized 38-second video diagnosis directly into an instant SMS link or email video embed for <strong className="text-white">{clientInfo.clientName}</strong>.
              </p>

              <div className="space-y-2">
                <button
                  onClick={handleSimulateRenderExport}
                  disabled={isGeneratingExport}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-lg shadow-red-900/40 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingExport ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Compiling Video Link...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Send Video Link to {clientInfo.clientName}</span>
                    </>
                  )}
                </button>

                {exportComplete && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500 rounded-lg text-xs font-mono text-emerald-300 flex items-center space-x-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Video link generated & ready for SMS dispatch!</span>
                  </div>
                )}
              </div>
            </div>

            {/* 5-Scene Playlist */}
            <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-4 space-y-3 shadow-xl">
              <div className="text-xs font-mono uppercase font-bold text-gray-400 flex items-center justify-between">
                <span>Video Storyboard Playlist</span>
                <span>5 Scenes</span>
              </div>

              <div className="space-y-2">
                {scenes.map((scene, idx) => (
                  <div
                    key={scene.id}
                    onClick={() => handleSelectScene(idx)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      currentSceneIndex === idx
                        ? "bg-[#1f2630] border-red-500/70 shadow-md"
                        : "bg-[#161a1f] border-[#242b35] hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-red-400">
                        Scene 0{scene.id} • {scene.duration}s
                      </span>
                      {currentSceneIndex === idx && isPlaying && (
                        <span className="flex space-x-0.5">
                          <span className="w-1 h-3 bg-red-400 animate-pulse" />
                          <span className="w-1 h-4 bg-red-500 animate-pulse" />
                          <span className="w-1 h-2 bg-red-400 animate-pulse" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white mt-1">{scene.title}</div>
                    <div className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">
                      {scene.accentMetricLabel}: {scene.accentMetric}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SLIDES OUTPUT FORMAT */}
      {/* ========================================================================= */}
      {activeOutputTab === "slides" && (
        <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242b35] pb-4 gap-3">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase">
                <Presentation className="w-4 h-4" />
                <span>Executive Slide Deck Output Channel</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
                5-Slide Diagnostic Deck for {clientInfo.clientName}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Wasabi-sharp slides optimized for live Zoom/Teams pitches and Google Slides export.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab("deck")}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all self-start sm:self-auto shadow-md shadow-amber-900/30"
            >
              <span>Open Interactive Slide Deck ↗</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#161a1f] border border-[#242b35] p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Slide 1</span>
              <h4 className="text-sm font-bold text-white">Capital Leak Diagnostic</h4>
              <p className="text-xs text-gray-400 font-mono">
                Audited monthly pipeline bleed of ${calculatedLeak.monthlyLeak.toLocaleString()}/mo with industry benchmark data.
              </p>
            </div>

            <div className="bg-[#161a1f] border border-[#242b35] p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Slide 2</span>
              <h4 className="text-sm font-bold text-white">What You Have vs. Missing</h4>
              <p className="text-xs text-gray-400 font-mono">
                Side-by-side comparison of passive digital brochure vs. autonomic lead engine.
              </p>
            </div>

            <div className="bg-[#161a1f] border border-[#242b35] p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Slide 3</span>
              <h4 className="text-sm font-bold text-white">3-Page Architectural Shift</h4>
              <p className="text-xs text-gray-400 font-mono">
                Page 1 Authority Anchor, Page 2 Proof Engine, Page 3 60s Scoping Portal.
              </p>
            </div>

            <div className="bg-[#161a1f] border border-[#242b35] p-4 rounded-xl space-y-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Slide 4</span>
              <h4 className="text-sm font-bold text-white">The 3 Conversion Weapons</h4>
              <p className="text-xs text-gray-400 font-mono">
                Interactive Scoping, Google MUM Intent Ingestion, and Direct SMS Routing.
              </p>
            </div>

            <div className="bg-[#161a1f] border border-[#242b35] p-4 rounded-xl space-y-2 md:col-span-2">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Slide 5</span>
              <h4 className="text-sm font-bold text-white">72-Hour Zero-Risk Staging Commitment</h4>
              <p className="text-xs text-gray-400 font-mono">
                Private demo environment built before any DNS changes. Guaranteed zero downtime.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DOCS PROPOSAL FORMAT */}
      {/* ========================================================================= */}
      {activeOutputTab === "docs" && (
        <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242b35] pb-4 gap-3">
            <div>
              <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs font-bold uppercase">
                <FileText className="w-4 h-4" />
                <span>Executive Docs Proposal Output Channel</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
                Formal Gladiator Proposal Document
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Comprehensive 4-part scope with technical audit, front door overhaul, and contract roadmap.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab("proposal")}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all self-start sm:self-auto shadow-md shadow-blue-900/30"
            >
              <span>Open Gladiator Proposal ↗</span>
            </button>
          </div>

          <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-4 font-mono text-xs text-gray-300 leading-relaxed">
            <div className="flex items-center justify-between border-b border-[#242b35] pb-3 text-[11px] text-gray-400">
              <span>DOCUMENT TYPE: Commercial Executive Proposal</span>
              <span>TARGET DOMAIN: {clientInfo.targetDomain}</span>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white uppercase text-sm">
                1. Executive Summary & Diagnostic
              </h5>
              <p className="text-gray-400">
                Audited monthly leak of ${calculatedLeak.monthlyLeak.toLocaleString()}/mo. Proposed system elevates monthly pipeline from ${calculatedLeak.currentMonthlyRev.toLocaleString()} to ${calculatedLeak.optimizedMonthlyRev.toLocaleString()}/mo.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#242b35]">
              <h5 className="font-bold text-white uppercase text-sm">
                2. The 4-Phase Deployment Protocol
              </h5>
              <p className="text-gray-400">
                • Phase 1: Asset extraction & digital audit verification<br />
                • Phase 2: 72-Hour private mobile staging environment build<br />
                • Phase 3: Executive cell phone approval & test bid submission<br />
                • Phase 4: Zero-downtime live DNS deployment
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. REAL-TIME FEEDS FORMAT (JSON / RSS / WEBHOOK) */}
      {/* ========================================================================= */}
      {activeOutputTab === "feeds" && (
        <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242b35] pb-4 gap-3">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <Rss className="w-4 h-4" />
                <span>Real-Time Feeds & Webhook Streams</span>
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
                Machine-Readable Data Feeds for {clientInfo.clientName}
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Stream live audit parameters, lead capture webhooks, and RSS syndicate endpoints directly into CRMs or zapier pipelines.
              </p>
            </div>

            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold px-3 py-1.5 rounded-lg self-start sm:self-auto">
              Live Feed Active
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* JSON Feed */}
            <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#242b35] pb-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-white font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>JSON Telemetry & CRM Feed</span>
                </div>
                <button
                  onClick={() => copyToClipboard(webhookJsonFeed, "json")}
                  className="text-xs font-mono text-gray-400 hover:text-white flex items-center space-x-1"
                >
                  {copiedFeed === "json" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-[#0b0d10] p-3 rounded-lg text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-64 border border-[#242b35]">
                {webhookJsonFeed}
              </pre>
            </div>

            {/* RSS XML Feed */}
            <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-4 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#242b35] pb-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-white font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>RSS 2.0 Syndicate Feed</span>
                </div>
                <button
                  onClick={() => copyToClipboard(rssXmlFeed, "rss")}
                  className="text-xs font-mono text-gray-400 hover:text-white flex items-center space-x-1"
                >
                  {copiedFeed === "rss" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy XML</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-[#0b0d10] p-3 rounded-lg text-[11px] font-mono text-amber-300 overflow-x-auto max-h-64 border border-[#242b35]">
                {rssXmlFeed}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
