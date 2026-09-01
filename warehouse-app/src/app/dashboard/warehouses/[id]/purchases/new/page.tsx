import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { requireWarehouseRole } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { PurchaseForm } from "./purchase-form";

export default async function NewPurchasePage({
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

  const [products, suppliers] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true },
    }),
    prisma.supplier.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-white">شراء واستلام من مورد</h1>
      <p className="mt-1 text-sm text-neutral-400">المستودع: {warehouse.name}</p>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <PurchaseForm warehouseId={warehouseId} products={products} suppliers={suppliers} />
      </div>
    </div>
  );
}
