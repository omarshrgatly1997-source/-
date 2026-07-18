import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { CATEGORY_LABELS, type CategoryValue } from "@/lib/categories";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/status";
import { acceptQuoteAction, declineQuoteAction } from "../../actions";
import { MessageForm } from "./message-form";

export default async function CustomerRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const request = await prisma.supplyRequest.findUnique({
    where: { id },
    include: {
      quotes: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" }, include: { sender: true } },
    },
  });

  if (!request || request.customerId !== user.id) notFound();

  const pendingQuote = request.quotes.find((q) => q.status === "PENDING");
  const category =
    request.category === "OTHER" && request.categoryOther
      ? request.categoryOther
      : CATEGORY_LABELS[request.category as CategoryValue];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{request.title}</h1>
            <p className="mt-1 text-sm text-neutral-400">{category}</p>
          </div>
          <span
            className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${STATUS_COLORS[request.status]}`}
          >
            {STATUS_LABELS[request.status]}
          </span>
        </div>
      </div>

      {request.status === "REJECTED_ILLEGAL" && request.rejectionReason && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-5">
          <h3 className="font-semibold text-red-300">سبب الرفض</h3>
          <p className="mt-2 text-sm text-red-300/80">{request.rejectionReason}</p>
        </div>
      )}

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h2 className="font-semibold text-white">تفاصيل الطلب</h2>
        <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-neutral-500">الكمية</dt>
            <dd className="mt-1 text-neutral-200">{request.quantity}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">الميزانية</dt>
            <dd className="mt-1 text-neutral-200">
              {request.budget ? `$${request.budget.toLocaleString()}` : "غير محددة"}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">الموعد المطلوب</dt>
            <dd className="mt-1 text-neutral-200">
              {request.neededBy ? request.neededBy.toLocaleDateString("ar-EG") : "غير محدد"}
            </dd>
          </div>
        </dl>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
          {request.description}
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h2 className="font-semibold text-white">عروض الأسعار</h2>
        {request.quotes.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">لم يتم إرسال أي عرض سعر بعد.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {request.quotes.map((q) => (
              <li key={q.id} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-white">${q.price.toLocaleString()}</span>
                  <span className="text-xs text-neutral-500">
                    {q.createdAt.toLocaleDateString("ar-EG")}
                  </span>
                </div>
                {q.notes && <p className="mt-2 text-sm text-neutral-400">{q.notes}</p>}
                {q.status === "PENDING" && q.id === pendingQuote?.id && (
                  <div className="mt-3 flex gap-2">
                    <form action={async () => { "use server"; await acceptQuoteAction(request.id, q.id); }}>
                      <button className="rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400">
                        قبول العرض
                      </button>
                    </form>
                    <form action={async () => { "use server"; await declineQuoteAction(request.id, q.id); }}>
                      <button className="rounded-lg border border-neutral-700 px-4 py-1.5 text-xs font-semibold text-neutral-300 hover:border-red-800 hover:text-red-400">
                        رفض العرض
                      </button>
                    </form>
                  </div>
                )}
                {q.status !== "PENDING" && (
                  <span className="mt-2 inline-block text-xs text-neutral-500">
                    {q.status === "ACCEPTED" ? "مقبول" : q.status === "DECLINED" ? "مرفوض" : "ملغى"}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h2 className="font-semibold text-white">سجل المراسلات</h2>
        <div className="mt-4 max-h-96 space-y-3 overflow-y-auto">
          {request.messages.length === 0 ? (
            <p className="text-sm text-neutral-500">لا توجد رسائل بعد.</p>
          ) : (
            request.messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-xl p-3 text-sm ${
                  m.senderId === user.id
                    ? "mr-8 bg-amber-950/30 text-amber-100"
                    : "ml-8 bg-neutral-800/60 text-neutral-200"
                }`}
              >
                <p className="mb-1 text-xs font-medium text-neutral-400">
                  {m.senderId === user.id ? "أنت" : m.sender.name}
                </p>
                {m.content}
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <MessageForm requestId={request.id} />
        </div>
      </div>
    </div>
  );
}
