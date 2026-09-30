import { z } from "zod";

export const bidSchema = z.object({
  listingId: z.string().min(1, "लिस्टिंग आईडी अनिवार्य है"),
  bidPricePerQuintal: z.coerce
    .number()
    .min(200, "बोली भाव ₹200 से कम नहीं हो सकता")
    .max(1200, "बोली भाव ₹1,200 से अधिक नहीं हो सकता"),
  paymentTerms: z
    .string()
    .trim()
    .min(3, "भुगतान की शर्त दर्ज करें (उदा. तौल पर नकद / 24 घंटे में बैंक ट्रांसफर)"),
  notes: z.string().trim().max(300, "टिप्पणी 300 अक्षरों से अधिक नहीं हो सकती").optional(),
});

export type BidInput = z.infer<typeof bidSchema>;
