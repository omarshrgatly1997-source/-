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

export async function registerAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    company: formData.get("company"),
    phone: formData.get("phone"),
    country: formData.get("country"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }

  const { name, email, password, company, phone, country } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "هذا البريد الإلكتروني مسجل بالفعل" };
  }

  const passwordHash = await hashPassword(password);
  const isBootstrapAdmin =
    process.env.ADMIN_EMAIL &&
    email === process.env.ADMIN_EMAIL.trim().toLowerCase() &&
    (await prisma.user.count({ where: { role: "ADMIN" } })) === 0;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: isBootstrapAdmin ? "ADMIN" : "CUSTOMER",
      company: company || null,
      phone: phone || null,
      country: country || null,
    },
  });

  const token = await createSessionToken(user.id);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
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

  const token = await createSessionToken(user.id);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
