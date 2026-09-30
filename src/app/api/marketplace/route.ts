import { NextRequest, NextResponse } from "next/server";
import { getMarketplaceListings } from "@/lib/data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district") || undefined;
  const variety = searchParams.get("variety") || undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;

  const listings = await getMarketplaceListings({
    district,
    variety,
    maxPrice,
  });

  return NextResponse.json(listings);
}
