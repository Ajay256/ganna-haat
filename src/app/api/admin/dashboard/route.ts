import { NextResponse } from "next/server";
import { getAdminDashboardData } from "@/lib/data";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const role = (session.user as unknown as { role: Role }).role;
  if (role !== Role.ADMIN) {
    return NextResponse.json({ error: "Forbidden — Admin only" }, { status: 403 });
  }

  const data = await getAdminDashboardData();
  return NextResponse.json(data);
}
