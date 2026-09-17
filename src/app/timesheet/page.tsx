import { Clock, User } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Timesheet | Centro" };

type EmployeeHours = {
  employeeName: string;
  totalHours: number;
  shiftsCompleted: number;
};

export default async function TimesheetPage() {
  const rosters = await prisma.roster.findMany({
    where: { punchInAt: { not: null }, punchOutAt: { not: null } },
    orderBy: { punchInAt: "asc" },
  });

  const map = new Map<string, EmployeeHours>();
  for (const r of rosters) {
    const hours = (r.punchOutAt!.getTime() - r.punchInAt!.getTime()) / 3_600_000;
    const entry = map.get(r.employeeName) ?? {
      employeeName: r.employeeName,
      totalHours: 0,
      shiftsCompleted: 0,
    };
    entry.totalHours += Math.max(0, hours);
    entry.shiftsCompleted += 1;
    map.set(r.employeeName, entry);
  }

  const employees = [...map.values()].sort((a, b) => b.totalHours - a.totalHours);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 sm:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm">Timesheet</h1>
        <p className="text-sm text-white/80">
          Total hours worked per employee, based on punch in/out records.
        </p>
      </div>

      <div className="glass-card flex flex-col gap-3 rounded-3xl p-6">
        {employees.length === 0 ? (
          <p className="py-8 text-center text-sm text-foreground/70">
            No completed shifts yet — hours will appear here once employees punch in and out.
          </p>
        ) : (
          employees.map((e) => (
            <div
              key={e.employeeName}
              className="glass-panel flex items-center justify-between rounded-2xl px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maroon/15 text-maroon dark:bg-white/10 dark:text-maroon-light">
                  <User className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold">{e.employeeName}</p>
                  <p className="text-xs text-foreground/60">
                    {e.shiftsCompleted} shift{e.shiftsCompleted === 1 ? "" : "s"} completed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-maroon dark:text-maroon-light">
                <Clock className="h-4 w-4" />
                {e.totalHours.toFixed(2)}h
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
