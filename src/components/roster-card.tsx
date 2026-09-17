"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Clock, Pencil, Repeat, User } from "lucide-react";
import type { Roster } from "@/generated/prisma/client";
import { PunchButtons } from "./punch-buttons";

export function RosterCard({ roster }: { roster: Roster }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/roster/${roster.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/roster/${roster.id}`);
      }}
      className="glass-card relative flex w-full max-w-sm cursor-pointer flex-col gap-4 rounded-3xl p-6 transition hover:-translate-y-1"
    >
      <Link
        href={`/roster/${roster.id}/edit`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Edit shift"
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/40 text-maroon-dark transition hover:bg-white/60 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
      >
        <Pencil className="h-4 w-4" />
      </Link>

      <div className="flex items-start justify-between gap-3 pr-8">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon/15 text-maroon dark:bg-white/10 dark:text-maroon-light">
            <User className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold leading-tight">{roster.employeeName}</p>
            {roster.swappedFrom && (
              <p className="flex items-center gap-1 text-xs text-maroon dark:text-maroon-light">
                <Repeat className="h-3 w-3" /> swapped from {roster.swappedFrom}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-white/40 px-4 py-3 text-sm dark:bg-white/5">
        <div>
          <p className="text-xs uppercase tracking-wide text-foreground/60">{roster.day}</p>
          <p className="font-medium">{format(roster.date, "d MMM yyyy")}</p>
        </div>
        <div className="flex items-center gap-1.5 text-right">
          <Clock className="h-4 w-4 text-maroon dark:text-maroon-light" />
          <span className="font-medium">
            {roster.shiftStart} – {roster.shiftEnd}
          </span>
        </div>
      </div>

      <Link
        href={`/roster/${roster.id}/swap`}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center justify-center gap-2 rounded-full bg-maroon px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-dark"
      >
        <Repeat className="h-4 w-4" />
        Swap shift
      </Link>

      <PunchButtons
        rosterId={roster.id}
        punchedIn={!!roster.punchInAt}
        punchedOut={!!roster.punchOutAt}
      />
    </div>
  );
}
