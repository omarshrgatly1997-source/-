import { prisma } from "@/lib/prisma";
import { SupplierForm } from "./supplier-form";

export const metadata = { title: "الموردين" };

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">الموردين</h1>
      <p className="mt-1 text-sm text-neutral-400">
        الموردين مشتركين بين كل المستودعات — تقدر تسجّل شراء منهم من صفحة أي مستودع.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <h2 className="mb-4 font-semibold text-white">إضافة مورد جديد</h2>
        <SupplierForm />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-start font-medium">الاسم</th>
              <th className="px-4 py-3 text-start font-medium">مسؤول التواصل</th>
              <th className="px-4 py-3 text-start font-medium">الهاتف</th>
              <th className="px-4 py-3 text-start font-medium">البريد الإلكتروني</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {suppliers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  لا يوجد موردين بعد.
                </td>
              </tr>
            )}
            {suppliers.map((s) => (
              <tr key={s.id} className="text-neutral-200">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3 text-neutral-400">{s.contactPerson ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-400" dir="ltr">
                  {s.phone ?? "—"}
                </td>
                <td className="px-4 py-3 text-neutral-400" dir="ltr">
                  {s.email ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
