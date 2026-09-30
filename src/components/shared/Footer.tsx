"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Wheat, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-cane-950 text-cane-100 border-t border-cane-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-cane-600 flex items-center justify-center text-white">
                <Wheat className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {t.appName}
              </span>
            </div>
            <p className="text-sm text-cane-300 max-w-md leading-relaxed">
              {t.tagline}। {t.subTagline}।
            </p>
            <div className="flex items-center gap-2 text-xs text-cane-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-cane-400" />
              <span>प्रमाणीकृत व सुरक्षित नीलामी प्रणाली</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              त्वरित लिंक
            </h4>
            <ul className="space-y-2 text-sm text-cane-300">
              <li>
                <Link href="/buyer/marketplace" className="hover:text-white transition-colors">
                  {t.nav.marketplace}
                </Link>
              </li>
              <li>
                <Link href="/farmer/listings/new" className="hover:text-white transition-colors">
                  {t.nav.newListing}
                </Link>
              </li>
              <li>
                <Link href="/farmer/dashboard" className="hover:text-white transition-colors">
                  {t.nav.farmerDashboard}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  {t.nav.login}
                </Link>
              </li>
            </ul>
          </div>

          {/* Kisan Helpline */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              किसान सहायता केंद्र
            </h4>
            <div className="space-y-2 text-sm text-cane-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cane-400 shrink-0" />
                <span>हेल्पलाइन: 1800-GANNA-HAAT</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cane-400 shrink-0" />
                <span>मुज़फ़्फ़रनगर • मेरठ • बिजनौर • शामली</span>
              </div>
              <p className="text-xs text-cane-400 pt-1">
                सोमवार से शनिवार: सुबह 8:00 से शाम 7:00 तक
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-cane-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-cane-400">
          <p>© {new Date().getFullYear()} {t.appName} (GannaHaat). सर्वाधिकार सुरक्षित।</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            ग्रामीण भारत के गन्ना किसानों के लिए समर्पित <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
