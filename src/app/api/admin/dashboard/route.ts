import { NextResponse } from "next/server";
import { getAdminDashboardData } from "@/lib/data";

export async function GET() {
  const data = await getAdminDashboardData();
  return NextResponse.json(data);
}
