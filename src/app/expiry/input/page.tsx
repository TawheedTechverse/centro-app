import { addExpiryProduct } from "@/lib/actions/expiry";

export const metadata = { title: "Input Expiry | Centro" };

export default function InputExpiryPage() {
  return (
    <div className="flex justify-center">
      <form
        action={addExpiryProduct}
        className="glass-card flex w-full max-w-lg flex-col gap-5 rounded-3xl p-8"
      >
        <div>
          <h2 className="text-2xl font-bold">Input Expiry</h2>
          <p className="text-sm text-foreground/70">
            Log a product nearing expiry so Centro can suggest clearance pricing.
          </p>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Expiry product name
          <input
            name="productName"
            type="text"
            required
            placeholder="e.g. Oat Milk 1L"
            className="rounded-xl border border-maroon/20 bg-white/70 px-4 py-2.5 text-foreground outline-none ring-maroon/40 focus:ring-2 dark:bg-white/10 dark:text-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Expiry date
          <input
            name="expiryDate"
            type="date"
            required
            className="rounded-xl border border-maroon/20 bg-white/70 px-4 py-2.5 text-foreground outline-none ring-maroon/40 focus:ring-2 dark:bg-white/10 dark:text-white"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Current price
          <input
            name="currentPrice"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            className="rounded-xl border border-maroon/20 bg-white/70 px-4 py-2.5 text-foreground outline-none ring-maroon/40 focus:ring-2 dark:bg-white/10 dark:text-white"
          />
        </label>

        <button
          type="submit"
          className="mt-2 rounded-full bg-maroon px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-maroon-dark"
        >
          Save
        </button>
      </form>
    </div>
  );
}
