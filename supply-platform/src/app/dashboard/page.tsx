import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { CATEGORY_LABELS, type CategoryValue } from "@/lib/categories";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/status";

export const metadata = { title: "طلباتي" };

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const requests = await prisma.supplyRequest.findMany({
    where: { customerId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">طلباتي</h1>
        <Link
          href="/dashboard/requests/new"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-amber-400"
        >
          طلب توريد جديد
        </Link>
      </div>

      {requests.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-800 p-10 text-center text-sm text-neutral-500">
          لم تقدّم أي طلب توريد بعد.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/70 text-neutral-400">
              <tr>
                <th className="px-4 py-3 text-right font-medium">العنوان</th>
                <th className="px-4 py-3 text-right font-medium">الفئة</th>
                <th className="px-4 py-3 text-right font-medium">الحالة</th>
                <th className="px-4 py-3 text-right font-medium">تاريخ الطلب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 text-white">
                    <Link href={`/dashboard/requests/${r.id}`} className="hover:text-amber-400">
                      {r.title}
                    </Link>
                  </td>
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
  );
}
