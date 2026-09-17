"use client";

import { Download } from "lucide-react";
import { format } from "date-fns";

type RosterRow = {
  employeeName: string;
  date: Date | string;
  day: string;
  shiftStart: string;
  shiftEnd: string;
};

export function DownloadRosterButton({
  rosters,
  weekLabel,
}: {
  rosters: RosterRow[];
  weekLabel: string;
}) {
  function download() {
    const columns = ["Employee Name", "Date", "Day", "Time"];
    const rows = rosters.map((r) => [
      r.employeeName,
      format(new Date(r.date), "d MMM yyyy"),
      r.day,
      `${r.shiftStart} - ${r.shiftEnd}`,
    ]);

    const colWidths = [220, 150, 130, 170];
    const width = colWidths.reduce((a, b) => a + b, 0) + 80;
    const rowHeight = 46;
    const headerHeight = 110;
    const height = headerHeight + rowHeight * (rows.length + 1) + 40;

    const canvas = document.createElement("canvas");
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(scale, scale);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#4a0a19");
    gradient.addColorStop(1, "#ffffff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px 'DM Sans', Arial, sans-serif";
    ctx.fillText("Centro", 40, 44);
    ctx.font = "14px 'DM Sans', Arial, sans-serif";
    ctx.fillText("Manage your Business", 40, 64);
    ctx.font = "16px 'DM Sans', Arial, sans-serif";
    ctx.fillText(`Roster — ${weekLabel}`, 40, 92);

    // Table card
    const tableX = 40;
    const tableY = headerHeight;
    const tableWidth = width - 80;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    roundRect(ctx, tableX, tableY, tableWidth, rowHeight * (rows.length + 1), 18);
    ctx.fill();

    // Header row
    ctx.fillStyle = "#7a1128";
    roundRect(ctx, tableX, tableY, tableWidth, rowHeight, 18, true);
    ctx.fill();

    let x = tableX;
    ctx.font = "bold 14px 'DM Sans', Arial, sans-serif";
    ctx.fillStyle = "#ffffff";
    columns.forEach((col, i) => {
      ctx.fillText(col, x + 16, tableY + rowHeight / 2 + 5);
      x += colWidths[i];
    });

    ctx.font = "14px 'DM Sans', Arial, sans-serif";
    rows.forEach((row, rIdx) => {
      const y = tableY + rowHeight * (rIdx + 1);
      ctx.fillStyle = rIdx % 2 === 0 ? "rgba(122,17,40,0.05)" : "transparent";
      ctx.fillRect(tableX, y, tableWidth, rowHeight);
      ctx.fillStyle = "#2b0a12";
      let cx = tableX;
      row.forEach((cell, cIdx) => {
        ctx.fillText(String(cell), cx + 16, y + rowHeight / 2 + 5);
        cx += colWidths[cIdx];
      });
    });

    const link = document.createElement("a");
    link.download = `centro-roster-${weekLabel.replace(/\s|,/g, "-")}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={rosters.length === 0}
      className="glass-panel flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-maroon-dark transition hover:bg-white/40 disabled:cursor-not-allowed disabled:opacity-40 dark:text-white dark:hover:bg-white/10"
    >
      <Download className="h-4 w-4" />
      Download roster (JPG)
    </button>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  topOnly = false
) {
  ctx.beginPath();
  if (topOnly) {
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  } else {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}
