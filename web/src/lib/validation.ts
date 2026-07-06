import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(80),
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل").max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const strategySchema = z.object({
  title: z.string().trim().min(3).max(150),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "الرابط يجب أن يحتوي أحرف إنجليزية وأرقام وشرطات فقط"),
  summary: z.string().trim().min(10).max(400),
  content: z.string().trim().min(20),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  published: z.boolean(),
});
