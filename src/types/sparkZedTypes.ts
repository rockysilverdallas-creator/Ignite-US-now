export type VaultCategory = 'welfare_health' | 'legal_identity' | 'financial_tax' | 'personal_diary' | 'tactical_assets';

export interface FileInspectionResult {
  riskScore: number; // 0 to 100
  securityStatus: 'Verified Safe' | 'Minor Caution' | 'Restricted';
  summary: string;
  actionItems: string[];
  sensitivityTags: string[];
  welfareRelevance: string;
  financialOptimizationNote?: string;
  mudaWasteDetected?: string[];
  analyzedAt: number;
}

export interface VaultFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  category: VaultCategory;
  uploadedAt: number;
  lastInspectedAt: number | null;
  checksum: string;
  isEncrypted: boolean;
  dataUrl: string; // Preview or local content
  textSample?: string;
  inspection?: FileInspectionResult;
  isFavorite?: boolean;
  source: 'google_drive' | 'local_upload' | 'welfare_generated';
  driveFileId?: string;
}

export interface AvatarPersona {
  id: string;
  name: string;
  roleTitle: string;
  description: string;
  avatarColor: string; // primary accent
  glowColor: string;
  voiceStyle: string;
  toneTag: string;
  frequencyHz: number;
  initialGreeting: string;
  aptitudes?: string[];
  engineType?: 'spark-zed-llama' | 'gemini' | 'hybrid';
}

export interface SparkTelemetryErrorLog {
  timestamp: string | Date;
  errorMessage: string;
  severity: 'info' | 'warning' | 'error';
}

export interface SparkTelemetryUserInteraction {
  userId: string;
  action: string;
  timestamp: string | Date;
  preferences?: Record<string, any>;
}

export interface SparkTelemetryTaskManagement {
  taskId: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  deadline?: string | Date;
}

export interface SparkTelemetryIntegration {
  serviceName: string;
  apiEndpoint: string;
  lastUpdated: string | Date;
}

export interface SparkTelemetrySecurity {
  encryptionEnabled: boolean;
  lastAuditDate: string | Date;
}

export interface SparkTelemetryLearningMetrics {
  adaptationRate: number; // A measure of how quickly the agent learns
  feedbackLoopEnabled: boolean; // Whether feedback mechanisms are in place
}

export interface SparkZedLlamaTelemetry {
  engineName: string;
  provider?: string;
  project?: string;
  location?: string;
  spark: {
    opsPerSec: number;
    rddPartitions: number;
    microBatchIntervalMs?: number;
    cacheHitRatePct?: number;
    dagStages?: string[];
    pipelineLatencyMs?: number;
    throughputMbPerSec?: number;
    benchmarkSummary?: string;
    stages?: string[];
    totalTimeMs?: number;
    telemetry?: object;
    errorLogs?: SparkTelemetryErrorLog[];
    userInteractions?: SparkTelemetryUserInteraction[];
    taskManagement?: SparkTelemetryTaskManagement[];
    integrations?: SparkTelemetryIntegration[];
    security?: SparkTelemetrySecurity;
    learningMetrics?: SparkTelemetryLearningMetrics;
  };
  zed?: {
    autonomousCapacity: string;
    contextBufferTokens: number;
    allocatedBufferMb: number;
    decoupledThreadCount: number;
    multiVectorMemorySlots: number;
    taskStaminaPct: number;
    deltaEngine?: {
      status: 'OPERATIVE' | 'IDLE' | 'ADAPTING';
      stateDiffingActive: boolean;
      varianceCorrectionPct: number;
      deltaThreshold: number;
    };
    coreCoderUnit?: {
      status: 'OPERATIVE' | 'STANDBY';
      onUnitPatching: boolean;
      astSynthesisActive: boolean;
      automatedVerification: boolean;
      activeRunners: number;
    };
    adaptiveLayer?: {
      status: 'OPERATIVE';
      adaptationMode: 'DYNAMIC_HEURISTIC' | 'HIGH_LOAD_SURGE';
      heuristicAcuity: number;
      environmentalFeedbackActive: boolean;
    };
    penetrationLayerDelta?: {
      status: 'OPERATIVE';
      leakAuditingActive: boolean;
      conversionFrictionDetection: boolean;
      channelPenetrationScore: number;
      bypassInspection: boolean;
    };
  };
  llama?: {
    model: string;
    tokensPerSecond: number;
    quantization: string;
    temperature: number;
    contextWindowMax: number;
    kvCacheStatus: string;
    reasoningMode: string;
  };
  timestamp: number;
}

export interface WelfareCheckIn {
  id: string;
  timestamp: number;
  energy: number; // 1-10
  stress: number; // 1-10
  sleepHours: number;
  hydrationLiters: number;
  activityNotes: string;
  moodNote: string;
  vitalityScore: number;
  statusGrade: string;
  recommendations: string[];
}

export interface SafetyBeaconConfig {
  isEnabled: boolean;
  intervalHours: number; // e.g. 24 hours
  lastPingTimestamp: number;
  nextDeadlineTimestamp: number;
  escalationStatus: 'nominal' | 'warning' | 'triggered';
  emergencyContacts: Array<{
    id: string;
    name: string;
    relation: string;
    emailOrPhone: string;
    autoDispatchWelfareVault: boolean;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: number;
  reasoning?: string;
  avatarMood?: string;
  actionPills?: string[];
  methodologyTag?: 'DMAIC' | 'JIT-Kanban' | 'Financial-Scale' | 'Welfare-Biometrics' | 'Spark-ZED-LLaMA';
  fileAttachment?: {
    id: string;
    name: string;
  };
  engineTelemetry?: SparkZedLlamaTelemetry;
  engineUsed?: string;
  executionTimeMs?: number;
}

export type KanbanStage = 'define' | 'measure' | 'analyze' | 'improve' | 'control';

export type MudaType = 
  | 'defects'
  | 'overproduction'
  | 'waiting'
  | 'non_utilized_talent'
  | 'transportation'
  | 'excess_inventory'
  | 'unnecessary_motion'
  | 'over_processing'
  | 'none';

export interface KanbanItem {
  id: string;
  title: string;
  description: string;
  stage: KanbanStage;
  mudaType: MudaType;
  financialImpactUsd: number;
  leadTimeHours: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assigneePersonaId?: string;
  standardizedControlNote?: string;
  createdAt: number;
}

export interface DMAICProject {
  id: string;
  title: string;
  problemStatement: string;
  unitDefects: number;
  totalOpportunities: number;
  dpmo: number; // Defects Per Million Opportunities
  sigmaLevel: number; // 1.0 to 6.0
  yieldPercent: number;
  whys: string[]; // 5-Whys
  rootCauseSummary: string;
  correctiveActions: string[];
  controlMetric: string;
  status: 'active' | 'standardized';
}

export interface FinancialThriveModel {
  monthlyGrossIncome: number;
  monthlyFixedBurn: number;
  monthlyDiscretionaryBurn: number;
  liquidCashReserves: number;
  highYieldInvestments: number;
  totalDebt: number;
  weightedDebtInterestRate: number;
  scaleTargetMultiple: number; // e.g. 5x
  monthlySavingsSurplus: number;
  runwaySurvivalMonths: number;
  capitalVelocityScore: number; // 0-100
  thriveScaleIndex: number; // 0-100
  tierLevel: 'Survival Floor' | 'Thrive Buffer' | 'Growth Accelerator' | 'Sovereign Scale';
}

export type LifePillarId = 
  | 'financial_soundness'
  | 'conscientious_impact'
  | 'vitality_health'
  | 'time_freedom'
  | 'relationships_family'
  | 'digital_sovereignty'
  | 'continuous_mastery';

export interface LifePillarData {
  id: LifePillarId;
  name: string;
  category: string;
  score: number; // 0 - 100
  targetScore: number;
  description: string;
  metricLabel: string;
  metricValue: string;
  keyPriority: string;
  conscientiousNote: string;
  recentAction: string;
  status: 'optimal' | 'imbalanced' | 'progressing';
}

export type LifestyleTier = 
  | 'Tier 1: Time Reclamation (Reclaim 10h/wk)'
  | 'Tier 2: Location Independence & 4-Day Sprints'
  | 'Tier 3: High-Frequency Health Sabbaticals'
  | 'Tier 4: Sovereign Autonomous Living';

export interface LifestyleGoal {
  id: string;
  tier: LifestyleTier;
  title: string;
  description: string;
  pillarId: LifePillarId;
  requiredSurplusMonthly: number;
  timeCostHours: number;
  conscientiousImpactScore: number;
  isUnlocked: boolean;
  progressPct: number;
  actionProtocol: string;
}

export interface ConscientiousImpactModel {
  monthlyRegenerativeAllocationUsd: number;
  ethicalAllocationPct: number; // percentage of surplus dedicated to ethical/regenerative impact
  communitySupportHours: number;
  carbonOffsetKg: number;
  ethicalVendorScore: number; // 0-100
  socialRoiIndex: number; // 0-100
  impactInitiatives: Array<{
    id: string;
    title: string;
    description: string;
    impactCategory: 'Environment' | 'Community' | 'Education' | 'Mentorship' | 'Open Source';
    allocatedUsdMonthly: number;
    hoursMonthly: number;
    impactMetric: string;
  }>;
}

export interface HolisticEquilibriumState {
  pillars: LifePillarData[];
  overallEquilibriumIndex: number; // 0-100
  imbalanceDelta: number; // max score - min score (variance)
  weakestPillar: LifePillarData;
  strongestPillar: LifePillarData;
  equalizedGrowthQuests: Array<{
    id: string;
    pillarId: LifePillarId;
    title: string;
    benefit: string;
    duration: string;
    completed: boolean;
    isCounterweight: boolean;
  }>;
  advisorEngagementPosture: 'on_demand' | 'proactive_sentinel' | 'holistic_architect';
}

export interface FacialAffectData {
  primaryEmotion: 'Calm' | 'Focused' | 'Fatigued' | 'Stressed' | 'Engaged' | 'Resolute';
  valenceScore: number; // 0 - 100
  stressIndex: number; // 0 - 100
  focusDepth: number; // 0 - 100
  eyeFatigueLevel: 'Low' | 'Moderate' | 'Elevated';
  microExpressionNotes: string;
}

export interface AudioProsodyData {
  voiceCadence: 'Measured' | 'Rapid' | 'Strained' | 'Energetic' | 'Hesitant';
  vocalTensionScore: number; // 0 - 100
  clarityRating: number; // 0 - 100
  acousticConfidence: 'High' | 'Steady' | 'Variable';
  decibelLevel: number;
  pitchFrequencyHz: number;
}

export interface RoboticsSpatialData {
  postureAlignment: 'Optimal Ergonomic' | 'Slight Forward Lean' | 'Slumped';
  ambientLightingRating: 'Optimal' | 'Glare' | 'Under-illuminated';
  spatialStabilityIndex: number; // 0 - 100
  ergonomicRecommendation: string;
}

export interface LivePerceptionLog {
  id: string;
  timestamp: string;
  spokenAgentReply: string;
  facialAffect: FacialAffectData;
  audioProsody: AudioProsodyData;
  roboticsSpatial: RoboticsSpatialData;
  snapshotThumb?: string;
}
