"use client";

import React from "react";
import Image from "next/image";
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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cane-950 via-cane-900 to-cane-950 text-white p-6 sm:p-10 lg:p-14 shadow-xl border border-cane-800/60">
        {/* Ambient Sugarcane Field Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/sugar-cane-field-ripe-harvest_843560-3447.avif"
            alt={language === "hi" ? "लहलहाता गन्ना खेत" : "Lush sugarcane crop"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-25 mix-blend-luminosity scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cane-950 via-cane-900/90 to-cane-950/80" />
        </div>

        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cane-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-jaggery-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-cane-200">
              <span className="w-2 h-2 rounded-full bg-cane-400 animate-pulse" />
              {language === "hi"
                ? "पेराई सत्र 2026-27: लाइव गन्ना नीलामी चालू है"
                : "Crushing Season 2026-27: Live Sugarcane Bidding Active"}
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.tagline}
            </h1>

            <p className="text-base sm:text-lg text-cane-200 max-w-2xl leading-relaxed">
              {t.subTagline}।{" "}
              {language === "hi"
                ? "बिचौलियों से मुक्ति, पारदर्शी बोलियाँ और तौल के तुरंत बाद सीधा भुगतान।"
                : "Direct farmer-to-mill auction with zero middlemen, fair bidding, and prompt settlement."}
            </p>

            {/* Dual CTAs for Farmer & Buyer */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
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

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-cane-950/40 backdrop-blur-sm group">
              <Image
                src="/images/sugar-cane-field-ripe-harvest_843560-3447.avif"
                alt={
                  language === "hi"
                    ? "लहलहाता गन्ने का खेत व लाइव नीलामी"
                    : "Lush sugarcane crop ready for harvest"
                }
                width={996}
                height={558}
                priority
                className="w-full h-64 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cane-950 via-cane-950/20 to-transparent" />

              {/* Floating Pill Top */}
              <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-cane-950 text-xs font-bold shadow-md">
                <span className="w-2 h-2 rounded-full bg-cane-600 animate-ping" />
                <span>
                  {language === "hi"
                    ? "ताजा फसल • खेत से सीधा उठाव"
                    : "Fresh Harvest • Direct Field Pickup"}
                </span>
              </div>

              {/* Floating Info Bottom */}
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-cane-950/85 backdrop-blur-md border border-white/15 text-white flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-cane-300 font-medium">
                    {language === "hi" ? "शर्करा रिकवरी" : "Sugar Recovery"}
                  </p>
                  <p className="text-sm font-black text-white">11.5% — 12.8%</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-cane-300 font-medium">
                    {language === "hi" ? "प्रमुख किस्में" : "Top Varieties"}
                  </p>
                  <p className="text-sm font-black text-cane-300">Co 0238, Co 0118</p>
                </div>
              </div>
            </div>
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

      {/* Farm to Mill Direct Harvest Showcase */}
      <section className="bg-white border border-cane-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-6 relative min-h-[320px] sm:min-h-[400px] lg:min-h-full">
            <Image
              src="/images/maxresdefault.jpg"
              alt={
                language === "hi"
                  ? "गन्ने की कटाई और बंधाई - किसान से मिल तक सीधा सौदा"
                  : "Sugarcane Harvesting and Bundling in the Field"
              }
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cane-950/70 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-semibold shadow-md">
              <ShieldCheck className="w-4 h-4 text-cane-400" />
              <span>
                {language === "hi"
                  ? "सत्यापित तौल व वास्तविक खेत का दृश्य"
                  : "Verified Weighment & Live Harvest"}
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cane-100 text-cane-800 text-xs font-bold w-fit">
              <Wheat className="w-4 h-4 text-cane-700" />
              <span>
                {language === "hi"
                  ? "खेत से सीधा मिल व कोल्हू तक"
                  : "Direct From Farm To Mill & Crusher"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-cane-950 tracking-tight leading-snug">
              {language === "hi"
                ? "बिचौलियों और अनुचित कटौतियों से मुक्ति, किसान के पसीने की पूरी कीमत"
                : "Zero Middlemen, Transparent Weighing, Fair Price for Every Quintal"}
            </h2>

            <p className="text-sm text-cane-700 leading-relaxed">
              {language === "hi"
                ? "गन्ना हाट पर किसान अपनी तैयार फसल की लिस्टिंग करते हैं और निकटवर्ती चीनी मिलें, खांडसारी इकाइयाँ व कोल्हू सीधे प्रतिस्पर्धी बोली लगाते हैं। सौदा स्वीकार होने पर बिना किसी मनमानी कटौती के सीधा और पारदर्शी व्यापार सुनिश्चित होता है।"
                : "Farmers list their harvested or standing sugarcane lots. Regional sugar mills and jaggery crushers place competitive digital bids. Upon acceptance, enjoy transparent trade with zero hidden deductions."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cane-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-cane-900">
                    {language === "hi" ? "सटीक धर्मकांटा तौल" : "Certified Weighbridge"}
                  </h4>
                  <p className="text-xs text-cane-600">
                    {language === "hi"
                      ? "कांटे पर सटीक वजन, बिना किसी अनुचित कटौती के"
                      : "Accurate gross weighment with zero arbitrary deductions"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cane-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-cane-900">
                    {language === "hi" ? "त्वरित सीधा भुगतान" : "Prompt Direct Settlement"}
                  </h4>
                  <p className="text-xs text-cane-600">
                    {language === "hi"
                      ? "तौल रसीद कटते ही सीधे खाते में भुगतान"
                      : "Direct bank transfer as soon as weighment is confirmed"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cane-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-cane-900">
                    {language === "hi" ? "परिवहन की सीधी सुविधा" : "Seamless Farm Logistics"}
                  </h4>
                  <p className="text-xs text-cane-600">
                    {language === "hi"
                      ? "खरीदार द्वारा खेत या नजदीकी सेंटर से उठान"
                      : "Arranged transport from the field or designated cane center"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cane-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-cane-900">
                    {language === "hi" ? "प्रतिस्पर्धी लाइव मंडी" : "Competitive Bidding"}
                  </h4>
                  <p className="text-xs text-cane-600">
                    {language === "hi"
                      ? "एक से अधिक खरीदार, सर्वोत्तम भाव की गारंटी"
                      : "Multiple verified buyers competing for your harvest"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/farmer/listings/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cane-800 hover:bg-cane-900 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>{language === "hi" ? "फसल सूचीबद्ध करें" : "List Your Harvest"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/buyer/marketplace"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cane-100 hover:bg-cane-200 text-cane-900 font-bold text-sm transition-all"
              >
                <Store className="w-4 h-4 text-cane-700" />
                <span>{language === "hi" ? "लाइव मंडियां देखें" : "View Live Lots"}</span>
              </Link>
            </div>
          </div>
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
