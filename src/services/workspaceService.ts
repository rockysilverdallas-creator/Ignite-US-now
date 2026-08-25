import { AuditResponse, WorkspaceItem } from "../types";

const DOCS_API_BASE = "https://docs.googleapis.com/v1/documents";
const SLIDES_API_BASE = "https://slides.googleapis.com/v1/presentations";
const DRIVE_API_BASE = "https://www.googleapis.com/drive/v3/files";

/**
 * 1. GOOGLE DOCS INTEGRATION
 * Creates a fully formatted Gladiator Protocol Sales Proposal in Google Docs
 */
export const createProposalGoogleDoc = async (
  auditData: AuditResponse,
  accessToken: string
): Promise<{ documentId: string; title: string; webViewLink: string }> => {
  const title = `Gladiator Protocol Proposal — ${auditData.clientInfo.clientName} (${auditData.clientInfo.targetDomain})`;

  // 1. Create empty document
  const createRes = await fetch(DOCS_API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create Google Doc (status ${createRes.status})`);
  }

  const docData = await createRes.json();
  const documentId = docData.documentId;

  // 2. Prepare structured text for the Gladiator Proposal
  const p = auditData.proposal;
  const c = auditData.clientInfo;
  const l = auditData.calculatedLeak;

  const contentText = `IGNITUS CORE: GLADIATOR PROTOCOL EXECUTIVE PROPOSAL
Target Client: ${c.clientName}
Domain: ${c.targetDomain}
Niche: ${c.niche}
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
Target Value: $${c.avgJobValue.toLocaleString()} Avg Contract | ${c.currentLeads} Monthly Inquiries | ${c.closeRate}% Close Rate

============================================================
EXECUTIVE SUMMARY: CAPITAL LEAKAGE DIAGNOSTIC
============================================================
Monthly Pipeline Bleed: $${l.monthlyLeak.toLocaleString()}/mo
Annual Capital Loss: $${l.annualLeak.toLocaleString()}/yr
Current Estimated Revenue: $${l.currentMonthlyRev.toLocaleString()}/mo
Ignitus Projected Revenue: $${l.optimizedMonthlyRev.toLocaleString()}/mo (${l.efficiencyLiftPct || 180}% Projected Efficiency Lift)

${p.theHook.leakSummaryText}

============================================================
SECTION 1: THE FRONT DOOR OVERHAUL
============================================================
[Current Gravestone State]
${p.frontDoorOverhaul.currentGravestone}

[Ignitus Digital Face]
${p.frontDoorOverhaul.ignitusDigitalFace}

[Authority & Craftsmanship Impact]
${p.frontDoorOverhaul.craftsmanshipImpact}

============================================================
SECTION 2: THE HOOK (WHAT YOU HAVE vs. WHAT YOU DON'T HAVE)
============================================================
[What You Have Today]
${p.theHook.currentPassiveState}

[What You Get With Ignitus]
${p.theHook.ignitusState}

============================================================
SECTION 3: THE WEAPON (WHAT WE GIVE YOU)
============================================================
${p.theWeapon.interactiveScoping}

${p.theWeapon.intentIngestion}

${p.theWeapon.autonomicRouting}

============================================================
SECTION 4: THE RESULT (EXECUTION & DEPLOYMENT TIMELINE)
============================================================
${p.theResult.step1AssetExtraction}
${p.theResult.step2StagingBuild}
${p.theResult.step3OwnerApproval}
${p.theResult.step4LiveDeployment}

============================================================
CLOSING & STAGING GUARANTEE
============================================================
Guarantee: ${auditData.playbook.guaranteeTerms}
Ready for 72-Hour Private Staging Build.
`;

  // 3. Insert content using batchUpdate
  const updateRes = await fetch(`${DOCS_API_BASE}/${documentId}:batchUpdate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: contentText,
          },
        },
      ],
    }),
  });

  if (!updateRes.ok) {
    console.warn("Could not insert formatted text into Google Doc, document was created empty.");
  }

  const webViewLink = `https://docs.google.com/document/d/${documentId}/edit`;

  return {
    documentId,
    title,
    webViewLink,
  };
};

/**
 * 2. GOOGLE SLIDES INTEGRATION
 * Creates a complete 5-Slide Executive Pitch Deck in Google Slides
 */
export const createPitchDeckGoogleSlides = async (
  auditData: AuditResponse,
  accessToken: string
): Promise<{ presentationId: string; title: string; webViewLink: string }> => {
  const title = `Executive Deck — ${auditData.clientInfo.clientName} ($${auditData.calculatedLeak.monthlyLeak.toLocaleString()} Pipeline Diagnostic)`;

  // 1. Create empty presentation
  const createRes = await fetch(SLIDES_API_BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Failed to create Google Slides (status ${createRes.status})`);
  }

  const presentationData = await createRes.json();
  const presentationId = presentationData.presentationId;

  // 2. Add custom slides using batchUpdate
  const p = auditData.proposal;
  const c = auditData.clientInfo;
  const l = auditData.calculatedLeak;

  const requests: any[] = [];

  // Slide 2: Capital Leak Diagnostic
  requests.push({
    createSlide: {
      insertionIndex: 1,
      slideLayoutReference: { predefinedLayout: "TITLE_AND_BODY" },
      placeholderIdMappings: [
        {
          layoutPlaceholder: { type: "TITLE", index: 0 },
          objectId: "slide2_title",
        },
        {
          layoutPlaceholder: { type: "BODY", index: 0 },
          objectId: "slide2_body",
        },
      ],
    },
  });

  // Slide 3: What You Have vs What You Don't Have
  requests.push({
    createSlide: {
      insertionIndex: 2,
      slideLayoutReference: { predefinedLayout: "TITLE_AND_BODY" },
      placeholderIdMappings: [
        {
          layoutPlaceholder: { type: "TITLE", index: 0 },
          objectId: "slide3_title",
        },
        {
          layoutPlaceholder: { type: "BODY", index: 0 },
          objectId: "slide3_body",
        },
      ],
    },
  });

  // Slide 4: The 3 Weapons (Scoping, MUM, SMS Routing)
  requests.push({
    createSlide: {
      insertionIndex: 3,
      slideLayoutReference: { predefinedLayout: "TITLE_AND_BODY" },
      placeholderIdMappings: [
        {
          layoutPlaceholder: { type: "TITLE", index: 0 },
          objectId: "slide4_title",
        },
        {
          layoutPlaceholder: { type: "BODY", index: 0 },
          objectId: "slide4_body",
        },
      ],
    },
  });

  // Slide 5: 72-Hour Zero-Risk Staging Commitment
  requests.push({
    createSlide: {
      insertionIndex: 4,
      slideLayoutReference: { predefinedLayout: "TITLE_AND_BODY" },
      placeholderIdMappings: [
        {
          layoutPlaceholder: { type: "TITLE", index: 0 },
          objectId: "slide5_title",
        },
        {
          layoutPlaceholder: { type: "BODY", index: 0 },
          objectId: "slide5_body",
        },
      ],
    },
  });

  // Text insertion for created slide objects
  requests.push(
    // Slide 2 Content
    {
      insertText: {
        objectId: "slide2_title",
        text: `Capital Leak Diagnostic: $${l.monthlyLeak.toLocaleString()}/mo Bleed`,
      },
    },
    {
      insertText: {
        objectId: "slide2_body",
        text: `Target: ${c.clientName} (${c.targetDomain})\n\n• Average Commercial Contract: $${c.avgJobValue.toLocaleString()}\n• Monthly Active Inquiries: ${c.currentLeads}\n• Current Monthly Revenue: $${l.currentMonthlyRev.toLocaleString()}\n• Optimized Pipeline Output: $${l.optimizedMonthlyRev.toLocaleString()}/mo\n• Annual Lost Capital: $${l.annualLeak.toLocaleString()}/yr\n\nDiagnosis: Passive digital brochure fails to capture 78% of mobile prospects.`,
      },
    },
    // Slide 3 Content
    {
      insertText: {
        objectId: "slide3_title",
        text: "What You Have vs. What You Don't Have",
      },
    },
    {
      insertText: {
        objectId: "slide3_body",
        text: `WHAT YOU HAVE TODAY:\n${p.theHook.currentPassiveState}\n\nWHAT YOU GET WITH IGNITUS:\n${p.theHook.ignitusState}\n\nKey Disadvantage: Decision makers bounce when forced to wait 24-48 hours for standard email quotes.`,
      },
    },
    // Slide 4 Content
    {
      insertText: {
        objectId: "slide4_title",
        text: "The 3 Conversion Weapons",
      },
    },
    {
      insertText: {
        objectId: "slide4_body",
        text: `1. 60-Second Mobile Scoping Engine\nAllows commercial prospects to select square footage, job tier, and budget in seconds.\n\n2. Google MUM Intent Ingestion\nMatches high-intent commercial contract queries directly to your landing portal.\n\n3. Autonomic Direct-to-Cell SMS Routing\nSends pre-qualified lead tickets to your phone in under 60 seconds with full scope specs.`,
      },
    },
    // Slide 5 Content
    {
      insertText: {
        objectId: "slide5_title",
        text: "72-Hour Staging Build & Zero Downtime Deployment",
      },
    },
    {
      insertText: {
        objectId: "slide5_body",
        text: `Execution Plan:\n• Step 1: Asset Extraction & Digital Branding Verification\n• Step 2: 72-Hour Private Staging Environment Build\n• Step 3: Executive Cell Phone Demo & Approval\n• Step 4: Zero-Downtime DNS Live Deployment\n\nGuarantee: ${auditData.playbook.guaranteeTerms}`,
      },
    }
  );

  try {
    await fetch(`${SLIDES_API_BASE}/${presentationId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    });
  } catch (err) {
    console.warn("Could not batch update Google Slides layout, presentation created.", err);
  }

  const webViewLink = `https://docs.google.com/presentation/d/${presentationId}/edit`;

  return {
    presentationId,
    title,
    webViewLink,
  };
};

/**
 * 3. GOOGLE DRIVE INTEGRATION
 * List files, search, query by type, and save data
 */
export const listDriveFiles = async (
  accessToken: string,
  options?: {
    pageSize?: number;
    mimeType?: string;
    searchTerm?: string;
  }
): Promise<WorkspaceItem[]> => {
  const pageSize = options?.pageSize || 25;
  const queries: string[] = ["trashed = false"];

  if (options?.mimeType) {
    queries.push(`mimeType = '${options.mimeType}'`);
  }

  if (options?.searchTerm) {
    queries.push(`name contains '${options.searchTerm.replace(/'/g, "\\'")}'`);
  }

  const q = encodeURIComponent(queries.join(" and "));
  const fields = encodeURIComponent(
    "files(id, name, mimeType, webViewLink, thumbnailLink, iconLink, createdTime, modifiedTime, size)"
  );

  const res = await fetch(
    `${DRIVE_API_BASE}?q=${q}&pageSize=${pageSize}&fields=${fields}&orderBy=modifiedTime desc`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to query Google Drive (status ${res.status})`);
  }

  const data = await res.json();
  const files: any[] = data.files || [];

  return files.map((file) => {
    let type: WorkspaceItem["type"] = "file";
    if (file.mimeType === "application/vnd.google-apps.document") type = "doc";
    else if (file.mimeType === "application/vnd.google-apps.presentation") type = "slide";
    else if (file.mimeType === "application/vnd.google-apps.spreadsheet") type = "sheet";
    else if (file.mimeType === "application/vnd.google-apps.folder") type = "folder";

    return {
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      webViewLink: file.webViewLink,
      thumbnailLink: file.thumbnailLink,
      iconLink: file.iconLink,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      size: file.size,
      type,
    };
  });
};

/**
 * Upload Audit Dossier JSON or Data File to Google Drive
 */
export const saveAuditDossierToDrive = async (
  auditData: AuditResponse,
  accessToken: string
): Promise<{ fileId: string; name: string; webViewLink: string }> => {
  const fileName = `Gladiator-Audit-${auditData.clientInfo.targetDomain}-${new Date().toISOString().slice(0, 10)}.json`;
  const fileContent = JSON.stringify(auditData, null, 2);

  const metadata = {
    name: fileName,
    mimeType: "application/json",
    description: `Ignitus Core Gladiator Protocol Audit Dossier for ${auditData.clientInfo.clientName} (${auditData.clientInfo.targetDomain})`,
  };

  const boundary = "-------314159265358979323846";
  const delimiter = "\r\n--" + boundary + "\r\n";
  const closeDelimiter = "\r\n--" + boundary + "--";

  const multipartRequestBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: application/json\r\n\r\n" +
    fileContent +
    closeDelimiter;

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to save file to Drive (status ${res.status})`);
  }

  const result = await res.json();
  return {
    fileId: result.id,
    name: result.name,
    webViewLink: `https://drive.google.com/file/d/${result.id}/view`,
  };
};

/**
 * Delete File from Google Drive (Mandatory user confirmation pattern)
 */
export const deleteDriveFile = async (
  fileId: string,
  fileName: string,
  accessToken: string
): Promise<boolean> => {
  const res = await fetch(`${DRIVE_API_BASE}/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to delete file ${fileName} from Drive`);
  }

  return true;
};
