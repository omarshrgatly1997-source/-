"use client";

import { useActionState } from "react";
import { sendQuoteAction, type QuoteFormState } from "../../actions";

export function QuoteForm({ requestId }: { requestId: string }) {
  const action = async (_prev: QuoteFormState, formData: FormData) =>
    sendQuoteAction(requestId, _prev, formData);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex gap-3">
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          dir="ltr"
          placeholder="السعر بالدولار"
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "جاري الإرسال..." : "إرسال عرض السعر"}
        </button>
      </div>
      <textarea
        name="notes"
        rows={2}
        placeholder="ملاحظات على العرض (اختياري)"
        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
