import { AuditResponse } from "./types";

export const DEFAULT_VISCON_PRESET: AuditResponse = {
  clientInfo: {
    id: "preset-viscon-group",
    clientName: "Viscon General Contracting / Viscon Group",
    targetDomain: "viscong.com",
    niche: "General Commercial Contractor & Construction",
    location: "Regional Metro & Commercial Hub",
    avgJobValue: 45000,
    currentLeads: 35,
    closeRate: 18,
    auditedTechStack: "Custom Commercial Web Stack, Shared Hosting, Unoptimized Asset Compression, No Meta Pixel",
    pageSpeed: "3.9s Mobile Load (LCP 4.2s, FCP 2.4s)",
    notes: "Commercial General Contractor. High craftsmanship, static digital conversion architecture.",
    autoInferred: true,
  },
  technicalDetails: {
    hosting: "Commercial Web Host (Shared Pipeline)",
    cms: "Custom Web Architecture / Static HTML",
    pixels: ["No Meta Conversion Pixel", "No Active LinkedIn Insight Tag", "No GA4 Custom Event Tracking"],
    mobileSpeedSec: 3.9,
    sslSecure: true,
    touchCtaPresent: false,
    missedLeadsScore: 85,
    headlineCopy: "Viscon General Contracting - Commercial & Residential General Contracting Specialists.",
    identifiedGaps: [
      "No 60-second interactive commercial scoping or project budget calculator on mobile",
      "No direct-to-SMS autonomic routing for high-intent commercial job inquiries",
      "Static contact form requires manual typing without intent or timeline ingestion",
      "Lacks interactive before/after craftsmanship slider for commercial build-outs",
      "No instant bid parameter selector for commercial project managers",
    ],
    competitiveDisadvantages: [
      "78% of mobile commercial prospects bounce due to static inquiry forms requiring desktop follow-up",
      "Competing commercial general contractors using instant scoping capture decision-maker intent 3.2x faster",
      "Safety compliance & bonding badges buried below the fold rather than anchored at the top",
    ],
  },
  proposal: {
    frontDoorOverhaul: {
      title: "🔘 [THE FRONT DOOR OVERHAUL]",
      currentGravestone:
        "Your current domain (viscong.com) operates as a passive digital brochure. It displays static project lists and standard contact links, failing to actively capture high-value commercial project managers searching on mobile.",
      ignitusDigitalFace:
        "We transform viscong.com into a high-impact digital face: featuring interactive HD project showcases, a 60-second commercial project scoping engine, instant square-footage estimators, and prominent licensing, bonding, and safety compliance verification.",
      craftsmanshipImpact:
        "Positions Viscon Group as the undisputed regional commercial general contracting authority, commanding premium contract margins.",
    },
    theHook: {
      title: "🚨 [THE HOOK: WHAT YOU HAVE vs. WHAT YOU DON'T HAVE]",
      currentPassiveState:
        "WHAT YOU HAVE TODAY: A passive site with slow inquiry turnaround. High-value commercial clients land, scan static text, and leave before leaving project specs.",
      ignitusState:
        "WHAT YOU GET WITH IGNITUS: An autonomic 60-second scoping engine delivering hot, pre-qualified commercial bid tickets directly to your cell phone via SMS.",
      leakSummaryText:
        "Based on a $45,000 average commercial job value and an 18% close rate on 35 monthly inquiries, viscong.com is bleeding approximately $248,063 every single month in uncaptured project pipeline.",
      monthlyLeakAmount: 248063,
      annualLeakAmount: 2976750,
    },
    theWeapon: {
      title: "🛠️ [THE WEAPON: WHAT WE GIVE YOU]",
      interactiveScoping:
        "1. 60-SECOND COMMERCIAL SCOPING TOOL: Allows project managers and property owners to specify square footage, build type (Commercial Buildout, Ground-Up, Structural Remodel), and timeline to get instant scope estimates.",
      intentIngestion:
        "2. GOOGLE MUM INTENT INGESTION: Detects commercial search intent algorithms to capture decision-makers searching for licensed commercial contractors in your metro area.",
      autonomicRouting:
        "3. AUTONOMIC DIRECT-TO-SMS CRM ROUTING: Delivers structured lead tickets directly to Viscon leadership's mobile phone within 60 seconds, bypassing email clutter.",
    },
    theResult: {
      title: "📈 [THE RESULT: HOW WE DO IT]",
      step1AssetExtraction:
        "STEP 1: ASSET EXTRACTION — Auto-pull Viscon logos, project media, and licensing credentials with zero friction.",
      step2StagingBuild:
        "STEP 2: STAGING BUILD — Deploy full Ignitus Core transaction engine on private staging server in under 72 hours.",
      step3OwnerApproval:
        "STEP 3: OWNER APPROVAL — Review live mobile scoping engine on your cell phone and give go-ahead.",
      step4LiveDeployment:
        "STEP 4: LIVE DEPLOYMENT — Switch viscong.com DNS to Ignitus Infrastructure with zero downtime.",
    },
  },
  playbook: {
    openingHook:
      "Viscon team, right now viscong.com shows your impressive physical construction work, but acts like a closed office door when a project manager arrives on mobile at 8 PM. You handle $45,000+ contracts, but your website lets prospective clients slip away to competitors with instant scoping.",
    valueAnchoring:
      "Capturing just ONE additional commercial contract or renovation per quarter pays for this system 10x over. Every contract after that goes straight to Viscon Group's bottom line.",
    objectionHandlers: [
      {
        objection: "'We get most of our commercial work from existing developer relationships.'",
        response:
          "Existing relationships get people to look up 'viscong.com'. But when new developers or decision-makers visit on mobile and see no instant scoping tool, you lose the opportunity before the first phone call.",
      },
      {
        objection: "'Our commercial projects are too custom for an online estimate.'",
        response:
          "The 60-second engine doesn't give a binding bid — it captures exact square footage, project type, and budget parameters, then routes the structured ticket to your cell in 60s so you can close them first.",
      },
      {
        objection: "'How much is this going to cost me?'",
        response:
          "The real question is how much it's costing you NOT to have it. You're currently leaking $248,000 a month in missed pipeline. Our staging deployment is fixed-fee and guaranteed to launch in 72 hours.",
      },
    ],
    closingScript:
      "We've already extracted Viscon Group's brand assets and prepared the 72-hour staging build for viscong.com. All we need is your approval today, and your mobile scoping engine will be live by Friday. Shall we lock in your staging build now?",
    guaranteeTerms: "72-Hour Staging Build Guarantee & 100% Mobile Direct-SMS Routing Verification.",
  },
  calculatedLeak: {
    currentMonthlyRev: 283500,
    optimizedMonthlyRev: 531563,
    monthlyLeak: 248063,
    annualLeak: 2976750,
    efficiencyLiftPct: 188,
    velocityMultiplier: 3.2,
    projectedScalingOutput: 6378756,
  },
};

export const DEFAULT_BOB_PRESET = DEFAULT_VISCON_PRESET;

export interface ICPPreset {
  id: string;
  category: "HEALTHCARE" | "SPECIALTY_SPA" | "LOGISTICS" | "LEGAL" | "STAFFING" | "MANUFACTURING" | "COMMERCIAL_CONSTRUCTION";
  label: string;
  url: string;
  clientName: string;
  niche: string;
  annualRevRange: "$2M - $20M" | "$5M - $50M" | "$1M - $5M";
  avgJobValue: number;
  currentLeads: number;
  closeRate: number;
  leakEstimateMonthly: number;
  coreServiceLines: string[];
  conversionWeapon: string;
}

export const TARGET_ICPS: ICPPreset[] = [
  {
    id: "icp-healthcare-provider",
    category: "HEALTHCARE",
    label: "Healthcare Provider ($2M-$20M Practice)",
    url: "vanguardhealthpartners.com",
    clientName: "Vanguard Multi-Specialty & Surgical Clinics",
    niche: "Multi-Location Healthcare Provider ($2M-$20M Base Rev)",
    annualRevRange: "$2M - $20M",
    avgJobValue: 12500, // Surgical / treatment patient lifecycle value
    currentLeads: 110,
    closeRate: 22,
    leakEstimateMonthly: 302500,
    coreServiceLines: [
      "Outpatient Surgical Procedures",
      "Specialty Diagnostic & Imaging",
      "Chronic Condition Care Retainers",
      "Executive Wellness Protocols"
    ],
    conversionWeapon: "HIPAA-Compliant Instant Patient Triage & Procedure Scoping Engine with Direct Care Dispatch"
  },
  {
    id: "icp-specialty-spa",
    category: "SPECIALTY_SPA",
    label: "Specialty MedSpa & Aesthetics ($2M-$8M)",
    url: "luminaaestheticsmedspa.com",
    clientName: "Lumina Medical Spa & Laser Institute",
    niche: "High-Ticket Medical Aesthetics & Wellness Club",
    annualRevRange: "$2M - $20M",
    avgJobValue: 3800, // Membership package / multi-session bundle
    currentLeads: 180,
    closeRate: 28,
    leakEstimateMonthly: 191520,
    coreServiceLines: [
      "Laser Skin Resurfacing Packages",
      "Injectables & Body Contouring Retainers",
      "Anti-Aging Hormone Replacement Therapy",
      "High-Tier VIP Annual Wellness Memberships"
    ],
    conversionWeapon: "60-Second Facial Analysis & Treatment Calculator with Direct VIP Chair Booking"
  },
  {
    id: "icp-logistics-3pl",
    category: "LOGISTICS",
    label: "Freight Logistics & 3PL Warehouse ($5M-$20M)",
    url: "ironcladfreightlogistics.com",
    clientName: "Ironclad Logistics & Regional 3PL",
    niche: "Freight Brokerage, Dedicated Fleet & 3PL Warehousing",
    annualRevRange: "$2M - $20M",
    avgJobValue: 32000, // Dedicated lane / monthly pallet storage contract
    currentLeads: 45,
    closeRate: 16,
    leakEstimateMonthly: 230400,
    coreServiceLines: [
      "Dedicated Full Truckload (FTL) Regional Lanes",
      "Temperature-Controlled Reefer Distribution",
      "Cross-Docking & 3PL Pallet Storage Retainers",
      "Expedited Critical-Route Dispatch"
    ],
    conversionWeapon: "Instant Freight Lane Rate Estimator & Pallet Space Calculator with 60s Broker Dispatch"
  },
  {
    id: "icp-legal-services",
    category: "LEGAL",
    label: "Commercial & Corporate Legal Firm ($2M-$15M)",
    url: "sterlingcorporatelaw.com",
    clientName: "Sterling & Associates Corporate Counsel",
    niche: "B2B Commercial Litigation, M&A, & Corporate Retainers",
    annualRevRange: "$2M - $20M",
    avgJobValue: 25000, // Retainer / Case engagement
    currentLeads: 30,
    closeRate: 20,
    leakEstimateMonthly: 150000,
    coreServiceLines: [
      "Commercial Dispute Litigation Defense",
      "M&A Transaction Advisory Retainers",
      "Corporate Regulatory & Compliance Governance",
      "Executive Employment Law Defense"
    ],
    conversionWeapon: "Confidential 60-Second Case Exposure & Retainer Scoper with Direct Partner Routing"
  },
  {
    id: "icp-staffing-instate",
    category: "STAFFING",
    label: "In-State Footprint Staffing Agency ($3M-$20M)",
    url: "texastalentworkforce.com",
    clientName: "Lone Star Industrial & Technical Staffing",
    niche: "In-State Footprint Exclusive Commercial & Industrial Staffing",
    annualRevRange: "$2M - $20M",
    avgJobValue: 18500, // Placement margin per 10-headcount contract
    currentLeads: 55,
    closeRate: 24,
    leakEstimateMonthly: 244200,
    coreServiceLines: [
      "High-Volume Skilled Trades & Manufacturing Shifts",
      "Licensed Healthcare & Nursing Temp Staffing",
      "Commercial Warehousing Rapid Deployment",
      "Executive Technical Search Retainers"
    ],
    conversionWeapon: "Instant Headcount Wage Multiplier & Shift Fill Calculator with On-Demand Recruiter Ping"
  },
  {
    id: "icp-manufacturing",
    category: "MANUFACTURING",
    label: "Precision CNC & Contract Manufacturing ($4M-$20M)",
    url: "apexprecisioncomponents.com",
    clientName: "Apex Precision Machining & Assembly",
    niche: "Contract Precision Machining, Tooling & Assembly",
    annualRevRange: "$2M - $20M",
    avgJobValue: 65000, // Production batch run
    currentLeads: 25,
    closeRate: 15,
    leakEstimateMonthly: 243750,
    coreServiceLines: [
      "High-Tolerance 5-Axis CNC Milling Runs",
      "Aerospace & Defense Rapid Prototyping",
      "Custom Sheet Metal & Precision Tooling",
      "Turnkey Sub-Assembly & Quality Certification"
    ],
    conversionWeapon: "CAD/Spec Upload & Instant Run-Volume Estimator with Lead Engineer SMS Alert"
  },
  {
    id: "icp-viscon-construction",
    category: "COMMERCIAL_CONSTRUCTION",
    label: "Viscon Commercial General Contracting ($2M-$20M)",
    url: "viscong.com",
    clientName: "Viscon General Contracting / Viscon Group",
    niche: "General Commercial Contractor & Construction",
    annualRevRange: "$2M - $20M",
    avgJobValue: 45000,
    currentLeads: 35,
    closeRate: 18,
    leakEstimateMonthly: 248063,
    coreServiceLines: [
      "Commercial Tenant Build-Outs",
      "Ground-Up Commercial Structural Builds",
      "Industrial Facility Retrofitting",
      "Multi-Unit Commercial Remodeling"
    ],
    conversionWeapon: "60-Second Square-Footage Commercial Scoper & Instant Cell Routing"
  }
];

export const PRESET_EXAMPLES = TARGET_ICPS.map((icp) => ({
  label: `${icp.label} ($${(icp.avgJobValue).toLocaleString()} Avg)`,
  url: icp.url,
  clientName: icp.clientName,
  niche: icp.niche,
  avgJobValue: icp.avgJobValue,
  currentLeads: icp.currentLeads,
  closeRate: icp.closeRate,
}));
