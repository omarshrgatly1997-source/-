"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-300">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          dir="ltr"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-300">
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          dir="ltr"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "جاري الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
