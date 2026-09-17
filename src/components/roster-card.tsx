import Link from "next/link";
import { format } from "date-fns";
import { Clock, Repeat, User } from "lucide-react";
import type { Roster } from "@/generated/prisma/client";

export function RosterCard({ roster }: { roster: Roster }) {
  return (
    <div className="glass-card flex w-full max-w-sm flex-col gap-4 rounded-3xl p-6 transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
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
        className="mt-auto flex items-center justify-center gap-2 rounded-full bg-maroon px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-dark"
      >
        <Repeat className="h-4 w-4" />
        Swap shift
      </Link>
    </div>
  );
}
