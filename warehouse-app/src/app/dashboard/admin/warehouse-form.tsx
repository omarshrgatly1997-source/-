"use client";

import { useActionState } from "react";
import { createWarehouseAction } from "./actions";

export function WarehouseForm() {
  const [state, formAction, pending] = useActionState(createWarehouseAction, undefined);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
      <div className="sm:col-span-2">
        <label htmlFor="wh-name" className="mb-1.5 block text-xs font-medium text-neutral-400">
          اسم المستودع
        </label>
        <input
          id="wh-name"
          name="name"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>
      <div>
        <label htmlFor="wh-code" className="mb-1.5 block text-xs font-medium text-neutral-400">
          الكود
        </label>
        <input
          id="wh-code"
          name="code"
          required
          dir="ltr"
          placeholder="CAI-01"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "جاري الإضافة..." : "+ مستودع"}
      </button>
      {state?.error && (
        <p className="text-sm text-red-400 sm:col-span-4">{state.error}</p>
      )}
    </form>
  );
}
