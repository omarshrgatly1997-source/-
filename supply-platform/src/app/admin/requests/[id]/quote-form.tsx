"use client";

import { useActionState } from "react";
import type { QuoteFormState } from "@/app/admin/actions";

export function QuoteForm({
  action,
  defaultCurrency,
}: {
  action: (prev: QuoteFormState, formData: FormData) => Promise<QuoteFormState>;
  defaultCurrency: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  const inputClass =
    "w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
  const labelClass = "mb-1.5 block text-sm font-medium text-neutral-300";

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className={labelClass}>
            السعر
          </label>
          <input id="price" name="price" type="number" min="0" step="0.01" required dir="ltr" className={inputClass} />
        </div>
        <div>
          <label htmlFor="currency" className={labelClass}>
            العملة
          </label>
          <input
            id="currency"
            name="currency"
            type="text"
            defaultValue={defaultCurrency}
            maxLength={3}
            dir="ltr"
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label htmlFor="validUntil" className={labelClass}>
          العرض ساري حتى (اختياري)
        </label>
        <input id="validUntil" name="validUntil" type="date" className={inputClass} />
      </div>
      <div>
        <label htmlFor="notes" className={labelClass}>
          ملاحظات (اختياري)
        </label>
        <textarea id="notes" name="notes" rows={3} className={inputClass} />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "جاري الإرسال..." : "إرسال عرض السعر"}
      </button>
    </form>
  );
}
