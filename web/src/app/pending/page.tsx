import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "@/app/(auth)/actions";

export const metadata = { title: "بانتظار الموافقة" };

export default async function PendingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.status === "APPROVED") redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");

  const isRejected = user.status === "REJECTED";

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8">
        <h1 className="text-xl font-bold text-white">
          {isRejected ? "تم رفض طلب الوصول" : "حسابك بانتظار الموافقة"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400">
          {isRejected
            ? "لم يتم قبول طلبك للوصول إلى هذه المنصة. تواصل مع الإدارة إن كنت تعتقد أن هذا خطأ."
            : "شكرًا لتسجيلك، طلبك قيد المراجعة من قبل الإدارة. ستتمكن من الدخول فور الموافقة عليه."}
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
