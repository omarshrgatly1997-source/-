import { prisma } from "@/lib/prisma";
import { ProductForm } from "./product-form";

export const metadata = { title: "الأصناف" };

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">الأصناف</h1>
      <p className="mt-1 text-sm text-neutral-400">
        كتالوج الأصناف مشترك بين كل المستودعات — الرصيد الفعلي لكل مستودع يظهر
        في صفحة المستودع نفسه.
      </p>

      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <h2 className="mb-4 font-semibold text-white">إضافة صنف جديد</h2>
        <ProductForm />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-start font-medium">الاسم</th>
              <th className="px-4 py-3 text-start font-medium">SKU</th>
              <th className="px-4 py-3 text-start font-medium">سعر التكلفة</th>
              <th className="px-4 py-3 text-start font-medium">سعر البيع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                  لا يوجد أصناف بعد.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="text-neutral-200">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-neutral-400" dir="ltr">
                  {p.sku}
                </td>
                <td className="px-4 py-3" dir="ltr">
                  {p.costPrice.toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3" dir="ltr">
                  {p.salePrice.toLocaleString("en-US")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
