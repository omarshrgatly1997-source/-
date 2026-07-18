"use client";

import { useActionState } from "react";
import { createRequestAction } from "@/lib/request-actions";
import { CATEGORIES, CATEGORY_LABELS, PROHIBITED_ITEMS } from "@/lib/categories";

const inputClass =
  "w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const labelClass = "mb-1.5 block text-sm font-medium text-neutral-300";

export function RequestForm() {
  const [state, formAction, pending] = useActionState(createRequestAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="title" className={labelClass}>
          عنوان الطلب
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className={inputClass}
          placeholder="مثال: 500 وحدة من مضخات مياه صناعية"
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          الفئة
        </label>
        <select id="category" name="category" required className={inputClass} defaultValue="">
          <option value="" disabled>
            اختر فئة
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          الوصف التفصيلي
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className={inputClass}
          placeholder="اذكر المواصفات، المعايير، أي شروط جودة أو شهادات مطلوبة..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className={labelClass}>
            الكمية
          </label>
          <input
            id="quantity"
            name="quantity"
            type="text"
            required
            className={inputClass}
            placeholder="مثال: 500 قطعة / حاوية واحدة"
          />
        </div>
        <div>
          <label htmlFor="destinationCountry" className={labelClass}>
            بلد الوجهة (اختياري)
          </label>
          <input id="destinationCountry" name="destinationCountry" type="text" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="targetBudget" className={labelClass}>
            الميزانية التقريبية (اختياري)
          </label>
          <input
            id="targetBudget"
            name="targetBudget"
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            dir="ltr"
          />
        </div>
        <div>
          <label htmlFor="currency" className={labelClass}>
            العملة
          </label>
          <input id="currency" name="currency" type="text" defaultValue="USD" maxLength={3} dir="ltr" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="deadline" className={labelClass}>
          الموعد المطلوب (اختياري)
        </label>
        <input id="deadline" name="deadline" type="date" className={inputClass} />
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
        <p className="text-xs font-medium text-neutral-400">
          لن نتمكن من تنفيذ أي طلب يتعلق بما يلي:
        </p>
        <ul className="mt-2 grid grid-cols-1 gap-1 text-xs text-neutral-500 sm:grid-cols-2">
          {PROHIBITED_ITEMS.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <label className="mt-4 flex items-start gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            name="legalDeclaration"
            required
            className="mt-0.5 h-4 w-4 rounded border-neutral-600 bg-neutral-950 text-emerald-500 focus:ring-emerald-500"
          />
          <span>أقر بأن هذا الطلب قانوني بالكامل ولا يخالف أيًا مما ذُكر أعلاه.</span>
        </label>
      </div>

      {state?.error && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "جاري الإرسال..." : "إرسال الطلب"}
      </button>
    </form>
  );
}
