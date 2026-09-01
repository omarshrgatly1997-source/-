"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { requireWarehouseRole } from "@/lib/access";
import { saleSchema } from "@/lib/validation";
import { deliverSale, InsufficientStockError } from "@/lib/stock";

export type SaleFormState = { error?: string } | undefined;

export async function createSaleAction(
  _prevState: SaleFormState,
  formData: FormData
): Promise<SaleFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const warehouseId = String(formData.get("warehouseId") ?? "");
  await requireWarehouseRole(user.id, warehouseId, [
    "ADMIN",
    "WAREHOUSE_MANAGER",
    "STOREKEEPER",
  ]);

  const parsed = saleSchema.safeParse({
    warehouseId,
    customerId: formData.get("customerId"),
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    unitPrice: formData.get("unitPrice"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  try {
    await deliverSale({
      warehouseId: parsed.data.warehouseId,
      customerId: parsed.data.customerId,
      productId: parsed.data.productId,
      quantity: parsed.data.quantity,
      unitPrice: parsed.data.unitPrice,
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
