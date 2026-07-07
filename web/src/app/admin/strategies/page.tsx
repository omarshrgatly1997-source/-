import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { togglePublishAction, deleteStrategyAction } from "../actions";

export const metadata = { title: "إدارة الاستراتيجيات" };

const riskLabel: Record<string, string> = {
  LOW: "منخفضة",
  MEDIUM: "متوسطة",
  HIGH: "مرتفعة",
};

export default async function AdminStrategiesPage() {
  const strategies = await prisma.strategy.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">إدارة الاستراتيجيات</h1>
        <Link
          href="/admin/strategies/new"
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
        >
          + استراتيجية جديدة
        </Link>
      </div>

      {strategies.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-neutral-800 p-10 text-center text-sm text-neutral-500">
          لم تُنشئ أي استراتيجية بعد.
        </p>
      ) : (
        <div className="space-y-3">
          {strategies.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-white">{s.title}</h2>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${
                      s.published
                        ? "border-emerald-900/50 bg-emerald-950/40 text-emerald-400"
                        : "border-neutral-700 bg-neutral-800/50 text-neutral-400"
                    }`}
                  >
                    {s.published ? "منشورة" : "مسودة"}
                  </span>
                  <span className="text-xs text-neutral-500">مخاطرة {riskLabel[s.riskLevel]}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-sm text-neutral-500">{s.summary}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/strategies/${s.id}/edit`}
                  className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-neutral-500"
                >
                  تعديل
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await togglePublishAction(s.id, !s.published);
                  }}
                >
                  <button className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-emerald-700 hover:text-emerald-400">
                    {s.published ? "إلغاء النشر" : "نشر"}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server";
                    await deleteStrategyAction(s.id);
                  }}
                >
                  <button className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:border-red-800 hover:text-red-400">
                    حذف
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
