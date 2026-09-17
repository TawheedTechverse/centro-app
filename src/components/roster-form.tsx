"use client";

import { useState } from "react";
import { createRoster } from "@/lib/actions/roster";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function dayFromDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T00:00:00`);
  return DAYS[(d.getDay() + 6) % 7];
}

export function RosterForm() {
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");

  return (
    <form
      action={createRoster}
      className="glass-card flex w-full max-w-lg flex-col gap-5 rounded-3xl p-8"
    >
      <div>
        <h2 className="text-2xl font-bold">Create Roster</h2>
        <p className="text-sm text-foreground/70">
          Add one shift at a time — repeat for each of the 7 days in the week.
        </p>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Employee name
        <input
          name="employeeName"
          type="text"
          required
          placeholder="e.g. Sam Carter"
          className="rounded-xl border border-maroon/20 bg-white/70 px-4 py-2.5 text-foreground outline-none ring-maroon/40 focus:ring-2 dark:bg-white/10 dark:text-white"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Date
          <input
            name="date"
            type="date"
            required
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setDay(dayFromDate(e.target.value));
            }}
            className="rounded-xl border border-maroon/20 bg-white/70 px-4 py-2.5 text-foreground outline-none ring-maroon/40 focus:ring-2 dark:bg-white/10 dark:text-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Day
          <select
            name="day"
            required
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="rounded-xl border border-maroon/20 bg-white/70 px-4 py-2.5 text-foreground outline-none ring-maroon/40 focus:ring-2 dark:bg-white/10 dark:text-white"
          >
            <option value="" disabled>
              Select day
            </option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Shift start
          <input
            name="shiftStart"
            type="time"
            required
            className="rounded-xl border border-maroon/20 bg-white/70 px-4 py-2.5 text-foreground outline-none ring-maroon/40 focus:ring-2 dark:bg-white/10 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Shift end
          <input
            name="shiftEnd"
            type="time"
            required
            className="rounded-xl border border-maroon/20 bg-white/70 px-4 py-2.5 text-foreground outline-none ring-maroon/40 focus:ring-2 dark:bg-white/10 dark:text-white"
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-2 rounded-full bg-maroon px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-maroon-dark"
      >
        Save
      </button>
    </form>
  );
}
