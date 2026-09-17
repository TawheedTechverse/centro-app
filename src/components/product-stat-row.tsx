import type { ProductStat } from "@/lib/orders";

function percentageColor(pct: number) {
  if (pct >= 66) return { text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" };
  if (pct >= 33) return { text: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" };
  return { text: "text-rose-600 dark:text-rose-400", bar: "bg-rose-500" };
}

export function ProductStatRow({ stat, rank }: { stat: ProductStat; rank: number }) {
  const colors = percentageColor(stat.percentage);

  return (
    <div className="glass-panel flex items-center gap-4 rounded-2xl px-5 py-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-maroon/15 text-sm font-bold text-maroon dark:bg-white/10 dark:text-maroon-light">
        {rank}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold">{stat.productName}</p>
          <span className={`shrink-0 text-sm font-bold ${colors.text}`}>{stat.percentage}%</span>
        </div>
        <p className="text-xs text-foreground/60">
          Ordered {stat.timesOrdered}× · {stat.totalQuantity} {stat.unit} total
        </p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/40 dark:bg-white/10">
          <div
            className={`h-full rounded-full ${colors.bar}`}
            style={{ width: `${stat.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
