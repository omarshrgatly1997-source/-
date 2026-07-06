import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/app/(auth)/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.status !== "APPROVED") redirect("/pending");
  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-lg font-bold tracking-tight text-white">
            نخبة <span className="text-emerald-400">التداول</span>{" "}
            <span className="text-neutral-500">— لوحة الإدارة</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
            >
              نظرة عامة
            </Link>
            <Link
              href="/admin/users"
              className="rounded-lg px-3 py-2 font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
            >
              المستخدمون
            </Link>
            <Link
              href="/admin/strategies"
              className="rounded-lg px-3 py-2 font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
            >
              الاستراتيجيات
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
            >
              عرض المنصة
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg px-3 py-2 font-medium text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
              >
                خروج
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
