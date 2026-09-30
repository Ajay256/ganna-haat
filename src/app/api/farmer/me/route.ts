import { NextResponse } from "next/server";
import { getFarmerDashboardData } from "@/lib/data";

export async function GET() {
  // Return the seeded demo farmer or authenticated user
  const farmer = await getFarmerDashboardData("9876543210");
  return NextResponse.json(farmer);
}
