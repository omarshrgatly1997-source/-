export const CATEGORY_VALUES = [
  "ELECTRONICS",
  "INDUSTRIAL_EQUIPMENT",
  "RAW_MATERIALS",
  "TEXTILES",
  "FOOD_AND_BEVERAGE",
  "MEDICAL_SUPPLIES",
  "CONSTRUCTION_MATERIALS",
  "LOGISTICS_SERVICES",
  "OTHER",
] as const;

export type CategoryValue = (typeof CATEGORY_VALUES)[number];

export const CATEGORY_LABELS: Record<CategoryValue, string> = {
  ELECTRONICS: "إلكترونيات",
  INDUSTRIAL_EQUIPMENT: "معدات صناعية",
  RAW_MATERIALS: "مواد خام",
  TEXTILES: "منسوجات وأقمشة",
  FOOD_AND_BEVERAGE: "أغذية ومشروبات",
  MEDICAL_SUPPLIES: "مستلزمات طبية",
  CONSTRUCTION_MATERIALS: "مواد بناء",
  LOGISTICS_SERVICES: "خدمات لوجستية",
  OTHER: "أخرى",
};
