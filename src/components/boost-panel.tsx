"use client";

import { useState } from "react";
import { Loader2, Rocket, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import type { ProductStat } from "@/lib/orders";

type BoostResult = {
  reorderSuggestions: { product: string; reason: string }[];
  salePricing: { product: string; currentPrice: number; suggestedSalePrice: number; reason: string }[];
  generalTips: string[];
};

export function BoostPanel({
  top,
  bottom,
  aiConfigured,
}: {
  top: ProductStat[];
  bottom: ProductStat[];
  aiConfigured: boolean;
}) {
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BoostResult | null>(null);

  async function run() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/boost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          top: top.map((t) => ({
            productName: t.productName,
            timesOrdered: t.timesOrdered,
            percentage: t.percentage,
          })),
          bottom: bottom.map((b) => ({
            productName: b.productName,
            timesOrdered: b.timesOrdered,
            percentage: b.percentage,
            currentPrice: prices[b.productName] ? Number(prices[b.productName]) : undefined,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Request failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-6">
      <div className="glass-card flex flex-col gap-4 rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-bold">Top performers</h2>
        </div>
        {top.length === 0 ? (
          <p className="text-sm text-foreground/70">
            Upload invoices in Frequent Orders to see your best sellers here.
          </p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {top.map((t) => (
              <li key={t.productName} className="glass-panel flex items-center justify-between rounded-xl px-4 py-2.5">
                <span className="font-medium">{t.productName}</span>
                <span className="text-emerald-600 dark:text-emerald-400">{t.percentage}% · {t.timesOrdered}×</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="glass-card flex flex-col gap-4 rounded-3xl p-6">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-rose-500" />
          <h2 className="text-xl font-bold">Least sold — add current price for sale suggestions</h2>
        </div>
        {bottom.length === 0 ? (
          <p className="text-sm text-foreground/70">No low-performing products yet.</p>
        ) : (
          <ul className="flex flex-col gap-2 text-sm">
            {bottom.map((b) => (
              <li key={b.productName} className="glass-panel flex items-center justify-between gap-3 rounded-xl px-4 py-2.5">
                <span className="font-medium">{b.productName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-rose-600 dark:text-rose-400">{b.percentage}%</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="price"
                    value={prices[b.productName] ?? ""}
                    onChange={(e) =>
                      setPrices((p) => ({ ...p, [b.productName]: e.target.value }))
                    }
                    className="w-24 rounded-lg border border-maroon/20 bg-white/70 px-2 py-1 text-sm dark:bg-white/10 dark:text-white"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={run}
          disabled={!aiConfigured || pending || (top.length === 0 && bottom.length === 0)}
          className="flex items-center justify-center gap-2 self-start rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-maroon-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
          {pending ? "Analyzing..." : "Get Boost Recommendations"}
        </button>
        {!aiConfigured && (
          <p className="text-xs text-foreground/60">Set GEMINI_API_KEY in .env to enable this.</p>
        )}
        {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      </div>

      {result && (
        <div className="glass-card flex flex-col gap-6 rounded-3xl p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-maroon dark:text-maroon-light" />
            <h2 className="text-xl font-bold">Recommendations</h2>
          </div>

          {result.reorderSuggestions?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">
                Reorder priority
              </h3>
              <ul className="flex flex-col gap-2 text-sm">
                {result.reorderSuggestions.map((r, i) => (
                  <li key={i} className="glass-panel rounded-xl px-4 py-2.5">
                    <span className="font-semibold">{r.product}</span> — {r.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.salePricing?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">
                Sale pricing
              </h3>
              <ul className="flex flex-col gap-2 text-sm">
                {result.salePricing.map((s, i) => (
                  <li key={i} className="glass-panel rounded-xl px-4 py-2.5">
                    <span className="font-semibold">{s.product}</span>: ${s.currentPrice.toFixed(2)} →{" "}
                    <span className="text-emerald-600 dark:text-emerald-400">${s.suggestedSalePrice.toFixed(2)}</span>
                    <p className="text-foreground/70">{s.reason}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.generalTips?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">
                General tips
              </h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm">
                {result.generalTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
