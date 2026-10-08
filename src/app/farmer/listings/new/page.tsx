"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Wheat,
  ArrowLeft,
  Coins,
  MapPin,
  CheckCircle2,
  Sparkles,
  Info,
} from "lucide-react";
import { SUGARCANE_VARIETIES } from "@/lib/constants/varieties";
import { SUGARCANE_DISTRICTS } from "@/lib/constants/districts";
import { createListingAction } from "@/server/actions/farmer";

export default function NewListingPage() {
  const { t, language } = useTranslation();
  const router = useRouter();

  const [variety, setVariety] = useState(SUGARCANE_VARIETIES[0].code);
  const [quantityQuintals, setQuantityQuintals] = useState("");
  const [harvestStatus, setHarvestStatus] = useState<
    "STANDING_CROP" | "FRESHLY_CUT" | "CUT_WITHIN_24HRS"
  >("STANDING_CROP");
  const [basePricePerQuintal, setBasePricePerQuintal] = useState("385");
  const [district, setDistrict] = useState(SUGARCANE_DISTRICTS[0].nameHi);
  const [tehsil, setTehsil] = useState("बुढ़ाना");
  const [village, setVillage] = useState("शाहपुर");
  const [landmark, setLandmark] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Total valuation calculation
  const totalValuation =
    quantityQuintals && basePricePerQuintal
      ? Number(quantityQuintals) * Number(basePricePerQuintal)
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // No need to fetch farmerId — server action reads it from session
      const res = await createListingAction({
        variety,
        quantityQuintals: Number(quantityQuintals),
        harvestStatus,
        basePricePerQuintal: Number(basePricePerQuintal),
        district,
        tehsil,
        village,
        landmark: landmark || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error?.messageHi || res.error?.message || "त्रुटि आई");
      } else {
        setSuccessMsg(
          language === "hi"
            ? "गन्ना बिक्री प्रविष्टि सफलतापूर्वक दर्ज हुई! एडमिन सत्यापन के बाद लाइव हो जाएगी।"
            : "Sugarcane crop listing submitted! It will go live after admin approval."
        );
        setTimeout(() => router.push("/farmer/dashboard"), 1800);
      }
    } catch {
      setErrorMsg("सर्वर से संपर्क करने में असमर्थ।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <Link
        href="/farmer/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-cane-700 hover:text-cane-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.back}</span>
      </Link>

      <div className="bg-white border border-cane-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cane-100 text-cane-800 text-xs font-bold">
            <Wheat className="w-4 h-4 text-cane-700" />
            <span>{t.roles.farmer}</span>
          </div>
          <h1 className="text-2xl font-black text-cane-950">
            {t.listing.createTitle}
          </h1>
          <p className="text-xs sm:text-sm text-cane-600">
            {t.listing.approvalNotice}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Variety & Quantity */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-cane-950 uppercase tracking-wider flex items-center gap-2 border-b border-cane-100 pb-2">
              <Wheat className="w-4 h-4 text-cane-600" />
              <span>फसल की जानकारी (Crop Details)</span>
            </h2>

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-cane-950">
                {t.listing.varietyLabel} <span className="text-red-500">*</span>
              </label>
              <select
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full rounded-xl border border-cane-300 bg-white py-3 px-3.5 text-cane-950 text-base focus:border-cane-600 focus:outline-hidden"
              >
                {SUGARCANE_VARIETIES.map((v) => (
                  <option key={v.code} value={v.name}>
                    {v.name} ({v.maturity} - {v.sugarRecovery} रिकवरी)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.listing.quantityLabel}
                placeholder="उदा. 800"
                type="number"
                min={10}
                max={50000}
                required
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(e.target.value)}
                helpText={t.listing.quantityHelp}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-cane-950">
                  {t.listing.harvestStatusLabel} <span className="text-red-500">*</span>
                </label>
                <select
                  value={harvestStatus}
                  onChange={(e) => setHarvestStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-cane-300 bg-white py-3 px-3.5 text-cane-950 text-base focus:border-cane-600 focus:outline-hidden"
                >
                  <option value="STANDING_CROP">{t.listing.standingCrop}</option>
                  <option value="FRESHLY_CUT">{t.listing.freshlyCut}</option>
                  <option value="CUT_WITHIN_24HRS">{t.listing.cutWithin24}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-cane-950 uppercase tracking-wider flex items-center gap-2 border-b border-cane-100 pb-2">
              <Coins className="w-4 h-4 text-cane-600" />
              <span>अपेक्षित भाव (Reserve Price)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={t.listing.basePriceLabel}
                placeholder="385"
                type="number"
                min={200}
                max={1000}
                required
                value={basePricePerQuintal}
                onChange={(e) => setBasePricePerQuintal(e.target.value)}
                prefixText="₹"
                helpText={t.listing.basePriceHelp}
              />

              <div className="bg-cane-50 border border-cane-200 rounded-xl p-3.5 flex flex-col justify-center">
                <span className="text-xs text-cane-600 font-semibold block">
                  कुल अनुमानित आधार मूल्य:
                </span>
                <span className="text-xl font-black text-cane-950 mt-1 block">
                  ₹{totalValuation.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-cane-500">
                  ({quantityQuintals || 0} क्विंटल × ₹{basePricePerQuintal || 0})
                </span>
              </div>
            </div>
          </div>

          {/* Farm Location */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-bold text-cane-950 uppercase tracking-wider flex items-center gap-2 border-b border-cane-100 pb-2">
              <MapPin className="w-4 h-4 text-cane-600" />
              <span>{t.listing.locationHeading}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-cane-950">
                  {t.auth.districtLabel} <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl border border-cane-300 bg-white py-3 px-3 text-cane-950 text-base focus:border-cane-600 focus:outline-hidden"
                >
                  {SUGARCANE_DISTRICTS.map((d) => (
                    <option key={d.id} value={d.nameHi}>
                      {language === "hi" ? d.nameHi : d.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label={t.auth.tehsilLabel}
                placeholder="उदा. बुढ़ाना"
                required
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
              />

              <Input
                label={t.auth.villageLabel}
                placeholder="उदा. शाहपुर"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />
            </div>

            <Input
              label={t.listing.landmarkLabel}
              placeholder="उदा. नहर पुलिया के पास / बाईपास तिराहा"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {t.listing.publishBtn}
          </Button>
        </form>
      </div>
    </div>
  );
}
