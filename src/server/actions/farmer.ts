"use server";

import { prisma } from "@/lib/prisma";
import { listingSchema, ListingInput } from "@/schemas/listing";
import { ListingStatus, BidStatus, HarvestStatus } from "@prisma/client";
import { ActionResult } from "./auth";
import { revalidatePath } from "next/cache";

export async function createListingAction(
  farmerId: string,
  input: ListingInput
): Promise<ActionResult<{ listingId: string }>> {
  try {
    const validated = listingSchema.parse(input);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 10); // 10 days listing lifespan

    const listing = await prisma.listing.create({
      data: {
        farmerId,
        variety: validated.variety,
        quantityQuintals: validated.quantityQuintals,
        harvestStatus: validated.harvestStatus as HarvestStatus,
        harvestDate: validated.harvestDate ? new Date(validated.harvestDate) : null,
        basePricePerQuintal: validated.basePricePerQuintal,
        district: validated.district,
        tehsil: validated.tehsil,
        village: validated.village,
        landmark: validated.landmark || null,
        status: ListingStatus.PENDING_APPROVAL, // Admin approval queue
        expiresAt,
      },
    });

    revalidatePath("/farmer/dashboard");
    revalidatePath("/buyer/marketplace");

    return {
      success: true,
      data: { listingId: listing.id },
    };
  } catch (err: unknown) {
    console.error("Create listing error:", err);
    return {
      success: false,
      error: {
        code: "LISTING_CREATION_FAILED",
        message: err instanceof Error ? err.message : "Creation failed",
        messageHi: "गन्ना लिस्टिंग बनाने में समस्या आई। कृपया फ़ॉर्म विवरण जांचें।",
      },
    };
  }
}

export async function updateListingAction(
  listingId: string,
  farmerId: string,
  input: ListingInput
): Promise<ActionResult> {
  try {
    const validated = listingSchema.parse(input);

    // Verify ownership
    const existing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existing || existing.farmerId !== farmerId) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Not authorized to edit this listing",
          messageHi: "आप केवल अपनी गन्ने की लिस्टिंग में संशोधन कर सकते हैं।",
        },
      };
    }

    if (existing.status === ListingStatus.SOLD) {
      return {
        success: false,
        error: {
          code: "ALREADY_SOLD",
          message: "Listing already sold",
          messageHi: "यह फसल पहले ही बिक चुकी है, संशोधन संभव नहीं है।",
        },
      };
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        variety: validated.variety,
        quantityQuintals: validated.quantityQuintals,
        harvestStatus: validated.harvestStatus as HarvestStatus,
        basePricePerQuintal: validated.basePricePerQuintal,
        district: validated.district,
        tehsil: validated.tehsil,
        village: validated.village,
        landmark: validated.landmark || null,
      },
    });

    revalidatePath(`/farmer/listings/${listingId}`);
    revalidatePath("/farmer/dashboard");

    return { success: true };
  } catch (err: unknown) {
    console.error("Update listing error:", err);
    return {
      success: false,
      error: {
        code: "UPDATE_FAILED",
        message: err instanceof Error ? err.message : "Update failed",
        messageHi: "संशोधन में त्रुटि आई।",
      },
    };
  }
}

export async function deleteListingAction(
  listingId: string,
  farmerId: string
): Promise<ActionResult> {
  try {
    const existing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existing || existing.farmerId !== farmerId) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          messageHi: "अनधिकृत अनुरोध।",
        },
      };
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: { status: ListingStatus.CANCELLED },
    });

    revalidatePath("/farmer/dashboard");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: {
        code: "DELETE_FAILED",
        message: err instanceof Error ? err.message : "Delete failed",
        messageHi: "लिस्टिंग हटाने में त्रुटि आई।",
      },
    };
  }
}

// किसान द्वारा बोली स्वीकार करना (Deal Lockdown)
export async function acceptBidAction(
  bidId: string,
  farmerId: string
): Promise<ActionResult> {
  try {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: { listing: true },
    });

    if (!bid || bid.listing.farmerId !== farmerId) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized to accept this bid",
          messageHi: "आप केवल अपनी फसल पर आई बोली स्वीकार कर सकते हैं।",
        },
      };
    }

    if (bid.status !== BidStatus.PENDING) {
      return {
        success: false,
        error: {
          code: "INVALID_STATE",
          message: "Bid not in pending state",
          messageHi: "यह बोली पहले से प्रोसेस हो चुकी है।",
        },
      };
    }

    // Transaction: Accept this bid, mark listing as SOLD, reject other bids
    await prisma.$transaction([
      // 1. Accept selected bid
      prisma.bid.update({
        where: { id: bidId },
        data: { status: BidStatus.ACCEPTED },
      }),
      // 2. Mark listing as SOLD
      prisma.listing.update({
        where: { id: bid.listingId },
        data: { status: ListingStatus.SOLD },
      }),
      // 3. Reject other pending bids on this listing
      prisma.bid.updateMany({
        where: {
          listingId: bid.listingId,
          id: { not: bidId },
          status: BidStatus.PENDING,
        },
        data: { status: BidStatus.REJECTED },
      }),
    ]);

    revalidatePath(`/farmer/listings/${bid.listingId}`);
    revalidatePath("/farmer/dashboard");
    revalidatePath("/buyer/marketplace");
    revalidatePath("/buyer/my-bids");

    return { success: true };
  } catch (err: unknown) {
    console.error("Accept bid error:", err);
    return {
      success: false,
      error: {
        code: "ACCEPT_FAILED",
        message: err instanceof Error ? err.message : "Failed to accept bid",
        messageHi: "बोली स्वीकार करने में समस्या आई।",
      },
    };
  }
}

// किसान द्वारा बोली अस्वीकार करना
export async function rejectBidAction(
  bidId: string,
  farmerId: string
): Promise<ActionResult> {
  try {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
      include: { listing: true },
    });

    if (!bid || bid.listing.farmerId !== farmerId) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          messageHi: "अनधिकृत अनुरोध।",
        },
      };
    }

    await prisma.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.REJECTED },
    });

    revalidatePath(`/farmer/listings/${bid.listingId}`);
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: {
        code: "REJECT_FAILED",
        message: err instanceof Error ? err.message : "Failed to reject bid",
        messageHi: "बोली अस्वीकार करने में त्रुटि आई।",
      },
    };
  }
}
