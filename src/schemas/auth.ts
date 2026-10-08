import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "कृपया 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें (6-9 से शुरू)");

export const pinSchema = z
  .string()
  .trim()
  .regex(/^\d{4}$/, "पिन 4 अंकों की संख्या (उदा. 1234) होनी चाहिए");

export const loginSchema = z.object({
  phone: phoneSchema,
  pin: pinSchema,
});

export const farmerRegisterSchema = z.object({
  phone: phoneSchema,
  pin: pinSchema,
  name: z.string().trim().min(2, "कृपया अपना पूरा नाम दर्ज करें").max(100, "नाम 100 अक्षरों से अधिक नहीं हो सकता"),
  village: z.string().trim().min(2, "गाँव का नाम दर्ज करें").max(100, "गाँव का नाम 100 अक्षरों से अधिक नहीं हो सकता"),
  panchayat: z.string().trim().max(100).optional().nullable(),
  tehsil: z.string().trim().min(2, "तहसील / ब्लॉक दर्ज करें").max(100, "तहसील 100 अक्षरों से अधिक नहीं हो सकता"),
  district: z.string().trim().min(2, "ज़िला चुनें").max(100),
  totalLandAcres: z.coerce.number().positive("एकड़ संख्या मान्य होनी चाहिए").max(10000, "अधिकतम 10,000 एकड़").optional().nullable(),
});

export const buyerRegisterSchema = z.object({
  phone: phoneSchema,
  pin: pinSchema,
  name: z.string().trim().min(2, "संपर्क व्यक्ति का नाम दर्ज करें").max(100, "नाम 100 अक्षरों से अधिक नहीं हो सकता"),
  businessName: z.string().trim().min(2, "फर्म / मिल / कोल्हू का नाम दर्ज करें").max(150, "फर्म का नाम 150 अक्षरों से अधिक नहीं हो सकता"),
  businessType: z.enum([
    "SUGAR_MILL",
    "JAGGERY_CRUSHER_KOLHU",
    "KHANDSARI",
    "TRADER_COMMISSION_AGENT",
  ]),
  address: z.string().trim().min(3, "व्यापारिक स्थल का पता दर्ज करें").max(250, "पता 250 अक्षरों से अधिक नहीं हो सकता"),
  district: z.string().trim().min(2, "ज़िला चुनें").max(100),
  gstin: z
    .string()
    .trim()
    .max(15)
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "अमान्य GSTIN प्रारूप (15 अक्षर, उदा. 09AAAAA0000A1Z5)")
    .optional()
    .or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type FarmerRegisterInput = z.infer<typeof farmerRegisterSchema>;
export type BuyerRegisterInput = z.infer<typeof buyerRegisterSchema>;
