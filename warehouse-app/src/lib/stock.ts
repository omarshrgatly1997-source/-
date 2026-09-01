import { prisma } from "@/lib/prisma";

/**
 * MVP simplification: movements/balances aren't bucketed by location or
 * batch yet (both columns exist in the schema for when Locations/Batches get
 * UI — see docs/roadmap.md phases 2-3), so every balance row here has
 * `locationId: null, batchId: null`. Because Postgres doesn't treat two NULLs
 * as equal for a unique-index conflict, we can't rely on a DB-level
 * `upsert`/`ON CONFLICT` for this case — this reads the row and creates/updates
 * it explicitly inside a transaction instead. That's good enough for a single
 * writer; a future phase should add row locking (`SELECT ... FOR UPDATE`) or a
 * partial unique index once concurrent movements on the same product/warehouse
 * become a real scenario.
 */

const DEFAULT_UNIT_SYMBOL = "PCS";

/** Every Product needs a baseUnitId; the MVP product form doesn't expose
 * units yet, so it always uses this lazily-created default unit. */
export async function ensureDefaultUnit() {
  const existing = await prisma.unitOfMeasure.findUnique({
    where: { symbol: DEFAULT_UNIT_SYMBOL },
  });
  if (existing) return existing;
  return prisma.unitOfMeasure.create({
    data: { name: "قطعة", symbol: DEFAULT_UNIT_SYMBOL },
  });
}

export type ApplyMovementInput = {
  type: "RECEIPT_IN" | "ISSUE_OUT";
  productId: string;
  warehouseId: string;
  quantity: number; // always positive; sign is derived from `type`
  userId: string;
  notes?: string;
};

export class InsufficientStockError extends Error {
  constructor() {
    super("لا يوجد رصيد كافٍ لهذا الصنف في هذا المستودع لإتمام عملية الصرف");
    this.name = "InsufficientStockError";
  }
}

export async function applyStockMovement(input: ApplyMovementInput) {
  const signedQuantity = input.type === "RECEIPT_IN" ? input.quantity : -input.quantity;

  return prisma.$transaction(async (tx) => {
    const balance = await tx.stockBalance.findFirst({
      where: {
        productId: input.productId,
        warehouseId: input.warehouseId,
        locationId: null,
        batchId: null,
      },
    });

    const currentQty = balance?.quantity ?? 0;
    if (input.type === "ISSUE_OUT" && currentQty < input.quantity) {
      throw new InsufficientStockError();
    }

    const movement = await tx.stockMovement.create({
      data: {
        type: input.type,
        productId: input.productId,
        warehouseId: input.warehouseId,
        quantity: signedQuantity,
        userId: input.userId,
        notes: input.notes || null,
        referenceType: "MANUAL",
      },
    });

    if (balance) {
      await tx.stockBalance.update({
        where: { id: balance.id },
        data: { quantity: currentQty + signedQuantity },
      });
    } else {
      await tx.stockBalance.create({
        data: {
          productId: input.productId,
          warehouseId: input.warehouseId,
          quantity: signedQuantity,
        },
      });
    }

    return movement;
  });
}
