"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { requireWarehouseRole } from "@/lib/access";
import { stockTransferSchema } from "@/lib/validation";
import { applyStockTransfer, InsufficientStockError } from "@/lib/stock";

export type TransferFormState = { error?: string } | undefined;

export async function createTransferAction(
  _prevState: TransferFormState,
  formData: FormData
): Promise<TransferFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const fromWarehouseId = String(formData.get("fromWarehouseId") ?? "");
  await requireWarehouseRole(user.id, fromWarehouseId, [
    "ADMIN",
    "WAREHOUSE_MANAGER",
    "STOREKEEPER",
  ]);

  const parsed = stockTransferSchema.safeParse({
    fromWarehouseId,
    toWarehouseId: formData.get("toWarehouseId"),
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  try {
    await applyStockTransfer({
      fromWarehouseId: parsed.data.fromWarehouseId,
      toWarehouseId: parsed.data.toWarehouseId,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
      notes: parsed.data.notes,
      userId: user.id,
    });
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return { error: err.message };
    }
    if (err instanceof Error && err.message === "لا يمكن التحويل لنفس المستودع") {
      return { error: err.message };
    }
    throw err;
  }

  redirect(`/dashboard/warehouses/${fromWarehouseId}`);
}
