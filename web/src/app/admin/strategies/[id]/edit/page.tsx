import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateStrategyAction } from "../../../actions";
import { StrategyForm } from "../../strategy-form";

export const metadata = { title: "تعديل الاستراتيجية" };

export default async function EditStrategyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const strategy = await prisma.strategy.findUnique({ where: { id } });
  if (!strategy) notFound();

  const boundAction = updateStrategyAction.bind(null, strategy.id);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">تعديل الاستراتيجية</h1>
      <StrategyForm
        action={boundAction}
        submitLabel="حفظ التعديلات"
        initial={{
          title: strategy.title,
          slug: strategy.slug,
          summary: strategy.summary,
          content: strategy.content,
          riskLevel: strategy.riskLevel,
          published: strategy.published,
        }}
      />
    </div>
  );
}
