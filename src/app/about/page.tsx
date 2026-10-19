import type { Metadata } from "next";
import { AboutClient } from "./AboutClient";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gannahaat.online";

export const metadata: Metadata = {
  title: "हमारे बारे में — गन्ना हाट (About GannaHaat) | भारत का डिजिटल गन्ना नीलामी मंच",
  description:
    "जानिए गन्ना हाट (GannaHaat) के बारे में — भारत के गन्ना किसानों, चीनी मिलों और कोल्हू व्यापारियों को पारदर्शी बोली, सही तौल और त्वरित भुगतान से जोड़ने वाला डिजिटल कृषि मंच।",
  alternates: {
    canonical: `${siteUrl}/about`,
    languages: {
      "hi-IN": `${siteUrl}/about?lang=hi`,
      "en-US": `${siteUrl}/about?lang=en`,
    },
  },
  openGraph: {
    title: "गन्ना हाट (GannaHaat) के बारे में — खेत से मिल तक पारदर्शी व्यापार",
    description:
      "बिचौलियों से मुक्ति, डिजिटल तौल पर्ची और पारदर्शी खुली नीलामी। जानिए गन्ना हाट का विजन और किसानों के हित में की गई पहल।",
    url: `${siteUrl}/about`,
    siteName: "GannaHaat",
    locale: "hi_IN",
    type: "website",
    images: [
      {
        url: "/images/sugar-cane-field-ripe-harvest_843560-3447.avif",
        width: 1200,
        height: 630,
        alt: "गन्ना हाट — डिजिटल कृषि मंच",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About GannaHaat — Sugarcane Bidding Platform",
    description:
      "Empowering sugarcane farmers and mills across India with digital auctions, fair weighment, and direct payments.",
    images: ["/images/sugar-cane-field-ripe-harvest_843560-3447.avif"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
