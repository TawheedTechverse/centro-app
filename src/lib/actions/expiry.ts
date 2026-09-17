"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addExpiryProduct(formData: FormData) {
  const productName = String(formData.get("productName") ?? "").trim();
  const expiryDateStr = String(formData.get("expiryDate") ?? "");
  const currentPrice = Number(formData.get("currentPrice"));

  if (!productName || !expiryDateStr || !Number.isFinite(currentPrice)) {
    throw new Error("All expiry fields are required.");
  }

  await prisma.expiryProduct.create({
    data: {
      productName,
      expiryDate: new Date(`${expiryDateStr}T00:00:00`),
      currentPrice,
    },
  });

  revalidatePath("/expiry/input");
  revalidatePath("/expiry/view");
  redirect("/expiry/view");
}
