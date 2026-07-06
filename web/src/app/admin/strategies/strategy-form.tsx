"use client";

import { useActionState } from "react";
import type { StrategyFormState } from "../actions";

type Initial = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  published: boolean;
};

export function StrategyForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prev: StrategyFormState, formData: FormData) => Promise<StrategyFormState>;
  initial?: Initial;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-neutral-300">
          العنوان
        </label>
        <input
          id="title"
          name="title"
          required
          defaultValue={initial?.title}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label htmlFor="slug" className="mb-1.5 block text-sm font-medium text-neutral-300">
          الرابط (بالإنجليزية، بدون مسافات)
        </label>
        <input
          id="slug"
          name="slug"
          required
          dir="ltr"
          defaultValue={initial?.slug}
          placeholder="ema-trend-fib"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label htmlFor="summary" className="mb-1.5 block text-sm font-medium text-neutral-300">
          ملخّص قصير
        </label>
        <textarea
          id="summary"
          name="summary"
          required
          rows={2}
          defaultValue={initial?.summary}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label htmlFor="content" className="mb-1.5 block text-sm font-medium text-neutral-300">
          الشرح الكامل (يدعم Markdown)
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={12}
          defaultValue={initial?.content}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 font-mono text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label htmlFor="riskLevel" className="mb-1.5 block text-sm font-medium text-neutral-300">
          مستوى المخاطرة
        </label>
        <select
          id="riskLevel"
          name="riskLevel"
          defaultValue={initial?.riskLevel ?? "MEDIUM"}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="LOW">منخفضة</option>
          <option value="MEDIUM">متوسطة</option>
          <option value="HIGH">مرتفعة</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-neutral-300">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial?.published}
          className="h-4 w-4 rounded border-neutral-700 bg-neutral-950 accent-emerald-500"
        />
        نشر الاستراتيجية فورًا
      </label>

      {state?.error && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "جاري الحفظ..." : submitLabel}
      </button>
    </form>
  );
}
