export interface ClientInfo {
  id: string;
  clientName: string;
  targetDomain: string;
  niche: string;
  location?: string;
  avgJobValue: number;
  currentLeads: number;
  closeRate: number;
  auditedTechStack?: string;
  pageSpeed?: string;
  notes?: string;
  autoInferred?: boolean;
}

export interface AuditTechnicalDetails {
  hosting: string;
  cms: string;
  pixels: string[];
  mobileSpeedSec: number;
  sslSecure: boolean;
  touchCtaPresent: boolean;
  missedLeadsScore: number; // 0-100 scale of revenue leakage severity
  headlineCopy: string;
  identifiedGaps: string[];
  competitiveDisadvantages: string[];
}

export interface ProposalSections {
  frontDoorOverhaul: {
    title: string;
    currentGravestone: string;
    ignitusDigitalFace: string;
    craftsmanshipImpact: string;
  };
  theHook: {
    title: string;
    currentPassiveState: string;
    ignitusState: string;
    leakSummaryText: string;
    monthlyLeakAmount: number;
    annualLeakAmount: number;
  };
  theWeapon: {
    title: string;
    interactiveScoping: string;
    intentIngestion: string;
    autonomicRouting: string;
  };
  theResult: {
    title: string;
    step1AssetExtraction: string;
    step2StagingBuild: string;
    step3OwnerApproval: string;
    step4LiveDeployment: string;
  };
}

export interface PlaybookData {
  openingHook: string;
  valueAnchoring: string;
  objectionHandlers: {
    objection: string;
    response: string;
  }[];
  closingScript: string;
  guaranteeTerms: string;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  type: 'doc' | 'slide' | 'sheet' | 'file' | 'folder';
}

export interface AuditResponse {
  clientInfo: ClientInfo;
  technicalDetails: AuditTechnicalDetails;
  proposal: ProposalSections;
  playbook: PlaybookData;
  calculatedLeak: {
    currentMonthlyRev: number;
    optimizedMonthlyRev: number;
    monthlyLeak: number;
    annualLeak: number;
    efficiencyLiftPct?: number;
    velocityMultiplier?: number;
    projectedScalingOutput?: number;
  };
}
