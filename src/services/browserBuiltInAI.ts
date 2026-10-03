/**
 * Built-in Browser AI (Chrome Prompt API / Gemini Nano)
 * Runs AI inference directly on the visitor's device CPU/GPU with $0 API token costs.
 * 100% margin optimization for client-side scoping, intent parsing, and instant triage.
 */

export interface BuiltInAIStatus {
  isAvailable: boolean;
  modelType: "CHROME_GEMINI_NANO" | "CLOUD_FALLBACK";
  costPerInference: "$0.00 (Client-Side GPU/NPU)" | "API Usage";
  tokenBills: "$0.00";
}

export class BrowserBuiltInAIService {
  private static session: any = null;

  /**
   * Checks if Chrome Prompt API (window.ai) is available in current browser
   */
  public static async checkAvailability(): Promise<BuiltInAIStatus> {
    if (typeof window === "undefined") {
      return {
        isAvailable: false,
        modelType: "CLOUD_FALLBACK",
        costPerInference: "API Usage",
        tokenBills: "$0.00",
      };
    }

    const ai = (window as any).ai;
    if (ai?.languageModel) {
      try {
        const capabilities = await ai.languageModel.capabilities();
        if (capabilities.available === "readily" || capabilities.available === "after-download") {
          return {
            isAvailable: true,
            modelType: "CHROME_GEMINI_NANO",
            costPerInference: "$0.00 (Client-Side GPU/NPU)",
            tokenBills: "$0.00",
          };
        }
      } catch {}
    }

    return {
      isAvailable: false,
      modelType: "CLOUD_FALLBACK",
      costPerInference: "API Usage",
      tokenBills: "$0.00",
    };
  }

  /**
   * Runs inference on the client's local Gemini Nano instance
   */
  public static async promptLocalAI(prompt: string, systemPrompt?: string): Promise<string | null> {
    if (typeof window === "undefined") return null;

    const ai = (window as any).ai;
    if (!ai?.languageModel) return null;

    try {
      if (!this.session) {
        this.session = await ai.languageModel.create({
          systemPrompt: systemPrompt || "You are the Ignitus Gladiator Instant Scoper. Provide direct, tactical contractor estimates and speed-to-lead advice in under 3 sentences.",
        });
      }

      const result = await this.session.prompt(prompt);
      return result;
    } catch (err) {
      console.warn("[BuiltInAI] Local inference error, falling back to server:", err);
      return null;
    }
  }
}
