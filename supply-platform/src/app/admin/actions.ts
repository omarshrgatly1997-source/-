"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { quoteSchema, messageSchema, rejectIllegalSchema } from "@/lib/validation";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

export type QuoteFormState = { error?: string } | undefined;

export async function sendQuoteAction(
  requestId: string,
  _prev: QuoteFormState,
  formData: FormData
): Promise<QuoteFormState> {
  await requireAdmin();

  const parsed = quoteSchema.safeParse({
    price: formData.get("price"),
    notes: formData.get("notes") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.$transaction([
    prisma.quote.updateMany({
      where: { requestId, status: "PENDING" },
      data: { status: "SUPERSEDED" },
    }),
    prisma.quote.create({ data: { ...parsed.data, requestId } }),
    prisma.supplyRequest.update({ where: { id: requestId }, data: { status: "QUOTED" } }),
  ]);

  revalidatePath("/admin");
  revalidatePath(`/admin/requests/${requestId}`);
}

export async function markFulfilledAction(requestId: string) {
  await requireAdmin();
  await prisma.supplyRequest.update({ where: { id: requestId }, data: { status: "FULFILLED" } });
  revalidatePath("/admin");
  revalidatePath(`/admin/requests/${requestId}`);
}

export type RejectFormState = { error?: string } | undefined;

export async function rejectIllegalAction(
  requestId: string,
  _prev: RejectFormState,
  formData: FormData
): Promise<RejectFormState> {
  await requireAdmin();

  const parsed = rejectIllegalSchema.safeParse({ reason: formData.get("reason") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.supplyRequest.update({
    where: { id: requestId },
    data: { status: "REJECTED_ILLEGAL", rejectionReason: parsed.data.reason },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/requests/${requestId}`);
}

export type MessageFormState = { error?: string } | undefined;

export async function sendAdminMessageAction(
  requestId: string,
  _prev: MessageFormState,
  formData: FormData
): Promise<MessageFormState> {
  const admin = await requireAdmin();

  const parsed = messageSchema.safeParse({ content: formData.get("content") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.message.create({
    data: { requestId, senderId: admin.id, content: parsed.data.content },
  });

  revalidatePath(`/admin/requests/${requestId}`);
}
