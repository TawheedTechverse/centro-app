"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getWeekStart } from "@/lib/utils";
import { distanceMeters, PUNCH_RADIUS_METERS, SHOP_LOCATION } from "@/lib/geo";

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

export async function updateRoster(id: string, formData: FormData) {
  const employeeName = String(formData.get("employeeName") ?? "").trim();
  const dateStr = String(formData.get("date") ?? "");
  const day = String(formData.get("day") ?? "").trim();
  const shiftStart = String(formData.get("shiftStart") ?? "").trim();
  const shiftEnd = String(formData.get("shiftEnd") ?? "").trim();

  if (!employeeName || !dateStr || !day || !shiftStart || !shiftEnd) {
    throw new Error("All roster fields are required.");
  }

  const date = new Date(`${dateStr}T00:00:00`);

  await prisma.roster.update({
    where: { id },
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
  revalidatePath(`/roster/${id}`);
  redirect(`/roster/${id}`);
}

export async function recordPunch(id: string, type: "in" | "out", lat: number, lng: number) {
  const distance = distanceMeters(lat, lng, SHOP_LOCATION.lat, SHOP_LOCATION.lng);
  if (distance > PUNCH_RADIUS_METERS) {
    throw new Error(
      `You're ${Math.round(distance)}m from ${SHOP_LOCATION.name} — you must be within ${PUNCH_RADIUS_METERS}m to punch ${type}.`
    );
  }

  await prisma.roster.update({
    where: { id },
    data:
      type === "in"
        ? { punchInAt: new Date(), punchInLat: lat, punchInLng: lng }
        : { punchOutAt: new Date(), punchOutLat: lat, punchOutLng: lng },
  });

  revalidatePath("/");
  revalidatePath(`/roster/${id}`);
  revalidatePath("/timesheet");
}

const TASK_FIELDS = {
  floorVacuumed: "taskFloorVacuumed",
  toiletCleaned: "taskToiletCleaned",
  floorMopped: "taskFloorMopped",
} as const;

export async function toggleTask(
  id: string,
  task: keyof typeof TASK_FIELDS,
  value: boolean
) {
  await prisma.roster.update({
    where: { id },
    data: { [TASK_FIELDS[task]]: value },
  });

  revalidatePath(`/roster/${id}`);
}
