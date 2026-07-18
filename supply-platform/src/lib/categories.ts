export const CATEGORY_LABELS: Record<string, string> = {
  ELECTRONICS: "إلكترونيات وتقنية",
  INDUSTRIAL_EQUIPMENT: "معدات صناعية",
  RAW_MATERIALS: "مواد خام",
  VEHICLES_MACHINERY: "مركبات وآليات",
  CONSTRUCTION_MATERIALS: "مواد بناء",
  CONSUMER_GOODS: "سلع استهلاكية",
  MEDICAL_SUPPLIES: "مستلزمات طبية",
  AGRICULTURE_FOOD: "زراعة وأغذية",
  SERVICES: "خدمات",
  OTHER: "أخرى / مخصص",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as (keyof typeof CATEGORY_LABELS)[];

export const STATUS_LABELS: Record<string, string> = {
  NEW: "جديد",
  UNDER_REVIEW: "قيد المراجعة",
  QUOTED: "تم تقديم عرض سعر",
  ACCEPTED: "مقبول - قيد التنفيذ",
  DECLINED: "مرفوض من العميل",
  FULFILLED: "تم التوريد",
  CANCELLED: "ملغى",
  REJECTED_ILLEGAL: "مرفوض - غير قانوني",
};

export const STATUS_COLORS: Record<string, string> = {
  NEW: "text-sky-400 border-sky-900/50 bg-sky-950/40",
  UNDER_REVIEW: "text-amber-400 border-amber-900/50 bg-amber-950/40",
  QUOTED: "text-violet-400 border-violet-900/50 bg-violet-950/40",
  ACCEPTED: "text-emerald-400 border-emerald-900/50 bg-emerald-950/40",
  DECLINED: "text-neutral-400 border-neutral-800 bg-neutral-900/40",
  FULFILLED: "text-emerald-400 border-emerald-900/50 bg-emerald-950/40",
  CANCELLED: "text-neutral-400 border-neutral-800 bg-neutral-900/40",
  REJECTED_ILLEGAL: "text-red-400 border-red-900/50 bg-red-950/40",
};

export const PROHIBITED_ITEMS = [
  "الأسلحة والذخائر والمتفجرات",
  "المخدرات والمؤثرات العقلية غير المرخصة",
  "الأعضاء البشرية أو الاتجار بالبشر بأي صورة",
  "السلع المقلّدة أو المسروقة أو المخالفة لحقوق الملكية الفكرية",
  "الحيوانات والنباتات المهددة بالانقراض ومشتقاتها",
  "المواد الخطرة أو المشعة دون تراخيص رسمية سارية",
  "أي سلعة أو خدمة تخضع لعقوبات دولية أو محظورة في بلد المنشأ أو الوجهة",
];
