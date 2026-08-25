import React, { useState } from "react";
import { Monitor, Smartphone, Play, CheckCircle2, ShieldCheck, Zap, ArrowRight, MessageSquare, Send, Award, Sliders, Sparkles } from "lucide-react";
import { ClientInfo } from "../types";

interface VisualShowcasePresentationProps {
  clientInfo: ClientInfo;
}

export const VisualShowcasePresentation: React.FC<VisualShowcasePresentationProps> = ({ clientInfo }) => {
  const [activePage, setActivePage] = useState<1 | 2 | 3>(1);

  // Before/After Slider state for Page 2
  const [sliderPos, setSliderPos] = useState<number>(50);

  // Instant Estimator for Page 2 & 3
  const [sqFt, setSqFt] = useState<number>(1200);
  const [mixType, setMixType] = useState<"residential" | "commercial">("residential");
  const [zipCode, setZipCode] = useState<string>("75001");
  const [ticketDispatched, setTicketDispatched] = useState<boolean>(false);

  const estimatedCost = sqFt * (mixType === "residential" ? 9.5 : 14.2);

  const handleDispatchTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketDispatched(true);
    setTimeout(() => setTicketDispatched(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Blueprint Tabs */}
      <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-500 font-mono text-xs font-bold uppercase tracking-wider">
            <Monitor className="w-4 h-4" />
            <span>3-Slide Visual Aesthetics Presentation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mt-1">
            Visual Authority & Transaction Blueprint Comparison
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">
            Comparing Page Complexity & Operational Value for {clientInfo.clientName}
          </p>
        </div>

        {/* Page Switcher Buttons */}
        <div className="flex items-center space-x-2 bg-[#0d0f12] p-1.5 rounded-lg border border-[#242b35]">
          <button
            onClick={() => setActivePage(1)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              activePage === 1
                ? "bg-red-500 text-white shadow-md shadow-red-900/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Page 1: Static Brochure
          </button>
          <button
            onClick={() => setActivePage(2)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              activePage === 2
                ? "bg-red-500 text-white shadow-md shadow-red-900/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Page 2: Immersive Showcase
          </button>
          <button
            onClick={() => setActivePage(3)}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              activePage === 3
                ? "bg-red-500 text-white shadow-md shadow-red-900/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Page 3: Intent Engine
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Screen Mockup (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0a0c0e] border border-[#242b35] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Browser Chrome Bar */}
          <div className="bg-[#12151a] border-b border-[#242b35] px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="bg-[#0d0f12] text-gray-400 font-mono text-[11px] px-4 py-1 rounded border border-[#242b35] w-72 text-center truncate">
              https://{clientInfo.targetDomain || "bobconcrete.com"}
            </div>
            <div className="text-[10px] font-mono font-bold uppercase text-red-400">
              {activePage === 1 && "LOW COMPLEXITY"}
              {activePage === 2 && "MEDIUM COMPLEXITY"}
              {activePage === 3 && "HIGH COMPLEXITY"}
            </div>
          </div>

          {/* SCREEN CONTENT BY ACTIVE PAGE */}
          <div className="p-4 sm:p-6 flex-1 min-h-[480px]">
            {/* PAGE 1: THE STATIC BROCHURE */}
            {activePage === 1 && (
              <div className="bg-[#111418] border border-dashed border-gray-700 rounded-xl p-6 space-y-6 text-gray-300 font-mono">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-4 gap-2">
                  <div className="font-bold text-lg text-white uppercase tracking-wider">
                    {clientInfo.clientName || "BOB'S CONCRETE & DRYWALL CO."}
                  </div>
                  <div className="text-xs text-amber-400 font-semibold">Call: 555-0199 (Static Link)</div>
                </div>

                {/* Static Image Box */}
                <div className="relative bg-gray-900 border border-gray-800 rounded-lg h-48 flex items-center justify-center overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                    alt="Concrete Truck"
                    className="w-full h-full object-cover opacity-40 grayscale"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-black/60">
                    <span className="text-xs text-gray-400 uppercase tracking-widest">[Static Unoptimized Photo]</span>
                    <p className="text-sm font-bold text-white mt-1">"We have been in business for 30 years."</p>
                  </div>
                </div>

                {/* Body copy */}
                <div className="space-y-3 bg-gray-900/60 p-4 rounded border border-gray-800 text-xs">
                  <p className="text-gray-300">"We do high quality concrete and drywall work. Call us for a free estimate."</p>
                  <div className="grid grid-cols-3 gap-2 text-center font-bold text-gray-400 pt-2 border-t border-gray-800">
                    <div>- Driveways</div>
                    <div>- Patios</div>
                    <div>- Foundations</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-[11px] text-gray-500 text-center border-t border-gray-800 pt-4">
                  Copyright 2021 {clientInfo.clientName || "Bob's Concrete Co."} • All Rights Reserved
                </div>
              </div>
            )}

            {/* PAGE 2: THE IMMERSIVE SHOWCASE */}
            {activePage === 2 && (
              <div className="space-y-6">
                {/* Top Banner */}
                <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-red-950 via-gray-900 to-black p-6 border border-red-500/30 shadow-2xl">
                  <div className="absolute top-2 right-3 bg-red-500/20 text-red-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-red-500/30">
                    IGNITUS CORE | PROJECT BOOTSTRAP
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase max-w-xl">
                    ARCHITECTURAL INTEGRITY MET WITH INDUSTRIAL PRECISION
                  </h3>
                  <p className="text-xs text-gray-300 mt-2 max-w-lg font-mono">
                    HD Drone Footage Background • High-Precision Concrete & Foundation Engineering
                  </p>

                  {/* Compliance Tags */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-red-500/20 text-xs font-mono font-bold text-gray-200">
                    <span className="flex items-center space-x-1.5 bg-black/50 px-2.5 py-1 rounded border border-gray-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>OSHA Certified</span>
                    </span>
                    <span className="flex items-center space-x-1.5 bg-black/50 px-2.5 py-1 rounded border border-gray-800">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Bonded up to $5M</span>
                    </span>
                    <span className="flex items-center space-x-1.5 bg-black/50 px-2.5 py-1 rounded border border-gray-800">
                      <CheckCircle2 className="w-4 h-4 text-rose-400" />
                      <span>⭐ 4.9 Rated (180+ Audited Reviews)</span>
                    </span>
                  </div>
                </div>

                {/* Interactive Grid: Before/After Slider + Instant Estimator */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Before/After Swipe Slider */}
                  <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-white uppercase flex items-center space-x-1.5">
                        <Sliders className="w-3.5 h-3.5 text-red-500" />
                        <span>Craftsmanship Before/After</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">Swipe Touch</span>
                    </div>

                    <div className="relative h-48 rounded-lg overflow-hidden border border-[#2a323d] select-none">
                      {/* Before Image */}
                      <img
                        src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80"
                        alt="Before Concrete Pad"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded">
                        BEFORE (Cracked Pad)
                      </div>

                      {/* After Image with Clip Path */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                      >
                        <img
                          src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
                          alt="After Precision Concrete"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          AFTER (Ignitus Precision)
                        </div>
                      </div>

                      {/* Divider Line */}
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-red-500 shadow-xl cursor-ew-resize"
                        style={{ left: `${sliderPos}%` }}
                      >
                        <div className="w-6 h-6 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center absolute top-1/2 -translate-y-1/2 -left-2.5 shadow-lg">
                          ↔
                        </div>
                      </div>
                    </div>

                    {/* Touch range input */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      className="w-full accent-red-500 cursor-pointer"
                    />
                  </div>

                  {/* Instant Estimator Widget */}
                  <div className="bg-[#12151a] border border-[#242b35] rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-white uppercase flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Instant Estimator</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">60-Sec Calculation</span>
                    </div>

                    <div className="space-y-3 bg-[#0d0f12] p-3 rounded-lg border border-[#242b35]">
                      <div>
                        <label className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                          Project Area: {sqFt.toLocaleString()} sq. ft.
                        </label>
                        <input
                          type="range"
                          min="300"
                          max="5000"
                          step="100"
                          value={sqFt}
                          onChange={(e) => setSqFt(Number(e.target.value))}
                          className="w-full accent-red-500"
                        />
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-[#1a1f26]">
                        <span className="text-xs text-gray-400 font-mono">Estimated Scope Budget:</span>
                        <span className="text-base font-black font-mono text-emerald-400">
                          ${Math.round(estimatedCost).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActivePage(3)}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Lock In Scope & Book Direct</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 3: THE SOVEREIGN INTENT MIRROR (TRANSACTION ENGINE) */}
            {activePage === 3 && (
              <div className="space-y-6">
                <div className="bg-[#12151a] border border-red-500/40 rounded-xl p-5 bg-gradient-to-r from-[#12151a] via-[#1a1114] to-[#12151a] shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-mono font-bold uppercase text-red-400 tracking-wider">
                        🔘 CLUSTER 3: ACTION ENGINE & TELEMETRY
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                      AUTONOMIC SMS ROUTING ACTIVE
                    </span>
                  </div>

                  <div className="text-center space-y-1 py-2">
                    <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                      "Let's Lock in Your Scope and Budget in 60 Seconds Flat"
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">
                      Bypasses email queues. Directly notifies Bob's cell phone with full job specifications.
                    </p>
                  </div>

                  {/* Step 1 & Step 2 Interactive Scope Form */}
                  <form onSubmit={handleDispatchTicket} className="space-y-4 max-w-xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono font-bold uppercase text-gray-400 block mb-1">
                          Step 1: Select Concrete Mix Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setMixType("residential")}
                            className={`px-2 py-2 rounded text-xs font-mono font-bold border transition-all ${
                              mixType === "residential"
                                ? "bg-red-500 text-white border-red-400"
                                : "bg-[#0d0f12] text-gray-400 border-[#242b35]"
                            }`}
                          >
                            Residential Pad
                          </button>
                          <button
                            type="button"
                            onClick={() => setMixType("commercial")}
                            className={`px-2 py-2 rounded text-xs font-mono font-bold border transition-all ${
                              mixType === "commercial"
                                ? "bg-red-500 text-white border-red-400"
                                : "bg-[#0d0f12] text-gray-400 border-[#242b35]"
                            }`}
                          >
                            Commercial Slab
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-bold uppercase text-gray-400 block mb-1">
                          Step 2: Delivery Zip & Footage
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder="Zip Code"
                            className="w-full bg-[#0d0f12] border border-[#2a3340] rounded px-2.5 py-1.5 text-xs text-white font-mono"
                          />
                          <span className="bg-[#0d0f12] border border-[#2a3340] rounded px-2 py-1.5 text-xs text-emerald-400 font-mono font-bold whitespace-nowrap">
                            ${Math.round(estimatedCost).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-mono font-black uppercase text-xs sm:text-sm py-3 rounded-lg shadow-xl shadow-red-950/50 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.01]"
                    >
                      <Send className="w-4 h-4" />
                      <span>Transmit Scope Ticket to Bob's Mobile (60s Lock)</span>
                    </button>
                  </form>

                  {/* API Connection Badge */}
                  <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-gray-400 pt-1 border-t border-[#1d232c]">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>⚡ Connected via local-native Pomelli and Google MUM APIs</span>
                  </div>
                </div>

                {/* Simulated SMS Alert Box when ticket dispatched */}
                {ticketDispatched && (
                  <div className="bg-emerald-950/80 border border-emerald-500 rounded-xl p-4 space-y-2 font-mono animate-bounce">
                    <div className="flex items-center justify-between text-emerald-300 text-xs font-bold uppercase">
                      <span className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Autonomic Telemetry Alert: Text Sent to Phone</span>
                      </span>
                      <span>Dispatched in 42s</span>
                    </div>
                    <p className="text-xs text-emerald-200">
                      "NEW HOT LEAD TICKET: {mixType === "residential" ? "Residential Pad" : "Commercial Slab"} • {sqFt} sq ft • Est. ${Math.round(estimatedCost).toLocaleString()} • Zip {zipCode} • Client on mobile line waiting for call back."
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Blueprint Analysis & Operational Value (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#161a1f] border border-[#242b35] rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-mono font-bold uppercase text-white border-b border-[#242b35] pb-2 flex items-center justify-between">
              <span>Operational Blueprint Breakdown</span>
              <span className="text-xs text-red-400">Slide {activePage} of 3</span>
            </h3>

            {/* Page 1 Breakdown */}
            {activePage === 1 && (
              <div className="space-y-3">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-red-400 uppercase">Complexity Level</div>
                  <div className="text-sm font-mono font-bold text-white">LOW (Sterile Brochure)</div>
                </div>

                <div className="space-y-2 text-xs font-mono text-gray-300">
                  <div className="font-bold uppercase text-red-400">Operational Value: ZERO</div>
                  <p className="leading-relaxed">
                    It is a dead business card on the web. It fails to convey craftsmanship, offers zero interactivity, and leaks 100% of its mobile visitors to competitors with active funnels.
                  </p>
                </div>

                <div className="bg-[#0d0f12] p-3 rounded-lg border border-[#242b35] text-[11px] font-mono text-gray-400">
                  <strong>Conversion Deficit:</strong> Visitors see a static truck picture and leave before ever attempting to call.
                </div>
              </div>
            )}

            {/* Page 2 Breakdown */}
            {activePage === 2 && (
              <div className="space-y-3">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">Complexity Level</div>
                  <div className="text-sm font-mono font-bold text-white">MEDIUM (Immersive Showcase)</div>
                </div>

                <div className="space-y-2 text-xs font-mono text-gray-300">
                  <div className="font-bold uppercase text-amber-400">Operational Value: HIGH VISUAL AUTHORITY</div>
                  <p className="leading-relaxed">
                    Projects absolute physical authority instantly. Before/after swiping demonstrates raw capability, while compliance tags establish immediate trust.
                  </p>
                </div>

                <div className="bg-[#0d0f12] p-3 rounded-lg border border-[#242b35] text-[11px] font-mono text-gray-400">
                  <strong>Authority Shift:</strong> Stops mobile bounce rate by giving visitors an interactive before/after craftsmanship slider.
                </div>
              </div>
            )}

            {/* Page 3 Breakdown */}
            {activePage === 3 && (
              <div className="space-y-3">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Complexity Level</div>
                  <div className="text-sm font-mono font-bold text-white">HIGH (Transaction Engine)</div>
                </div>

                <div className="space-y-2 text-xs font-mono text-gray-300">
                  <div className="font-bold uppercase text-emerald-400">Operational Value: MAXIMUM MARGIN RECOVERY</div>
                  <p className="leading-relaxed">
                    A completely autonomous transaction engine. Eliminates the "free quote" waiting game. The page qualifies the visitor, calculates their scope, and routes the ticket directly to Bob's phone as a text message within 60 seconds.
                  </p>
                </div>

                <div className="bg-[#0d0f12] p-3 rounded-lg border border-[#242b35] text-[11px] font-mono text-gray-400">
                  <strong>Direct SMS Routing:</strong> Solves the 24-hour lead decay problem by sending verified scope details straight to cell phone.
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActivePage((prev) => (prev % 3 === 0 ? 1 : ((prev + 1) as 1 | 2 | 3)))}
            className="w-full bg-[#1f2630] hover:bg-[#2a3340] text-gray-200 font-mono font-bold text-xs py-3 rounded-xl border border-[#2a323d] transition-colors flex items-center justify-center space-x-2"
          >
            <span>Next Blueprint Slide ({activePage === 3 ? "1" : activePage + 1})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5-Photo Dynamic Improvement Showcase for Client Pitching */}
      <div className="bg-[#12151a] border border-[#242b35] rounded-2xl p-6 space-y-6 shadow-2xl mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242b35] pb-4 gap-2">
          <div>
            <div className="flex items-center space-x-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Client Presentation Samples • 5 Visual Pillars</span>
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mt-1">
              "The Distance Between Now and Ignite is Now"
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              5 Concrete Visual Transformations to Demonstrate Dynamic Web Page Capabilities to {clientInfo.clientName}
            </p>
          </div>
          <span className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[11px] font-bold px-3 py-1 rounded uppercase self-start sm:self-auto">
            Viscon Group Pitch Deck
          </span>
        </div>

        {/* 5 Photo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Photo 1 */}
          <div className="bg-[#161a1f] border border-[#242b35] hover:border-red-500/50 rounded-xl overflow-hidden shadow-lg transition-all group flex flex-col">
            <div className="relative h-48 overflow-hidden bg-black">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Architectural Hero Banner"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161a1f] via-transparent to-black/40" />
              <span className="absolute top-3 left-3 bg-red-600/90 text-white font-mono text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                1. Architectural Hero Entrance
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase font-mono">
                  Dynamic High-Impact Commercial Entrance
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-1 leading-relaxed">
                  Replaces static text with high-definition architectural photography, live bonding verification ($5M Bonded), OSHA credentials, and instant 1-click bid triggers.
                </p>
              </div>
              <div className="pt-3 border-t border-[#242b35] flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold">
                <span>⭐ Instant Authority Anchor</span>
                <span>+42% Trust Factor</span>
              </div>
            </div>
          </div>

          {/* Photo 2 */}
          <div className="bg-[#161a1f] border border-[#242b35] hover:border-red-500/50 rounded-xl overflow-hidden shadow-lg transition-all group flex flex-col">
            <div className="relative h-48 overflow-hidden bg-black">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                alt="Interactive Scoping Engine"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161a1f] via-transparent to-black/40" />
              <span className="absolute top-3 left-3 bg-amber-600/90 text-white font-mono text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                2. 60s Scoping Engine
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase font-mono">
                  Interactive Commercial Scoping Engine
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-1 leading-relaxed">
                  Replaces dead "Contact Us" forms with live square-footage sliders, commercial build selectors, and instant scope estimates that capture decision-maker intent on mobile.
                </p>
              </div>
              <div className="pt-3 border-t border-[#242b35] flex items-center justify-between text-[10px] font-mono text-amber-400 font-bold">
                <span>⚡ 60-Second Lead Capture</span>
                <span>3.2x Intent Conversion</span>
              </div>
            </div>
          </div>

          {/* Photo 3 */}
          <div className="bg-[#161a1f] border border-[#242b35] hover:border-red-500/50 rounded-xl overflow-hidden shadow-lg transition-all group flex flex-col">
            <div className="relative h-48 overflow-hidden bg-black">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
                alt="Before After Craftsmanship"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161a1f] via-transparent to-black/40" />
              <span className="absolute top-3 left-3 bg-rose-600/90 text-white font-mono text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                3. Touch Craftsmanship Slider
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase font-mono">
                  Touch-Interactive Quality Verification
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-1 leading-relaxed">
                  Proves Viscon Group's high craftsmanship by allowing prospective developers to swipe across raw foundation work and finished commercial interiors in real time.
                </p>
              </div>
              <div className="pt-3 border-t border-[#242b35] flex items-center justify-between text-[10px] font-mono text-rose-400 font-bold">
                <span>↔ Touch Swipe Before/After</span>
                <span>Eliminates Bounces</span>
              </div>
            </div>
          </div>

          {/* Photo 4 */}
          <div className="bg-[#161a1f] border border-[#242b35] hover:border-red-500/50 rounded-xl overflow-hidden shadow-lg transition-all group flex flex-col">
            <div className="relative h-48 overflow-hidden bg-black">
              <img
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80"
                alt="Hotspot Build Inspection"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161a1f] via-transparent to-black/40" />
              <span className="absolute top-3 left-3 bg-emerald-600/90 text-white font-mono text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                4. Node Hotspot Inspection
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase font-mono">
                  Interactive Node Hotspot Inspection
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-1 leading-relaxed">
                  Converts passive photo galleries into an interactive engineering tour where clients click hotspots to verify material specs, structural load tolerances, and safety compliance.
                </p>
              </div>
              <div className="pt-3 border-t border-[#242b35] flex items-center justify-between text-[10px] font-mono text-emerald-400 font-bold">
                <span>🔍 Clickable Hotspots</span>
                <span>Commercial Trust Proof</span>
              </div>
            </div>
          </div>

          {/* Photo 5 */}
          <div className="bg-[#161a1f] border border-[#242b35] hover:border-red-500/50 rounded-xl overflow-hidden shadow-lg transition-all group flex flex-col md:col-span-2 lg:col-span-2">
            <div className="relative h-48 overflow-hidden bg-black">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80"
                alt="Autonomic SMS Lead Dispatch"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161a1f] via-transparent to-black/40" />
              <span className="absolute top-3 left-3 bg-red-600/90 text-white font-mono text-[10px] font-black uppercase px-2.5 py-1 rounded shadow">
                5. Autonomic SMS Lead Dispatch
              </span>
            </div>
            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white uppercase font-mono">
                  Instant Mobile SMS Lead Ticket Dispatch
                </h4>
                <p className="text-xs text-gray-400 font-mono mt-1 leading-relaxed">
                  Eliminates 24-hour lead decay by instantly transmitting complete commercial bid specs ($45,000+ estimated contract value) directly to executive cell phones in under 60 seconds.
                </p>
              </div>
              <div className="pt-3 border-t border-[#242b35] flex items-center justify-between text-[10px] font-mono text-red-400 font-bold">
                <span>📲 Direct-to-Cell SMS Routing</span>
                <span>Zero Lead Decay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
