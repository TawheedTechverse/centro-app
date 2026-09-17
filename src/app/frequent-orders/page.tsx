import { Download } from "lucide-react";
import { getProductStats } from "@/lib/orders";
import { isAiConfigured } from "@/lib/gemini";
import { InvoiceUpload } from "@/components/invoice-upload";
import { ProductStatRow } from "@/components/product-stat-row";

export const metadata = { title: "Frequent Orders | Centro" };

export default async function FrequentOrdersPage() {
  const stats = await getProductStats();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10 sm:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm">
          Tracking Frequent Orders
        </h1>
        <p className="text-sm text-white/80">
          See which products to prioritize based on your last 30 days of invoices.
        </p>
      </div>

      <InvoiceUpload aiConfigured={isAiConfigured()} />

      <div className="glass-card flex flex-col gap-4 rounded-3xl p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Frequent order status</h2>
          <a
            href="/api/orders/csv"
            className="flex items-center gap-2 rounded-full bg-maroon px-4 py-2 text-sm font-semibold text-white transition hover:bg-maroon-dark"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </a>
        </div>

        {stats.length === 0 ? (
          <p className="py-8 text-center text-sm text-foreground/70">
            No orders extracted yet. Upload invoices above to get started.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {stats.map((stat, i) => (
              <ProductStatRow key={stat.productName} stat={stat} rank={i + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
