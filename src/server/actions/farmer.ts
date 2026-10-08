"use server";

import { prisma } from "@/lib/prisma";
import { listingSchema, ListingInput } from "@/schemas/listing";
import { ListingStatus, BidStatus, HarvestStatus, Role } from "@prisma/client";
import { ActionResult } from "./auth";
import { requireSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createListingAction(
  input: ListingInput
): Promise<ActionResult<{ listingId: string }>> {
  try {
    const session = await requireSession([Role.FARMER]);
    const farmerId = session.id;

    const validated = listingSchema.parse(input);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 10); // 10-day listing lifespan

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
        status: ListingStatus.PENDING_APPROVAL,
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
    if (err instanceof Error) {
      if (err.message === "UNAUTHENTICATED") {
        return {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Please log in first",
            messageHi: "कृपया पहले लॉगिन करें।",
          },
        };
      }
      if (err.message === "ACCOUNT_SUSPENDED") {
        return {
          success: false,
          error: {
            code: "ACCOUNT_SUSPENDED",
            message: "Your account is suspended. Please contact support.",
            messageHi: "यह खाता सुरक्षा कारणों से निलंबित है। कृपया सहायता केंद्र से संपर्क करें।",
          },
        };
      }
      if (err.message.startsWith("UNAUTHORIZED")) {
        return {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Only farmers can create listings",
            messageHi: "केवल किसान ही गन्ना लिस्टिंग बना सकते हैं।",
          },
        };
      }
    }
    console.error("Create listing error:", err);
    return {
      success: false,
      error: {
        code: "LISTING_CREATION_FAILED",
        message: "Failed to create listing. Please check the inputs.",
        messageHi: "गन्ना लिस्टिंग बनाने में समस्या आई। कृपया फ़ॉर्म विवरण जांचें।",
      },
    };
  }
}

export async function updateListingAction(
  listingId: string,
  input: ListingInput
): Promise<ActionResult> {
  try {
    const session = await requireSession([Role.FARMER]);
    const farmerId = session.id;

    const validated = listingSchema.parse(input);

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
          message: "Listing already sold, cannot be edited",
          messageHi: "यह फसल पहले ही बिक चुकी है, संशोधन संभव नहीं है।",
        },
      };
    }

    if (existing.status === ListingStatus.CANCELLED) {
      return {
        success: false,
        error: {
          code: "ALREADY_CANCELLED",
          message: "Cancelled listing cannot be edited",
          messageHi: "रद्द की गई लिस्टिंग में संशोधन संभव नहीं है।",
        },
      };
    }

    // Security fix (Issue #7): If listing was previously APPROVED, any edit requires re-verification by admin
    const nextStatus =
      existing.status === ListingStatus.APPROVED
        ? ListingStatus.PENDING_APPROVAL
        : existing.status;

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
        status: nextStatus,
      },
    });

    revalidatePath(`/farmer/listings/${listingId}`);
    revalidatePath("/farmer/dashboard");
    revalidatePath("/buyer/marketplace");

    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "ACCOUNT_SUSPENDED") {
        return {
          success: false,
          error: {
            code: "ACCOUNT_SUSPENDED",
            message: "Account suspended",
            messageHi: "यह खाता सुरक्षा कारणों से निलंबित है।",
          },
        };
      }
    }
    console.error("Update listing error:", err);
    return {
      success: false,
      error: {
        code: "UPDATE_FAILED",
        message: "Update failed",
        messageHi: "संशोधन में त्रुटि आई।",
      },
    };
  }
}

export async function deleteListingAction(listingId: string): Promise<ActionResult> {
  try {
    const session = await requireSession([Role.FARMER]);
    const farmerId = session.id;

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

    // Security fix (Issue #8): Cannot cancel an already sold listing
    if (existing.status === ListingStatus.SOLD) {
      return {
        success: false,
        error: {
          code: "ALREADY_SOLD",
          message: "Cannot cancel an already sold listing",
          messageHi: "बिक चुकी फसल की लिस्टिंग रद्द नहीं की जा सकती।",
        },
      };
    }

    // Atomically cancel listing and reject all orphaned pending bids
    await prisma.$transaction([
      prisma.listing.update({
        where: { id: listingId },
        data: { status: ListingStatus.CANCELLED },
      }),
      prisma.bid.updateMany({
        where: {
          listingId,
          status: BidStatus.PENDING,
        },
        data: { status: BidStatus.REJECTED },
      }),
    ]);

    revalidatePath("/farmer/dashboard");
    revalidatePath("/buyer/marketplace");
    revalidatePath("/buyer/my-bids");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "ACCOUNT_SUSPENDED") {
      return {
        success: false,
        error: {
          code: "ACCOUNT_SUSPENDED",
          message: "Account suspended",
          messageHi: "यह खाता सुरक्षा कारणों से निलंबित है।",
        },
      };
    }
    return {
      success: false,
      error: {
        code: "DELETE_FAILED",
        message: "Failed to delete listing",
        messageHi: "लिस्टिंग हटाने में त्रुटि आई।",
      },
    };
  }
}

// किसान द्वारा बोली स्वीकार करना (Deal Lockdown) - Race condition safe
export async function acceptBidAction(bidId: string): Promise<ActionResult> {
  try {
    const session = await requireSession([Role.FARMER]);
    const farmerId = session.id;

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

    // Security Fix (CRITICAL #4): Interactive atomic transaction prevents race conditions and double-selling
    await prisma.$transaction(async (tx) => {
      // 1. Atomically lock and transition listing status from APPROVED to SOLD
      const listingUpdate = await tx.listing.updateMany({
        where: {
          id: bid.listingId,
          farmerId,
          status: ListingStatus.APPROVED,
        },
        data: { status: ListingStatus.SOLD },
      });

      if (listingUpdate.count === 0) {
        throw new Error("LISTING_NOT_AVAILABLE");
      }

      // 2. Atomically lock and transition bid status from PENDING to ACCEPTED
      const bidUpdate = await tx.bid.updateMany({
        where: {
          id: bidId,
          listingId: bid.listingId,
          status: BidStatus.PENDING,
        },
        data: { status: BidStatus.ACCEPTED },
      });

      if (bidUpdate.count === 0) {
        throw new Error("BID_NOT_PENDING");
      }

      // 3. Atomically reject all other pending bids on this listing
      await tx.bid.updateMany({
        where: {
          listingId: bid.listingId,
          id: { not: bidId },
          status: BidStatus.PENDING,
        },
        data: { status: BidStatus.REJECTED },
      });
    });

    revalidatePath(`/farmer/listings/${bid.listingId}`);
    revalidatePath("/farmer/dashboard");
    revalidatePath("/buyer/marketplace");
    revalidatePath("/buyer/my-bids");

    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "ACCOUNT_SUSPENDED") {
        return {
          success: false,
          error: {
            code: "ACCOUNT_SUSPENDED",
            message: "Account suspended",
            messageHi: "यह खाता सुरक्षा कारणों से निलंबित है।",
          },
        };
      }
      if (err.message === "LISTING_NOT_AVAILABLE") {
        return {
          success: false,
          error: {
            code: "LISTING_NOT_AVAILABLE",
            message: "This listing is no longer open for bidding or was already sold.",
            messageHi: "यह फसल पहले से बिक चुकी है या अब उपलब्ध नहीं है।",
          },
        };
      }
      if (err.message === "BID_NOT_PENDING") {
        return {
          success: false,
          error: {
            code: "BID_NOT_PENDING",
            message: "This bid is no longer pending.",
            messageHi: "यह बोली अब विचाराधीन नहीं है।",
          },
        };
      }
    }
    console.error("Accept bid error:", err);
    return {
      success: false,
      error: {
        code: "ACCEPT_FAILED",
        message: "Failed to accept bid",
        messageHi: "बोली स्वीकार करने में समस्या आई।",
      },
    };
  }
}

// किसान द्वारा बोली अस्वीकार करना
export async function rejectBidAction(bidId: string): Promise<ActionResult> {
  try {
    const session = await requireSession([Role.FARMER]);
    const farmerId = session.id;

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

    // Atomic update only if bid is currently PENDING
    const result = await prisma.bid.updateMany({
      where: {
        id: bidId,
        listingId: bid.listingId,
        status: BidStatus.PENDING,
      },
      data: { status: BidStatus.REJECTED },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: {
          code: "CANNOT_REJECT",
          message: "Only pending bids can be rejected",
          messageHi: "केवल विचाराधीन बोलियों को ही अस्वीकार किया जा सकता है।",
        },
      };
    }

    revalidatePath(`/farmer/listings/${bid.listingId}`);
    revalidatePath("/farmer/dashboard");
    revalidatePath("/buyer/my-bids");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "ACCOUNT_SUSPENDED") {
      return {
        success: false,
        error: {
          code: "ACCOUNT_SUSPENDED",
          message: "Account suspended",
          messageHi: "यह खाता सुरक्षा कारणों से निलंबित है।",
        },
      };
    }
    return {
      success: false,
      error: {
        code: "REJECT_FAILED",
        message: "Failed to reject bid",
        messageHi: "बोली अस्वीकार करने में त्रुटि आई।",
      },
    };
  }
}
