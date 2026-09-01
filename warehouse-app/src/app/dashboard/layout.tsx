import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getAccessibleWarehouses, isGlobalAdmin } from "@/lib/access";
import { logoutAction } from "@/app/(auth)/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [warehouses, globalAdmin] = await Promise.all([
    getAccessibleWarehouses(user.id),
    isGlobalAdmin(user.id),
  ]);
  if (warehouses.length === 0) redirect("/pending");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight text-white">
            إدارة <span className="text-sky-400">المستودعات</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
            >
              المستودعات
            </Link>
            <Link
              href="/dashboard/products"
              className="rounded-lg px-3 py-2 font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
            >
              الأصناف
            </Link>
            <Link
              href="/dashboard/suppliers"
              className="rounded-lg px-3 py-2 font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
            >
              الموردين
            </Link>
            {globalAdmin && (
              <Link
                href="/dashboard/admin"
                className="rounded-lg px-3 py-2 font-medium text-sky-400 transition hover:bg-neutral-900"
              >
                لوحة الإدارة
              </Link>
            )}
            <span className="mx-2 hidden text-neutral-600 sm:inline">|</span>
            <span className="hidden text-neutral-500 sm:inline">{user.name}</span>
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
