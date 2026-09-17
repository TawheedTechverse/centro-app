import { startOfWeek, addWeeks, format } from "date-fns";

export function getWeekStart(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  start.setHours(0, 0, 0, 0);
  return start;
}

export function shiftWeek(weekStart: Date, weeks: number) {
  return addWeeks(weekStart, weeks);
}

export function formatWeekLabel(weekStart: Date) {
  const end = addWeeks(weekStart, 1);
  end.setDate(end.getDate() - 1);
  return `${format(weekStart, "d MMM")} – ${format(end, "d MMM yyyy")}`;
}

export function csvEscape(value: string | number) {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(headers: string[], rows: (string | number)[][]) {
  const lines = [headers, ...rows].map((row) =>
    row.map(csvEscape).join(",")
  );
  return lines.join("\r\n");
}

const SPARK_BLOCKS = "▁▂▃▄▅▆▇█";

/** Renders a series of numbers as a compact unicode sparkline (usable inside a CSV cell). */
export function sparkline(values: number[]) {
  if (values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values
    .map((v) => {
      const idx = Math.round(((v - min) / range) * (SPARK_BLOCKS.length - 1));
      return SPARK_BLOCKS[idx];
    })
    .join("");
}
