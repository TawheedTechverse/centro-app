import { GoogleGenerativeAI } from "@google/generative-ai";

export function isAiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function getModel(modelName = "gemini-3.6-flash") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to your .env file to enable AI features."
    );
  }
  const client = new GoogleGenerativeAI(apiKey);
  return client.getGenerativeModel({ model: modelName });
}

/** Strips ```json fences that Gemini sometimes wraps responses in, then parses. */
export function parseJsonResponse<T>(text: string): T {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "");
  return JSON.parse(cleaned) as T;
}
