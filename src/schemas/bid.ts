import { z } from "zod";

export const bidSchema = z.object({
  listingId: z.string().trim().min(1, "लिस्टिंग आईडी अनिवार्य है").max(50),
  bidPricePerQuintal: z.coerce
    .number()
    .min(200, "बोली भाव ₹200 से कम नहीं हो सकता")
    .max(5000, "बोली भाव ₹5,000 प्रति क्विंटल से अधिक नहीं हो सकता"),
  paymentTerms: z
    .string()
    .trim()
    .min(3, "भुगतान की शर्त दर्ज करें")
    .max(200, "भुगतान शर्तें 200 अक्षरों से अधिक नहीं हो सकती"),
  notes: z
    .string()
    .trim()
    .max(300, "टिप्पणी 300 अक्षरों से अधिक नहीं हो सकती")
    .optional()
    .or(z.literal("")),
});

export type BidInput = z.infer<typeof bidSchema>;
