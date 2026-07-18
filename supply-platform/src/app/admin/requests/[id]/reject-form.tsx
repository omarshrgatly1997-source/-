"use client";

import { useActionState, useState } from "react";
import { rejectIllegalAction, type RejectFormState } from "../../actions";

export function RejectForm({ requestId }: { requestId: string }) {
  const [open, setOpen] = useState(false);
  const action = async (_prev: RejectFormState, formData: FormData) =>
    rejectIllegalAction(requestId, _prev, formData);
  const [state, formAction, pending] = useActionState(action, undefined);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg border border-red-900/50 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-950/30"
      >
        رفض نهائيًا - غير قانوني
      </button>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-red-900/50 bg-red-950/20 p-4">
      <label htmlFor="reason" className="block text-sm font-medium text-red-300">
        سبب الرفض (سيظهر للعميل)
      </label>
      <textarea
        id="reason"
        name="reason"
        required
        rows={3}
        className="w-full rounded-lg border border-red-900/50 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        placeholder="مثال: هذا الطلب يتعلق بتوريد مواد محظورة دوليًا"
      />
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "جاري التأكيد..." : "تأكيد الرفض"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 hover:border-neutral-500"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
