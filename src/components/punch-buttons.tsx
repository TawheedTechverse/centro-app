"use client";

import { useState, useTransition } from "react";
import { LogIn, LogOut } from "lucide-react";
import { recordPunch } from "@/lib/actions/roster";

export function PunchButtons({
  rosterId,
  punchedIn,
  punchedOut,
}: {
  rosterId: string;
  punchedIn: boolean;
  punchedOut: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"in" | "out" | null>(null);

  function punch(type: "in" | "out") {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError("Geolocation isn't available on this device.");
      return;
    }
    setBusy(type);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        startTransition(async () => {
          try {
            await recordPunch(rosterId, type, pos.coords.latitude, pos.coords.longitude);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Punch failed. Try again.");
          } finally {
            setBusy(null);
          }
        });
      },
      () => {
        setError("Location permission denied — enable location access to punch in/out.");
        setBusy(null);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col gap-1.5"
    >
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => punch("in")}
          disabled={pending || punchedIn}
          className="flex items-center justify-center gap-1.5 rounded-full bg-emerald-600/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogIn className="h-3.5 w-3.5" />
          {busy === "in" ? "Locating..." : punchedIn ? "Punched in" : "Punch in"}
        </button>
        <button
          type="button"
          onClick={() => punch("out")}
          disabled={pending || !punchedIn || punchedOut}
          className="flex items-center justify-center gap-1.5 rounded-full bg-rose-600/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          {busy === "out" ? "Locating..." : punchedOut ? "Punched out" : "Punch out"}
        </button>
      </div>
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
