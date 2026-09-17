import Link from "next/link";
import { ArrowLeftCircle, ArrowRightCircle, CalendarPlus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getWeekStart, shiftWeek, formatWeekLabel } from "@/lib/utils";
import { RosterCard } from "@/components/roster-card";
import { DownloadRosterButton } from "@/components/download-roster-button";

export default async function DashboardPage({
  searchParams,
}: PageProps<"/">) {
  const params = await searchParams;
  const weekOffset = Number(Array.isArray(params.week) ? params.week[0] : params.week ?? 0) || 0;

  const weekStart = shiftWeek(getWeekStart(new Date()), weekOffset);

  const rosters = await prisma.roster.findMany({
    where: { weekStart },
    orderBy: [{ date: "asc" }, { shiftStart: "asc" }],
  });

  const weekLabel = formatWeekLabel(weekStart);

  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-4 py-10 sm:px-8">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm sm:text-4xl">
          Roster Dashboard
        </h1>
        <p className="text-sm text-white/80">Manage your Business, one shift at a time.</p>
      </div>

      <div className="flex w-full max-w-5xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/?week=${weekOffset - 1}`}
            aria-label="Previous week"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur transition hover:bg-white/40"
          >
            <ArrowLeftCircle className="h-7 w-7" />
          </Link>
          <div className="glass-panel rounded-full px-5 py-2 text-sm font-semibold text-white">
            {weekLabel}
          </div>
          <Link
            href={`/?week=${weekOffset + 1}`}
            aria-label="Next week, see upcoming rosters"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur transition hover:bg-white/40"
          >
            <ArrowRightCircle className="h-7 w-7" />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <DownloadRosterButton rosters={rosters} weekLabel={weekLabel} />
          <Link
            href="/roster/new"
            className="flex items-center gap-2 rounded-full bg-maroon px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-maroon-dark"
          >
            <CalendarPlus className="h-4 w-4" />
            Add shift
          </Link>
        </div>
      </div>

      {rosters.length === 0 ? (
        <div className="glass-card flex w-full max-w-md flex-col items-center gap-3 rounded-3xl p-10 text-center">
          <p className="font-semibold">No shifts for this week yet</p>
          <p className="text-sm text-foreground/70">
            Create a roster entry for each day worked this week — it will appear here as a card.
          </p>
          <Link
            href="/roster/new"
            className="mt-2 rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-dark"
          >
            Create roster
          </Link>
        </div>
      ) : (
        <div className="grid w-full max-w-5xl grid-cols-1 place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rosters.map((roster) => (
            <RosterCard key={roster.id} roster={roster} />
          ))}
        </div>
      )}
    </div>
  );
}
