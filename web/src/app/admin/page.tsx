import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { approveUserAction, rejectUserAction } from "./actions";

export const metadata = { title: "لوحة الإدارة" };

export default async function AdminOverviewPage() {
  const [pendingUsers, totalUsers, approvedUsers, totalStrategies, publishedStrategies] =
    await Promise.all([
      prisma.user.findMany({ where: { status: "PENDING" }, orderBy: { createdAt: "asc" } }),
      prisma.user.count(),
      prisma.user.count({ where: { status: "APPROVED" } }),
      prisma.strategy.count(),
      prisma.strategy.count({ where: { published: true } }),
    ]);

  const stats = [
    { label: "إجمالي المستخدمين", value: totalUsers },
    { label: "مستخدمون مفعّلون", value: approvedUsers },
    { label: "بانتظار الموافقة", value: pendingUsers.length },
    { label: "استراتيجيات منشورة", value: `${publishedStrategies}/${totalStrategies}` },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">نظرة عامة</h1>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
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
          <h2 className="text-lg font-semibold text-white">طلبات بانتظار الموافقة</h2>
          <Link href="/admin/users" className="text-sm text-emerald-400 hover:text-emerald-300">
            عرض كل المستخدمين
          </Link>
        </div>

        {pendingUsers.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-500">
            لا توجد طلبات جديدة حاليًا.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900/70 text-neutral-400">
                <tr>
                  <th className="px-4 py-3 text-right font-medium">الاسم</th>
                  <th className="px-4 py-3 text-right font-medium">البريد الإلكتروني</th>
                  <th className="px-4 py-3 text-right font-medium">تاريخ الطلب</th>
                  <th className="px-4 py-3 text-right font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {pendingUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 text-white">
                      <Link href={`/admin/users/${u.id}`} className="hover:text-emerald-400">
                        {u.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-400" dir="ltr">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">
                      {u.createdAt.toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <form
                          action={async () => {
                            "use server";
                            await approveUserAction(u.id);
                          }}
                        >
                          <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400">
                            قبول
                          </button>
                        </form>
                        <form
                          action={async () => {
                            "use server";
                            await rejectUserAction(u.id);
                          }}
                        >
                          <button className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-red-800 hover:text-red-400">
                            رفض
                          </button>
                        </form>
                      </div>
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
