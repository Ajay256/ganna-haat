import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "गन्ना मंडी और लाइव बोलियाँ (Marketplace)",
  description:
    "गन्ना हाट की लाइव मंडी में किसानों द्वारा सूचीबद्ध गन्ने की विभिन्न किस्में (Co 0238, Co 0118, CoLk 94184 आदि) देखें और पारदर्शी बोली लगाएं।",
  keywords: [
    "Ganna Mandi",
    "Sugarcane Marketplace",
    "गन्ना बोली",
    "गन्ना रेट",
    "Ganna Live Bidding",
    "Co 0238 गन्ना",
  ],
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
