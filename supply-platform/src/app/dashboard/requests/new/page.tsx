import { RequestForm } from "./request-form";

export const metadata = { title: "طلب توريد جديد" };

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-white">طلب توريد جديد</h1>
      <p className="mt-2 text-sm text-neutral-400">
        املأ التفاصيل التالية وسيراجع فريقنا طلبك ويرسل عرض سعر مناسب.
      </p>
      <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8">
        <RequestForm />
      </div>
    </div>
  );
}
