import { PipelineAuditRecord, LeadEngagementState, ConversionVectorType } from "../types/pipeline";
import { AuditResponse } from "../types";

const STORAGE_KEY = "IGNITUS_PIPELINE_STATE_STORE";

export class PipelineEngineService {
  /**
   * Transforms raw UI AuditResponse into a deterministic binary record.
   */
  public static createRecordFromAudit(
    audit: AuditResponse,
    activeVector: ConversionVectorType = "BIKE_WALKIN_SMS"
  ): PipelineAuditRecord {
    const timestamp = new Date().toISOString();
    const recordId = `REC_${Date.now()}_${audit.clientInfo.targetDomain.replace(/[^a-zA-Z0-9]/g, "")}`;

    return {
      recordId,
      timestamp,
      domain: audit.clientInfo.targetDomain,
      clientName: audit.clientInfo.clientName,
      niche: audit.clientInfo.niche,
      avgJobValue: audit.clientInfo.avgJobValue,
      monthlyLeakEstimate: audit.calculatedLeak.monthlyLeak,
      annualLeakEstimate: audit.calculatedLeak.annualLeak,
      currentState: "DIAGNOSED",
      activeVector,
      eoeSummary: {
        energyExpendedScore: 3,
        outcomeStatus: "PIPELINE_WARM",
        objectionCode: "NONE",
        nextDeterministicAction: "DISPATCH_SMS_STAGING_LINK",
      },
      telemetryPayload: {
        speedToPitchSeconds: 45,
        stagingUrl: `https://${audit.clientInfo.targetDomain}.staging.ignituscore.com`,
        videoExported: false,
        slidesExported: false,
        docsExported: false,
      },
    };
  }

  /**
   * Persists record to the structured memory store with zero redundant memory footprint.
   */
  public static saveRecord(record: PipelineAuditRecord): void {
    const existing = this.getAllRecords();
    const index = existing.findIndex((r) => r.recordId === record.recordId || r.domain === record.domain);

    if (index >= 0) {
      existing[index] = record;
    } else {
      existing.unshift(record);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error("[PIPELINE_ENGINE_FATAL] Storage write failure:", e);
    }
  }

  /**
   * Retrieves all historical records sorted by most recent engagement.
   */
  public static getAllRecords(): PipelineAuditRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error("[PIPELINE_ENGINE_ERROR] Read failure, returning empty buffer:", e);
      return [];
    }
  }

  /**
   * Updates state transition with deterministic guardrails.
   */
  public static transitionState(
    recordId: string,
    nextState: LeadEngagementState,
    eoeUpdate?: Partial<PipelineAuditRecord["eoeSummary"]>
  ): PipelineAuditRecord | null {
    const records = this.getAllRecords();
    const target = records.find((r) => r.recordId === recordId);
    if (!target) return null;

    target.currentState = nextState;
    if (eoeUpdate) {
      target.eoeSummary = {
        ...target.eoeSummary,
        ...eoeUpdate,
      };
    }

    this.saveRecord(target);
    return target;
  }

  /**
   * Exports lightweight agent handoff envelope.
   */
  public static exportAgentHandoff(record: PipelineAuditRecord): string {
    return JSON.stringify(
      {
        schemaVersion: "1.0.0",
        senderAgentId: "INGESTION_CONTROLLER",
        receiverAgentId: "CRM_STORE",
        record,
        signature: `SIG_${btoa(record.recordId + record.timestamp).slice(0, 16)}`,
      },
      null,
      2
    );
  }
}
