# تصميم قاعدة البيانات

تصميم مقسّم حسب النطاقات الوظيفية (Bounded Contexts). السكيمة الفعلية
(Prisma) موجودة في [`../prisma/schema.prisma`](../prisma/schema.prisma) وهي
تطبيق مباشر لهذا التصميم.

## 1. الهوية والوصول (Identity & Access)

- **User**: `id, name, email, passwordHash, phone, isActive, createdAt`
- **UserWarehouseAccess** (جدول ربط many-to-many بين المستخدم والمستودع، مع
  دور مختلف في كل مستودع):
  `userId, warehouseId, role`
  - `role` من enum: `ADMIN | WAREHOUSE_MANAGER | STOREKEEPER | ACCOUNTANT | VIEWER`
  - ده بيسمح مثلاً: نفس المستخدم "مدير" في فرع القاهرة، لكن "مشاهد فقط" في فرع
    الإسكندرية.
  - `ADMIN` عادة بيكون له صلاحية على كل المستودعات (نتعامل معاه كحالة خاصة في
    منطق الصلاحيات، أو نضيفه لكل مستودع تلقائيًا عند إنشائه).
- **AuditLog**: سجل تدقيق عام لأي عملية حساسة (إنشاء/تعديل/حذف):
  `userId, action, entityType, entityId, oldValue(json), newValue(json), createdAt`

## 2. الهيكل التنظيمي (Org Structure)

- **Warehouse** (المستودع/الفرع): `id, name, code, address, phone, isActive`
- **WarehouseLocation** (منطقة/رف/خانة داخل المستودع، هرمي):
  `id, warehouseId, code, name, parentLocationId`
  - مثال: `المستودع الرئيسي > المنطقة A > الرف 3 > الخانة 12`

## 3. كتالوج الأصناف (Product Catalog)

- **Category**: `id, name, parentId` (تصنيف شجري: أقسام وأقسام فرعية)
- **UnitOfMeasure**: `id, name, symbol` (قطعة، كرتونة، كيلو...)
- **UnitConversion**: `productId, fromUnitId, toUnitId, factor`
  (مثلاً: 1 كرتونة = 24 قطعة، لصنف معيّن)
- **Product**: `id, sku, barcode, name, description, categoryId, baseUnitId, costPrice, salePrice, isBatchTracked, isSerialTracked, isActive`
- **ProductWarehouseSetting**: `productId, warehouseId, minStock, maxStock, reorderPoint`
  (حدود مختلفة لنفس الصنف في كل فرع — فرع ممكن يحتاج حد أدنى أعلى من فرع تاني)

## 4. المخزون والحركة (Inventory & Movements)

- **Batch** (الدفعة): `id, productId, batchNumber, expiryDate, manufactureDate`
  (فقط للأصناف اللي `isBatchTracked = true`)
- **StockBalance** (الرصيد الحالي — **قيمة مُشتقة** من `StockMovement`، مش
  مصدر الحقيقة):
  `productId, warehouseId, locationId, batchId, quantity`
  (فهرس فريد مركّب على الأربعة معًا)
- **StockMovement** (سجل الحركة — **مصدر الحقيقة**، لا يُعدَّل ولا يُحذف):
  `id, type, productId, warehouseId, locationId, batchId, quantity(+/-), referenceType, referenceId, userId, createdAt, notes`
  - `type` من enum: `RECEIPT_IN | ISSUE_OUT | TRANSFER_OUT | TRANSFER_IN | ADJUSTMENT | COUNT_CORRECTION`
  - `referenceType/referenceId`: ربط اختياري بالمستند المصدر (أمر شراء، أمر
    بيع، تحويل، جرد...) بدون foreign key صارم (polymorphic reference).
- **StockTransfer** (تحويل بين مستودعين): `id, fromWarehouseId, toWarehouseId, status, requestedById, approvedById, transferDate`
  - `status`: `DRAFT | IN_TRANSIT | RECEIVED | CANCELLED`
  - **StockTransferItem**: `transferId, productId, quantity, batchId`
- **StockCount** (الجرد الدوري): `id, warehouseId, status, countedById, countDate`
  - **StockCountItem**: `countId, productId, locationId, systemQty, countedQty, variance`
  - عند اعتماد الجرد، أي فرق (`variance`) بيتولّد منه `StockMovement` من نوع
    `COUNT_CORRECTION` تلقائيًا.

## 5. المشتريات (Purchasing)

- **Supplier**: `id, name, contactPerson, phone, email, address`
- **PurchaseOrder**: `id, supplierId, warehouseId, status, orderDate, expectedDate, createdById`
  - `status`: `DRAFT | SENT | PARTIALLY_RECEIVED | RECEIVED | CANCELLED`
  - **PurchaseOrderItem**: `poId, productId, quantity, unitCost, receivedQty`
- **GoodsReceipt** (إذن استلام بضاعة): `id, poId, warehouseId, receivedDate, receivedById`
  - **GoodsReceiptItem**: `receiptId, productId, quantity, batchId`
  - عند تأكيد الاستلام، يتولّد `StockMovement` من نوع `RECEIPT_IN` لكل صنف.

## 6. المبيعات / الصرف (Sales / Outbound)

- **Customer**: `id, name, phone, email, address`
- **SalesOrder**: `id, customerId, warehouseId, status, orderDate, createdById`
- **SalesOrderItem**: `soId, productId, quantity, unitPrice`
- **DeliveryNote** (إذن الصرف): `id, soId, warehouseId, deliveredDate, deliveredById`
  - **DeliveryNoteItem**: `deliveryId, productId, quantity, batchId`
  - عند تأكيد الصرف، يتولّد `StockMovement` من نوع `ISSUE_OUT` لكل صنف.

## 7. التنبيهات والتقارير

- **Notification**: `id, userId, type, message, isRead, createdAt`
  - أنواع: نقص مخزون عن الحد الأدنى، قرب انتهاء صلاحية دفعة، طلب شراء يحتاج
    موافقة...
- **التقارير**: لا تحتاج جداول خاصة بها في الغالب — بتُبنى كـ Views/Queries
  فوق الجداول الموجودة، مثل:
  - تقرير حركة صنف (فلترة `StockMovement` حسب المنتج/الفترة)
  - تقرير قيمة المخزون الكلي (تجميع `StockBalance × costPrice`)
  - الأصناف تحت `reorderPoint`
  - الدفعات القريبة من `expiryDate`

## مخطط العلاقات المختصر (Entity Relationships)

```
User ──< UserWarehouseAccess >── Warehouse ──< WarehouseLocation (شجري)
Warehouse ──< ProductWarehouseSetting >── Product ──< UnitConversion
Product ──< Batch
Product, Warehouse, WarehouseLocation, Batch ──< StockMovement (الـ Ledger)
StockMovement ──(مُشتق منه)──> StockBalance

Supplier ──< PurchaseOrder ──< PurchaseOrderItem >── Product
PurchaseOrder ──< GoodsReceipt ──< GoodsReceiptItem  →  يولّد StockMovement(RECEIPT_IN)

Customer ──< SalesOrder ──< SalesOrderItem >── Product
SalesOrder ──< DeliveryNote ──< DeliveryNoteItem  →  يولّد StockMovement(ISSUE_OUT)

Warehouse ──< StockTransfer >── Warehouse  →  يولّد StockMovement(TRANSFER_OUT/IN)
Warehouse ──< StockCount ──< StockCountItem  →  يولّد StockMovement(COUNT_CORRECTION)
```

## نقاط للنقاش لاحقًا (تحتاج قرار منك قبل التنفيذ)

1. **تتبع السيريال نمبر (Serial Tracking)**: هل فيه أصناف تحتاج تتبع بالرقم
   التسلسلي الفردي (مش بس دفعة)، زي أجهزة إلكترونية؟ لو آه، هنحتاج جدول
   `SerialUnit` إضافي.
2. **العملة والتسعير**: عملة واحدة؟ ولا محتاجين دعم أكتر من عملة للموردين
   الأجانب؟
3. **الموافقات (Approvals)**: هل أوامر الشراء/التحويلات محتاجة سير موافقة
   (مثلاً مدير الفرع يطلب، والأدمن يوافق) قبل التنفيذ؟
4. **الفوترة**: هل النظام هيصدر فواتير فعلية (ضريبية) ولا هو إدارة مخزون فقط
   وربط بنظام محاسبي خارجي لاحقًا؟
