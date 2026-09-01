"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { requireWarehouseRole } from "@/lib/access";
import { purchaseSchema } from "@/lib/validation";
import { receivePurchase } from "@/lib/stock";

export type PurchaseFormState = { error?: string } | undefined;

export async function createPurchaseAction(
  _prevState: PurchaseFormState,
  formData: FormData
): Promise<PurchaseFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const warehouseId = String(formData.get("warehouseId") ?? "");
  await requireWarehouseRole(user.id, warehouseId, [
    "ADMIN",
    "WAREHOUSE_MANAGER",
    "STOREKEEPER",
  ]);

  const parsed = purchaseSchema.safeParse({
    warehouseId,
    supplierId: formData.get("supplierId"),
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    unitCost: formData.get("unitCost"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await receivePurchase({
    warehouseId: parsed.data.warehouseId,
    supplierId: parsed.data.supplierId,
    productId: parsed.data.productId,
    quantity: parsed.data.quantity,
    unitCost: parsed.data.unitCost,
    notes: parsed.data.notes,
    userId: user.id,
  });

  redirect(`/dashboard/warehouses/${warehouseId}`);
}
