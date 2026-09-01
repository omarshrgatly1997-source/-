"use client";

import { useActionState } from "react";
import { createSaleAction } from "./actions";

type Product = { id: string; name: string; sku: string };
type Customer = { id: string; name: string };

export function SaleForm({
  warehouseId,
  products,
  customers,
}: {
  warehouseId: string;
  products: Product[];
  customers: Customer[];
}) {
  const [state, formAction, pending] = useActionState(createSaleAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="warehouseId" value={warehouseId} />

      <div>
        <label htmlFor="customerId" className="mb-1.5 block text-sm font-medium text-neutral-300">
          العميل
        </label>
        <select
          id="customerId"
          name="customerId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="" disabled>
            اختر عميلًا...
          </option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {customers.length === 0 && (
          <p className="mt-1.5 text-xs text-neutral-500">
            لا يوجد عملاء بعد — أضف عميلًا من صفحة العملاء أولًا.
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
          <label htmlFor="unitPrice" className="mb-1.5 block text-sm font-medium text-neutral-300">
            سعر الوحدة
          </label>
          <input
            id="unitPrice"
            name="unitPrice"
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
        disabled={pending || customers.length === 0 || products.length === 0}
        className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "جاري التسجيل..." : "تسجيل البيع والصرف"}
      </button>
    </form>
  );
}
