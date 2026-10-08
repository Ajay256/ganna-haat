import { NextResponse } from "next/server";
import { getBuyerDashboardData } from "@/lib/data";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const role = (session.user as unknown as { role: Role }).role;
  if (role !== Role.BUYER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const phone = (session.user as unknown as { phone: string }).phone;
  const buyer = await getBuyerDashboardData(phone);
  return NextResponse.json(buyer);
}
