"use client";

import { useActionState } from "react";
import { grantAccessAction } from "./actions";

const roleOptions = [
  { value: "ADMIN", label: "أدمن (كل المستودعات)" },
  { value: "WAREHOUSE_MANAGER", label: "مدير مستودع" },
  { value: "STOREKEEPER", label: "أمين مخزن" },
  { value: "ACCOUNTANT", label: "محاسب" },
  { value: "VIEWER", label: "مشاهد فقط" },
];

export function AccessGrantForm({
  users,
  warehouses,
}: {
  users: { id: string; name: string; email: string }[];
  warehouses: { id: string; name: string }[];
}) {
  const [state, formAction, pending] = useActionState(grantAccessAction, undefined);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
      <div>
        <label htmlFor="userId" className="mb-1.5 block text-xs font-medium text-neutral-400">
          المستخدم
        </label>
        <select
          id="userId"
          name="userId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="" disabled>
            اختر مستخدمًا...
          </option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="warehouseId" className="mb-1.5 block text-xs font-medium text-neutral-400">
          المستودع
        </label>
        <select
          id="warehouseId"
          name="warehouseId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          <option value="" disabled>
            اختر مستودعًا...
          </option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="role" className="mb-1.5 block text-xs font-medium text-neutral-400">
          الدور
        </label>
        <select
          id="role"
          name="role"
          required
          defaultValue="STOREKEEPER"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        >
          {roleOptions.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "جاري المنح..." : "منح الصلاحية"}
      </button>
      {state?.error && <p className="text-sm text-red-400 sm:col-span-4">{state.error}</p>}
    </form>
  );
}
