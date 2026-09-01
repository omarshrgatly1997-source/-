"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  hashPassword,
  verifyPassword,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validation";

export type FormState = { error?: string; success?: string } | undefined;

async function setSessionCookie(userId: string) {
  const token = await createSessionToken(userId);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function registerAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "هذا البريد الإلكتروني مسجل بالفعل" };
  }

  const passwordHash = await hashPassword(password);
  const isBootstrapAdmin =
    !!process.env.ADMIN_EMAIL &&
    email === process.env.ADMIN_EMAIL.trim().toLowerCase() &&
    (await prisma.userWarehouseAccess.count({ where: { role: "ADMIN" } })) === 0;

  const userId = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({ data: { name, email, passwordHash } });

    if (isBootstrapAdmin) {
      // First admin ever: bootstrap a default warehouse if none exists yet,
      // and grant this user ADMIN on every existing warehouse.
      let warehouses = await tx.warehouse.findMany();
      if (warehouses.length === 0) {
        warehouses = [
          await tx.warehouse.create({ data: { name: "المستودع الرئيسي", code: "MAIN" } }),
        ];
      }
      await tx.userWarehouseAccess.createMany({
        data: warehouses.map((w) => ({ userId: user.id, warehouseId: w.id, role: "ADMIN" as const })),
      });
    }

    return user.id;
  });

  await setSessionCookie(userId);
  redirect("/dashboard");
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
  }

  if (!user.isActive) {
    return { error: "هذا الحساب معطّل" };
  }

  await setSessionCookie(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
