import { NextResponse } from "next/server";
import { getBuyerDashboardData } from "@/lib/data";

export async function GET() {
  const buyer = await getBuyerDashboardData("9123456780");
  return NextResponse.json(buyer);
}
