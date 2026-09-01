import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { requireWarehouseRole } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { SaleForm } from "./sale-form";

export default async function NewSalePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: warehouseId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await requireWarehouseRole(user.id, warehouseId, ["ADMIN", "WAREHOUSE_MANAGER", "STOREKEEPER"]);

  const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
  if (!warehouse) notFound();

  const [products, customers] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true },
    }),
    prisma.customer.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-white">بيع وصرف لعميل</h1>
      <p className="mt-1 text-sm text-neutral-400">المستودع: {warehouse.name}</p>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <SaleForm warehouseId={warehouseId} products={products} customers={customers} />
      </div>
    </div>
  );
}
