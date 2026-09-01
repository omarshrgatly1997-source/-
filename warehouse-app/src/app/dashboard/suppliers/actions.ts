"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { supplierSchema } from "@/lib/validation";

export type SupplierFormState = { error?: string } | undefined;

export async function createSupplierAction(
  _prevState: SupplierFormState,
  formData: FormData
): Promise<SupplierFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = supplierSchema.safeParse({
    name: formData.get("name"),
    contactPerson: formData.get("contactPerson"),
    phone: formData.get("phone"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.supplier.create({
    data: {
      name: parsed.data.name,
      contactPerson: parsed.data.contactPerson || null,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
    },
  });

  redirect("/dashboard/suppliers");
}
