import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { approveUserAction, rejectUserAction, revokeUserAction } from "../../actions";

const statusLabel: Record<string, string> = {
  PENDING: "بانتظار الموافقة",
  APPROVED: "مفعّل",
  REJECTED: "مرفوض",
};

const statusColor: Record<string, string> = {
  PENDING: "text-amber-400 border-amber-900/50 bg-amber-950/40",
  APPROVED: "text-emerald-400 border-emerald-900/50 bg-emerald-950/40",
  REJECTED: "text-red-400 border-red-900/50 bg-red-950/40",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { trades: { orderBy: { openedAt: "desc" }, take: 20 } },
  });

  if (!user) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-sm text-neutral-400" dir="ltr">
            {user.email}
          </p>
        </div>
        <span
          className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${statusColor[user.status]}`}
        >
          {statusLabel[user.status]}
        </span>
      </div>

      <div className="mb-8 flex gap-2">
        {user.status !== "APPROVED" && (
          <form action={async () => { "use server"; await approveUserAction(user.id); }}>
            <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400">
              قبول الدخول
            </button>
          </form>
        )}
        {user.status !== "REJECTED" && (
          <form action={async () => { "use server"; await rejectUserAction(user.id); }}>
            <button className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 hover:border-red-800 hover:text-red-400">
              رفض / حظر الدخول
            </button>
          </form>
        )}
        {user.status === "APPROVED" && user.role !== "ADMIN" && (
          <form action={async () => { "use server"; await revokeUserAction(user.id); }}>
            <button className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 hover:border-amber-800 hover:text-amber-400">
              تعليق الصلاحية مؤقتًا
            </button>
          </form>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">سجل التداولات</h2>
          <span className="text-xs text-neutral-500">
            البنية جاهزة — إدخال التداولات سيُفعّل لاحقًا
          </span>
        </div>

        {user.trades.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-800 p-8 text-center text-sm text-neutral-500">
            لا توجد تداولات مسجّلة لهذا المستخدم بعد.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-neutral-900/70 text-neutral-400">
                <tr>
                  <th className="px-3 py-2 text-right font-medium">الرمز</th>
                  <th className="px-3 py-2 text-right font-medium">الاتجاه</th>
                  <th className="px-3 py-2 text-right font-medium">الدخول</th>
                  <th className="px-3 py-2 text-right font-medium">الخروج</th>
                  <th className="px-3 py-2 text-right font-medium">الربح/الخسارة</th>
                  <th className="px-3 py-2 text-right font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {user.trades.map((t) => (
                  <tr key={t.id}>
                    <td className="px-3 py-2 text-white">{t.symbol}</td>
                    <td className="px-3 py-2 text-neutral-400">
                      {t.direction === "LONG" ? "شراء" : "بيع"}
                    </td>
                    <td className="px-3 py-2 text-neutral-400">{t.entryPrice}</td>
                    <td className="px-3 py-2 text-neutral-400">{t.exitPrice ?? "—"}</td>
                    <td
                      className={`px-3 py-2 font-medium ${
                        (t.pnl ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {t.pnl ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-neutral-400">
                      {t.openedAt.toLocaleDateString("ar-EG")}
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
