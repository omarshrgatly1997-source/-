import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = { title: "تسجيل الدخول" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          نخبة <span className="text-emerald-400">التداول</span>
        </Link>
        <p className="mt-2 text-sm text-neutral-400">
          سجّل الدخول للوصول إلى استراتيجياتك ومساعدك الذكي
        </p>
      </div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-xl backdrop-blur">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-neutral-400">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="font-medium text-emerald-400 hover:text-emerald-300">
          اطلب صلاحية الدخول
        </Link>
      </p>
    </div>
  );
}
