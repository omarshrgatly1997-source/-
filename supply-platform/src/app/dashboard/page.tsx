import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from "@/lib/categories";

export const metadata = { title: "طلباتي" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const requests = await prisma.request.findMany({
    where: { customerId: user.id },
    orderBy: { createdAt: "desc" },
    include: { quotes: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">طلباتي</h1>
          <p className="mt-1 text-sm text-neutral-400">تابع حالة كل طلب توريد قدّمته وعروض الأسعار الخاصة به.</p>
        </div>
        <Link
          href="/dashboard/requests/new"
          className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
        >
          + طلب جديد
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-10 text-center text-neutral-500">
          لا توجد طلبات بعد.{" "}
          <Link href="/dashboard/requests/new" className="text-emerald-400 hover:text-emerald-300">
            قدّم طلبك الأول
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/dashboard/requests/${r.id}`}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition hover:border-neutral-700 hover:bg-neutral-900"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-neutral-500">{CATEGORY_LABELS[r.category]}</span>
                <span
                  className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[r.status]}`}
                >
                  {STATUS_LABELS[r.status]}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-emerald-400">{r.title}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-400">{r.description}</p>
              {r.quotes[0] && (
                <p className="mt-3 text-sm font-medium text-emerald-400">
                  عرض سعر: {r.quotes[0].price.toLocaleString()} {r.quotes[0].currency}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
