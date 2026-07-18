"use client";

import { useActionState } from "react";
import { registerAction } from "../actions";

const inputClass =
  "w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500";
const labelClass = "mb-1.5 block text-sm font-medium text-neutral-300";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="name" className={labelClass}>
          الاسم الكامل
        </label>
        <input id="name" name="name" type="text" required className={inputClass} placeholder="اسمك الكامل" />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          dir="ltr"
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          dir="ltr"
          className={inputClass}
          placeholder="8 أحرف على الأقل"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className={labelClass}>
            الشركة (اختياري)
          </label>
          <input id="company" name="company" type="text" className={inputClass} placeholder="اسم شركتك" />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            الهاتف (اختياري)
          </label>
          <input id="phone" name="phone" type="tel" dir="ltr" className={inputClass} placeholder="+966..." />
        </div>
      </div>
      <div>
        <label htmlFor="country" className={labelClass}>
          الدولة (اختياري)
        </label>
        <input id="country" name="country" type="text" className={inputClass} placeholder="بلد إقامتك" />
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
        {pending ? "جاري الإنشاء..." : "إنشاء حساب"}
      </button>
    </form>
  );
}
