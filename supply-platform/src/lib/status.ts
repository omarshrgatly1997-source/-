export const STATUS_LABELS: Record<string, string> = {
  PENDING: "قيد المراجعة",
  QUOTED: "تم إرسال عرض سعر",
  ACCEPTED: "تم قبول العرض",
  DECLINED_BY_CUSTOMER: "رفض العميل العرض",
  FULFILLED: "تم التوريد",
  REJECTED_ILLEGAL: "مرفوض - غير قانوني",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-400 border-amber-900/50 bg-amber-950/40",
  QUOTED: "text-blue-400 border-blue-900/50 bg-blue-950/40",
  ACCEPTED: "text-emerald-400 border-emerald-900/50 bg-emerald-950/40",
  DECLINED_BY_CUSTOMER: "text-neutral-400 border-neutral-700 bg-neutral-900/40",
  FULFILLED: "text-emerald-400 border-emerald-900/50 bg-emerald-950/40",
  REJECTED_ILLEGAL: "text-red-400 border-red-900/50 bg-red-950/40",
};
