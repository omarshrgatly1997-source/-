import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { requireWarehouseRole } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { MovementForm } from "./movement-form";

export default async function NewMovementPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id: warehouseId } = await params;
  const { type } = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await requireWarehouseRole(user.id, warehouseId, ["ADMIN", "WAREHOUSE_MANAGER", "STOREKEEPER"]);

  const warehouse = await prisma.warehouse.findUnique({ where: { id: warehouseId } });
  if (!warehouse) notFound();

  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true, sku: true },
  });

  const defaultType = type === "ISSUE_OUT" ? "ISSUE_OUT" : "RECEIPT_IN";

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-white">حركة مخزون جديدة</h1>
      <p className="mt-1 text-sm text-neutral-400">المستودع: {warehouse.name}</p>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <MovementForm warehouseId={warehouseId} products={products} defaultType={defaultType} />
      </div>
    </div>
  );
}
