import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "الاستراتيجيات" };

const riskLabel: Record<string, string> = {
  LOW: "منخفضة",
  MEDIUM: "متوسطة",
  HIGH: "مرتفعة",
};

const riskColor: Record<string, string> = {
  LOW: "text-emerald-400 border-emerald-900/50 bg-emerald-950/40",
  MEDIUM: "text-amber-400 border-amber-900/50 bg-amber-950/40",
  HIGH: "text-red-400 border-red-900/50 bg-red-950/40",
};

export default async function DashboardPage() {
  const strategies = await prisma.strategy.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">الاستراتيجيات المنشورة</h1>
        <p className="mt-1 text-sm text-neutral-400">
          تصفّح استراتيجيات التداول المتاحة لك مع الشرح الكامل لكل واحدة.
        </p>
      </div>

      {strategies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-10 text-center text-neutral-500">
          لا توجد استراتيجيات منشورة بعد. تابعنا قريبًا.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {strategies.map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/strategies/${s.slug}`}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 transition hover:border-neutral-700 hover:bg-neutral-900"
            >
              <span
                className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${riskColor[s.riskLevel]}`}
              >
                مخاطرة {riskLabel[s.riskLevel]}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-emerald-400">
                {s.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-400">
                {s.summary}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
