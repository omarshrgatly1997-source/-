import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prisma";

const riskLabel: Record<string, string> = {
  LOW: "منخفضة",
  MEDIUM: "متوسطة",
  HIGH: "مرتفعة",
};

export default async function StrategyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const strategy = await prisma.strategy.findUnique({ where: { slug } });

  if (!strategy || !strategy.published) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <span className="inline-block rounded-full border border-neutral-700 px-2.5 py-0.5 text-xs font-medium text-neutral-300">
        مستوى المخاطرة: {riskLabel[strategy.riskLevel]}
      </span>
      <h1 className="mt-3 text-3xl font-bold text-white">{strategy.title}</h1>
      <p className="mt-3 text-lg text-neutral-400">{strategy.summary}</p>

      <div className="prose prose-invert prose-headings:text-white prose-a:text-emerald-400 mt-8 max-w-none">
        <ReactMarkdown>{strategy.content}</ReactMarkdown>
      </div>
    </article>
  );
}
