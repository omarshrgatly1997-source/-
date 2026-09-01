import { z } from "zod";

/**
 * `FormData.get("field")` returns `null` for a field that isn't in the form
 * at all (not `undefined`), but zod's `.optional()` only treats `undefined`
 * as "absent" — so passing a raw FormData value straight through silently
 * fails validation with a generic "Invalid input" for any optional field a
 * form happens to omit. These helpers normalize null/empty-string/undefined
 * to "no value" up front so every optional field behaves the same regardless
 * of whether the form has the input at all or just left it blank.
 */
function optionalText(max: number) {
  return z.preprocess(
    (v) => (v === null || v === "" ? undefined : v),
    z.string().trim().max(max).optional()
  );
}

function optionalEmail() {
  return z.preprocess(
    (v) => (v === null || v === "" ? undefined : v),
    z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح").optional()
  );
}

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
  address: optionalText(300),
  phone: optionalText(40),
});

export const productSchema = z.object({
  sku: z.string().trim().min(1, "كود الصنف (SKU) مطلوب").max(60),
  name: z.string().trim().min(2, "اسم الصنف يجب أن يكون حرفين على الأقل").max(150),
  barcode: optionalText(60),
  costPrice: z.coerce.number().min(0, "سعر التكلفة لا يمكن أن يكون سالبًا").default(0),
  salePrice: z.coerce.number().min(0, "سعر البيع لا يمكن أن يكون سالبًا").default(0),
});

export const stockMovementSchema = z.object({
  warehouseId: z.string().min(1),
  productId: z.string().min(1, "اختر صنفًا"),
  type: z.enum(["RECEIPT_IN", "ISSUE_OUT"]),
  quantity: z.coerce.number().positive("الكمية يجب أن تكون أكبر من صفر"),
  notes: optionalText(300),
});

export const accessGrantSchema = z.object({
  userId: z.string().min(1),
  warehouseId: z.string().min(1),
  role: z.enum(["ADMIN", "WAREHOUSE_MANAGER", "STOREKEEPER", "ACCOUNTANT", "VIEWER"]),
});

export const stockTransferSchema = z.object({
  fromWarehouseId: z.string().min(1),
  toWarehouseId: z.string().min(1, "اختر مستودع الوجهة"),
  productId: z.string().min(1, "اختر صنفًا"),
  quantity: z.coerce.number().positive("الكمية يجب أن تكون أكبر من صفر"),
  notes: optionalText(300),
});

export const supplierSchema = z.object({
  name: z.string().trim().min(2, "اسم المورد يجب أن يكون حرفين على الأقل").max(150),
  contactPerson: optionalText(100),
  phone: optionalText(40),
  email: optionalEmail(),
});

export const purchaseSchema = z.object({
  warehouseId: z.string().min(1),
  supplierId: z.string().min(1, "اختر موردًا"),
  productId: z.string().min(1, "اختر صنفًا"),
  quantity: z.coerce.number().positive("الكمية يجب أن تكون أكبر من صفر"),
  unitCost: z.coerce.number().min(0, "التكلفة لا يمكن أن تكون سالبة"),
  notes: optionalText(300),
});
