import { createStrategyAction } from "../../actions";
import { StrategyForm } from "../strategy-form";

export const metadata = { title: "استراتيجية جديدة" };

export default function NewStrategyPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">استراتيجية جديدة</h1>
      <StrategyForm action={createStrategyAction} submitLabel="إنشاء الاستراتيجية" />
    </div>
  );
}
