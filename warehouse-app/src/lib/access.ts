import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { WarehouseRole } from "@/generated/prisma/client";

/**
 * Access model: a user's role is normally scoped per-warehouse via
 * `UserWarehouseAccess`. A user holding an ADMIN role on *any* warehouse is
 * treated as a global admin (sees and manages every warehouse) — see the
 * note in ../../docs/database-schema.md §1.
 */

export async function isGlobalAdmin(userId: string): Promise<boolean> {
  const count = await prisma.userWarehouseAccess.count({
    where: { userId, role: "ADMIN" },
  });
  return count > 0;
}

export type AccessibleWarehouse = {
  id: string;
  name: string;
  code: string;
  role: WarehouseRole;
};

/** Warehouses this user can see, with their effective role in each. */
export async function getAccessibleWarehouses(userId: string): Promise<AccessibleWarehouse[]> {
  if (await isGlobalAdmin(userId)) {
    const warehouses = await prisma.warehouse.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return warehouses.map((w) => ({ id: w.id, name: w.name, code: w.code, role: "ADMIN" as const }));
  }

  const access = await prisma.userWarehouseAccess.findMany({
    where: { userId, warehouse: { isActive: true } },
    include: { warehouse: true },
    orderBy: { warehouse: { name: "asc" } },
  });
  return access.map((a) => ({
    id: a.warehouse.id,
    name: a.warehouse.name,
    code: a.warehouse.code,
    role: a.role,
  }));
}

/** This user's effective role on one warehouse, or null if they have none. */
export async function getWarehouseRole(
  userId: string,
  warehouseId: string
): Promise<WarehouseRole | null> {
  if (await isGlobalAdmin(userId)) return "ADMIN";
  const access = await prisma.userWarehouseAccess.findUnique({
    where: { userId_warehouseId: { userId, warehouseId } },
  });
  return access?.role ?? null;
}

/**
 * Redirects to /dashboard if the user has no role on this warehouse, or a
 * role outside `allowedRoles` (when given). Returns the resolved role
 * otherwise, so callers can also branch on it.
 */
export async function requireWarehouseRole(
  userId: string,
  warehouseId: string,
  allowedRoles?: WarehouseRole[]
): Promise<WarehouseRole> {
  const role = await getWarehouseRole(userId, warehouseId);
  if (!role || (allowedRoles && !allowedRoles.includes(role))) {
    redirect("/dashboard");
  }
  return role;
}
