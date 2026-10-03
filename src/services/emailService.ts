/**
 * Agent SHAH — Google Workspace & Email Integration Service
 * Manages Gmail thread triage, proposal drafts, and calendar scheduling.
 */

const GMAIL_API_BASE = "https://gmail.googleapis.com/gmail/v1/users/me";
const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

export interface EmailTriageResult {
  threadId: string;
  sender: string;
  subject: string;
  leadUrgency: "HIGH" | "STANDARD" | "LOW";
  suggestedAction: string;
}

export class EmailWorkspaceService {
  /**
   * Fetches unread contractor inquiries from Gmail.
   */
  public static async fetchUnreadInquiries(accessToken: string): Promise<EmailTriageResult[]> {
    try {
      const listRes = await fetch(`${GMAIL_API_BASE}/messages?q=is:unread&maxResults=10`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!listRes.ok) return [];

      const listData = await listRes.json();
      const messages = listData.messages || [];

      const triageList: EmailTriageResult[] = [];
      for (const msg of messages.slice(0, 5)) {
        const msgRes = await fetch(`${GMAIL_API_BASE}/messages/${msg.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (msgRes.ok) {
          const detail = await msgRes.json();
          const headers = detail.payload?.headers || [];
          const subject = headers.find((h: any) => h.name.toLowerCase() === "subject")?.value || "Inquiry";
          const sender = headers.find((h: any) => h.name.toLowerCase() === "from")?.value || "Unknown";

          triageList.push({
            threadId: msg.threadId || msg.id,
            sender,
            subject,
            leadUrgency: subject.toLowerCase().includes("quote") || subject.toLowerCase().includes("emergency") ? "HIGH" : "STANDARD",
            suggestedAction: "DISPATCH_GLADIATOR_AUDIT_PROPOSAL",
          });
        }
      }
      return triageList;
    } catch (err) {
      console.error("[SHAH_EMAIL_TRIAGE_ERROR]", err);
      return [];
    }
  }

  /**
   * Prepares a draft response in Gmail with a Gladiator proposal link.
   */
  public static async draftProposalEmail(
    accessToken: string,
    recipient: string,
    subject: string,
    proposalBody: string
  ): Promise<{ draftId: string; success: boolean }> {
    const rawEmail = [
      `To: ${recipient}`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=utf-8`,
      "",
      proposalBody,
    ].join("\r\n");

    const base64Encoded = btoa(unescape(encodeURIComponent(rawEmail)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await fetch(`${GMAIL_API_BASE}/drafts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: { raw: base64Encoded },
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to create draft in Gmail: status ${res.status}`);
    }

    const data = await res.json();
    return { draftId: data.id, success: true };
  }

  /**
   * Checks Google Calendar availability for booking client triage calls.
   */
  public static async checkCalendarAvailability(
    accessToken: string,
    timeMin: string,
    timeMax: string
  ): Promise<any[]> {
    const res = await fetch(
      `${CALENDAR_API_BASE}/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  }
}
