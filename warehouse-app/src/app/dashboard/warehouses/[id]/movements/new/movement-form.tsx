"use client";

import { useActionState, useState } from "react";
import { createMovementAction } from "./actions";

type Product = { id: string; name: string; sku: string };

export function MovementForm({
  warehouseId,
  products,
  defaultType,
}: {
  warehouseId: string;
  products: Product[];
  defaultType: "RECEIPT_IN" | "ISSUE_OUT";
}) {
  const [state, formAction, pending] = useActionState(createMovementAction, undefined);
  const [type, setType] = useState(defaultType);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="warehouseId" value={warehouseId} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-300">نوع الحركة</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("RECEIPT_IN")}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
              type === "RECEIPT_IN"
                ? "border-sky-500 bg-sky-950/40 text-sky-400"
                : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
            }`}
          >
            + إدخال بضاعة
          </button>
          <button
            type="button"
            onClick={() => setType("ISSUE_OUT")}
            className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
              type === "ISSUE_OUT"
                ? "border-sky-500 bg-sky-950/40 text-sky-400"
                : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
            }`}
          >
            - صرف بضاعة
          </button>
        </div>
        <input type="hidden" name="type" value={type} />
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
        {products.length === 0 && (
          <p className="mt-1.5 text-xs text-neutral-500">
            لا يوجد أصناف بعد — أنشئ صنفًا أولًا من صفحة الأصناف.
          </p>
        )}
      </div>

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
        disabled={pending || products.length === 0}
        className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "جاري الحفظ..." : "تسجيل الحركة"}
      </button>
    </form>
  );
}
