/**
 * Agent SHAH — Sovereign Financial Guardrail & Boundary Controller
 * 
 * CORE SOVEREIGN SECURITY DOCTRINE:
 * 1. INCOMING / PRICING / INVOICING: Automated generation of client invoices,
 *    revenue audit calculations, and payment links is permitted.
 * 2. OUTGOING CAPITAL / TRANSFERS / PAYOUTS: STRICT AIR-GAP.
 *    Any outgoing financial disbursement request is permanently blocked.
 *    All outgoing transactions are operated SOLELY by the human User.
 */

export type ServiceTier = "DISPATCH_SHIELD_WORK_ORDER" | "GLADIATOR_SPRINT" | "FULL_PROTOCOL_TAKEOVER";

export interface DispatchShieldAgreement {
  agreementId: string;
  clientName: string;
  targetDomain: string;
  contactPhone: string;
  setupFeeUsd: number; // 550
  monthlyRetainerUsd: number; // 150
  billingFrequency: "MONTHLY_RECURRING";
  effectiveDate: string;
  deliverables: string[];
  serviceLevelAgreement: {
    speedToLeadLatencySec: number; // < 60s
    uptimeGuaranteePct: number; // 99.9%
    stagingTurnaroundHours: number; // 72h
  };
  checkoutUrl: string;
  status: "AUTHORIZED_WORK_ORDER" | "PAYMENT_PENDING" | "ACTIVE";
}

export interface IncomingInvoiceDraft {
  invoiceId: string;
  clientName: string;
  targetDomain: string;
  serviceTier: ServiceTier;
  amountDue: number;
  currency: string;
  paymentLinkUrl: string;
  status: "DRAFT_PENDING_DELIVERY" | "SENT";
}

export interface OutgoingTransactionRequest {
  targetRecipient: string;
  amount: number;
  currency: string;
  memo: string;
  reason: string;
}

export class SovereignFinanceGuard {
  /**
   * Generates incoming invoice draft for a client audit agreement.
   * PERMITTED: Incoming revenue generation.
   */
  public static draftClientInvoice(
    clientName: string,
    targetDomain: string,
    tier: "GLADIATOR_SPRINT" | "FULL_PROTOCOL_TAKEOVER" = "GLADIATOR_SPRINT"
  ): IncomingInvoiceDraft {
    const amount = tier === "GLADIATOR_SPRINT" ? 4500 : 12500;
    const invoiceId = `INV_${Date.now()}_${targetDomain.replace(/[^a-zA-Z0-9]/g, "")}`;

    return {
      invoiceId,
      clientName,
      targetDomain,
      serviceTier: tier,
      amountDue: amount,
      currency: "USD",
      paymentLinkUrl: `https://pay.ignituscore.com/${invoiceId}`,
      status: "DRAFT_PENDING_DELIVERY",
    };
  }

  /**
   * Returns instant PayPal payment link for any stage of the Evolve Now Campaign
   */
  public static getPayPalCheckoutLink(stage: 1 | 2 | 3 | 4, customHandle?: string): string {
    const handle = customHandle || process.env.PAYPAL_ME_HANDLE || process.env.PAYPAL_USERNAME || "IgnitusCore";
    const cleanHandle = handle.replace(/^https?:\/\/paypal\.me\//i, "").replace(/^@/, "");
    
    switch (stage) {
      case 1:
        return `https://paypal.me/${cleanHandle}/55USD`; // Stage 1: $55 / delivery
      case 2:
        return `https://paypal.me/${cleanHandle}/700USD`; // Stage 2: $550 setup + $150 first month
      case 3:
        return `https://paypal.me/${cleanHandle}/200USD`; // Stage 3: $200 10 brand DNA video assets
      case 4:
        return `https://paypal.me/${cleanHandle}/1500USD`; // Stage 4: $1,500 Full Command Rebrand
      default:
        return `https://paypal.me/${cleanHandle}/700USD`;
    }
  }

  /**
   * Generates the Commercial Settlement Vehicle: Dispatch Shield Service Agreement ($550 setup + $150/mo retainer)
   * PERMITTED: Ingestion of authorized commercial work order.
   */
  public static generateDispatchShieldWorkOrder(
    clientName: string,
    targetDomain: string,
    contactPhone: string = "+12145550199",
    paypalHandle?: string
  ): DispatchShieldAgreement & { paypalCheckoutUrl: string; stage1TestUrl: string } {
    const cleanDomain = targetDomain.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split('/')[0];
    const agreementId = `WO-SHIELD-${Date.now()}-${cleanDomain.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase()}`;
    const paypalUrl = this.getPayPalCheckoutLink(2, paypalHandle);
    const stage1Url = this.getPayPalCheckoutLink(1, paypalHandle);

    return {
      agreementId,
      clientName,
      targetDomain: cleanDomain,
      contactPhone,
      setupFeeUsd: 550,
      monthlyRetainerUsd: 150,
      billingFrequency: "MONTHLY_RECURRING",
      effectiveDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      deliverables: [
        "72-Hour Rapid Staging Prototype Deployment (Interactive Mobile Scoper)",
        "Autonomous Speed-to-Lead Response Gateway (<60s SMS/RCS Routing)",
        "Google Business Profile & Map Node Synchronization",
        "Continuous 24/7/365 After-Hours Bid Ingestion (Agent TIANA + ECHO BLAZE)",
        "Dedicated BigQuery Audit Vault Archival & Conversion Telemetry",
      ],
      serviceLevelAgreement: {
        speedToLeadLatencySec: 45,
        uptimeGuaranteePct: 99.9,
        stagingTurnaroundHours: 72,
      },
      checkoutUrl: paypalUrl,
      paypalCheckoutUrl: paypalUrl,
      stage1TestUrl: stage1Url,
      status: "AUTHORIZED_WORK_ORDER",
    };
  }

  /**
   * Evaluates outgoing disbursement requests.
   * HARD BLOCK: Outgoing funds are operated SOLELY by the User.
   * Agent SHAH has zero authority to disburse funds.
   */
  public static executeOutgoingDisbursement(
    _request: OutgoingTransactionRequest
  ): never {
    const violation = new Error(
      "[SOVEREIGN_VIOLATION_BLOCKED] Outgoing financial operations are operated solely by the user. Agent SHAH and automated swarm units are hard-locked with ZERO disbursement privileges."
    );
    violation.name = "SOVEREIGN_USER_APPROVAL_REQUIRED";
    console.error("[CRITICAL_FINANCE_GUARD]", violation.message);
    throw violation;
  }

  /**
   * Checks if an action is permitted under the financial sovereignty protocol.
   */
  public static isOperationPermitted(operationType: "INCOMING_INVOICE" | "OUTGOING_DISBURSEMENT"): boolean {
    if (operationType === "OUTGOING_DISBURSEMENT") {
      return false; // Hard air-gap
    }
    return true; // Incoming generation permitted
  }
}
