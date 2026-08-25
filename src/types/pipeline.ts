// Strict Binary Pipeline State & Telemetry Schema
// No fluff, deterministic, optimized for zero token bleed across agent handoffs

export type LeadEngagementState = 
  | "INGESTED"
  | "DIAGNOSED"
  | "STAGED_72HR"
  | "DISPATCHED_SMS"
  | "ENGAGED_WALKIN"
  | "PROPOSAL_SENT"
  | "RETAINED"
  | "ABANDONED";

export type ConversionVectorType = 
  | "BIKE_WALKIN_SMS"
  | "EXECUTIVE_SLIDES"
  | "STAGING_PREVIEW"
  | "PROPOSAL_DOC"
  | "VIDEO_TEARDOWN"
  | "SOCIAL_POSITIONING";

export interface PipelineAuditRecord {
  recordId: string;
  timestamp: string; // ISO 8601
  domain: string;
  clientName: string;
  niche: string;
  avgJobValue: number;
  monthlyLeakEstimate: number;
  annualLeakEstimate: number;
  currentState: LeadEngagementState;
  activeVector: ConversionVectorType;
  eoeSummary: {
    energyExpendedScore: number; // 1-10
    outcomeStatus: "CONVERTED" | "PIPELINE_WARM" | "BOUNCED" | "HARD_NO";
    objectionCode?: "NO_BUDGET" | "TECH_LACK" | "GATEKEEPER_BLOCKED" | "FOLLOWUP_REQUIRED" | "NONE";
    nextDeterministicAction: string;
  };
  telemetryPayload: {
    speedToPitchSeconds: number;
    stagingUrl: string;
    videoExported: boolean;
    slidesExported: boolean;
    docsExported: boolean;
    smsSentTimestamp?: string;
  };
}

export interface AgentHandoffPackage {
  schemaVersion: "1.0.0";
  senderAgentId: "INGESTION_CONTROLLER";
  receiverAgentId: "EXECUTION_DISPATCHER" | "CRM_STORE" | "ANALYTICS_CORE";
  record: PipelineAuditRecord;
  signature: string;
}
