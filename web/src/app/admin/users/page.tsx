import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "المستخدمون" };

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

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">كل المستخدمين</h1>
      <div className="overflow-hidden rounded-2xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900/70 text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-right font-medium">الاسم</th>
              <th className="px-4 py-3 text-right font-medium">البريد الإلكتروني</th>
              <th className="px-4 py-3 text-right font-medium">الحالة</th>
              <th className="px-4 py-3 text-right font-medium">الدور</th>
              <th className="px-4 py-3 text-right font-medium">تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {users.map((u) => (
              <tr key={u.id} className="transition hover:bg-neutral-900/40">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="font-medium text-white hover:text-emerald-400"
                  >
                    {u.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-400" dir="ltr">
                  {u.email}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor[u.status]}`}
                  >
                    {statusLabel[u.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-400">
                  {u.role === "ADMIN" ? "مدير" : "عضو"}
                </td>
                <td className="px-4 py-3 text-neutral-400">
                  {u.createdAt.toLocaleDateString("ar-EG")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
