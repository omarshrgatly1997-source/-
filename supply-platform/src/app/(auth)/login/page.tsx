import Link from "next/link";
import { LoginForm } from "./login-form";

export const metadata = { title: "تسجيل الدخول" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          التوريد <span className="text-amber-400">العالمي</span>
        </Link>
        <p className="mt-2 text-sm text-neutral-400">سجّل الدخول لمتابعة طلبات التوريد الخاصة بك</p>
      </div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-xl backdrop-blur">
        <LoginForm />
      </div>
      <p className="mt-6 text-center text-sm text-neutral-400">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="font-medium text-amber-400 hover:text-amber-300">
          أنشئ حسابًا جديدًا
        </Link>
      </p>
    </div>
  );
}
