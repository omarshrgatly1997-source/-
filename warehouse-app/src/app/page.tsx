import Link from "next/link";

const features = [
  {
    title: "عدة مستودعات وفروع",
    desc: "إدارة مركزية لأكتر من مستودع، وصلاحيات مستقلة لكل مستودع لكل مستخدم.",
  },
  {
    title: "سجل حركة كامل",
    desc: "كل إدخال أو صرف يُسجَّل كحركة دائمة (Ledger)، والرصيد الحالي يُحسب منها تلقائيًا.",
  },
  {
    title: "صلاحيات مرنة",
    desc: "نفس المستخدم ممكن يكون مديرًا في فرع، ومشاهدًا فقط في فرع آخر.",
  },
  {
    title: "أساس قابل للتوسع",
    desc: "مشتريات، مبيعات، جرد دوري، وتنبيهات نقص المخزون — على نفس الأساس.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-xl font-bold tracking-tight">
            إدارة <span className="text-sky-400">المستودعات</span>
          </span>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-300 transition hover:text-white"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-sky-400"
            >
              إنشاء حساب
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-sky-900/50 bg-sky-950/40 px-4 py-1.5 text-xs font-medium text-sky-400">
            نسخة أولية (MVP)
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            مخزونك، عبر كل فروعك،
            <br />
            <span className="text-sky-400">في مكان واحد</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            تتبّع الأصناف والأرصدة وحركات الإدخال والصرف عبر عدة مستودعات، مع
            صلاحيات مستقلة لكل فرع.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-sky-500 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-sky-400"
            >
              ابدأ الآن
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-neutral-700 px-6 py-3 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500"
            >
              لدي حساب بالفعل
            </Link>
          </div>
        </section>

        <section className="border-t border-neutral-900 bg-neutral-950">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6"
              >
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-900 py-8">
        <p className="text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} نظام إدارة المستودعات.
        </p>
      </footer>
    </div>
  );
}
