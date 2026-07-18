import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from "@/lib/categories";
import { acceptQuoteAction, declineQuoteAction, postMessageAction } from "@/lib/request-actions";
import { MessageForm } from "./message-form";

export const metadata = { title: "تفاصيل الطلب" };

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      quotes: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" }, include: { sender: true } },
    },
  });

  if (!request) notFound();
  if (user.role !== "ADMIN" && request.customerId !== user.id) redirect("/dashboard");

  const latestQuote = request.quotes[0];
  const canRespondToQuote = user.role !== "ADMIN" && request.status === "QUOTED" && latestQuote;
  const postMessage = postMessageAction.bind(null, request.id);

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

        {request.status === "REJECTED_ILLEGAL" && request.rejectionReason && (
          <p className="mt-4 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            سبب الرفض: {request.rejectionReason}
          </p>
        )}
      </div>

      {latestQuote && (
        <div className="rounded-2xl border border-emerald-900/50 bg-emerald-950/20 p-6">
          <h2 className="font-semibold text-white">عرض السعر</h2>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {latestQuote.price.toLocaleString()} {latestQuote.currency}
          </p>
          {latestQuote.notes && <p className="mt-2 text-sm text-neutral-300">{latestQuote.notes}</p>}
          {latestQuote.validUntil && (
            <p className="mt-2 text-xs text-neutral-500">
              العرض ساري حتى {latestQuote.validUntil.toLocaleDateString("ar-EG")}
            </p>
          )}

          {canRespondToQuote && (
            <div className="mt-4 flex gap-3">
              <form
                action={async () => {
                  "use server";
                  await acceptQuoteAction(request.id);
                }}
              >
                <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400">
                  قبول العرض
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await declineQuoteAction(request.id);
                }}
              >
                <button className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-300 hover:border-red-800 hover:text-red-400">
                  رفض العرض
                </button>
              </form>
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
