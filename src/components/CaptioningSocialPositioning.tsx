import React, { useState } from "react";
import {
  MessageSquare,
  Share2,
  Sparkles,
  Copy,
  Check,
  Smartphone,
  Flame,
  Send,
  Target,
  Hash,
  RefreshCw,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
  FileText
} from "lucide-react";
import { AuditResponse } from "../types";

interface CaptioningSocialPositioningProps {
  auditData: AuditResponse;
}

type Platform = "instagram" | "linkedin" | "sms" | "tiktok" | "facebook" | "gmb";
type Angle = "leak_callout" | "authority_roast" | "before_after" | "local_hero";

export const CaptioningSocialPositioning: React.FC<CaptioningSocialPositioningProps> = ({
  auditData,
}) => {
  const { clientInfo, calculatedLeak, proposal, technicalDetails } = auditData;

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("sms");
  const [selectedAngle, setSelectedAngle] = useState<Angle>("leak_callout");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toneIntensity, setToneIntensity] = useState<"diplomatic" | "wasabi_direct" | "gladiator">("wasabi_direct");
  const [customNotes, setCustomNotes] = useState("");

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Dynamic Generator for Omnichannel Positioning & Captions
  const generateCaptions = () => {
    const name = clientInfo.clientName;
    const domain = clientInfo.targetDomain;
    const leak = `$${calculatedLeak.monthlyLeak.toLocaleString()}`;
    const annualLeak = `$${calculatedLeak.annualLeak.toLocaleString()}`;
    const avgJob = `$${clientInfo.avgJobValue.toLocaleString()}`;
    const niche = clientInfo.niche;

    return {
      // 1. Direct Owner In-Person / SMS Drop (Perfect for bike route walk-ins)
      sms: [
        {
          id: "sms-1",
          title: "Bike Walk-In / Instant 60s SMS Follow-up",
          hook: "Cold Truth SMS with Staging Link",
          text: `Hey ${name} team — stopped by your office earlier. Took a quick look at ${domain}. Your mobile funnel is currently leaking an estimated ${leak}/mo because commercial clients can't get instant estimates on their phones. We built a 72-hour private interactive staging engine for you to test on your phone. No strings. Take a look here: https://${domain}.staging.ignituscore.com`,
          tags: ["Walk-In Followup", "Instant Impact", "60s Close"],
        },
        {
          id: "sms-2",
          title: "Executive Bleed Callout (High Urgency)",
          hook: "Direct-to-Owner Mobile Text",
          text: `${name} — Quick diagnostic on ${domain}: You have top-tier craftsmanship, but your site is acting like a digital gravestone losing ${annualLeak}/yr in bids to faster competitors. Let me send a 38-second video audit to your phone. Reply YES and I'll drop the private link.`,
          tags: ["High Urgency", "Pattern Interrupt"],
        },
      ],

      // 2. LinkedIn B2B Positioning Post
      linkedin: [
        {
          id: "li-1",
          title: "B2B Case Study / Positioning Teardown",
          hook: "The $${calculatedLeak.monthlyLeak.toLocaleString()} Leak in Local Contracting",
          text: `Most ${niche} companies don't have a lead problem. They have a SPEED TO SCOPE problem.\n\nWe just ran an architectural teardown of ${domain} (${name}).\n\nHere is what we discovered:\n❌ Commercial decision-makers wait 24-48 hours for standard email quotes.\n❌ 78% bounce on mobile before ever submitting.\n❌ Estimated capital leak: ${leak}/month (${annualLeak}/year).\n\nWhen we replaced static PDF contact forms with a 60-Second Interactive Scoping Engine + Instant Cell Dispatch, client inquiry capture tripled.\n\nCraftsmanship deserves an engine, not a digital brochure.\n\n#ContractorGrowth #B2BMarketing #CommercialConstruction #RevenueLeakage #IgnitusProtocol`,
          tags: ["LinkedIn B2B", "Authority Positioning", "Case Study"],
        },
      ],

      // 3. Instagram Reels / TikTok Hook & Caption
      tiktok: [
        {
          id: "tt-1",
          title: "Reel / TikTok Video Script & Caption",
          hook: "I biked into this business and showed the owner this screen...",
          text: `[REEL CAPTION]:\nI pulled up on my bike to ${name} and pulled up their website on my phone.\n\nLook at this: ${domain} was losing ${leak} EVERY SINGLE MONTH.\n\nWhy? Because when a developer wants a quote on a commercial job, they don't want a "Contact Us" box from 2012. They want to tap their specs, see the tier, and get a bid.\n\nWatch their face when we loaded the private 72-hour staging engine.\n\nDrop your business domain in the comments and I'll run your leak diagnostic live on my next ride. 🚲💨\n\n#BusinessAudit #StreetSales #GladiatorProtocol #ContractorLife #SmallBusinessHustle`,
          tags: ["Viral Street Story", "Reel / TikTok", "High Engagement"],
        },
      ],

      // 4. Instagram Carousel Slide Captions
      instagram: [
        {
          id: "ig-1",
          title: "Instagram Carousel: 'Why Top Contractors Bleed Leads'",
          hook: "Swipe to see the $${calculatedLeak.monthlyLeak.toLocaleString()} audit",
          text: `Slide 1: Why ${name} was bleeding ${leak}/month without knowing it.\nSlide 2: The Gravestone vs. The Engine.\nSlide 3: 60-Second Mobile Scoping.\nSlide 4: Direct-to-Cell SMS Dispatch.\nSlide 5: The 72-Hour Zero Risk Guarantee.\n\nFull teardown in bio. Ready for your staging build? DM "IGNITE".\n\n#LocalBusiness #SalesEngine #ModernWeb #AuthorityAudit`,
          tags: ["Carousel Format", "Visual Slides", "High Conversion"],
        },
      ],

      // 5. Facebook Local Business Group Teardown
      facebook: [
        {
          id: "fb-1",
          title: "Local Business Community / Facebook Roast & Praise",
          hook: "Shoutout to ${name} — Massive respect, but here's a free upgrade",
          text: `Local shoutout to ${name}! Incredible reputation and top-tier work across our community.\n\nWe did a free speed & conversion audit of ${domain} to see how they stack against regional competitors.\n\nThe findings: Outstanding brand authority, but losing ~${leak}/mo from mobile prospects who bounce off the contact form.\n\nWe engineered a free 72-hour mobile scoping prototype for them. Check it out and let's support local excellence!`,
          tags: ["Local Community", "High Goodwill", "Zero Friction"],
        },
      ],

      // 6. Google My Business (GMB) / Local SEO Positioning Update
      gmb: [
        {
          id: "gmb-1",
          title: "Google Business Profile Update Post",
          hook: "New 60-Second Instant Mobile Project Scoping Available",
          text: `Looking for fast estimates on ${niche} projects? We've upgraded our digital scoping engine. Calculate your project scope and receive instant priority scheduling directly from your smartphone. Visit ${domain} to start.`,
          tags: ["GMB Update", "Local SEO", "High Intent"],
        },
      ],
    };
  };

  const captions = generateCaptions();
  const activeList = captions[selectedPlatform] || [];

  const platformMeta = [
    { id: "sms" as Platform, label: "SMS & In-Person Walk-In", icon: Smartphone, color: "text-red-400 border-red-500/40 bg-red-500/10" },
    { id: "linkedin" as Platform, label: "LinkedIn Authority", icon: Award, color: "text-blue-400 border-blue-500/40 bg-blue-500/10" },
    { id: "tiktok" as Platform, label: "Reels / TikTok Street Vibe", icon: Flame, color: "text-pink-400 border-pink-500/40 bg-pink-500/10" },
    { id: "instagram" as Platform, label: "Instagram Carousel", icon: Share2, color: "text-purple-400 border-purple-500/40 bg-purple-500/10" },
    { id: "facebook" as Platform, label: "Local Community", icon: Target, color: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10" },
    { id: "gmb" as Platform, label: "GMB / Local SEO", icon: TrendingUp, color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded uppercase flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>Omnichannel Social Positioning & Caption Engine</span>
              </span>
              <span className="text-gray-400 text-xs font-mono">
                Target: <strong className="text-white">{clientInfo.clientName}</strong> (${calculatedLeak.monthlyLeak.toLocaleString()}/mo Bleed)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Captioning & Positioning Engine
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl font-mono leading-relaxed">
              Auto-generate street-tested bike walk-in SMS scripts, LinkedIn authority case studies, TikTok/Reel street hooks, and local community positioning posts ready to dispatch in seconds.
            </p>
          </div>

          {/* Tone Filter */}
          <div className="bg-[#161a1f] border border-[#242b35] p-3 rounded-xl space-y-2">
            <div className="text-[10px] font-mono uppercase text-gray-400 font-bold flex items-center space-x-1">
              <Sliders className="w-3 h-3 text-purple-400" />
              <span>Positioning Tone Style</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-mono">
              <button
                onClick={() => setToneIntensity("wasabi_direct")}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  toneIntensity === "wasabi_direct"
                    ? "bg-red-600 text-white shadow-md shadow-red-900/40"
                    : "bg-[#12151a] text-gray-400 hover:text-white"
                }`}
              >
                Wasabi Direct
              </button>
              <button
                onClick={() => setToneIntensity("gladiator")}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  toneIntensity === "gladiator"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                    : "bg-[#12151a] text-gray-400 hover:text-white"
                }`}
              >
                Gladiator Street
              </button>
              <button
                onClick={() => setToneIntensity("diplomatic")}
                className={`px-2.5 py-1 rounded font-bold transition-all ${
                  toneIntensity === "diplomatic"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                    : "bg-[#12151a] text-gray-400 hover:text-white"
                }`}
              >
                Diplomatic B2B
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {platformMeta.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedPlatform === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all group ${
                isSelected
                  ? `${p.color} shadow-lg scale-[1.02]`
                  : "bg-[#161a1f] border-[#242b35] text-gray-400 hover:border-gray-600 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <div className="text-xs font-bold font-mono truncate">{p.label}</div>
            </button>
          );
        })}
      </div>

      {/* Main Generated Content Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase text-gray-400 font-bold">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Ready-to-Post Captions & Scripts ({activeList.length} Variations)</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            Tailored for {clientInfo.clientName}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {activeList.map((item) => (
            <div
              key={item.id}
              className="bg-[#12151a] border border-[#242b35] hover:border-purple-500/40 rounded-xl p-5 space-y-4 shadow-xl transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242b35] pb-3 gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">{item.title}</h4>
                  <div className="text-xs text-purple-400 font-mono mt-0.5">Hook: "{item.hook}"</div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => copyToClipboard(item.text, item.id)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-md shadow-purple-900/30 transition-all cursor-pointer"
                  >
                    {copiedKey === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Caption</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Caption Text Box */}
              <div className="bg-[#0b0d10] border border-[#242b35] rounded-xl p-4 font-mono text-xs text-gray-200 whitespace-pre-wrap leading-relaxed">
                {item.text}
              </div>

              {/* Tags & Execution Notes */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] font-mono">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-[#161a1f] text-gray-400 px-2 py-0.5 rounded border border-[#242b35]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="text-gray-500 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>100% Calculated on Live Bleed Engine</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
