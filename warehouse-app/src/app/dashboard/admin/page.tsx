import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { isGlobalAdmin } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { WarehouseForm } from "./warehouse-form";
import { AccessGrantForm } from "./access-form";
import { revokeAccessAction } from "./actions";

const roleLabels: Record<string, string> = {
  ADMIN: "أدمن",
  WAREHOUSE_MANAGER: "مدير مستودع",
  STOREKEEPER: "أمين مخزن",
  ACCOUNTANT: "محاسب",
  VIEWER: "مشاهد",
};

export const metadata = { title: "لوحة الإدارة" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!(await isGlobalAdmin(user.id))) redirect("/dashboard");

  const [warehouses, users, accessGrants] = await Promise.all([
    prisma.warehouse.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.userWarehouseAccess.findMany({
      include: { user: true, warehouse: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">لوحة الإدارة</h1>
        <p className="mt-1 text-sm text-neutral-400">
          إدارة المستودعات وصلاحيات المستخدمين عليها.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-semibold text-white">المستودعات ({warehouses.length})</h2>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <WarehouseForm />
        </div>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {warehouses.map((w) => (
            <li
              key={w.id}
              className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-4 py-2 text-sm text-neutral-200"
            >
              {w.name} <span className="text-neutral-500">({w.code})</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-white">منح صلاحية مستخدم على مستودع</h2>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <AccessGrantForm
            users={users.map((u) => ({ id: u.id, name: u.name, email: u.email }))}
            warehouses={warehouses.map((w) => ({ id: w.id, name: w.name }))}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-semibold text-white">
          الصلاحيات الممنوحة ({accessGrants.length})
        </h2>
        <div className="overflow-hidden rounded-2xl border border-neutral-800">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="px-4 py-3 text-start font-medium">المستخدم</th>
                <th className="px-4 py-3 text-start font-medium">المستودع</th>
                <th className="px-4 py-3 text-start font-medium">الدور</th>
                <th className="px-4 py-3 text-start font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {accessGrants.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                    لا يوجد صلاحيات ممنوحة بعد.
                  </td>
                </tr>
              )}
              {accessGrants.map((a) => {
                const revoke = revokeAccessAction.bind(null, a.id);
                return (
                  <tr key={a.id} className="text-neutral-200">
                    <td className="px-4 py-3">
                      {a.user.name} <span className="text-neutral-500">({a.user.email})</span>
                    </td>
                    <td className="px-4 py-3">{a.warehouse.name}</td>
                    <td className="px-4 py-3">{roleLabels[a.role] ?? a.role}</td>
                    <td className="px-4 py-3 text-end">
                      <form action={revoke}>
                        <button
                          type="submit"
                          className="text-xs font-medium text-red-400 hover:text-red-300"
                        >
                          إلغاء
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
