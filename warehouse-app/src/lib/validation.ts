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

export const warehouseSchema = z.object({
  name: z.string().trim().min(2, "اسم المستودع يجب أن يكون حرفين على الأقل").max(120),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]{2,20}$/, "الكود يجب أن يكون أحرف/أرقام إنجليزية فقط (2-20)"),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
});

export const productSchema = z.object({
  sku: z.string().trim().min(1, "كود الصنف (SKU) مطلوب").max(60),
  name: z.string().trim().min(2, "اسم الصنف يجب أن يكون حرفين على الأقل").max(150),
  barcode: z.string().trim().max(60).optional().or(z.literal("")),
  costPrice: z.coerce.number().min(0, "سعر التكلفة لا يمكن أن يكون سالبًا").default(0),
  salePrice: z.coerce.number().min(0, "سعر البيع لا يمكن أن يكون سالبًا").default(0),
});

export const stockMovementSchema = z.object({
  warehouseId: z.string().min(1),
  productId: z.string().min(1, "اختر صنفًا"),
  type: z.enum(["RECEIPT_IN", "ISSUE_OUT"]),
  quantity: z.coerce.number().positive("الكمية يجب أن تكون أكبر من صفر"),
  notes: z.string().trim().max(300).optional().or(z.literal("")),
});

export const accessGrantSchema = z.object({
  userId: z.string().min(1),
  warehouseId: z.string().min(1),
  role: z.enum(["ADMIN", "WAREHOUSE_MANAGER", "STOREKEEPER", "ACCOUNTANT", "VIEWER"]),
});
