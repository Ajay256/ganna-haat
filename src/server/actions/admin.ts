"use server";

import { prisma } from "@/lib/prisma";
import { ListingStatus, UserStatus, Role } from "@prisma/client";
import { ActionResult } from "./auth";
import { requireSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function approveListingAction(
  listingId: string
): Promise<ActionResult> {
  try {
    const session = await requireSession([Role.ADMIN]);
    const adminId = session.id;

    // Security fix (MEDIUM #17): Restrict approval strictly to PENDING_APPROVAL listings
    const result = await prisma.listing.updateMany({
      where: {
        id: listingId,
        status: ListingStatus.PENDING_APPROVAL,
      },
      data: {
        status: ListingStatus.APPROVED,
        approvedById: adminId,
        approvedAt: new Date(),
        rejectionReason: null,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: {
          code: "CANNOT_APPROVE",
          message: "Only listings awaiting verification can be approved",
          messageHi: "केवल सत्यापन हेतु लंबित लिस्टिंग ही अनुमोदित की जा सकती हैं।",
        },
      };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/listings");
    revalidatePath("/buyer/marketplace");

    return { success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === "UNAUTHENTICATED") {
        return {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Please log in as an administrator",
            messageHi: "कृपया पहले व्यवस्थापक लॉगिन करें।",
          },
        };
      }
      if (err.message.startsWith("UNAUTHORIZED")) {
        return {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Administrator access required",
            messageHi: "केवल व्यवस्थापक ही लिस्टिंग अनुमोदित कर सकते हैं।",
          },
        };
      }
    }
    console.error("Approve listing error:", err);
    return {
      success: false,
      error: {
        code: "APPROVE_FAILED",
        message: "Failed to approve listing",
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
    await requireSession([Role.ADMIN]);

    // Input sanitization: Trim and truncate reason to 250 characters
    const sanitizedReason = (reason || "")
      .trim()
      .slice(0, 250) || "अपूर्ण या संदिग्ध जानकारी के कारण अस्वीकृत";

    // Only listings currently awaiting verification can be rejected
    const result = await prisma.listing.updateMany({
      where: {
        id: listingId,
        status: ListingStatus.PENDING_APPROVAL,
      },
      data: {
        status: ListingStatus.REJECTED,
        rejectionReason: sanitizedReason,
      },
    });

    if (result.count === 0) {
      return {
        success: false,
        error: {
          code: "CANNOT_REJECT",
          message: "Only listings pending approval can be rejected",
          messageHi: "केवल सत्यापन हेतु लंबित लिस्टिंग ही अस्वीकार की जा सकती हैं।",
        },
      };
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/listings");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: {
        code: "REJECT_FAILED",
        message: "Failed to reject listing",
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
    const session = await requireSession([Role.ADMIN]);

    // Admin cannot suspend themselves
    if (userId === session.id && newStatus === UserStatus.SUSPENDED) {
      return {
        success: false,
        error: {
          code: "SELF_SUSPEND",
          message: "Cannot suspend your own account",
          messageHi: "आप अपना स्वयं का खाता निलंबित नहीं कर सकते।",
        },
      };
    }

    // Security fix (MEDIUM #16): Prevent suspension of peer administrators
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (targetUser?.role === Role.ADMIN && newStatus === UserStatus.SUSPENDED) {
      return {
        success: false,
        error: {
          code: "CANNOT_SUSPEND_ADMIN",
          message: "Administrator accounts cannot be suspended directly",
          messageHi: "व्यवस्थापक (Admin) खाते को निलंबित नहीं किया जा सकता।",
        },
      };
    }

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
        message: "Failed to update user status",
        messageHi: "उपयोगकर्ता स्थिति बदलने में समस्या आई।",
      },
    };
  }
}
