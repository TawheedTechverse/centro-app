import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Clock, ListChecks, Pencil, Repeat, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TaskChecklist } from "@/components/task-checklist";

export const metadata = { title: "Shift Details | Centro" };

function hoursBetween(start: Date, end: Date) {
  return Math.max(0, (end.getTime() - start.getTime()) / 3_600_000);
}

export default async function RosterDetailsPage(props: PageProps<"/roster/[id]">) {
  const { id } = await props.params;
  const roster = await prisma.roster.findUnique({ where: { id } });

  if (!roster) notFound();

  const hoursWorked =
    roster.punchInAt && roster.punchOutAt
      ? hoursBetween(roster.punchInAt, roster.punchOutAt)
      : null;

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="glass-card flex w-full max-w-lg flex-col gap-6 rounded-3xl p-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex w-fit items-center gap-1.5 text-sm font-medium text-maroon-dark hover:underline dark:text-maroon-light"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <Link
            href={`/roster/${roster.id}/edit`}
            className="flex items-center gap-1.5 rounded-full bg-white/40 px-3 py-1.5 text-sm font-medium text-maroon-dark transition hover:bg-white/60 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold">Shift Details</h1>
        </div>

        <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-white/40 p-5 text-sm dark:bg-white/5">
          <div>
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-foreground/60">
              <User className="h-3.5 w-3.5" /> Employee
            </dt>
            <dd className="font-semibold">{roster.employeeName}</dd>
            {roster.swappedFrom && (
              <dd className="flex items-center gap-1 text-xs text-maroon dark:text-maroon-light">
                <Repeat className="h-3 w-3" /> swapped from {roster.swappedFrom}
              </dd>
            )}
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-foreground/60">Date</dt>
            <dd className="font-semibold">{format(roster.date, "d MMM yyyy")}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-foreground/60">Day</dt>
            <dd className="font-semibold">{roster.day}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-foreground/60">
              <Clock className="h-3.5 w-3.5" /> Shift time
            </dt>
            <dd className="font-semibold">
              {roster.shiftStart} – {roster.shiftEnd}
            </dd>
          </div>
        </dl>

        <div className="rounded-2xl bg-white/40 p-5 text-sm dark:bg-white/5">
          <p className="mb-2 text-xs uppercase tracking-wide text-foreground/60">Clocking</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-foreground/60">Punched in</p>
              <p className="font-semibold">
                {roster.punchInAt ? format(roster.punchInAt, "d MMM, h:mm a") : "—"}
              </p>
            </div>
            <div>
              <p className="text-foreground/60">Punched out</p>
              <p className="font-semibold">
                {roster.punchOutAt ? format(roster.punchOutAt, "d MMM, h:mm a") : "—"}
              </p>
            </div>
          </div>
          {hoursWorked !== null && (
            <p className="mt-3 font-semibold text-emerald-600 dark:text-emerald-400">
              {hoursWorked.toFixed(2)} hours worked
            </p>
          )}
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide text-foreground/60">
            <ListChecks className="h-3.5 w-3.5" /> End-of-shift tasks
          </p>
          <TaskChecklist
            rosterId={roster.id}
            initial={{
              floorVacuumed: roster.taskFloorVacuumed,
              toiletCleaned: roster.taskToiletCleaned,
              floorMopped: roster.taskFloorMopped,
            }}
          />
        </div>

        <Link
          href={`/roster/${roster.id}/swap`}
          className="flex items-center justify-center gap-2 rounded-full bg-maroon px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-dark"
        >
          <Repeat className="h-4 w-4" />
          Swap shift
        </Link>
      </div>
    </div>
  );
}
