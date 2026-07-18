import { z } from "zod";
import { CATEGORIES } from "@/lib/categories";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(80),
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل").max(200),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const requestSchema = z.object({
  title: z.string().trim().min(3, "العنوان قصير جدًا").max(150),
  category: z.enum(CATEGORIES as [string, ...string[]]),
  description: z.string().trim().min(20, "الوصف يجب أن يكون 20 حرفًا على الأقل").max(4000),
  quantity: z.string().trim().min(1, "الكمية مطلوبة").max(120),
  targetBudget: z.coerce.number().positive().optional().or(z.literal("").transform(() => undefined)),
  currency: z.string().trim().toUpperCase().min(3).max(3).default("USD"),
  deadline: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined))
    .refine((v) => !v || !Number.isNaN(v.getTime()), "تاريخ غير صالح"),
  destinationCountry: z.string().trim().max(80).optional().or(z.literal("")),
  legalDeclaration: z.literal("on"),
});

export const quoteSchema = z.object({
  price: z.coerce.number().positive("السعر يجب أن يكون أكبر من صفر"),
  currency: z.string().trim().toUpperCase().min(3).max(3).default("USD"),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  validUntil: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined))
    .refine((v) => !v || !Number.isNaN(v.getTime()), "تاريخ غير صالح"),
});

export const messageSchema = z.object({
  body: z.string().trim().min(1, "الرسالة فارغة").max(4000),
});
