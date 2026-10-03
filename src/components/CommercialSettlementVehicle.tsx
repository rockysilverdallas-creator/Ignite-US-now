import React, { useState } from 'react';
import {
  ShieldCheck,
  DollarSign,
  FileText,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Copy,
  Lock,
  ExternalLink,
  CreditCard,
  Building,
  Phone,
  Layers,
} from 'lucide-react';
import { SovereignFinanceGuard, DispatchShieldAgreement } from '../services/financeGuard';
import { playSound } from '../utils/audio';

interface CommercialSettlementVehicleProps {
  clientName: string;
  domain: string;
}

export const CommercialSettlementVehicle: React.FC<CommercialSettlementVehicleProps> = ({
  clientName,
  domain,
}) => {
  const [agreement, setAgreement] = useState<DispatchShieldAgreement>(
    SovereignFinanceGuard.generateDispatchShieldWorkOrder(clientName, domain)
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const handleCopyAgreement = () => {
    const text = `DISPATCH SHIELD SERVICE AGREEMENT & WORK ORDER
Agreement ID: ${agreement.agreementId}
Client: ${agreement.clientName} (${agreement.targetDomain})
Date: ${agreement.effectiveDate}

FEES & TERMS:
- One-Time Implementation & Staging Fee: $${agreement.setupFeeUsd}.00 USD
- Ongoing Monthly Retention & High-Frequency Ingestion: $${agreement.monthlyRetainerUsd}.00 USD / Month
- Billing Cycle: Monthly Recurring (30-day cancellation notice)

DELIVERABLES:
${agreement.deliverables.map((d, i) => `${i + 1}. ${d}`).join('\n')}

SERVICE LEVEL AGREEMENT (SLA):
- Speed-to-Lead Response Latency: < ${agreement.serviceLevelAgreement.speedToLeadLatencySec} seconds
- Platform Uptime Guarantee: ${agreement.serviceLevelAgreement.uptimeGuaranteePct}%
- Working Staging Prototype Delivery: ${agreement.serviceLevelAgreement.stagingTurnaroundHours} Hours

AUTHORIZATION URL:
${agreement.checkoutUrl}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    playSound('pop');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    playSound('success');
    setPaymentSuccess(true);
    setAgreement((prev) => ({ ...prev, status: 'ACTIVE' }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Dispatch Shield Commercial Vehicle */}
      <div className="rounded-2xl border border-emerald-900/60 bg-gradient-to-br from-neutral-950 via-neutral-900 to-emerald-950/30 p-5 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/30 border border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-950/50">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-wide font-mono uppercase">
                  DISPATCH SHIELD SERVICE AGREEMENT & WORK ORDER
                </h2>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-300 uppercase">
                  Settlement Vehicle
                </span>
                <span className="rounded-full bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[10px] font-mono text-neutral-300">
                  {agreement.status}
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-sans mt-0.5">
                Standardized high-ticket contractor settlement vehicle. $550 deployment setup + $150/month recurring maintenance retainer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleCopyAgreement}
              className="flex items-center gap-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-3.5 py-2 text-neutral-200 border border-neutral-700 transition-all active:scale-95"
            >
              <Copy className="h-3.5 w-3.5 text-emerald-400" />
              <span>{copied ? 'Agreement Copied!' : 'Copy Work Order'}</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Strip */}
        <div className="mt-4 pt-4 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="rounded-xl bg-neutral-950/90 p-3.5 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">One-Time Setup & Staging</div>
            <div className="text-2xl font-black text-white mt-0.5 flex items-center gap-1">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              <span>550.00</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">72-Hour Mobile Staging Turnaround</div>
          </div>

          <div className="rounded-xl bg-neutral-950/90 p-3.5 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">Monthly Recurring Retainer</div>
            <div className="text-2xl font-black text-emerald-400 mt-0.5 flex items-center gap-1">
              <DollarSign className="h-5 w-5" />
              <span>150.00</span>
              <span className="text-xs text-neutral-400 font-normal">/mo</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">Autonomous Multi-Channel Ingestion</div>
          </div>

          <div className="rounded-xl bg-neutral-950/90 p-3.5 border border-neutral-800">
            <div className="text-[10px] text-neutral-400 uppercase">Speed-to-Lead Guarantee</div>
            <div className="text-2xl font-black text-cyan-400 mt-0.5 flex items-center gap-1">
              <Clock className="h-5 w-5" />
              <span>&lt; 45 sec</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-1">99.9% Uptime SLA Enforced</div>
          </div>
        </div>

        {/* $5 A Day Contractor Guarantee Callout */}
        <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-neutral-950 to-teal-950/80 border border-emerald-500/40 p-4 text-center shadow-lg">
          <div className="text-sm sm:text-base font-extrabold text-white font-mono tracking-wide">
            ⚡ <span className="text-emerald-400">$550 grabs your site</span> — and for just <span className="text-emerald-300 underline decoration-emerald-500 decoration-2 underline-offset-4">$5 A DAY</span>, we have your back <span className="text-cyan-400">24/7 • 365!</span>
          </div>
          <p className="text-xs text-neutral-300 font-sans mt-1">
            Less than a cup of gas-station coffee or a single gallon of work-truck diesel. One closed job covers an entire decade of 24/7 speed-to-lead protection.
          </p>
        </div>
      </div>

      {/* Main Work Order Document View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: The Agreement Paperwork */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/90 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider">
                COMMERCIAL WORK ORDER SPECIFICATION
              </span>
              <h3 className="text-base font-bold text-white font-mono mt-0.5">
                {agreement.agreementId}
              </h3>
            </div>
            <div className="text-right text-xs font-mono text-neutral-400">
              <div>Effective: <strong className="text-neutral-200">{agreement.effectiveDate}</strong></div>
              <div>Target: <strong className="text-emerald-400">{agreement.targetDomain}</strong></div>
            </div>
          </div>

          {/* Parties Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Provider / Operator</div>
              <div className="font-bold text-white mt-1">IGNITUS CORE PROTOCOL</div>
              <div className="text-neutral-400 mt-0.5">Sovereign Automation & Revenue Recovery</div>
              <div className="text-emerald-400 text-[11px] mt-2">auth@ignituscore.com</div>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase font-bold">Client / Contractor</div>
              <div className="font-bold text-white mt-1">{agreement.clientName}</div>
              <div className="text-neutral-400 mt-0.5">{agreement.targetDomain}</div>
              <div className="text-neutral-400 text-[11px] mt-2">{agreement.contactPhone}</div>
            </div>
          </div>

          {/* Deliverables Section */}
          <div>
            <h4 className="text-xs font-mono font-bold text-neutral-300 uppercase mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>1. Authorized Scope of Deliverables</span>
            </h4>
            <div className="space-y-2">
              {agreement.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800/80 text-xs text-neutral-200 font-sans">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[11px] font-bold">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Service Level Agreement Guarantee */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
            <h4 className="font-mono font-bold text-neutral-300 uppercase mb-2 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>2. Service Level Agreement (SLA) & Performance Guarantee</span>
            </h4>
            <p className="text-neutral-400 leading-relaxed font-sans text-[12.5px]">
              If the Dispatch Shield automated speed-to-lead gateway does not achieve a confirmed sub-60 second qualification on inbound inquiries during the first 30 days, client may terminate the work order with a 100% full refund of the $550 setup fee.
            </p>
          </div>

          {/* Sovereign Air-Gap Notice */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <Lock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-mono uppercase text-amber-400">Sovereign Financial Guardrail:</strong>
              <p className="text-[11.5px] text-amber-200/90 mt-0.5 leading-relaxed font-sans">
                All client payments flow directly into the Sovereign User Merchant Account. Automated agents hold strictly ZERO outgoing disbursement privileges.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Instant Settlement Action */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
              <CreditCard className="h-4 w-4 text-emerald-400" />
              <h3 className="font-bold text-sm text-white font-mono uppercase">
                Authorize Settlement
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Setup & 72h Staging:</span>
                <span className="text-white font-bold">$550.00</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>First Month Retainer:</span>
                <span className="text-white font-bold">$150.00</span>
              </div>
              <div className="border-t border-neutral-800 pt-2 flex justify-between text-sm">
                <span className="text-white font-bold">Total Initial Due:</span>
                <span className="text-emerald-400 font-extrabold">$700.00</span>
              </div>
            </div>

            {paymentSuccess ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs text-center space-y-1">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto" />
                <div className="font-bold">Work Order Authorized & Active</div>
                <div className="text-[11px] text-neutral-400">72-Hour Staging Build Commenced</div>
              </div>
            ) : (
              <button
                onClick={handleSimulatePayment}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-emerald-950/50 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Authorize & Collect $700</span>
              </button>
            )}

            <div className="pt-2 text-[11px] font-mono text-neutral-500 text-center">
              Powered by Stripe ACH & Instant Card Ingestion
            </div>
          </div>

          {/* Quick Details Box */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4 shadow-xl space-y-2 font-mono text-xs text-neutral-400">
            <div className="flex justify-between">
              <span>Checkout Link:</span>
              <span className="text-cyan-400 truncate max-w-[140px]">{agreement.checkoutUrl}</span>
            </div>
            <div className="flex justify-between">
              <span>Agreement Ref:</span>
              <span className="text-neutral-300">{agreement.agreementId}</span>
            </div>
            <div className="flex justify-between">
              <span>Billing Cadence:</span>
              <span className="text-neutral-300">Monthly Auto-Debit</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
