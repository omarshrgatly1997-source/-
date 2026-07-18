import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from "@/lib/categories";
import type { RequestStatus } from "@/generated/prisma/client";

export const metadata = { title: "طلبات التوريد" };

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const validStatus = status && status in STATUS_LABELS ? status : undefined;

  const requests = await prisma.request.findMany({
    where: validStatus ? { status: validStatus as RequestStatus } : undefined,
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  const filters = [{ value: undefined, label: "الكل" }, ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">طلبات التوريد</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.label}
            href={f.value ? `/admin/requests?status=${f.value}` : "/admin/requests"}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              validStatus === f.value || (!validStatus && !f.value)
                ? "border-emerald-500 bg-emerald-950/40 text-emerald-400"
                : "border-neutral-800 text-neutral-400 hover:border-neutral-600"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {requests.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-neutral-800 p-10 text-center text-sm text-neutral-500">
          لا توجد طلبات مطابقة.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/70 text-neutral-400">
              <tr>
                <th className="px-4 py-3 text-right font-medium">الطلب</th>
                <th className="px-4 py-3 text-right font-medium">الفئة</th>
                <th className="px-4 py-3 text-right font-medium">العميل</th>
                <th className="px-4 py-3 text-right font-medium">الحالة</th>
                <th className="px-4 py-3 text-right font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-white">
                    <Link href={`/admin/requests/${r.id}`} className="hover:text-emerald-400">
                      {r.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{CATEGORY_LABELS[r.category]}</td>
                  <td className="px-4 py-3 text-neutral-400">{r.customer.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[r.status]}`}
                    >
                      {STATUS_LABELS[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{r.createdAt.toLocaleDateString("ar-EG")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
