import Link from "next/link";
import { RegisterForm } from "./register-form";

export const metadata = { title: "إنشاء حساب" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          التوريد <span className="text-amber-400">العالمي</span>
        </Link>
        <p className="mt-2 text-sm text-neutral-400">أنشئ حسابك لتقديم طلبات التوريد ومتابعتها</p>
      </div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-xl backdrop-blur">
        <RegisterForm />
      </div>
      <p className="mt-6 text-center text-sm text-neutral-400">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="font-medium text-amber-400 hover:text-amber-300">
          تسجيل الدخول
        </Link>
      </p>
    </div>
  );
}
