import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getModel, isAiConfigured, parseJsonResponse } from "@/lib/gemini";

type ExtractedItem = {
  productName: string;
  quantity: number;
  unit?: string;
  date?: string;
};

const EXTRACTION_PROMPT = `You are analyzing a shop purchase invoice image (last 30 days of stock orders).
Extract every product line item as a JSON array only, no prose, no markdown fences:
[{"productName": string, "quantity": number, "unit": string, "date": "YYYY-MM-DD"}]
"unit" is the pack/unit label as printed on the invoice (e.g. "box", "carton", "kg", "pcs", "case of 24").
If an invoice date is visible, use it for every line item on that invoice. If not visible, omit "date".
Respond with ONLY the JSON array.`;

export async function POST(request: Request) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not set. Add it to .env to enable AI extraction." },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const files = formData.getAll("invoices").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No invoice files uploaded." }, { status: 400 });
  }

  const model = getModel();
  const results: { fileName: string; itemCount: number; error?: string }[] = [];

  for (const file of files) {
    const invoice = await prisma.invoiceUpload.create({
      data: { fileName: file.name },
    });

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const response = await model.generateContent([
        { inlineData: { data: buffer.toString("base64"), mimeType: file.type || "image/jpeg" } },
        EXTRACTION_PROMPT,
      ]);
      const text = response.response.text();
      const items = parseJsonResponse<ExtractedItem[]>(text);

      if (Array.isArray(items) && items.length > 0) {
        await prisma.orderItem.createMany({
          data: items
            .filter((it) => it.productName)
            .map((it) => ({
              productName: it.productName.trim(),
              quantity: Math.max(1, Math.round(Number(it.quantity) || 1)),
              unit: it.unit?.trim() || null,
              orderDate: it.date ? new Date(it.date) : new Date(),
              invoiceId: invoice.id,
            })),
        });
      }
      results.push({ fileName: file.name, itemCount: items?.length ?? 0 });
    } catch {
      results.push({ fileName: file.name, itemCount: 0, error: "Could not read this invoice." });
    }
  }

  revalidatePath("/frequent-orders");
  return NextResponse.json({ results });
}
