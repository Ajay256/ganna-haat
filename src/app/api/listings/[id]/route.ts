import { NextRequest, NextResponse } from "next/server";
import { getListingById } from "@/lib/data";
import { auth } from "@/lib/auth";
import { ListingStatus, Role } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Security fix (MEDIUM #11): IDOR protection — draft/pending/rejected listings only visible to owner or admin
  if (
    listing.status !== ListingStatus.APPROVED &&
    listing.status !== ListingStatus.SOLD
  ) {
    const session = await auth();
    const userId = session?.user?.id;
    const role = (session?.user as unknown as { role?: Role })?.role;

    if (!session || (listing.farmer.id !== userId && role !== Role.ADMIN)) {
      return NextResponse.json(
        { error: "Listing not found or pending verification" },
        { status: 404 }
      );
    }
  }

  return NextResponse.json(listing);
}
