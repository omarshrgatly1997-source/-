"use client";

import { useActionState } from "react";
import { sendAdminMessageAction, type MessageFormState } from "../../actions";

export function AdminMessageForm({ requestId }: { requestId: string }) {
  const action = async (_prev: MessageFormState, formData: FormData) =>
    sendAdminMessageAction(requestId, _prev, formData);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex gap-2">
      <input
        name="content"
        type="text"
        required
        placeholder="اكتب ردًا للعميل..."
        className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        إرسال
      </button>
      {state?.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}
