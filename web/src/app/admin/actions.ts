"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { strategySchema } from "@/lib/validation";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN" || user.status !== "APPROVED") {
    redirect("/dashboard");
  }
  return user;
}

export async function approveUserAction(userId: string) {
  const admin = await requireAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { status: "APPROVED", approvedAt: new Date(), approvedById: admin.id },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
}

export async function rejectUserAction(userId: string) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { status: "REJECTED" } });
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
}

export async function revokeUserAction(userId: string) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { status: "PENDING" } });
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${userId}`);
}

export type StrategyFormState = { error?: string } | undefined;

export async function createStrategyAction(
  _prev: StrategyFormState,
  formData: FormData
): Promise<StrategyFormState> {
  const admin = await requireAdmin();

  const parsed = strategySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    riskLevel: formData.get("riskLevel"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const existing = await prisma.strategy.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return { error: "هذا الرابط مستخدم بالفعل، اختر رابطًا آخر" };
  }

  await prisma.strategy.create({ data: { ...parsed.data, authorId: admin.id } });
  revalidatePath("/admin/strategies");
  revalidatePath("/dashboard");
  redirect("/admin/strategies");
}

export async function updateStrategyAction(
  id: string,
  _prev: StrategyFormState,
  formData: FormData
): Promise<StrategyFormState> {
  await requireAdmin();

  const parsed = strategySchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    riskLevel: formData.get("riskLevel"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const existing = await prisma.strategy.findUnique({ where: { slug: parsed.data.slug } });
  if (existing && existing.id !== id) {
    return { error: "هذا الرابط مستخدم بالفعل، اختر رابطًا آخر" };
  }

  await prisma.strategy.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/strategies");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/strategies/${parsed.data.slug}`);
  redirect("/admin/strategies");
}

export async function togglePublishAction(id: string, published: boolean) {
  await requireAdmin();
  await prisma.strategy.update({ where: { id }, data: { published } });
  revalidatePath("/admin/strategies");
  revalidatePath("/dashboard");
}

export async function deleteStrategyAction(id: string) {
  await requireAdmin();
  await prisma.strategy.delete({ where: { id } });
  revalidatePath("/admin/strategies");
  revalidatePath("/dashboard");
}
