import { prisma } from "@/lib/prisma";
import { CustomerForm } from "./customer-form";

export const metadata = { title: "العملاء" };

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">العملاء</h1>
      <p className="mt-1 text-sm text-neutral-400">
        العملاء مشتركين بين كل المستودعات — تقدر تسجّل بيع لهم من صفحة أي مستودع.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <h2 className="mb-4 font-semibold text-white">إضافة عميل جديد</h2>
        <CustomerForm />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-start font-medium">الاسم</th>
              <th className="px-4 py-3 text-start font-medium">الهاتف</th>
              <th className="px-4 py-3 text-start font-medium">البريد الإلكتروني</th>
              <th className="px-4 py-3 text-start font-medium">العنوان</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  لا يوجد عملاء بعد.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.id} className="text-neutral-200">
                <td className="px-4 py-3">{c.name}</td>
                <td className="px-4 py-3 text-neutral-400" dir="ltr">
                  {c.phone ?? "—"}
                </td>
                <td className="px-4 py-3 text-neutral-400" dir="ltr">
                  {c.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-neutral-400">{c.address ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
