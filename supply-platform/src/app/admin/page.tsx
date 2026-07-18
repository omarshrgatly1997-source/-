import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, type CategoryValue } from "@/lib/categories";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/status";

export const metadata = { title: "لوحة الإدارة" };

const FILTERS = [
  "ALL",
  "PENDING",
  "QUOTED",
  "ACCEPTED",
  "DECLINED_BY_CUSTOMER",
  "FULFILLED",
  "REJECTED_ILLEGAL",
] as const;

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const filter = FILTERS.includes(status as (typeof FILTERS)[number])
    ? (status as (typeof FILTERS)[number])
    : "ALL";

  const [total, pending, quoted, accepted, fulfilled, requests] = await Promise.all([
    prisma.supplyRequest.count(),
    prisma.supplyRequest.count({ where: { status: "PENDING" } }),
    prisma.supplyRequest.count({ where: { status: "QUOTED" } }),
    prisma.supplyRequest.count({ where: { status: "ACCEPTED" } }),
    prisma.supplyRequest.count({ where: { status: "FULFILLED" } }),
    prisma.supplyRequest.findMany({
      where: filter === "ALL" ? {} : { status: filter },
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    }),
  ]);

  const stats = [
    { label: "إجمالي الطلبات", value: total },
    { label: "قيد المراجعة", value: pending },
    { label: "بانتظار رد العميل", value: quoted },
    { label: "مقبولة", value: accepted },
    { label: "مكتملة", value: fulfilled },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">نظرة عامة</h1>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-xs text-neutral-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f}
              href={f === "ALL" ? "/admin" : `/admin?status=${f}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filter === f
                  ? "border-amber-500 bg-amber-950/40 text-amber-400"
                  : "border-neutral-800 text-neutral-400 hover:border-neutral-600"
              }`}
            >
              {f === "ALL" ? "الكل" : STATUS_LABELS[f]}
            </Link>
          ))}
        </div>

        {requests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-800 p-10 text-center text-sm text-neutral-500">
            لا توجد طلبات في هذا التصنيف.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900/70 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">العنوان</th>
                  <th className="px-4 py-3 text-right font-medium">العميل</th>
                  <th className="px-4 py-3 text-right font-medium">الفئة</th>
                  <th className="px-4 py-3 text-right font-medium">الحالة</th>
                  <th className="px-4 py-3 text-right font-medium">تاريخ الطلب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-white">
                      <Link href={`/admin/requests/${r.id}`} className="hover:text-amber-400">
                        {r.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{r.customer.name}</td>
                    <td className="px-4 py-3 text-neutral-400">
                      {CATEGORY_LABELS[r.category as CategoryValue]}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[r.status]}`}
                      >
                        {STATUS_LABELS[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {r.createdAt.toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
