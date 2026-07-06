import Link from "next/link";

const features = [
  {
    title: "استراتيجيات موثّقة باحتراف",
    desc: "كل استراتيجية تُنشر مع شرح مفصّل: فكرة الدخول، إدارة المخاطر، ومستويات الأهداف ووقف الخسارة.",
  },
  {
    title: "دخول محصور بموافقتك",
    desc: "لا أحد يصل إلى المحتوى دون تسجيل طلب والموافقة عليه يدويًا من قبل الإدارة.",
  },
  {
    title: "مساعد ذكي متاح دائمًا",
    desc: "بوت دردشة مبني على الذكاء الاصطناعي يجيب فوريًا عن أي سؤال يخص الاستراتيجيات المنشورة.",
  },
  {
    title: "متابعة كل عضو على حدة",
    desc: "لوحة تحكم إدارية تعرض كل مستخدم على حدة تمهيدًا لتتبع تداولاته وأدائه.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-xl font-bold tracking-tight">
            نخبة <span className="text-emerald-400">التداول</span>
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
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
            >
              اطلب صلاحية الدخول
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-emerald-900/50 bg-emerald-950/40 px-4 py-1.5 text-xs font-medium text-emerald-400">
            وصول خاص — بالدعوة والموافقة فقط
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            تداول مباشر، واستراتيجيات
            <br />
            <span className="text-emerald-400">نصنعها ونشرحها باحترافية</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            منصة خاصة نتابع فيها التداول المباشر، وننشر استراتيجياتنا بشرح كامل
            لكل من نمنحه صلاحية الدخول، مع مساعد ذكي يجيب على أسئلتك في أي وقت.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
            >
              اطلب صلاحية الدخول الآن
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

        <section className="border-t border-neutral-900">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h2 className="text-2xl font-bold text-white">إخلاء مسؤولية</h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              التداول ينطوي على مخاطر، والمحتوى المنشور على هذه المنصة تعليمي
              ولأغراض المتابعة فقط، ولا يُعد توصية استثمارية أو ضمانًا لأي عوائد.
              يتحمّل كل مستخدم مسؤولية قراراته الخاصة بالتداول.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-900 py-8">
        <p className="text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} نخبة التداول. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}
