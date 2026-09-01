"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";
import { ensureDefaultUnit } from "@/lib/stock";

export type ProductFormState = { error?: string } | undefined;

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = productSchema.safeParse({
    sku: formData.get("sku"),
    name: formData.get("name"),
    barcode: formData.get("barcode"),
    costPrice: formData.get("costPrice"),
    salePrice: formData.get("salePrice"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const existing = await prisma.product.findUnique({ where: { sku: parsed.data.sku } });
  if (existing) {
    return { error: "يوجد صنف بنفس كود الـ SKU بالفعل" };
  }

  const baseUnit = await ensureDefaultUnit();

  await prisma.product.create({
    data: {
      sku: parsed.data.sku,
      name: parsed.data.name,
      barcode: parsed.data.barcode || null,
      costPrice: parsed.data.costPrice,
      salePrice: parsed.data.salePrice,
      baseUnitId: baseUnit.id,
    },
  });

  redirect("/dashboard/products");
}
