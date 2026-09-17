import { prisma } from "@/lib/prisma";

export type ProductStat = {
  productName: string;
  timesOrdered: number;
  totalQuantity: number;
  unit: string;
  percentage: number;
  trend: number[];
};

export async function getProductStats(): Promise<ProductStat[]> {
  const items = await prisma.orderItem.findMany({ orderBy: { orderDate: "asc" } });

  const map = new Map<
    string,
    { count: number; qty: number; units: Record<string, number>; trend: number[] }
  >();

  for (const item of items) {
    const entry = map.get(item.productName) ?? {
      count: 0,
      qty: 0,
      units: {},
      trend: [],
    };
    entry.count += 1;
    entry.qty += item.quantity;
    entry.trend.push(item.quantity);
    if (item.unit) entry.units[item.unit] = (entry.units[item.unit] ?? 0) + 1;
    map.set(item.productName, entry);
  }

  const maxCount = Math.max(1, ...[...map.values()].map((v) => v.count));

  const stats: ProductStat[] = [...map.entries()].map(([productName, v]) => ({
    productName,
    timesOrdered: v.count,
    totalQuantity: v.qty,
    unit: Object.entries(v.units).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "unit",
    percentage: Math.round((v.count / maxCount) * 100),
    trend: v.trend,
  }));

  return stats.sort((a, b) => b.timesOrdered - a.timesOrdered);
}
