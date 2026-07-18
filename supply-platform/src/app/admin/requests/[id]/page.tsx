import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { CATEGORY_LABELS, type CategoryValue } from "@/lib/categories";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/status";
import { markFulfilledAction } from "../../actions";
import { QuoteForm } from "./quote-form";
import { RejectForm } from "./reject-form";
import { AdminMessageForm } from "./message-form";

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentUser();
  const { id } = await params;

  const request = await prisma.supplyRequest.findUnique({
    where: { id },
    include: {
      customer: true,
      quotes: { orderBy: { createdAt: "desc" } },
      messages: { orderBy: { createdAt: "asc" }, include: { sender: true } },
    },
  });

  if (!request) notFound();

  const category =
    request.category === "OTHER" && request.categoryOther
      ? request.categoryOther
      : CATEGORY_LABELS[request.category as CategoryValue];

  const canQuote = request.status === "PENDING" || request.status === "DECLINED_BY_CUSTOMER";
  const canReject = request.status !== "REJECTED_ILLEGAL" && request.status !== "FULFILLED";
  const canFulfill = request.status === "ACCEPTED";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{request.title}</h1>
            <p className="mt-1 text-sm text-neutral-400">
              {category} — العميل: {request.customer.name} ({request.customer.email})
            </p>
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
          <h3 className="font-semibold text-red-300">سبب الرفض المُرسل للعميل</h3>
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

      <div className="flex flex-wrap gap-3">
        {canFulfill && (
          <form action={async () => { "use server"; await markFulfilledAction(request.id); }}>
            <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400">
              تحديد كـ &quot;تم التوريد&quot;
            </button>
          </form>
        )}
        {canReject && <RejectForm requestId={request.id} />}
      </div>

      {canQuote && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
          <h2 className="font-semibold text-white">إرسال عرض سعر</h2>
          <div className="mt-4">
            <QuoteForm requestId={request.id} />
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
        <h2 className="font-semibold text-white">سجل عروض الأسعار</h2>
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
                <span className="mt-2 inline-block text-xs text-neutral-500">
                  {q.status === "PENDING"
                    ? "بانتظار رد العميل"
                    : q.status === "ACCEPTED"
                      ? "مقبول"
                      : q.status === "DECLINED"
                        ? "مرفوض"
                        : "ملغى"}
                </span>
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
                  m.senderId === admin?.id
                    ? "mr-8 bg-amber-950/30 text-amber-100"
                    : "ml-8 bg-neutral-800/60 text-neutral-200"
                }`}
              >
                <p className="mb-1 text-xs font-medium text-neutral-400">
                  {m.senderId === admin?.id ? "أنت (الإدارة)" : m.sender.name}
                </p>
                {m.content}
              </div>
            ))
          )}
        </div>
        <div className="mt-4">
          <AdminMessageForm requestId={request.id} />
        </div>
      </div>
    </div>
  );
}
