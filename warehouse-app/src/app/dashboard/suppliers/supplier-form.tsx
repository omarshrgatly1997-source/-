"use client";

import { useActionState } from "react";
import { createSupplierAction } from "./actions";

export function SupplierForm() {
  const [state, formAction, pending] = useActionState(createSupplierAction, undefined);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-300">
          اسم المورد
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
        <label htmlFor="contactPerson" className="mb-1.5 block text-sm font-medium text-neutral-300">
          مسؤول التواصل (اختياري)
        </label>
        <input
          id="contactPerson"
          name="contactPerson"
          type="text"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-neutral-300">
          الهاتف (اختياري)
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          dir="ltr"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-300">
          البريد الإلكتروني (اختياري)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          dir="ltr"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
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
          {pending ? "جاري الحفظ..." : "إضافة المورد"}
        </button>
      </div>
    </form>
  );
}
