import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { requireWarehouseRole } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { TransferForm } from "./transfer-form";

export default async function NewTransferPage({
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

  const [products, destinations] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true },
    }),
    prisma.warehouse.findMany({
      where: { isActive: true, id: { not: warehouseId } },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-white">تحويل بضاعة</h1>
      <p className="mt-1 text-sm text-neutral-400">من مستودع: {warehouse.name}</p>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <TransferForm fromWarehouseId={warehouseId} products={products} destinations={destinations} />
      </div>
    </div>
  );
}
