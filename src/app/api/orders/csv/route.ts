import { getProductStats } from "@/lib/orders";
import { toCsv, sparkline } from "@/lib/utils";

export async function GET() {
  const stats = await getProductStats();

  const csv = toCsv(
    ["Product Name", "Times Ordered", "Total Pack/Unit Qty", "Unit", "Trend"],
    stats.map((s) => [
      s.productName,
      s.timesOrdered,
      s.totalQuantity,
      s.unit,
      sparkline(s.trend),
    ])
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="centro-frequent-orders.csv"`,
    },
  });
}
