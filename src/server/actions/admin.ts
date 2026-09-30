"use server";

import { prisma } from "@/lib/prisma";
import { ListingStatus, UserStatus } from "@prisma/client";
import { ActionResult } from "./auth";
import { revalidatePath } from "next/cache";

export async function approveListingAction(
  listingId: string,
  adminId: string
): Promise<ActionResult> {
  try {
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.APPROVED,
        approvedById: adminId,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/listings");
    revalidatePath("/buyer/marketplace");

    return { success: true };
  } catch (err: unknown) {
    console.error("Approve listing error:", err);
    return {
      success: false,
      error: {
        code: "APPROVE_FAILED",
        message: err instanceof Error ? err.message : "Approval failed",
        messageHi: "लिस्टिंग अनुमोदन में समस्या आई।",
      },
    };
  }
}

export async function rejectListingAction(
  listingId: string,
  reason: string
): Promise<ActionResult> {
  try {
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.REJECTED,
        rejectionReason: reason || "अपूर्ण या संदिग्ध जानकारी के कारण अस्वीकृत",
      },
    });

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/listings");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: {
        code: "REJECT_FAILED",
        message: err instanceof Error ? err.message : "Rejection failed",
        messageHi: "लिस्टिंग अस्वीकार करने में समस्या आई।",
      },
    };
  }
}

export async function toggleUserStatusAction(
  userId: string,
  newStatus: UserStatus
): Promise<ActionResult> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: {
        code: "STATUS_UPDATE_FAILED",
        message: err instanceof Error ? err.message : "Status update failed",
        messageHi: "उपयोगकर्ता स्थिति बदलने में समस्या आई।",
      },
    };
  }
}
