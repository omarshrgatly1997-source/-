"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { requireWarehouseRole } from "@/lib/access";
import { stockMovementSchema } from "@/lib/validation";
import { applyStockMovement, InsufficientStockError } from "@/lib/stock";

export type MovementFormState = { error?: string } | undefined;

export async function createMovementAction(
  _prevState: MovementFormState,
  formData: FormData
): Promise<MovementFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const warehouseId = String(formData.get("warehouseId") ?? "");
  await requireWarehouseRole(user.id, warehouseId, [
    "ADMIN",
    "WAREHOUSE_MANAGER",
    "STOREKEEPER",
  ]);

  const parsed = stockMovementSchema.safeParse({
    warehouseId,
    productId: formData.get("productId"),
    type: formData.get("type"),
    quantity: formData.get("quantity"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  try {
    await applyStockMovement({
      type: parsed.data.type,
      productId: parsed.data.productId,
      warehouseId: parsed.data.warehouseId,
      quantity: parsed.data.quantity,
      notes: parsed.data.notes,
      userId: user.id,
    });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return { error: err.message };
    }
    throw err;
  }

  redirect(`/dashboard/warehouses/${warehouseId}`);
}
