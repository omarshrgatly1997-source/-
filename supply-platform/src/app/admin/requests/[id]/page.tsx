import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from "@/lib/categories";
import { sendQuoteAction, updateStatusAction, rejectIllegalAction } from "@/app/admin/actions";
import { postMessageAction } from "@/lib/request-actions";
import { MessageForm } from "@/app/dashboard/requests/[id]/message-form";
import { QuoteForm } from "./quote-form";

export const metadata = { title: "تفاصيل طلب التوريد" };

export default async function AdminRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      customer: true,
      quotes: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" }, include: { sender: true } },
    },
  });

  if (!request) notFound();

  const sendQuote = sendQuoteAction.bind(null, request.id);
  const postMessage = postMessageAction.bind(null, request.id);
  const isFinal = ["FULFILLED", "CANCELLED", "REJECTED_ILLEGAL", "DECLINED"].includes(request.status);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-neutral-500">{CATEGORY_LABELS[request.category]}</span>
          <span
            className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[request.status]}`}
          >
            {STATUS_LABELS[request.status]}
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white">{request.title}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          العميل: {request.customer.name} ({request.customer.email})
          {request.customer.company ? ` — ${request.customer.company}` : ""}
        </p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">{request.description}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-neutral-500">الكمية</dt>
            <dd className="mt-1 text-white">{request.quantity}</dd>
          </div>
          {request.targetBudget && (
            <div>
              <dt className="text-neutral-500">الميزانية التقريبية</dt>
              <dd className="mt-1 text-white">
                {request.targetBudget.toLocaleString()} {request.currency}
              </dd>
            </div>
          )}
          {request.destinationCountry && (
            <div>
              <dt className="text-neutral-500">بلد الوجهة</dt>
              <dd className="mt-1 text-white">{request.destinationCountry}</dd>
            </div>
          )}
          {request.deadline && (
            <div>
              <dt className="text-neutral-500">الموعد المطلوب</dt>
              <dd className="mt-1 text-white">{request.deadline.toLocaleDateString("ar-EG")}</dd>
            </div>
          )}
        </dl>
      </div>

      {!isFinal && (
        <div className="flex flex-wrap gap-2">
          {request.status === "NEW" && (
            <form
              action={async () => {
                "use server";
                await updateStatusAction(request.id, "UNDER_REVIEW");
              }}
            >
              <button className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-neutral-500">
                بدء المراجعة
              </button>
            </form>
          )}
          {request.status === "ACCEPTED" && (
            <form
              action={async () => {
                "use server";
                await updateStatusAction(request.id, "FULFILLED");
              }}
            >
              <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400">
                تحديد كـ &quot;تم التوريد&quot;
              </button>
            </form>
          )}
          <form
            action={async () => {
              "use server";
              await updateStatusAction(request.id, "CANCELLED");
            }}
          >
            <button className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-red-800 hover:text-red-400">
              إلغاء الطلب
            </button>
          </form>
        </div>
      )}

      {!isFinal && (
        <details className="rounded-2xl border border-red-900/40 bg-red-950/10 p-4">
          <summary className="cursor-pointer text-sm font-medium text-red-400">
            رفض الطلب لعدم القانونية
          </summary>
          <form
            action={async (formData: FormData) => {
              "use server";
              await rejectIllegalAction(request.id, String(formData.get("reason") ?? ""));
            }}
            className="mt-3 flex gap-2"
          >
            <input
              name="reason"
              type="text"
              required
              placeholder="سبب الرفض (سيظهر للعميل)"
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-950 px-3.5 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
              رفض نهائيًا
            </button>
          </form>
        </details>
      )}

      {request.status !== "REJECTED_ILLEGAL" && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h2 className="font-semibold text-white">
            {request.quotes[0] ? "إرسال عرض سعر محدّث" : "إرسال عرض سعر"}
          </h2>
          <div className="mt-4">
            <QuoteForm action={sendQuote} defaultCurrency={request.currency} />
          </div>
          {request.quotes.length > 0 && (
            <div className="mt-6 space-y-2 border-t border-neutral-800 pt-4">
              <p className="text-xs font-medium text-neutral-500">عروض سابقة</p>
              {request.quotes.map((q) => (
                <p key={q.id} className="text-sm text-neutral-400">
                  {q.price.toLocaleString()} {q.currency} — {q.createdAt.toLocaleDateString("ar-EG")}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="font-semibold text-white">المراسلات</h2>
        <div className="mt-3 space-y-3">
          {request.messages.length === 0 ? (
            <p className="text-sm text-neutral-500">لا توجد رسائل بعد.</p>
          ) : (
            request.messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-lg border p-3 text-sm ${
                  m.sender.role === "ADMIN"
                    ? "border-emerald-900/40 bg-emerald-950/20"
                    : "border-neutral-800 bg-neutral-900/50"
                }`}
              >
                <div className="mb-1 flex items-center justify-between text-xs text-neutral-500">
                  <span>{m.sender.role === "ADMIN" ? "فريق التوريد" : m.sender.name}</span>
                  <span>{m.createdAt.toLocaleString("ar-EG")}</span>
                </div>
                <p className="whitespace-pre-wrap text-neutral-200">{m.body}</p>
              </div>
            ))
          )}
        </div>
        <MessageForm action={postMessage} />
      </div>
    </div>
  );
}
