"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { requestSchema, messageSchema } from "@/lib/validation";
import type { ProductCategory } from "@/generated/prisma/client";

export type FormState = { error?: string } | undefined;

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function createRequestAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();

  if (formData.get("legalDeclaration") !== "on") {
    return { error: "يجب الإقرار بأن هذا الطلب قانوني بالكامل قبل الإرسال" };
  }

  const parsed = requestSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    quantity: formData.get("quantity"),
    targetBudget: formData.get("targetBudget"),
    currency: formData.get("currency") || "USD",
    deadline: formData.get("deadline"),
    destinationCountry: formData.get("destinationCountry"),
    legalDeclaration: formData.get("legalDeclaration"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { legalDeclaration: _legal, ...data } = parsed.data;
  void _legal;

  const request = await prisma.request.create({
    data: {
      ...data,
      category: data.category as ProductCategory,
      destinationCountry: data.destinationCountry || null,
      legalDeclaration: true,
      customerId: user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/requests/${request.id}`);
}

export async function acceptQuoteAction(requestId: string) {
  const user = await requireUser();
  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request || request.customerId !== user.id) redirect("/dashboard");

  await prisma.request.update({ where: { id: requestId }, data: { status: "ACCEPTED" } });
  revalidatePath(`/dashboard/requests/${requestId}`);
  revalidatePath("/dashboard");
}

export async function declineQuoteAction(requestId: string) {
  const user = await requireUser();
  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request || request.customerId !== user.id) redirect("/dashboard");

  await prisma.request.update({ where: { id: requestId }, data: { status: "DECLINED" } });
  revalidatePath(`/dashboard/requests/${requestId}`);
  revalidatePath("/dashboard");
}

export async function postMessageAction(
  requestId: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const user = await requireUser();
  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request) redirect("/dashboard");
  if (user.role !== "ADMIN" && request.customerId !== user.id) redirect("/dashboard");

  const parsed = messageSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "رسالة غير صالحة" };
  }

  await prisma.requestMessage.create({
    data: { requestId, senderId: user.id, body: parsed.data.body },
  });

  revalidatePath(`/dashboard/requests/${requestId}`);
  revalidatePath(`/admin/requests/${requestId}`);
}
