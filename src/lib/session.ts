import "server-only";
import { auth } from "@/lib/auth";
import { Role, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface SessionUser {
  id: string;
  name: string | null | undefined;
  phone: string;
  role: Role;
  status: UserStatus;
}

/**
 * Server-side session guard with real-time database verification.
 * Verifies active session, confirms user existence in DB, enforces account status (active vs suspended),
 * and checks role authorization.
 *
 * @param allowedRoles - Array of roles that may call this action. If empty, any active authenticated user is allowed.
 */
export async function requireSession(
  allowedRoles: Role[] = []
): Promise<SessionUser> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("UNAUTHENTICATED");
  }

  const sessionUser = session.user as unknown as { id: string };

  // Real-time DB lookup ensures immediate revocation for suspended users
  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      status: true,
    },
  });

  if (!dbUser) {
    throw new Error("UNAUTHENTICATED");
  }

  if (dbUser.status === UserStatus.SUSPENDED) {
    throw new Error("ACCOUNT_SUSPENDED");
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
    throw new Error(`UNAUTHORIZED: requires ${allowedRoles.join(" or ")} role`);
  }

  return dbUser;
}
