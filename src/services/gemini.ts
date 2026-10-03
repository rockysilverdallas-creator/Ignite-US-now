import { GoogleGenAI } from "@google/genai";

let geminiInstance: GoogleGenAI | null = null;

export function getGeminiAI(): GoogleGenAI {
  if (!geminiInstance) {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      (typeof window !== "undefined" ? (window as any).__GEMINI_API_KEY__ : "");

    geminiInstance = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiInstance;
}
