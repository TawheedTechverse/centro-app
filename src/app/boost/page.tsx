import { getProductStats } from "@/lib/orders";
import { isAiConfigured } from "@/lib/gemini";
import { BoostPanel } from "@/components/boost-panel";

export const metadata = { title: "Boost Business | Centro" };

export default async function BoostBusinessPage() {
  const stats = await getProductStats();
  const top = stats.slice(0, 5);
  const bottom = [...stats].reverse().slice(0, 5).filter((s) => !top.includes(s));

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-4 py-10 sm:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white drop-shadow-sm">Boost Business</h1>
        <p className="text-sm text-white/80">
          AI recommendations based on your frequent order data to help grow Centro.
        </p>
      </div>

      <BoostPanel top={top} bottom={bottom} aiConfigured={isAiConfigured()} />
    </div>
  );
}
