"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getWeekStart } from "@/lib/utils";

export async function createRoster(formData: FormData) {
  const employeeName = String(formData.get("employeeName") ?? "").trim();
  const dateStr = String(formData.get("date") ?? "");
  const day = String(formData.get("day") ?? "").trim();
  const shiftStart = String(formData.get("shiftStart") ?? "").trim();
  const shiftEnd = String(formData.get("shiftEnd") ?? "").trim();

  if (!employeeName || !dateStr || !day || !shiftStart || !shiftEnd) {
    throw new Error("All roster fields are required.");
  }

  const date = new Date(`${dateStr}T00:00:00`);

  await prisma.roster.create({
    data: {
      employeeName,
      date,
      day,
      shiftStart,
      shiftEnd,
      weekStart: getWeekStart(date),
    },
  });

  revalidatePath("/");
  revalidatePath("/roster/new");
  redirect("/");
}

export async function swapShift(id: string, formData: FormData) {
  const swapTo = String(formData.get("swapTo") ?? "").trim();
  if (!swapTo) {
    throw new Error("Enter the name of the employee to swap with.");
  }

  const roster = await prisma.roster.findUniqueOrThrow({ where: { id } });

  await prisma.roster.update({
    where: { id },
    data: {
      employeeName: swapTo,
      swappedFrom: roster.swappedFrom ?? roster.employeeName,
    },
  });

  revalidatePath("/");
  redirect("/");
}
