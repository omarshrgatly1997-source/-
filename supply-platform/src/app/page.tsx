import Link from "next/link";
import { CATEGORY_LABELS, PROHIBITED_ITEMS } from "@/lib/categories";

const steps = [
  {
    title: "أرسل طلبك",
    desc: "صف لنا المنتج أو الخدمة التي تحتاجها: المواصفات، الكمية، الميزانية التقريبية، والموعد المطلوب.",
  },
  {
    title: "نبحث ونقيّم",
    desc: "فريقنا يبحث عن أفضل الموردين حول العالم، يتحقق من الجودة والامتثال القانوني، ويجهّز عرض سعر واضح.",
  },
  {
    title: "توافق وتتابع",
    desc: "تراجع عرض السعر وتوافق عليه من حسابك، وتتابع حالة الطلب حتى التسليم عبر لوحة تحكم مباشرة.",
  },
];

const features = [
  {
    title: "أي فئة تقريبًا",
    desc: "من الإلكترونيات والمعدات الصناعية إلى المواد الخام والخدمات المتخصصة — إن كان قانونيًا، نبحث لك عنه.",
  },
  {
    title: "شفافية كاملة",
    desc: "كل طلب له حالة واضحة وسجل محادثة مباشر مع فريقنا، وعرض سعر رسمي قبل أي التزام.",
  },
  {
    title: "التزام قانوني صارم",
    desc: "نراجع كل طلب ونرفض فورًا أي سلعة أو خدمة محظورة أو مخالفة للقانون في بلد المنشأ أو الوجهة.",
  },
  {
    title: "متابعة من حساب واحد",
    desc: "لوحة تحكم لكل عميل تعرض جميع طلباته وعروض الأسعار وسجل المراسلات في مكان واحد.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-xl font-bold tracking-tight">
            التوريد <span className="text-emerald-400">العالمي</span>
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
              قدّم طلب توريد
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-emerald-900/50 bg-emerald-950/40 px-4 py-1.5 text-xs font-medium text-emerald-400">
            توريد عالمي — أي طلب قانوني، من أي مكان
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            أخبرنا بما تحتاجه،
            <br />
            <span className="text-emerald-400">ونحن نتولى توريده</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            منصة توريد تربطك بشبكة موردين عالمية. مهما كان طلبك — منتج، معدات، مواد
            خام، أو خدمة متخصصة — أرسله وسنبحث عن أفضل مصدر وسعر، ضمن الأطر
            القانونية دائمًا.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-emerald-400"
            >
              قدّم طلبك الآن
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
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center text-2xl font-bold text-white">كيف تعمل المنصة</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-neutral-950">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-neutral-900 bg-neutral-950">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-center text-2xl font-bold text-white">فئات نغطّيها</h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {Object.values(CATEGORY_LABELS).map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-sm text-neutral-300"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h2 className="text-center text-2xl font-bold text-white">إخلاء مسؤولية والتزام قانوني</h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-neutral-400">
              نلتزم بالعمل ضمن الأطر القانونية في كل معاملة. نراجع كل طلب توريد
              يدويًا، ونرفض فورًا — دون استثناء — أي طلب يتعلق بما يلي:
            </p>
            <ul className="mx-auto mt-6 max-w-xl space-y-2 text-sm text-neutral-400">
              {PROHIBITED_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 text-red-400">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-xs leading-relaxed text-neutral-500">
              نحتفظ بحق رفض أي طلب مشبوه أو مخالف، والإبلاغ عنه للجهات المختصة عند
              الاقتضاء. تقديم طلب توريد لا يضمن قبوله؛ القبول مشروط بمراجعتنا
              وتوفر مصدر قانوني وموثوق.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-900 py-8">
        <p className="text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} التوريد العالمي. جميع الحقوق محفوظة.
        </p>
      </footer>
    </div>
  );
}
