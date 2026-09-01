import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { requireWarehouseRole } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export default async function WarehouseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: warehouseId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await requireWarehouseRole(user.id, warehouseId);

  const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
  if (!warehouse) notFound();

  const balances = await prisma.stockBalance.findMany({
    where: { warehouseId, quantity: { not: 0 } },
    include: { product: true },
    orderBy: { product: { name: "asc" } },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{warehouse.name}</h1>
          <p className="mt-1 text-sm text-neutral-400">كود المستودع: {warehouse.code}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/warehouses/${warehouse.id}/movements/new?type=RECEIPT_IN`}
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-sky-400"
          >
            + إدخال بضاعة
          </Link>
          <Link
            href={`/dashboard/warehouses/${warehouse.id}/movements/new?type=ISSUE_OUT`}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500"
          >
            - صرف بضاعة
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-start font-medium">الصنف</th>
              <th className="px-4 py-3 text-start font-medium">SKU</th>
              <th className="px-4 py-3 text-start font-medium">الرصيد الحالي</th>
              <th className="px-4 py-3 text-start font-medium">قيمة الرصيد</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {balances.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  لا يوجد رصيد بعد في هذا المستودع. سجّل أول عملية إدخال بضاعة.
                </td>
              </tr>
            )}
            {balances.map((b) => (
              <tr key={b.id} className="text-neutral-200">
                <td className="px-4 py-3">{b.product.name}</td>
                <td className="px-4 py-3 text-neutral-400" dir="ltr">
                  {b.product.sku}
                </td>
                <td className="px-4 py-3" dir="ltr">
                  {b.quantity.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3" dir="ltr">
                  {(b.quantity * b.product.costPrice).toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
