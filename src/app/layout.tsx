import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "गन्ना हाट (GannaHaat) — Sugarcane Bidding Platform",
  description:
    "ग्रामीण भारत के गन्ना किसानों और चीनी मिल/कोल्हू व्यापारियों के लिए पूर्णतः हिंदी व अंग्रेज़ी में डिजिटल नीलामी मंच।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
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
