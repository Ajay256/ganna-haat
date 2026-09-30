"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import {
  Wheat,
  Store,
  Gavel,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Truck,
  CheckCircle2,
  Coins,
  MapPin,
} from "lucide-react";
import { SUGARCANE_VARIETIES } from "@/lib/constants/varieties";

export default function HomePage() {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cane-900 via-cane-800 to-cane-950 text-white p-8 sm:p-12 lg:p-16 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cane-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-jaggery-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-cane-200">
            <span className="w-2 h-2 rounded-full bg-cane-400 animate-pulse" />
            {language === "hi"
              ? "पेराई सत्र 2026-27: लाइव गन्ना नीलामी चालू है"
              : "Crushing Season 2026-27: Live Sugarcane Bidding Active"}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            {t.tagline}
          </h1>

          <p className="text-base sm:text-lg text-cane-200 max-w-2xl leading-relaxed">
            {t.subTagline}।{" "}
            {language === "hi"
              ? "बिचौलियों से मुक्ति, पारदर्शी बोलियाँ और तौल के तुरंत बाद सीधा भुगतान।"
              : "Direct farmer-to-mill auction with zero middlemen, fair bidding, and prompt settlement."}
          </p>

          {/* Dual CTAs for Farmer & Buyer */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/farmer/listings/new"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-cane-500 to-cane-400 hover:from-cane-400 hover:to-cane-300 text-cane-950 font-black text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              <Wheat className="w-5 h-5 text-cane-950" />
              <span>{t.nav.newListing} ({t.roles.farmer})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/buyer/marketplace"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-base backdrop-blur-md transition-all"
            >
              <Store className="w-5 h-5 text-cane-300" />
              <span>{t.nav.marketplace} ({t.roles.buyer})</span>
            </Link>
          </div>
        </div>

        {/* Live Mini Stats Banner */}
        <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6 text-white">
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-cane-300">
              ₹385 - 410
            </span>
            <span className="text-xs text-cane-300">
              {language === "hi" ? "आज का औसत भाव (₹/क्विंटल)" : "Today's Avg Price (₹/q)"}
            </span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-cane-300">
              5,400+
            </span>
            <span className="text-xs text-cane-300">
              {language === "hi" ? "क्विंटल लाइव बोली में" : "Quintals in Live Auction"}
            </span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-cane-300">
              100%
            </span>
            <span className="text-xs text-cane-300">
              {language === "hi" ? "सत्यापित चीनी मिलें व कोल्हू" : "Verified Mills & Crushers"}
            </span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black text-cane-300">
              12+
            </span>
            <span className="text-xs text-cane-300">
              {language === "hi" ? "सक्रिय गन्ना उत्पादक ज़िले" : "Active Sugarcane Districts"}
            </span>
          </div>
        </div>
      </section>

      {/* Value Proposition / 3 Key Benefits */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-cane-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-cane-100 flex items-center justify-center text-cane-700 mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-cane-950 mb-2">
            {language === "hi" ? "अधिकतम भाव की गारंटी" : "Highest Market Price"}
          </h3>
          <p className="text-sm text-cane-700 leading-relaxed">
            {language === "hi"
              ? "एक ही जगह पर कई मिलें व कोल्हू प्रतिस्पर्धी बोली लगाते हैं, जिससे किसान को अपनी फसल का श्रेष्ठ भाव मिलता है।"
              : "Multiple mills and crushers compete simultaneously, ensuring farmers obtain top market value for every quintal."}
          </p>
        </div>

        <div className="bg-white border border-cane-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-jaggery-100 flex items-center justify-center text-jaggery-700 mb-4">
            <Coins className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-cane-950 mb-2">
            {language === "hi" ? "पारदर्शी व सुरक्षित सौदा" : "Transparent & Safe Deals"}
          </h3>
          <p className="text-sm text-cane-700 leading-relaxed">
            {language === "hi"
              ? "किसान जब बोली स्वीकार करता है तभी सौदा पक्का होता है। कोई छुपा शुल्क नहीं, कोई अनावश्यक कटौती नहीं।"
              : "No deal is locked until the farmer approves the bid. Zero hidden fees and zero unnecessary weighment deductions."}
          </p>
        </div>

        <div className="bg-white border border-cane-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-cane-100 flex items-center justify-center text-cane-700 mb-4">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-cane-950 mb-2">
            {language === "hi" ? "सीधा खेत से उठान" : "Direct Farm Pickup"}
          </h3>
          <p className="text-sm text-cane-700 leading-relaxed">
            {language === "hi"
              ? "खरीदार सीधे खेत या नजदीकी सेंटर से ट्रॉली/ट्रक द्वारा उठान का प्रबंध करते हैं, किसान का परिवहन खर्च बचता है।"
              : "Buyers arrange vehicle pickup directly from field or center, minimizing farmer freight handling and logistics delay."}
          </p>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-cane-50/70 border border-cane-200 rounded-3xl p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-cane-950 tracking-tight">
            {language === "hi" ? "गन्ना हाट कैसे काम करता है?" : "How GannaHaat Works"}
          </h2>
          <p className="text-sm text-cane-700 mt-2">
            {language === "hi"
              ? "सरल 4 चरणों में अपनी गन्ने की फसल बेचें या खरीदें"
              : "Sell or purchase sugarcane harvest in 4 simple transparent steps"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-cane-200 shadow-xs relative">
            <span className="w-8 h-8 rounded-full bg-cane-700 text-white font-bold flex items-center justify-center text-sm mb-3">
              1
            </span>
            <h4 className="font-bold text-cane-950 mb-1">
              {language === "hi" ? "फसल सूचीबद्ध करें" : "List Your Crop"}
            </h4>
            <p className="text-xs text-cane-600 leading-relaxed">
              {language === "hi"
                ? "किसान मात्रा (क्विंटल), किस्म (Co 0238 आदि), स्थान व अपेक्षित भाव दर्ज करते हैं।"
                : "Farmer specifies quantity, variety, farm location and expected reserve price."}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-cane-200 shadow-xs relative">
            <span className="w-8 h-8 rounded-full bg-cane-700 text-white font-bold flex items-center justify-center text-sm mb-3">
              2
            </span>
            <h4 className="font-bold text-cane-950 mb-1">
              {language === "hi" ? "सत्यापन व लाइव मंडी" : "Admin Verification"}
            </h4>
            <p className="text-xs text-cane-600 leading-relaxed">
              {language === "hi"
                ? "एडमिन द्वारा गुणवत्ता व भाव सत्यापन के बाद लिस्टिंग लाइव मंडी में प्रदर्शित होती है।"
                : "After quick sanity check by admin, listing goes live on the marketplace."}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-cane-200 shadow-xs relative">
            <span className="w-8 h-8 rounded-full bg-cane-700 text-white font-bold flex items-center justify-center text-sm mb-3">
              3
            </span>
            <h4 className="font-bold text-cane-950 mb-1">
              {language === "hi" ? "खरीदारों की बोलियाँ" : "Buyers Place Bids"}
            </h4>
            <p className="text-xs text-cane-600 leading-relaxed">
              {language === "hi"
                ? "चीनी मिलें, खांडसारी व कोल्हू मालिक प्रति क्विंटल अपनी प्रतिस्पर्धी बोली लगाते हैं।"
                : "Sugar mills and jaggery crushers inspect details and place competitive bids."}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-cane-200 shadow-xs relative">
            <span className="w-8 h-8 rounded-full bg-cane-700 text-white font-bold flex items-center justify-center text-sm mb-3">
              4
            </span>
            <h4 className="font-bold text-cane-950 mb-1">
              {language === "hi" ? "सौदा स्वीकार व उठान" : "Accept & Dispatch"}
            </h4>
            <p className="text-xs text-cane-600 leading-relaxed">
              {language === "hi"
                ? "किसान उत्तम बोली स्वीकार करते हैं, संपर्क अनलॉक होता है और गन्ने का उठान होता है।"
                : "Farmer accepts top bid, contact details are shared, and dispatch commences."}
            </p>
          </div>
        </div>
      </section>

      {/* Popular Sugarcane Varieties Supported */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-cane-950">
              {language === "hi" ? "प्रमुख समर्थित गन्ना किस्में" : "Supported Sugarcane Varieties"}
            </h2>
            <p className="text-xs sm:text-sm text-cane-600 mt-1">
              {language === "hi"
                ? "उच्च शर्करा रिकवरी व अच्छी पैदावार वाली किस्में"
                : "High sugar recovery and commercial grade cane varieties"}
            </p>
          </div>
          <Link
            href="/buyer/marketplace"
            className="text-sm font-semibold text-cane-700 hover:text-cane-900 flex items-center gap-1"
          >
            {t.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUGARCANE_VARIETIES.slice(0, 6).map((variety) => (
            <div
              key={variety.code}
              className="bg-white border border-cane-200 rounded-xl p-4 shadow-xs hover:border-cane-400 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-cane-950 text-base">
                  {variety.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cane-100 text-cane-800 font-semibold">
                  {variety.maturity}
                </span>
              </div>
              <p className="text-xs text-cane-600 mb-3">{variety.recommendedFor}</p>
              <div className="flex items-center justify-between text-xs text-cane-700 pt-2 border-t border-cane-100">
                <span>
                  शर्करा रिकवरी: <strong>{variety.sugarRecovery}</strong>
                </span>
                <span>
                  पैदावार: <strong>{variety.yieldQuintalPerAcre} क्वि/एकड़</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
