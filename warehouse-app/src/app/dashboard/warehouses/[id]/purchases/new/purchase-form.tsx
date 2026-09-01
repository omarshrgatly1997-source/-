"use client";

import { useActionState } from "react";
import { createPurchaseAction } from "./actions";

type Product = { id: string; name: string; sku: string };
type Supplier = { id: string; name: string };

export function PurchaseForm({
  warehouseId,
  products,
  suppliers,
}: {
  warehouseId: string;
  products: Product[];
  suppliers: Supplier[];
}) {
  const [state, formAction, pending] = useActionState(createPurchaseAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="warehouseId" value={warehouseId} />

      <div>
        <label htmlFor="supplierId" className="mb-1.5 block text-sm font-medium text-neutral-300">
          المورد
        </label>
        <select
          id="supplierId"
          name="supplierId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="" disabled>
            اختر موردًا...
          </option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {suppliers.length === 0 && (
          <p className="mt-1.5 text-xs text-neutral-500">
            لا يوجد موردين بعد — أضف موردًا من صفحة الموردين أولًا.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="productId" className="mb-1.5 block text-sm font-medium text-neutral-300">
          الصنف
        </label>
        <select
          id="productId"
          name="productId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="" disabled>
            اختر صنفًا...
          </option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.sku})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="mb-1.5 block text-sm font-medium text-neutral-300">
            الكمية
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            step="any"
            min="0"
            required
            dir="ltr"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="unitCost" className="mb-1.5 block text-sm font-medium text-neutral-300">
            تكلفة الوحدة
          </label>
          <input
            id="unitCost"
            name="unitCost"
            type="number"
            step="any"
            min="0"
            required
            dir="ltr"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-neutral-300">
          ملاحظات (اختياري)
        </label>
        <input
          id="notes"
          name="notes"
          type="text"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || suppliers.length === 0 || products.length === 0}
        className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "جاري التسجيل..." : "تسجيل الشراء والاستلام"}
      </button>
    </form>
  );
}
