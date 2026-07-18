import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/categories";

export const metadata = { title: "لوحة الإدارة" };

export default async function AdminOverviewPage() {
  const [totalRequests, newRequests, underReview, quoted, accepted, fulfilled, newList] =
    await Promise.all([
      prisma.request.count(),
      prisma.request.count({ where: { status: "NEW" } }),
      prisma.request.count({ where: { status: "UNDER_REVIEW" } }),
      prisma.request.count({ where: { status: "QUOTED" } }),
      prisma.request.count({ where: { status: "ACCEPTED" } }),
      prisma.request.count({ where: { status: "FULFILLED" } }),
      prisma.request.findMany({
        where: { status: "NEW" },
        orderBy: { createdAt: "asc" },
        include: { customer: true },
        take: 10,
      }),
    ]);

  const stats = [
    { label: "إجمالي الطلبات", value: totalRequests },
    { label: "جديدة", value: newRequests },
    { label: "قيد المراجعة", value: underReview },
    { label: "بانتظار رد العميل", value: quoted },
    { label: "قيد التنفيذ", value: accepted },
    { label: "تم التوريد", value: fulfilled },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">نظرة عامة</h1>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="mt-1 text-xs text-neutral-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">طلبات جديدة بحاجة لمراجعة</h2>
          <Link href="/admin/requests" className="text-sm text-emerald-400 hover:text-emerald-300">
            عرض كل الطلبات
          </Link>
        </div>

        {newList.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-500">
            لا توجد طلبات جديدة حاليًا.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900/70 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">الطلب</th>
                  <th className="px-4 py-3 text-right font-medium">الفئة</th>
                  <th className="px-4 py-3 text-right font-medium">العميل</th>
                  <th className="px-4 py-3 text-right font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {newList.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 text-white">
                      <Link href={`/admin/requests/${r.id}`} className="hover:text-emerald-400">
                        {r.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{CATEGORY_LABELS[r.category]}</td>
                    <td className="px-4 py-3 text-neutral-400">{r.customer.name}</td>
                    <td className="px-4 py-3 text-neutral-400">{r.createdAt.toLocaleDateString("ar-EG")}</td>
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

