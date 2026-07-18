import { z } from "zod";
import { CATEGORY_VALUES } from "@/lib/categories";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "الاسم يجب أن يكون حرفين على الأقل").max(80),
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل").max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const requestSchema = z
  .object({
    category: z.enum(CATEGORY_VALUES, "الفئة غير صالحة"),
    categoryOther: z.string().trim().max(100).optional(),
    title: z.string().trim().min(3, "العنوان يجب أن يكون 3 أحرف على الأقل").max(150),
    description: z.string().trim().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل").max(4000),
    quantity: z.string().trim().min(1, "الكمية مطلوبة").max(100),
    budget: z
      .union([z.string().trim().length(0), z.coerce.number().positive()])
      .optional()
      .transform((v) => (typeof v === "number" ? v : undefined)),
    neededBy: z
      .union([z.string().trim().length(0), z.coerce.date()])
      .optional()
      .transform((v) => (v instanceof Date ? v : undefined)),
    legalDeclarationAccepted: z
      .literal("on", {
        message: "يجب الإقرار بالالتزام بالشروط القانونية قبل إرسال الطلب",
      })
      .transform(() => true as const),
  })
  .refine((data) => data.category !== "OTHER" || !!data.categoryOther?.length, {
    message: "يرجى تحديد الفئة عند اختيار (أخرى)",
    path: ["categoryOther"],
  });

export const quoteSchema = z.object({
  price: z.coerce.number().positive("السعر يجب أن يكون رقمًا موجبًا"),
  notes: z.string().trim().max(2000).optional(),
});

export const messageSchema = z.object({
  content: z.string().trim().min(1, "الرسالة لا يمكن أن تكون فارغة").max(4000),
});

export const rejectIllegalSchema = z.object({
  reason: z.string().trim().min(10, "يجب توضيح سبب الرفض (10 أحرف على الأقل)").max(2000),
});
