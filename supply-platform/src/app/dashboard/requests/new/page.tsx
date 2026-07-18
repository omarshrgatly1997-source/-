import { RequestForm } from "./request-form";

export const metadata = { title: "طلب توريد جديد" };

export default function NewRequestPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">طلب توريد جديد</h1>
        <p className="mt-1 text-sm text-neutral-400">
          صف لنا احتياجك بالتفصيل، وسيراجعه فريقنا ويرد عليك بعرض سعر.
        </p>
      </div>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <RequestForm />
      </div>
    </div>
  );
}
