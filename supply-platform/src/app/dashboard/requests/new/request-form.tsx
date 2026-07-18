"use client";

import { useActionState, useState } from "react";
import { createRequestAction } from "../../actions";
import { CATEGORY_VALUES, CATEGORY_LABELS } from "@/lib/categories";

const prohibited = [
  "الأسلحة والذخائر بجميع أنواعها",
  "المخدرات والمؤثرات العقلية غير المشروعة",
  "أي نشاط يتعلق بالاتجار بالبشر",
  "السلع المقلدة أو المسروقة",
  "الأنواع الحيوانية والنباتية المهددة بالانقراض",
  "المواد الخطرة أو المحظورة دوليًا",
  "أي توريد يخالف العقوبات الدولية المفروضة",
];

const inputClass =
  "w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export function RequestForm() {
  const [state, formAction, pending] = useActionState(createRequestAction, undefined);
  const [category, setCategory] = useState("");

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-neutral-300">
          الفئة
        </label>
        <select
          id="category"
          name="category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
        >
          <option value="" disabled>
            اختر الفئة
          </option>
          {CATEGORY_VALUES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      {category === "OTHER" && (
        <div>
          <label
            htmlFor="categoryOther"
            className="mb-1.5 block text-sm font-medium text-neutral-300"
          >
            حدّد الفئة
          </label>
          <input
            id="categoryOther"
            name="categoryOther"
            type="text"
            className={inputClass}
            placeholder="اكتب الفئة"
          />
        </div>
      )}

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-neutral-300">
          عنوان الطلب
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className={inputClass}
          placeholder="مثال: توريد 500 وحدة من كذا"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-neutral-300">
          وصف تفصيلي
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className={inputClass}
          placeholder="اشرح المواصفات المطلوبة بالتفصيل"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="quantity" className="mb-1.5 block text-sm font-medium text-neutral-300">
            الكمية
          </label>
          <input
            id="quantity"
            name="quantity"
            type="text"
            required
            className={inputClass}
            placeholder="مثال: 500 وحدة"
          />
        </div>
        <div>
          <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-neutral-300">
            الميزانية التقريبية (اختياري)
          </label>
          <input
            id="budget"
            name="budget"
            type="number"
            min="0"
            step="0.01"
            dir="ltr"
            className={inputClass}
            placeholder="بالدولار الأمريكي"
          />
        </div>
        <div>
          <label htmlFor="neededBy" className="mb-1.5 block text-sm font-medium text-neutral-300">
            الموعد المطلوب (اختياري)
          </label>
          <input id="neededBy" name="neededBy" type="date" dir="ltr" className={inputClass} />
        </div>
      </div>

      <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-5">
        <h3 className="font-semibold text-red-300">إقرار قانوني إلزامي</h3>
        <p className="mt-2 text-sm text-red-300/80">
          لا يجوز أن يتضمن طلبك أيًا مما يلي، وسيتم رفض أي طلب مشتبه به فورًا:
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-red-300/80">
          {prohibited.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <label className="mt-4 flex items-start gap-2.5 text-sm text-neutral-200">
          <input
            type="checkbox"
            name="legalDeclarationAccepted"
            required
            className="mt-0.5 h-4 w-4 rounded border-neutral-600 bg-neutral-950 accent-amber-500"
          />
          أقرّ بأن هذا الطلب لا يخالف أيًا من الشروط أعلاه، وأتحمّل المسؤولية الكاملة عن صحة هذا
          الإقرار.
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
        className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "جاري الإرسال..." : "إرسال طلب التوريد"}
      </button>
    </form>
  );
}
