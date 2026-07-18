import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/categories";

const steps = [
  {
    title: "قدّم طلب التوريد",
    desc: "املأ نموذجًا واحدًا يوضح الفئة والمواصفات والكمية والميزانية والموعد المطلوب.",
  },
  {
    title: "مراجعة قانونية وتسعير",
    desc: "يراجع فريقنا الطلب للتأكد من مطابقته للشروط القانونية، ثم يرسل عرض سعر مفصّل.",
  },
  {
    title: "قبول العرض والتنفيذ",
    desc: "اقبل العرض من حسابك لتبدأ عملية التوريد، مع سجل مراسلات مباشر لمتابعة كل التفاصيل.",
  },
];

const prohibited = [
  "الأسلحة والذخائر بجميع أنواعها",
  "المخدرات والمؤثرات العقلية غير المشروعة",
  "أي نشاط يتعلق بالاتجار بالبشر",
  "السلع المقلدة أو المسروقة",
  "الأنواع الحيوانية والنباتية المهددة بالانقراض",
  "المواد الخطرة أو المحظورة دوليًا",
  "أي توريد يخالف العقوبات الدولية المفروضة",
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-neutral-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-xl font-bold tracking-tight">
            التوريد <span className="text-amber-400">العالمي</span>
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
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400"
            >
              إنشاء حساب
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-amber-900/50 bg-amber-950/40 px-4 py-1.5 text-xs font-medium text-amber-400">
            منصة توريد لأي فئة، من أي مكان
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            اطلب توريد ما تحتاجه
            <br />
            <span className="text-amber-400">ونحن نتولى الباقي</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            نربط عملاءنا بمصادر توريد موثوقة لأي فئة من المنتجات أو الخدمات،
            مع مراجعة قانونية إلزامية لكل طلب وعرض سعر واضح قبل أي التزام.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400"
            >
              قدّم طلب توريد الآن
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
            <h2 className="text-center text-2xl font-bold text-white">الفئات المدعومة</h2>
            <p className="mt-2 text-center text-sm text-neutral-400">
              نستقبل طلبات توريد في أي فئة تقريبًا — إليك أبرزها
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Object.values(CATEGORY_LABELS).map((label) => (
                <div
                  key={label}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-4 text-center text-sm font-medium text-neutral-200"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center text-2xl font-bold text-white">كيف تعمل المنصة</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-neutral-950">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-900 bg-neutral-950">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h2 className="text-center text-2xl font-bold text-white">الالتزام القانوني</h2>
            <p className="mt-4 text-center text-sm leading-relaxed text-neutral-400">
              لا نقبل أي طلب توريد يتعلق بما يلي، ويُرفض أي طلب مشتبه به فورًا مع توضيح السبب:
            </p>
            <ul className="mx-auto mt-6 max-w-xl space-y-2">
              {prohibited.map((item) => (
                <li
                  key={item}
                  className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-2.5 text-sm text-red-300"
                >
                  {item}
                </li>
              ))}
            </ul>
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
