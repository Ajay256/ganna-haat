"use server";

import { prisma } from "@/lib/prisma";
import { bidSchema, BidInput } from "@/schemas/bid";
import { ListingStatus, BidStatus, Role, Prisma } from "@prisma/client";
import { ActionResult } from "./auth";
import { requireSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function placeBidAction(
  input: BidInput
): Promise<ActionResult<{ bidId: string }>> {
  try {
    const session = await requireSession([Role.BUYER]);
    const buyerId = session.id;

    const validated = bidSchema.parse(input);

    const listing = await prisma.listing.findUnique({
      where: { id: validated.listingId },
    });

    if (!listing) {
      return {
        success: false,
        error: {
          code: "LISTING_NOT_FOUND",
          message: "Listing not found",
          messageHi: "यह गन्ने की लिस्टिंग उपलब्ध नहीं है।",
        },
      };
    }

    if (listing.status !== ListingStatus.APPROVED) {
      return {
        success: false,
        error: {
          code: "NOT_ACTIVE",
          message: "Listing is not open for bidding",
          messageHi: "यह लिस्टिंग अभी बोली के लिए सक्रिय नहीं है।",
        },
      };
    }

    // Security fix (HIGH #6): Block bidding on expired listings
    if (new Date(listing.expiresAt) <= new Date()) {
      return {
        success: false,
        error: {
          code: "LISTING_EXPIRED",
          message: "This listing has expired and is closed for bidding",
          messageHi: "इस लिस्टिंग की समयावधि समाप्त हो चुकी है, नई बोली स्वीकार नहीं होगी।",
        },
      };
    }

    // Check minimum price floor
    if (Number(validated.bidPricePerQuintal) < Number(listing.basePricePerQuintal)) {
      return {
        success: false,
        error: {
          code: "BELOW_BASE_PRICE",
          message: "Bid cannot be lower than base price",
          messageHi: `बोली दर किसान के न्यूनतम भाव (₹${listing.basePricePerQuintal}) से कम नहीं हो सकती।`,
        },
      };
    }

    // Prevent farmer from bidding on their own listing
    if (listing.farmerId === buyerId) {
      return {
        success: false,
        error: {
          code: "OWN_LISTING",
          message: "Cannot bid on your own listing",
          messageHi: "आप अपनी खुद की लिस्टिंग पर बोली नहीं लगा सकते।",
        },
      };
    }

    // Security fix (LOW #18): Precise Decimal multiplication for valuation
    const bidDecimal = new Prisma.Decimal(validated.bidPricePerQuintal);
    const totalAmount = bidDecimal.mul(listing.quantityQuintals);

    // Check if buyer already has an active bid on this listing
    const existingBid = await prisma.bid.findFirst({
      where: {
        listingId: listing.id,
        buyerId,
        status: BidStatus.PENDING,
      },
    });

    // Security fix (HIGH #9): Prevent bid shaving — revision must strictly increase
    if (
      existingBid &&
      Number(validated.bidPricePerQuintal) <= Number(existingBid.bidPricePerQuintal)
    ) {
      return {
        success: false,
        error: {
          code: "BID_NOT_HIGHER",
          message: `Revised bid must be higher than your existing pending bid (₹${existingBid.bidPricePerQuintal})`,
          messageHi: `संशोधित बोली आपकी पूर्व बोली (₹${existingBid.bidPricePerQuintal}) से अधिक होनी चाहिए।`,
        },
      };
    }

    let bidRecord;
    if (existingBid) {
      bidRecord = await prisma.bid.update({
        where: { id: existingBid.id },
        data: {
          bidPricePerQuintal: validated.bidPricePerQuintal,
          totalAmount,
          paymentTerms: validated.paymentTerms,
          notes: validated.notes || null,
        },
      });
    } else {
      bidRecord = await prisma.bid.create({
        data: {
          listingId: listing.id,
          buyerId,
          bidPricePerQuintal: validated.bidPricePerQuintal,
          totalAmount,
          paymentTerms: validated.paymentTerms,
          notes: validated.notes || null,
          status: BidStatus.PENDING,
        },
      });
    }

    revalidatePath(`/buyer/listings/${listing.id}`);
    revalidatePath("/buyer/my-bids");
    revalidatePath(`/farmer/listings/${listing.id}`);

    return {
      success: true,
      data: { bidId: bidRecord.id },
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
            message: "Only buyers can place bids",
            messageHi: "केवल खरीदार ही बोली लगा सकते हैं।",
          },
        };
      }
    }
    console.error("Place bid error:", err);
    return {
      success: false,
      error: {
        code: "BID_FAILED",
        message: "Failed to place bid. Please try again.",
        messageHi: "बोली सबमिट करने में समस्या आई। कृपया पुनः प्रयास करें।",
      },
    };
  }
}

export async function withdrawBidAction(bidId: string): Promise<ActionResult> {
  try {
    const session = await requireSession([Role.BUYER]);
    const buyerId = session.id;

    // Security fix (HIGH #10): Atomic update only if currently PENDING
    const result = await prisma.bid.updateMany({
      where: {
        id: bidId,
        buyerId,
        status: BidStatus.PENDING,
      },
      data: { status: BidStatus.WITHDRAWN },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: {
          code: "CANNOT_WITHDRAW",
          message: "Only pending bids can be withdrawn (it may have been accepted or already withdrawn).",
          messageHi: "केवल विचाराधीन बोलियों को ही वापस लिया जा सकता है।",
        },
      };
    }

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
        code: "WITHDRAW_FAILED",
        message: "Failed to withdraw bid",
        messageHi: "बोली वापस लेने में समस्या आई।",
      },
    };
  }
}
