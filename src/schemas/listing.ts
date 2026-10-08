import { z } from "zod";

export const listingSchema = z.object({
  variety: z.string().trim().min(2, "गन्ने की किस्म चुनना अनिवार्य है").max(100, "अधिकतम 100 अक्षर"),
  quantityQuintals: z.coerce
    .number()
    .min(10, "न्यूनतम गन्ने की मात्रा 10 क्विंटल होनी चाहिए")
    .max(50000, "अधिकतम 50,000 क्विंटल तक दर्ज किया जा सकता है"),
  harvestStatus: z.enum(["STANDING_CROP", "FRESHLY_CUT", "CUT_WITHIN_24HRS"] as const),
  harvestDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "कटाई तिथि YYYY-MM-DD प्रारूप में होनी चाहिए")
    .optional()
    .or(z.literal("")),
  basePricePerQuintal: z.coerce
    .number()
    .min(200, "न्यूनतम भाव ₹200 प्रति क्विंटल से कम नहीं हो सकता")
    .max(1000, "भाव ₹1,000 प्रति क्विंटल से अधिक नहीं हो सकता"),
  district: z.string().trim().min(2, "ज़िला चुनना अनिवार्य है").max(100),
  tehsil: z.string().trim().min(2, "तहसील / ब्लॉक दर्ज करें").max(100),
  village: z.string().trim().min(2, "गाँव का नाम दर्ज करें").max(100),
  landmark: z.string().trim().max(200, "लैंडमार्क 200 अक्षरों से अधिक नहीं हो सकता").optional().or(z.literal("")),
});

export type ListingInput = z.infer<typeof listingSchema>;
