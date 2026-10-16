import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { JsonLd } from "@/components/shared/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gannahaat.online";

export const viewport: Viewport = {
  themeColor: "#166534",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "गन्ना हाट (GannaHaat) — भारत का डिजिटल गन्ना नीलामी मंच | Sugarcane Bidding Platform",
    template: "%s | GannaHaat",
  },
  description:
    "गन्ना हाट (GannaHaat) - भारत के गन्ना किसानों, चीनी मिलों और कोल्हू व्यापारियों के लिए अग्रणी डिजिटल नीलामी मंच। बिचौलियों से मुक्ति, पारदर्शी बोलियां और सुरक्षित व्यापार।",
  applicationName: "GannaHaat",
  authors: [{ name: "GannaHaat Team", url: siteUrl }],
  creator: "GannaHaat",
  publisher: "GannaHaat",
  category: "Agriculture & Commodity Trading",
  keywords: [
    "GannaHaat",
    "gannahaat",
    "गन्ना हाट",
    "Ganna Haat",
    "गन्नाहाट",
    "Sugarcane Bidding Platform",
    "गन्ना मंडी",
    "गन्ना भाव",
    "Sugarcane Auction India",
    "UP Sugarcane Rate",
    "Kisan Mandi",
    "Sugarcane Price Today",
    "चीनी मिल गन्ना खरीद",
    "डिजिटल गन्ना मंडी",
    "Crushing Season Sugarcane",
  ],
  alternates: {
    canonical: siteUrl,
    languages: {
      "hi-IN": siteUrl,
      "en-US": `${siteUrl}/?lang=en`,
    },
  },
  openGraph: {
    title: "गन्ना हाट (GannaHaat) — भारत का डिजिटल गन्ना नीलामी मंच",
    description:
      "सीधे खेत से मिल तक — उचित भाव, पारदर्शी नीलामी और त्वरित भुगतान। गन्ना किसानों और व्यापारियों का डिजिटल बाज़ार।",
    url: siteUrl,
    siteName: "GannaHaat",
    locale: "hi_IN",
    alternateLocale: ["en_IN", "en_US"],
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "GannaHaat Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "गन्ना हाट (GannaHaat) — Sugarcane Bidding Platform",
    description:
      "ग्रामीण भारत के गन्ना किसानों और चीनी मिल व्यापारियों के लिए डिजिटल नीलामी मंच।",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen flex flex-col bg-[#fcfdfa] text-cane-950 font-sans antialiased selection:bg-cane-200">
        <Providers>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
            <Footer />
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
