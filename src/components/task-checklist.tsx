"use client";

import { useTransition } from "react";
import { toggleTask } from "@/lib/actions/roster";

const TASKS = [
  { key: "floorVacuumed", label: "Floor Vacuuming" },
  { key: "toiletCleaned", label: "Toilet Cleaned" },
  { key: "floorMopped", label: "Floor Mopped" },
] as const;

export function TaskChecklist({
  rosterId,
  initial,
}: {
  rosterId: string;
  initial: { floorVacuumed: boolean; toiletCleaned: boolean; floorMopped: boolean };
}) {
  const [pending, startTransition] = useTransition();

  function toggle(key: (typeof TASKS)[number]["key"], checked: boolean) {
    startTransition(() => toggleTask(rosterId, key, checked));
  }

  return (
    <div className="flex flex-col gap-2.5">
      {TASKS.map((task) => (
        <label
          key={task.key}
          className="flex items-center gap-3 rounded-xl bg-white/40 px-4 py-3 text-sm dark:bg-white/5"
        >
          <input
            type="checkbox"
            defaultChecked={initial[task.key]}
            disabled={pending}
            onChange={(e) => toggle(task.key, e.target.checked)}
            className="h-4 w-4 rounded border-maroon/40 text-maroon accent-maroon"
          />
          <span className="font-medium">{task.label}</span>
        </label>
      ))}
    </div>
  );
}
