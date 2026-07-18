import { cookies } from "next/headers";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

/**
 * Re-checks the DB on every call (memoized per request via React `cache`) so a
 * role change takes effect immediately, instead of waiting for the JWT to expire.
 */
export const getCurrentUser = cache(async () => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  return user;
});
