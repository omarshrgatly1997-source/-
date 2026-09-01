import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

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

export class InsufficientStockError extends Error {
  constructor() {
    super("لا يوجد رصيد كافٍ لهذا الصنف في هذا المستودع لإتمام العملية");
    this.name = "InsufficientStockError";
  }
}

async function getBalanceQty(tx: Prisma.TransactionClient, productId: string, warehouseId: string) {
  const balance = await tx.stockBalance.findFirst({
    where: { productId, warehouseId, locationId: null, batchId: null },
  });
  return { balance, qty: balance?.quantity ?? 0 };
}

/** Applies `delta` (signed) to a product's balance in a warehouse, creating
 * the balance row if it doesn't exist yet. Caller is responsible for any
 * "enough stock to go negative" check beforehand. */
async function applyBalanceDelta(
  tx: Prisma.TransactionClient,
  productId: string,
  warehouseId: string,
  delta: number
) {
  const { balance, qty } = await getBalanceQty(tx, productId, warehouseId);
  if (balance) {
    await tx.stockBalance.update({ where: { id: balance.id }, data: { quantity: qty + delta } });
  } else {
    await tx.stockBalance.create({
      data: { productId, warehouseId, quantity: delta },
    });
  }
}

export type ApplyMovementInput = {
  type: "RECEIPT_IN" | "ISSUE_OUT";
  productId: string;
  warehouseId: string;
  quantity: number; // always positive; sign is derived from `type`
  userId: string;
  notes?: string;
};

export async function applyStockMovement(input: ApplyMovementInput) {
  const signedQuantity = input.type === "RECEIPT_IN" ? input.quantity : -input.quantity;

  return prisma.$transaction(async (tx) => {
    const { qty } = await getBalanceQty(tx, input.productId, input.warehouseId);
    if (input.type === "ISSUE_OUT" && qty < input.quantity) {
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

    await applyBalanceDelta(tx, input.productId, input.warehouseId, signedQuantity);

    return movement;
  });
}

export type ApplyTransferInput = {
  fromWarehouseId: string;
  toWarehouseId: string;
  productId: string;
  quantity: number;
  userId: string;
  notes?: string;
};

/** MVP simplification: transfers complete immediately (no DRAFT/IN_TRANSIT
 * hand-off step) — see docs/roadmap.md. */
export async function applyStockTransfer(input: ApplyTransferInput) {
  if (input.fromWarehouseId === input.toWarehouseId) {
    throw new Error("لا يمكن التحويل لنفس المستودع");
  }

  return prisma.$transaction(async (tx) => {
    const { qty } = await getBalanceQty(tx, input.productId, input.fromWarehouseId);
    if (qty < input.quantity) {
      throw new InsufficientStockError();
    }

    const transfer = await tx.stockTransfer.create({
      data: {
        fromWarehouseId: input.fromWarehouseId,
        toWarehouseId: input.toWarehouseId,
        status: "RECEIVED",
        requestedById: input.userId,
        approvedById: input.userId,
        items: { create: [{ productId: input.productId, quantity: input.quantity }] },
      },
    });

    await tx.stockMovement.create({
      data: {
        type: "TRANSFER_OUT",
        productId: input.productId,
        warehouseId: input.fromWarehouseId,
        quantity: -input.quantity,
        userId: input.userId,
        notes: input.notes || null,
        referenceType: "STOCK_TRANSFER",
        referenceId: transfer.id,
      },
    });
    await tx.stockMovement.create({
      data: {
        type: "TRANSFER_IN",
        productId: input.productId,
        warehouseId: input.toWarehouseId,
        quantity: input.quantity,
        userId: input.userId,
        notes: input.notes || null,
        referenceType: "STOCK_TRANSFER",
        referenceId: transfer.id,
      },
    });

    await applyBalanceDelta(tx, input.productId, input.fromWarehouseId, -input.quantity);
    await applyBalanceDelta(tx, input.productId, input.toWarehouseId, input.quantity);

    return transfer;
  });
}

export type ReceivePurchaseInput = {
  supplierId: string;
  warehouseId: string;
  productId: string;
  quantity: number;
  unitCost: number;
  userId: string;
  notes?: string;
};

/** MVP simplification: one product per purchase, received immediately (no
 * DRAFT/SENT/PARTIALLY_RECEIVED order lifecycle) — see docs/roadmap.md. */
export async function receivePurchase(input: ReceivePurchaseInput) {
  return prisma.$transaction(async (tx) => {
    const po = await tx.purchaseOrder.create({
      data: {
        supplierId: input.supplierId,
        warehouseId: input.warehouseId,
        status: "RECEIVED",
        createdById: input.userId,
        items: {
          create: [
            {
              productId: input.productId,
              quantity: input.quantity,
              unitCost: input.unitCost,
              receivedQty: input.quantity,
            },
          ],
        },
      },
    });

    const receipt = await tx.goodsReceipt.create({
      data: {
        poId: po.id,
        warehouseId: input.warehouseId,
        receivedById: input.userId,
        items: { create: [{ productId: input.productId, quantity: input.quantity }] },
      },
    });

    await tx.stockMovement.create({
      data: {
        type: "RECEIPT_IN",
        productId: input.productId,
        warehouseId: input.warehouseId,
        quantity: input.quantity,
        userId: input.userId,
        notes: input.notes || null,
        referenceType: "GOODS_RECEIPT",
        referenceId: receipt.id,
      },
    });

    await applyBalanceDelta(tx, input.productId, input.warehouseId, input.quantity);

    return { purchaseOrder: po, receipt };
  });
}
