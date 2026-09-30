"use server";

import { prisma } from "@/lib/prisma";
import { bidSchema, BidInput } from "@/schemas/bid";
import { ListingStatus, BidStatus } from "@prisma/client";
import { ActionResult } from "./auth";
import { revalidatePath } from "next/cache";

export async function placeBidAction(
  buyerId: string,
  input: BidInput
): Promise<ActionResult<{ bidId: string }>> {
  try {
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

    const totalAmount =
      Number(validated.bidPricePerQuintal) * Number(listing.quantityQuintals);

    // Check if buyer already has an active bid on this listing
    const existingBid = await prisma.bid.findFirst({
      where: {
        listingId: listing.id,
        buyerId,
        status: BidStatus.PENDING,
      },
    });

    let bidRecord;
    if (existingBid) {
      // Update existing bid to higher amount
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
    console.error("Place bid error:", err);
    return {
      success: false,
      error: {
        code: "BID_FAILED",
        message: err instanceof Error ? err.message : "Failed to place bid",
        messageHi: "बोली सबमिट करने में समस्या आई। कृपया पुनः प्रयास करें।",
      },
    };
  }
}

export async function withdrawBidAction(
  bidId: string,
  buyerId: string
): Promise<ActionResult> {
  try {
    const bid = await prisma.bid.findUnique({
      where: { id: bidId },
    });

    if (!bid || bid.buyerId !== buyerId) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          messageHi: "अनधिकृत अनुरोध।",
        },
      };
    }

    if (bid.status !== BidStatus.PENDING) {
      return {
        success: false,
        error: {
          code: "CANNOT_WITHDRAW",
          message: "Only pending bids can be withdrawn",
          messageHi: "केवल विचाराधीन बोलियों को ही वापस लिया जा सकता है।",
        },
      };
    }

    await prisma.bid.update({
      where: { id: bidId },
      data: { status: BidStatus.WITHDRAWN },
    });

    revalidatePath("/buyer/my-bids");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: {
        code: "WITHDRAW_FAILED",
        message: err instanceof Error ? err.message : "Failed to withdraw",
        messageHi: "बोली वापस लेने में समस्या आई।",
      },
    };
  }
}
