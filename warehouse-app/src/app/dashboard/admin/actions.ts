"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { isGlobalAdmin } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { warehouseSchema, accessGrantSchema } from "@/lib/validation";

async function requireGlobalAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!(await isGlobalAdmin(user.id))) redirect("/dashboard");
  return user;
}

export type AdminFormState = { error?: string } | undefined;

export async function createWarehouseAction(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireGlobalAdmin();

  // The compact admin quick-create form has no address/phone inputs at all;
  // warehouseSchema's optionalText() normalizes the resulting `null` from
  // formData.get() the same as an omitted or blank field (see lib/validation.ts).
  const parsed = warehouseSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    address: formData.get("address"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const existing = await prisma.warehouse.findUnique({ where: { code: parsed.data.code } });
  if (existing) {
    return { error: "يوجد مستودع بنفس الكود بالفعل" };
  }

  await prisma.warehouse.create({
    data: {
      name: parsed.data.name,
      code: parsed.data.code,
      address: parsed.data.address || null,
      phone: parsed.data.phone || null,
    },
  });

  revalidatePath("/dashboard/admin");
}

export async function grantAccessAction(
  _prevState: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  await requireGlobalAdmin();

  const parsed = accessGrantSchema.safeParse({
    userId: formData.get("userId"),
    warehouseId: formData.get("warehouseId"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.userWarehouseAccess.upsert({
    where: {
      userId_warehouseId: {
        userId: parsed.data.userId,
        warehouseId: parsed.data.warehouseId,
      },
    },
    update: { role: parsed.data.role },
    create: parsed.data,
  });

  revalidatePath("/dashboard/admin");
}

export async function revokeAccessAction(accessId: string) {
  await requireGlobalAdmin();
  await prisma.userWarehouseAccess.delete({ where: { id: accessId } });
  revalidatePath("/dashboard/admin");
}
