import { format, differenceInCalendarDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { isAiConfigured } from "@/lib/gemini";
import { AiActionButton } from "@/components/ai-action-button";

export const metadata = { title: "View Expiry | Centro" };

export default async function ViewExpiryPage() {
  const products = await prisma.expiryProduct.findMany({
    orderBy: { expiryDate: "asc" },
  });
  const pendingCount = products.filter((p) => p.suggestedPrice === null).length;
  const aiConfigured = isAiConfigured();

  return (
    <div className="glass-card flex flex-col gap-4 rounded-3xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Expiring products</h2>
          <p className="text-sm text-foreground/70">
            {pendingCount > 0
              ? `${pendingCount} product${pendingCount === 1 ? "" : "s"} awaiting an AI pricing suggestion.`
              : "All products have AI pricing suggestions."}
          </p>
        </div>
        <AiActionButton
          endpoint="/api/expiry/suggest"
          label="Get AI suggestions"
          disabled={!aiConfigured || pendingCount === 0}
          disabledReason={!aiConfigured ? "Set GEMINI_API_KEY to enable this." : undefined}
        />
      </div>

      {products.length === 0 ? (
        <p className="py-8 text-center text-sm text-foreground/70">
          No expiry entries yet. Add one from the Input Expiry tab.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-foreground/60">
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Expiry date</th>
                <th className="px-4 py-2">Current price</th>
                <th className="px-4 py-2">Suggested price</th>
                <th className="px-4 py-2">Sale start date</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const daysLeft = differenceInCalendarDays(p.expiryDate, new Date());
                const urgent = daysLeft <= 3;
                return (
                  <tr key={p.id} className="glass-panel rounded-2xl">
                    <td className="rounded-l-2xl px-4 py-3 font-medium">{p.productName}</td>
                    <td className={`px-4 py-3 ${urgent ? "font-semibold text-rose-600 dark:text-rose-400" : ""}`}>
                      {format(p.expiryDate, "d MMM yyyy")}
                      <span className="ml-1.5 text-xs text-foreground/50">
                        ({daysLeft <= 0 ? "expired" : `${daysLeft}d left`})
                      </span>
                    </td>
                    <td className="px-4 py-3">${p.currentPrice.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {p.suggestedPrice != null ? (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ${p.suggestedPrice.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-foreground/40">—</span>
                      )}
                    </td>
                    <td className="rounded-r-2xl px-4 py-3">
                      {p.saleStartDate ? format(p.saleStartDate, "d MMM yyyy") : (
                        <span className="text-foreground/40">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
