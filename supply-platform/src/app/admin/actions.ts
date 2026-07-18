"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { quoteSchema } from "@/lib/validation";
import type { RequestStatus } from "@/generated/prisma/client";
import { STATUS_LABELS } from "@/lib/categories";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return user;
}

export type QuoteFormState = { error?: string } | undefined;

export async function sendQuoteAction(
  requestId: string,
  _prev: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  const admin = await requireAdmin();

  const parsed = quoteSchema.safeParse({
    price: formData.get("price"),
    currency: formData.get("currency") || "USD",
    notes: formData.get("notes"),
    validUntil: formData.get("validUntil"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.$transaction([
    prisma.quote.create({
      data: {
        requestId,
        authorId: admin.id,
        price: parsed.data.price,
        currency: parsed.data.currency,
        notes: parsed.data.notes || null,
        validUntil: parsed.data.validUntil ?? null,
      },
    }),
    prisma.request.update({ where: { id: requestId }, data: { status: "QUOTED" } }),
  ]);

  revalidatePath(`/admin/requests/${requestId}`);
  revalidatePath(`/dashboard/requests/${requestId}`);
  revalidatePath("/admin");
}

export async function updateStatusAction(requestId: string, status: string) {
  await requireAdmin();
  if (!(status in STATUS_LABELS)) redirect("/admin/requests");

  await prisma.request.update({
    where: { id: requestId },
    data: { status: status as RequestStatus },
  });
  revalidatePath(`/admin/requests/${requestId}`);
  revalidatePath(`/dashboard/requests/${requestId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/requests");
}

export async function rejectIllegalAction(requestId: string, reason: string) {
  await requireAdmin();
  await prisma.request.update({
    where: { id: requestId },
    data: { status: "REJECTED_ILLEGAL", rejectionReason: reason || "يخالف سياسة المنصة القانونية" },
  });
  revalidatePath(`/admin/requests/${requestId}`);
  revalidatePath(`/dashboard/requests/${requestId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/requests");
}
