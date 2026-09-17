import { NextResponse } from "next/server";
import { getModel, isAiConfigured, parseJsonResponse } from "@/lib/gemini";

type BoostResult = {
  reorderSuggestions: { product: string; reason: string }[];
  salePricing: { product: string; currentPrice: number; suggestedSalePrice: number; reason: string }[];
  generalTips: string[];
};

export async function POST(request: Request) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set. Add it to .env to enable AI recommendations." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { top, bottom } = body as {
    top: { productName: string; timesOrdered: number; percentage: number }[];
    bottom: { productName: string; timesOrdered: number; percentage: number; currentPrice?: number }[];
  };

  const priced = bottom.filter((b) => typeof b.currentPrice === "number" && b.currentPrice > 0);

  const prompt = `You are a small business growth advisor for a grocery/convenience shop called Centro
("Manage your Business"). You're given order frequency data from the last 30 days.

Top selling products (JSON): ${JSON.stringify(top)}
Least selling products, with current retail price where the owner provided it (JSON): ${JSON.stringify(priced)}

Give actionable recommendations to boost the business:
1. "reorderSuggestions": which top products to prioritize reordering, and why. Array of {"product": string, "reason": string}.
2. "salePricing": for each least-sold product that has a currentPrice, suggest a clearance sale price that keeps at least 70% of currentPrice as profit protection while moving stock faster. Array of {"product": string, "currentPrice": number, "suggestedSalePrice": number, "reason": string}. Skip products with no currentPrice.
3. "generalTips": 3-5 short, concrete tips to grow this small grocery shop's business. Array of strings.

Respond with ONLY JSON, no prose, no markdown fences:
{"reorderSuggestions": [...], "salePricing": [...], "generalTips": [...]}`;

  const model = getModel();
  const response = await model.generateContent(prompt);
  const result = parseJsonResponse<BoostResult>(response.response.text());

  return NextResponse.json(result);
}
