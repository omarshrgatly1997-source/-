"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { requestSchema, messageSchema } from "@/lib/validation";

async function requireCustomer() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

async function requireOwnRequest(requestId: string, userId: string) {
  const request = await prisma.supplyRequest.findUnique({ where: { id: requestId } });
  if (!request || request.customerId !== userId) redirect("/dashboard");
  return request;
}

export type RequestFormState = { error?: string } | undefined;

export async function createRequestAction(
  _prev: RequestFormState,
  formData: FormData
): Promise<RequestFormState> {
  const user = await requireCustomer();

  const parsed = requestSchema.safeParse({
    category: formData.get("category"),
    categoryOther: formData.get("categoryOther") ?? undefined,
    title: formData.get("title"),
    description: formData.get("description"),
    quantity: formData.get("quantity"),
    budget: formData.get("budget") ?? undefined,
    neededBy: formData.get("neededBy") ?? undefined,
    legalDeclarationAccepted: formData.get("legalDeclarationAccepted"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { categoryOther, ...data } = parsed.data;

  const request = await prisma.supplyRequest.create({
    data: {
      ...data,
      categoryOther: categoryOther || null,
      customerId: user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/requests/${request.id}`);
}

export async function acceptQuoteAction(requestId: string, quoteId: string) {
  const user = await requireCustomer();
  const request = await requireOwnRequest(requestId, user.id);
  if (request.status !== "QUOTED") redirect(`/dashboard/requests/${requestId}`);

  await prisma.$transaction([
    prisma.quote.update({ where: { id: quoteId }, data: { status: "ACCEPTED" } }),
    prisma.supplyRequest.update({ where: { id: requestId }, data: { status: "ACCEPTED" } }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/requests/${requestId}`);
}

export async function declineQuoteAction(requestId: string, quoteId: string) {
  const user = await requireCustomer();
  const request = await requireOwnRequest(requestId, user.id);
  if (request.status !== "QUOTED") redirect(`/dashboard/requests/${requestId}`);

  await prisma.$transaction([
    prisma.quote.update({ where: { id: quoteId }, data: { status: "DECLINED" } }),
    prisma.supplyRequest.update({
      where: { id: requestId },
      data: { status: "DECLINED_BY_CUSTOMER" },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/requests/${requestId}`);
}

export type MessageFormState = { error?: string } | undefined;

export async function sendCustomerMessageAction(
  requestId: string,
  _prev: MessageFormState,
  formData: FormData
): Promise<MessageFormState> {
  const user = await requireCustomer();
  await requireOwnRequest(requestId, user.id);

  const parsed = messageSchema.safeParse({ content: formData.get("content") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.message.create({
    data: { requestId, senderId: user.id, content: parsed.data.content },
  });

  revalidatePath(`/dashboard/requests/${requestId}`);
}
