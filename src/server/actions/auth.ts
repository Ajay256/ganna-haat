"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  farmerRegisterSchema,
  buyerRegisterSchema,
  loginSchema,
  FarmerRegisterInput,
  BuyerRegisterInput,
  LoginInput,
} from "@/schemas/auth";
import { Role } from "@prisma/client";

export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    messageHi: string;
  };
};

export async function registerFarmerAction(
  input: FarmerRegisterInput
): Promise<ActionResult<{ userId: string }>> {
  try {
    const validated = farmerRegisterSchema.parse(input);

    // Check if phone already registered
    const existing = await prisma.user.findUnique({
      where: { phone: validated.phone },
    });

    if (existing) {
      return {
        success: false,
        error: {
          code: "PHONE_EXISTS",
          message: "Phone already exists",
          messageHi: "यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉगिन करें।",
        },
      };
    }

    const pinHash = await bcrypt.hash(validated.pin, 10);

    const user = await prisma.user.create({
      data: {
        phone: validated.phone,
        name: validated.name,
        pinHash,
        role: Role.FARMER,
        farmerProfile: {
          create: {
            village: validated.village,
            panchayat: validated.panchayat || null,
            tehsil: validated.tehsil,
            district: validated.district,
            totalLandAcres: validated.totalLandAcres || null,
          },
        },
      },
    });

    return {
      success: true,
      data: { userId: user.id },
    };
  } catch (err: unknown) {
    console.error("Farmer register error:", err);
    return {
      success: false,
      error: {
        code: "REGISTER_FAILED",
        message: err instanceof Error ? err.message : "Registration failed",
        messageHi: "पंजीकरण में त्रुटि आई। कृपया फ़ील्ड्स जांचें और पुनः प्रयास करें।",
      },
    };
  }
}

export async function registerBuyerAction(
  input: BuyerRegisterInput
): Promise<ActionResult<{ userId: string }>> {
  try {
    const validated = buyerRegisterSchema.parse(input);

    const existing = await prisma.user.findUnique({
      where: { phone: validated.phone },
    });

    if (existing) {
      return {
        success: false,
        error: {
          code: "PHONE_EXISTS",
          message: "Phone already exists",
          messageHi: "यह मोबाइल नंबर पहले से पंजीकृत है। कृपया लॉगिन करें।",
        },
      };
    }

    const pinHash = await bcrypt.hash(validated.pin, 10);

    const user = await prisma.user.create({
      data: {
        phone: validated.phone,
        name: validated.name,
        pinHash,
        role: Role.BUYER,
        buyerProfile: {
          create: {
            businessName: validated.businessName,
            businessType: validated.businessType,
            address: validated.address,
            district: validated.district,
            gstin: validated.gstin || null,
          },
        },
      },
    });

    return {
      success: true,
      data: { userId: user.id },
    };
  } catch (err: unknown) {
    console.error("Buyer register error:", err);
    return {
      success: false,
      error: {
        code: "REGISTER_FAILED",
        message: err instanceof Error ? err.message : "Registration failed",
        messageHi: "पंजीकरण में त्रुटि आई। कृपया फ़ील्ड्स जांचें और पुनः प्रयास करें।",
      },
    };
  }
}
