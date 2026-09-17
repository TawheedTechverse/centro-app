import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, Clock, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { swapShift } from "@/lib/actions/roster";

export const metadata = { title: "Swap Shift | Centro" };

export default async function SwapShiftPage(props: PageProps<"/roster/[id]/swap">) {
  const { id } = await props.params;
  const roster = await prisma.roster.findUnique({ where: { id } });

  if (!roster) notFound();

  const swapWithId = swapShift.bind(null, roster.id);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="glass-card flex w-full max-w-lg flex-col gap-6 rounded-3xl p-8">
        <Link
          href="/"
          className="flex w-fit items-center gap-1.5 text-sm font-medium text-maroon-dark hover:underline dark:text-maroon-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div>
          <h2 className="text-2xl font-bold">Swap Shift</h2>
          <p className="text-sm text-foreground/70">
            Review the roster details below and assign a new employee to this shift.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-white/40 p-5 text-sm dark:bg-white/5">
          <div>
            <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-foreground/60">
              <User className="h-3.5 w-3.5" /> Current employee
            </dt>
            <dd className="font-semibold">{roster.employeeName}</dd>
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

        <form action={swapWithId} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Shift swap to (Name of the employee)
            <input
              name="swapTo"
              type="text"
              required
              placeholder="e.g. Jamie Lee"
              defaultValue=""
              className="rounded-xl border border-maroon/20 bg-white/70 px-4 py-2.5 text-foreground outline-none ring-maroon/40 focus:ring-2 dark:bg-white/10 dark:text-white"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-maroon px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-maroon-dark"
          >
            OK — confirm swap
          </button>
        </form>
      </div>
    </div>
  );
}
