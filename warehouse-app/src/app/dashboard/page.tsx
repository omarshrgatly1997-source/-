import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getAccessibleWarehouses } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const roleLabels: Record<string, string> = {
  ADMIN: "أدمن",
  WAREHOUSE_MANAGER: "مدير مستودع",
  STOREKEEPER: "أمين مخزن",
  ACCOUNTANT: "محاسب",
  VIEWER: "مشاهد",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const warehouses = await getAccessibleWarehouses(user.id);
  const warehouseIds = warehouses.map((w) => w.id);

  const balances = await prisma.stockBalance.findMany({
    where: { warehouseId: { in: warehouseIds }, quantity: { not: 0 } },
    include: { product: { select: { costPrice: true } } },
  });

  const statsByWarehouse = new Map<string, { itemsCount: number; totalValue: number }>();
  for (const b of balances) {
    const stats = statsByWarehouse.get(b.warehouseId) ?? { itemsCount: 0, totalValue: 0 };
    stats.itemsCount += 1;
    stats.totalValue += b.quantity * b.product.costPrice;
    statsByWarehouse.set(b.warehouseId, stats);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">مستودعاتك</h1>
      <p className="mt-1 text-sm text-neutral-400">
        اختر مستودعًا لعرض الأرصدة وتسجيل حركات إدخال/صرف.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {warehouses.map((w) => {
          const stats = statsByWarehouse.get(w.id) ?? { itemsCount: 0, totalValue: 0 };
          return (
            <Link
              key={w.id}
              href={`/dashboard/warehouses/${w.id}`}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition hover:border-sky-800 hover:bg-neutral-900"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-white">{w.name}</h2>
                <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs text-neutral-300">
                  {roleLabels[w.role] ?? w.role}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">كود: {w.code}</p>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-neutral-500">أصناف برصيد</dt>
                  <dd className="mt-1 text-lg font-semibold text-white" dir="ltr">
                    {stats.itemsCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-neutral-500">قيمة المخزون</dt>
                  <dd className="mt-1 text-lg font-semibold text-white" dir="ltr">
                    {stats.totalValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </dd>
                </div>
              </dl>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
