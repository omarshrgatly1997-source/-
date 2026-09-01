import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getAccessibleWarehouses } from "@/lib/access";
import { logoutAction } from "@/app/(auth)/actions";

export const metadata = { title: "بانتظار صلاحية" };

export default async function PendingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const warehouses = await getAccessibleWarehouses(user.id);
  if (warehouses.length > 0) redirect("/dashboard");

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8">
        <h1 className="text-xl font-bold text-white">حسابك بانتظار صلاحية</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          تم إنشاء حسابك بنجاح، لكن ماعندكش صلاحية على أي مستودع حتى الآن. تواصل
          مع مدير النظام عشان يمنحك صلاحية، وهتقدر تدخل فورًا بعد كده.
        </p>
        <form action={logoutAction} className="mt-6">
          <button
            type="submit"
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-500"
          >
            تسجيل الخروج
          </button>
        </form>
      </div>
    </div>
  );
}
