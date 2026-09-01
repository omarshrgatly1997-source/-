"use client";

import { useActionState } from "react";
import { createProductAction } from "./actions";

export function ProductForm() {
  const [state, formAction, pending] = useActionState(createProductAction, undefined);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="sku" className="mb-1.5 block text-sm font-medium text-neutral-300">
          كود الصنف (SKU)
        </label>
        <input
          id="sku"
          name="sku"
          type="text"
          required
          dir="ltr"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-300">
          اسم الصنف
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>
      <div>
        <label htmlFor="barcode" className="mb-1.5 block text-sm font-medium text-neutral-300">
          الباركود (اختياري)
        </label>
        <input
          id="barcode"
          name="barcode"
          type="text"
          dir="ltr"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="costPrice" className="mb-1.5 block text-sm font-medium text-neutral-300">
            سعر التكلفة
          </label>
          <input
            id="costPrice"
            name="costPrice"
            type="number"
            step="any"
            min="0"
            defaultValue="0"
            dir="ltr"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div>
          <label htmlFor="salePrice" className="mb-1.5 block text-sm font-medium text-neutral-300">
            سعر البيع
          </label>
          <input
            id="salePrice"
            name="salePrice"
            type="number"
            step="any"
            min="0"
            defaultValue="0"
            dir="ltr"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-400 sm:col-span-2">
          {state.error}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "جاري الحفظ..." : "إضافة الصنف"}
        </button>
      </div>
    </form>
  );
}
