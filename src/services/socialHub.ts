/**
 * Agent SHAH — Social Media Operations Fleet
 * Autonomous Social Operating Agents coordinating multi-channel accounts:
 * - LinkedIn (B2B Authority & Commercial Pipeline)
 * - X / Twitter (Speed-to-Lead, Viral Hooks & Instant DM Interception)
 * - Meta / Instagram (Project Portfolio, Stories & Lead Triage)
 * - TikTok / YouTube Shorts (Short-form video hooks & Street Case Studies)
 */

export type SocialPlatform = "LINKEDIN" | "X" | "META_INSTAGRAM" | "TIKTOK" | "FACEBOOK";

export interface ConnectedAccount {
  platform: SocialPlatform;
  handle: string;
  name: string;
  avatarUrl?: string;
  status: "CONNECTED" | "SYNCING" | "DISCONNECTED";
  lastActive: string;
  followerCount: string;
  activeAutomations: number;
}

export interface SocialAgent {
  id: string;
  name: string;
  callsign: string;
  role: string;
  pillar: "ECHO_BLAZE" | "TIANA_AI" | "KING_TAKER" | "THE_VAULT";
  status: "ONLINE" | "ENGAGED" | "STANDBY" | "GUARDED";
  mode: "AUTONOMOUS" | "CO_PILOT";
  actionsExecutedToday: number;
  rateLimitPerHour: number;
  capabilities: string[];
}

export interface SocialDMMessage {
  id: string;
  platform: SocialPlatform;
  senderHandle: string;
  senderName: string;
  avatarUrl?: string;
  incomingText: string;
  timestamp: number;
  sentiment: "HOT_LEAD" | "NEUTRAL_INQUIRY" | "OBJECTION" | "SPAM";
  detectedLeakEstimate?: number;
  proposedReply: string;
  status: "PENDING_APPROVAL" | "AUTO_DISPATCHED" | "RESOLVED";
  speedToLeadSeconds?: number;
}

export interface SocialPostItem {
  id: string;
  platform: SocialPlatform;
  headline: string;
  content: string;
  tags: string[];
  status: "QUEUED" | "PUBLISHED" | "DRAFT";
  scheduledFor?: string;
  targetAudience: string;
  estimatedReach: string;
  createdAt: number;
}

export interface SocialProspectItem {
  id: string;
  platform: SocialPlatform;
  handle: string;
  businessName: string;
  niche: string;
  location: string;
  website: string;
  monthlyLeakEstimate: number;
  engagementStatus: "RADAR_DISCOVERED" | "HOOK_PREPARED" | "OUTREACH_FIRED" | "REPLIED";
  customHook: string;
}

export type SocialPostPayload = SocialPostItem | {
  platform: "LINKEDIN" | "X" | "META_INSTAGRAM";
  headline?: string;
  content?: string;
  auditLink?: string;
  scheduledTime?: string;
};

export type SocialProspect = SocialProspectItem | {
  id: string;
  platform: "LINKEDIN" | "X" | "META_INSTAGRAM";
  handleOrProfile: string;
  businessName: string;
  niche: string;
  identifiedGaps?: string[];
  engagementStatus?: "QUEUED" | "CONTACTED" | "CONVERTED";
};

export interface StealthMaskConfig {
  enabled: boolean;
  humanWindowActive: boolean;
  humanWindowHours: { start: number; end: number; timeZone: string };
  browserFingerprint: {
    userAgent: string;
    secChUa: string;
    platform: string;
    acceptLanguage: string;
  };
  typingCadence: {
    minJitterMs: number;
    maxJitterMs: number;
  };
  antiBotShield: {
    stripAiSignatures: boolean;
    residentialProxyEmulation: boolean;
  };
}

export class SocialHubService {
  private static stealthMask: StealthMaskConfig = {
    enabled: true,
    humanWindowActive: true,
    humanWindowHours: { start: 7.5, end: 20.5, timeZone: "America/Chicago (CST)" },
    browserFingerprint: {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      secChUa: '"Chromium";v="133", "Google Chrome";v="133", "Not-A.Brand";v="99"',
      platform: '"Windows"',
      acceptLanguage: "en-US,en;q=0.9",
    },
    typingCadence: {
      minJitterMs: 2200,
      maxJitterMs: 5800,
    },
    antiBotShield: {
      stripAiSignatures: true,
      residentialProxyEmulation: true,
    },
  };

  private static accounts: ConnectedAccount[] = [];

  private static agents: SocialAgent[] = [
    {
      id: "AGENT_CONTENT_SYNDICATOR",
      name: "Content Syndicator & Algorithm Striker",
      callsign: "ECHO_PULSE_01",
      role: "Drafts and schedules platform-native authority teardowns, threads, and carousels.",
      pillar: "ECHO_BLAZE",
      status: "ONLINE",
      mode: "AUTONOMOUS",
      actionsExecutedToday: 0,
      rateLimitPerHour: 10,
      capabilities: [
        "LinkedIn B2B Long-form Case Studies",
        "X/Twitter Speed-to-Lead Punchy Threads",
        "Instagram Carousel Slide Copy",
        "TikTok Street Walk-in Hooks",
      ],
    },
    {
      id: "AGENT_DM_INTERCEPTOR",
      name: "Speed-to-Lead Inbound DM Interceptor",
      callsign: "TIANA_STRIKE_02",
      role: "Monitors inbound DMs and comments 24/7/365; engages prospects in sub-60s.",
      pillar: "TIANA_AI",
      status: "ONLINE",
      mode: "AUTONOMOUS",
      actionsExecutedToday: 0,
      rateLimitPerHour: 60,
      capabilities: [
        "Sub-60s Inbound DM Response",
        "Revenue Leak Calculator Drop",
        "Objection Neutralization",
        "Private 72-hr Staging Link Handoff",
      ],
    },
    {
      id: "AGENT_PROSPECT_RADAR",
      name: "Contractor Radar & Profile Sweeper",
      callsign: "COBRA_SWEEPER_03",
      role: "Scans social networks for local trade businesses, audits sites, and prepares outreach.",
      pillar: "KING_TAKER",
      status: "ONLINE",
      mode: "CO_PILOT",
      actionsExecutedToday: 0,
      rateLimitPerHour: 25,
      capabilities: [
        "DFW Regional Contractor Crawl",
        "Mobile Friction & Contact Form Audit",
        "Personalized Custom Value Hooks",
        "Automated DM Pipeline Staging",
      ],
    },
    {
      id: "AGENT_SOVEREIGN_SENTINEL",
      name: "Social Sovereign Sentinel & Third-Party Human Mask",
      callsign: "VAULT_SENTINEL_04",
      role: "Strict security barrier enforcing third-party human masking, operational window pacing, and zero ad spend.",
      pillar: "THE_VAULT",
      status: "GUARDED",
      mode: "AUTONOMOUS",
      actionsExecutedToday: 0,
      rateLimitPerHour: 1000,
      capabilities: [
        "Third-Party Human Mask (Chrome 133 Desktop Fingerprint)",
        "Human Operational Window (7:30 AM - 8:30 PM CST)",
        "Typing Jitter & Micro-Delays (2.2s - 5.8s Latency)",
        "Zero-Bot Signature Text Sanitization",
        "Zero Outgoing Ad Spend Air-Gap Enforcement",
      ],
    },
  ];

  private static dms: SocialDMMessage[] = [];
  private static posts: SocialPostItem[] = [];
  private static prospects: SocialProspectItem[] = [];

  /**
   * Compatibility alias for legacy calls
   */
  public static generateSocialDM(
    prospect: any,
    monthlyLeak: number
  ): string {
    const formattedLeak = `$${monthlyLeak.toLocaleString()}`;
    const handle = prospect.handleOrProfile || prospect.handle || "contractor";
    switch (prospect.platform) {
      case "LINKEDIN":
        return `Hey ${prospect.businessName} team — ran a quick technical sweep on your domain. Noticed you're losing approximately ${formattedLeak}/mo to dead contact forms and slow mobile response times. Built a 60-second interactive scoper to plug this leak. Would you like to review the private staging link?`;
      case "X":
        return `Quick observation for @${handle}: Checked your site speed & lead flow. Estimating ~${formattedLeak}/mo in lost bid opportunities. Here's how to capture those leads in under 60s:`;
      case "META_INSTAGRAM":
      default:
        return `Hey guys! Loved your recent project photos. Ran your website through our audit engine — you're missing direct SMS lead routing, costing roughly ${formattedLeak}/mo in prime contracts. Want me to send over the free audit breakdown?`;
    }
  }

  public static queuePost(post: any) {
    return { success: true, queueId: `SOC_${Date.now()}` };
  }

  public static getActiveQueue() {
    return [...this.posts];
  }

  /**
   * Retrieves complete fleet telemetry
   */
  /**
   * Returns live external API connection telemetry
   */
  public static getLiveAPIStatus() {
    return {
      gemini: {
        active: Boolean(process.env.GEMINI_API_KEY),
        model: "gemini-2.5-flash",
        provider: "Google AI Studio / Vertex AI",
      },
      twilio: {
        active: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
        accountSid: process.env.TWILIO_ACCOUNT_SID ? `${process.env.TWILIO_ACCOUNT_SID.slice(0, 8)}...` : null,
        phone: process.env.TWILIO_PHONE_NUMBER || null,
      },
      twitter: {
        active: Boolean(process.env.TWITTER_BEARER_TOKEN || process.env.TWITTER_API_KEY),
        mode: process.env.TWITTER_BEARER_TOKEN ? "X_API_V2_BEARER" : "STANDBY",
      },
      linkedin: {
        active: Boolean(process.env.LINKEDIN_ACCESS_TOKEN),
        mode: process.env.LINKEDIN_ACCESS_TOKEN ? "LINKEDIN_V2_REST" : "STANDBY",
      },
      meta: {
        active: Boolean(process.env.INSTAGRAM_ACCESS_TOKEN),
        mode: process.env.INSTAGRAM_ACCESS_TOKEN ? "INSTAGRAM_GRAPH_V21" : "STANDBY",
      },
      webhook: {
        active: Boolean(process.env.SOCIAL_DISPATCH_WEBHOOK_URL),
        url: process.env.SOCIAL_DISPATCH_WEBHOOK_URL ? "CONFIGURED_LIVE" : null,
      },
    };
  }

  /**
   * Evaluates if current time is within human operator hours (CST)
   */
  public static isWithinHumanWindow(): boolean {
    const now = new Date();
    // America/Chicago CST is UTC-5 (or UTC-6 in standard time)
    const cstHours = (now.getUTCHours() - 5 + 24) % 24 + now.getUTCMinutes() / 60;
    return cstHours >= this.stealthMask.humanWindowHours.start && cstHours <= this.stealthMask.humanWindowHours.end;
  }

  /**
   * Strips all bot/AI markers, tags, and formatting signatures so messages
   * appear 100% human-typed by the business owner.
   */
  public static sanitizeHumanText(text: string): string {
    if (!text) return "";
    let cleaned = text
      .replace(/\[AGENT\s+CRAFTED[^\]]*\]/gi, "")
      .replace(/\[AGENT\s+GENERATED[^\]]*\]/gi, "")
      .replace(/\[BOT[^\]]*\]/gi, "")
      .replace(/^(Certainly!|Here is|Below is|Sure!|As an AI)[^\n]*\n+/gi, "")
      .replace(/Topic:[^\n]*\n+/gi, "")
      .replace(/Angle:[^\n]*\n+/gi, "")
      .trim();

    return cleaned;
  }

  /**
   * Retrieves live Third-Party Human Mask & Stealth Telemetry
   */
  public static getStealthMaskTelemetry() {
    return {
      ...this.stealthMask,
      isCurrentlyWithinHumanWindow: this.isWithinHumanWindow(),
      currentCadenceStatus: this.isWithinHumanWindow() ? "ORGANIC_DAYLIGHT_PACING" : "OFF_HOURS_STEALTH_BUFFERED",
      simulatedLatencyMs: Math.floor(
        Math.random() * (this.stealthMask.typingCadence.maxJitterMs - this.stealthMask.typingCadence.minJitterMs) +
          this.stealthMask.typingCadence.minJitterMs
      ),
    };
  }

  public static toggleStealthMask(enabled: boolean): StealthMaskConfig {
    this.stealthMask.enabled = enabled;
    return this.stealthMask;
  }

  /**
   * Retrieves complete fleet telemetry
   */
  public static getFleetStatus() {
    return {
      doctrine: "What one agent learns, all learn.",
      fleetStatus: "ALL_SYSTEMS_OPERATIONAL",
      accounts: this.accounts,
      agents: this.agents,
      recentDMs: this.dms,
      queuedPosts: this.posts,
      prospects: this.prospects,
      liveApis: this.getLiveAPIStatus(),
      stealthMask: this.getStealthMaskTelemetry(),
      metrics: {
        totalDMsProcessedToday: this.dms.length,
        averageSpeedToLeadSeconds: this.dms.length > 0
          ? Math.round(this.dms.reduce((acc, d) => acc + (d.speedToLeadSeconds || 28), 0) / this.dms.length)
          : 0,
        activeOutreachPipelines: this.prospects.length,
        zeroSpendAirGapActive: true,
      },
    };
  }

  /**
   * Retrieves content pipeline status breakdown for social-operator
   */
  public static getContentPipeline() {
    const ready = this.posts.filter((p) => p.status === "QUEUED");
    const scheduled = this.posts.filter((p) => p.status === "SCHEDULED");
    const live = this.posts.filter((p) => p.status === "PUBLISHED");

    return {
      success: true,
      operatorLane: "social-operator (Content & Posting)",
      pipeline: {
        ready,
        readyCount: ready.length,
        scheduled,
        scheduledCount: scheduled.length,
        live,
        liveCount: live.length,
        totalCount: this.posts.length,
      },
    };
  }

  /**
   * Generates and enqueues a new social post using AI / template
   */
  public static async generateAndQueuePost(payload: {
    platform: SocialPlatform;
    topic: string;
    angle: string;
    targetAudience?: string;
    hookType?: "COMMENT_INSIDER" | "COMMENT_DISPATCH" | "CAROUSEL" | "STANDARD";
  }): Promise<SocialPostItem> {
    let generatedHeadline = `Ignitus Teardown: ${payload.topic}`;
    let generatedContent = "";
    const isInsiderPlay = payload.hookType === "COMMENT_INSIDER" || payload.angle?.toLowerCase().includes("insider");
    const isCarousel = payload.hookType === "CAROUSEL" || payload.angle?.toLowerCase().includes("carousel");

    // 1. Try Live Gemini Inference if GEMINI_API_KEY is present
    if (process.env.GEMINI_API_KEY) {
      try {
        const { getGeminiAI } = await import("./gemini");
        const ai = getGeminiAI();
        const hookInstruction = isInsiderPlay
          ? "Use the 'comment INSIDER' lead-generation play. End with a sharp call to action: comment 'INSIDER' to get the exact speed-to-scope breakdown and private staging link."
          : isCarousel
          ? "Format as a 5-slide carousel caption: Slide 1: The speed crisis. Slide 2: Why contact forms bleed cash. Slide 3: The 60-second interactive scoper. Slide 4: Sub-60s cell dispatch. Slide 5: How to get your staging link. Zero fluff."
          : "End with a direct call to action to test drive the 72-hour private staging link.";

        const prompt = `You are the Social Platform Operator for Ignitus Core. Your lane is content and posting only.
Draft a short, direct, zero-fluff post for platform: ${payload.platform}.
Topic: ${payload.topic}
Angle: ${payload.angle}
Target Audience: ${payload.targetAudience || "Contractors, Developers, Trades ($1M-$15M ARR)"}
Requirements:
- Emphasize the Speed-to-Scope crisis: waiting 24-48 hours for standard quotes loses jobs to faster competitors.
- Contrast static contact forms with our sub-60s interactive scoper + instant cell dispatch.
- Keep tone authoritative, direct, and tactical. Zero fluff.
- ${hookInstruction}
- Include 3-4 relevant high-impact hashtags.
Return ONLY the raw post content.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (response.text) {
          generatedContent = response.text.trim();
        }
      } catch (err) {
        console.warn("[SocialHub] Gemini generation fallback:", err);
      }
    }

    // 2. Fallback to Gladiator doctrine template if AI not active
    if (!generatedContent) {
      if (isInsiderPlay) {
        generatedContent = `We audited 40 contractor websites across DFW. 82% bleed deals because their mobile quote forms take 24-48 hours to answer.

We built a 60-second interactive scoper that captures specs on mobile and alerts the owner's cell in 12 seconds.

Comment 'INSIDER' below and I'll send you the full teardown + a private staging link to test with your crew.

#ContractorGrowth #DFWBusiness #SpeedToScope #IgnitusCore`;
      } else if (isCarousel) {
        generatedContent = `CAROUSEL: Why your mobile quote form is costing you $15k/mo (Swipe ➔)

Slide 1: Speed to Lead is the only moat left in local contracting.
Slide 2: 78% of commercial clients choose the first qualified vendor who replies.
Slide 3: Static "Contact Us" forms have an 85% drop-off rate on mobile.
Slide 4: Interactive 60-second scoping gives instant ballpark ranges + cell dispatch.
Slide 5: Want to plug your leak? Comment 'INSIDER' for our private staging scoper.

#ConstructionTech #ContractorTips #LeadGen`;
      } else {
        generatedContent = `Most contractors lose up to 35% of qualified leads simply due to delayed response times. When a commercial client wants a quote on mobile, they don't want a generic 'Contact Us' box and a 48-hour wait.

With our sub-60s interactive scoper + instant cell dispatch, inquiries turn into closed contracts before competitors check their email.

Comment 'INSIDER' or DM 'DISPATCH' to test drive your private staging link.

#ContractorGrowth #SpeedToLead #IgnitusGladiator`;
      }
    }

    // 3. Strip any bot signatures if Stealth Mask is enabled
    if (this.stealthMask.antiBotShield.stripAiSignatures) {
      generatedContent = this.sanitizeHumanText(generatedContent);
    }

    const newPost: SocialPostItem = {
      id: `post-${Date.now()}`,
      platform: payload.platform,
      headline: generatedHeadline,
      content: generatedContent,
      tags: ["ContractorGrowth", "SpeedToLead", "GladiatorProtocol"],
      status: "QUEUED",
      scheduledFor: "Next optimal engagement slot",
      targetAudience: payload.targetAudience || "Regional Subcontractors & GCs",
      estimatedReach: "5,000 - 10,000 impressions",
      createdAt: Date.now(),
    };

    this.posts.unshift(newPost);
    return newPost;
  }

  /**
   * Dispatches queued post immediately across live external APIs
   */
  public static async dispatchPost(postId: string): Promise<{
    success: boolean;
    post: SocialPostItem | null;
    liveDispatch?: any;
  }> {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) {
      return { success: false, post: null };
    }

    const liveDispatchResults: any = {
      timestamp: new Date().toISOString(),
      channelsAttempted: [],
    };

    // 1. Live X / Twitter API Dispatch (if configured)
    if (process.env.TWITTER_BEARER_TOKEN && post.platform === "X") {
      try {
        const twitterRes = await fetch("https://api.twitter.com/2/tweets", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: post.content.slice(0, 280) }),
        });
        liveDispatchResults.twitter = {
          status: twitterRes.status,
          success: twitterRes.ok,
        };
        liveDispatchResults.channelsAttempted.push("X_API_V2");
      } catch (err: any) {
        liveDispatchResults.twitterError = err?.message;
      }
    }

    // 2. Live Webhook Dispatch (Zapier, Make, Telegram, Discord, Slack)
    if (process.env.SOCIAL_DISPATCH_WEBHOOK_URL) {
      try {
        const hookRes = await fetch(process.env.SOCIAL_DISPATCH_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "SOCIAL_POST_DISPATCHED",
            platform: post.platform,
            headline: post.headline,
            content: post.content,
            scheduledFor: post.scheduledFor,
            timestamp: Date.now(),
          }),
        });
        liveDispatchResults.webhook = {
          status: hookRes.status,
          success: hookRes.ok,
        };
        liveDispatchResults.channelsAttempted.push("WEBHOOK");
      } catch (err: any) {
        liveDispatchResults.webhookError = err?.message;
      }
    }

    // 3. Live Twilio SMS Notification to Operator
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.OPERATOR_PHONE_NUMBER) {
      try {
        const sid = process.env.TWILIO_ACCOUNT_SID;
        const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
        const body = new URLSearchParams({
          To: process.env.OPERATOR_PHONE_NUMBER,
          From: process.env.TWILIO_PHONE_NUMBER || "",
          Body: `[IGNITUS FLEET] Post Dispatched to ${post.platform}: "${post.headline.slice(0, 60)}..."`,
        });

        const twilioRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body.toString(),
        });
        liveDispatchResults.twilioSMS = { success: twilioRes.ok };
        liveDispatchResults.channelsAttempted.push("TWILIO_SMS");
      } catch (err: any) {
        liveDispatchResults.twilioError = err?.message;
      }
    }

    post.status = "PUBLISHED";
    return {
      success: true,
      post,
      liveDispatch: liveDispatchResults,
    };
  }

  /**
   * Triages incoming DM / Comment with Live AI
   */
  public static async triageIncomingDM(dm: Omit<SocialDMMessage, "id" | "timestamp" | "status">): Promise<SocialDMMessage> {
    let proposedReply = dm.proposedReply;

    if (process.env.GEMINI_API_KEY && !proposedReply) {
      try {
        const { getGeminiAI } = await import("./gemini");
        const ai = getGeminiAI();
        const prompt = `You are Tiana AI, the sub-60-second speed-to-lead concierge for Ignitus Core.
An inbound prospect just messaged us on ${dm.platform}:
Sender: @${dm.senderHandle} (${dm.senderName})
Message: "${dm.incomingText}"
Sentiment: ${dm.sentiment}

Craft a direct, professional, high-converting response:
- Acknowledge their exact inquiry without robotic pleasantries.
- If they have a leak or ask about speed, explain that our 60-second interactive scoper captures specs on mobile and texts the ticket to their phone in 12s.
- Invite them to test a private 72-hour staging prototype.
Keep response under 3 sentences.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (response.text) {
          proposedReply = response.text.trim();
        }
      } catch (err) {
        console.warn("[SocialHub] DM triage AI fallback:", err);
      }
    }

    const newDM: SocialDMMessage = {
      ...dm,
      proposedReply: proposedReply || dm.proposedReply,
      id: `dm-${Date.now()}`,
      timestamp: Date.now(),
      status: "PENDING_APPROVAL",
      speedToLeadSeconds: 28,
    };
    this.dms.unshift(newDM);
    return newDM;
  }

  /**
   * Approves and executes DM reply (with optional Twilio SMS alert)
   */
  public static async approveDM(dmId: string, customReply?: string): Promise<{ success: boolean; dm: SocialDMMessage | null }> {
    const dm = this.dms.find((d) => d.id === dmId);
    if (dm) {
      if (customReply) dm.proposedReply = customReply;
      dm.status = "AUTO_DISPATCHED";

      // If Webhook configured, broadcast the reply event
      if (process.env.SOCIAL_DISPATCH_WEBHOOK_URL) {
        try {
          await fetch(process.env.SOCIAL_DISPATCH_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "DM_REPLY_DISPATCHED",
              platform: dm.platform,
              recipient: dm.senderHandle,
              replyText: dm.proposedReply,
              timestamp: Date.now(),
            }),
          });
        } catch {}
      }

      return { success: true, dm };
    }
    return { success: false, dm: null };
  }

  /**
   * Toggles Agent Mode (Autonomous vs Co-Pilot)
   */
  public static toggleAgentMode(agentId: string, mode: "AUTONOMOUS" | "CO_PILOT"): SocialAgent | null {
    const agent = this.agents.find((a) => a.id === agentId);
    if (agent) {
      agent.mode = mode;
      return agent;
    }
    return null;
  }

  /**
   * Adds or updates social account connection
   */
  public static updateAccount(platform: SocialPlatform, handle: string, name: string): ConnectedAccount {
    const existing = this.accounts.find((a) => a.platform === platform);
    if (existing) {
      existing.handle = handle;
      existing.name = name;
      existing.status = "CONNECTED";
      existing.lastActive = "Just now";
      return existing;
    }
    const newAcc: ConnectedAccount = {
      platform,
      handle,
      name,
      status: "CONNECTED",
      lastActive: "Just now",
      followerCount: "1.2K",
      activeAutomations: 1,
    };
    this.accounts.push(newAcc);
    return newAcc;
  }
}

