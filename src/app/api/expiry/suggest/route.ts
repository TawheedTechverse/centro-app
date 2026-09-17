import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { differenceInCalendarDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getModel, isAiConfigured, parseJsonResponse } from "@/lib/gemini";

type Suggestion = {
  id: string;
  suggestedPrice: number;
  saleStartDate: string;
  note: string;
};

export async function POST() {
  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set. Add it to .env to enable AI suggestions." },
      { status: 400 }
    );
  }

  const pending = await prisma.expiryProduct.findMany({
    where: { suggestedPrice: null },
  });

  if (pending.length === 0) {
    return NextResponse.json({ updated: 0 });
  }

  const today = new Date();
  const payload = pending.map((p) => ({
    id: p.id,
    productName: p.productName,
    currentPrice: p.currentPrice,
    daysUntilExpiry: differenceInCalendarDays(p.expiryDate, today),
  }));

  const prompt = `You are a retail pricing assistant for a small grocery shop clearing stock before it expires.
For each product below, recommend a clearance sale price and a sale start date that:
- Never goes below 70% of currentPrice, to protect profit margin.
- Starts the sale early enough to realistically sell through before the expiry date — the fewer daysUntilExpiry, the sooner the sale should start (if daysUntilExpiry <= 3, saleStartDate should be today).
- Includes a short one-sentence "note" explaining the reasoning.

Products (JSON): ${JSON.stringify(payload)}

Today's date is ${today.toISOString().slice(0, 10)}.
Respond with ONLY a JSON array, no prose, no markdown fences:
[{"id": string, "suggestedPrice": number, "saleStartDate": "YYYY-MM-DD", "note": string}]`;

  const model = getModel();
  const response = await model.generateContent(prompt);
  const suggestions = parseJsonResponse<Suggestion[]>(response.response.text());

  for (const s of suggestions) {
    await prisma.expiryProduct.update({
      where: { id: s.id },
      data: {
        suggestedPrice: s.suggestedPrice,
        saleStartDate: new Date(`${s.saleStartDate}T00:00:00`),
        aiNote: s.note,
      },
    });
  }

  revalidatePath("/expiry/view");
  return NextResponse.json({ updated: suggestions.length });
}
