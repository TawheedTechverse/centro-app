import { ExpiryTabs } from "@/components/expiry-tabs";

export default function ExpiryLayout({ children }: LayoutProps<"/expiry">) {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 py-10 sm:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm">
          Closest Expiry Products
        </h1>
        <p className="text-sm text-white/80">
          Track upcoming expiries and get AI-recommended clearance pricing.
        </p>
      </div>
      <ExpiryTabs />
      <div className="w-full max-w-4xl">{children}</div>
    </div>
  );
}
