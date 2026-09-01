"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { customerSchema } from "@/lib/validation";

export type CustomerFormState = { error?: string } | undefined;

export async function createCustomerAction(
  _prevState: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  await prisma.customer.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      address: parsed.data.address || null,
    },
  });

  redirect("/dashboard/customers");
}
