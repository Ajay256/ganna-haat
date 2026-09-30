"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Wheat,
  Store,
  Gavel,
  Filter,
  Search,
  MapPin,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { SUGARCANE_DISTRICTS } from "@/lib/constants/districts";
import { SUGARCANE_VARIETIES } from "@/lib/constants/varieties";

export default function BuyerMarketplacePage() {
  const { t, language } = useTranslation();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState("ALL");
  const [selectedVariety, setSelectedVariety] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDistrict !== "ALL") params.append("district", selectedDistrict);
      if (selectedVariety !== "ALL") params.append("variety", selectedVariety);
      if (maxPrice) params.append("maxPrice", maxPrice);

      const res = await fetch(`/api/marketplace?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setListings(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedDistrict, selectedVariety, maxPrice]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cane-900 via-cane-800 to-cane-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-cane-200 text-xs font-bold border border-white/20">
            <Store className="w-4 h-4 text-cane-300" />
            <span>{t.marketplace.heading}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {language === "hi"
              ? "सीधे किसानों से ताजा गन्ना खरीदें"
              : "Source Fresh Sugarcane Directly from Farmers"}
          </h1>
          <p className="text-xs sm:text-sm text-cane-200 leading-relaxed">
            {t.marketplace.subheading}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-cane-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-cane-950 flex items-center gap-2">
            <Filter className="w-4 h-4 text-cane-700" />
            <span>{t.filter} (फ़िल्टर करें)</span>
          </h2>
          {(selectedDistrict !== "ALL" || selectedVariety !== "ALL" || maxPrice) && (
            <button
              onClick={() => {
                setSelectedDistrict("ALL");
                setSelectedVariety("ALL");
                setMaxPrice("");
              }}
              className="text-xs text-cane-700 hover:text-cane-950 font-semibold underline"
            >
              फ़िल्टर रीसेट करें
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* District Filter */}
          <div>
            <label className="block text-xs font-bold text-cane-900 mb-1">
              {t.marketplace.filterByDistrict}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-xl border border-cane-300 bg-white py-2.5 px-3 text-cane-950 text-sm focus:border-cane-600 focus:outline-hidden"
            >
              <option value="ALL">
                {language === "hi" ? "सभी ज़िले (All Districts)" : "All Districts"}
              </option>
              {SUGARCANE_DISTRICTS.map((d) => (
                <option key={d.id} value={d.nameHi}>
                  {language === "hi" ? d.nameHi : d.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Variety Filter */}
          <div>
            <label className="block text-xs font-bold text-cane-900 mb-1">
              {t.marketplace.filterByVariety}
            </label>
            <select
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="w-full rounded-xl border border-cane-300 bg-white py-2.5 px-3 text-cane-950 text-sm focus:border-cane-600 focus:outline-hidden"
            >
              <option value="ALL">
                {language === "hi" ? "सभी किस्में (All Varieties)" : "All Varieties"}
              </option>
              {SUGARCANE_VARIETIES.map((v) => (
                <option key={v.code} value={v.code}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Filter */}
          <div>
            <label className="block text-xs font-bold text-cane-900 mb-1">
              {t.marketplace.maxPrice} (₹/क्विंटल)
            </label>
            <input
              type="number"
              placeholder="उदा. 420"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full rounded-xl border border-cane-300 bg-white py-2.5 px-3 text-cane-950 text-sm focus:border-cane-600 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs sm:text-sm text-cane-700 font-semibold">
          <span>
            {listings.length} {t.marketplace.totalListingsFound}
          </span>
          <span>मंडी स्थिति: 🟢 लाइव नीलामी खुली है</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-cane-700 font-bold">
            {t.loading}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white border border-dashed border-cane-300 rounded-3xl p-12 text-center space-y-3">
            <Wheat className="w-12 h-12 text-cane-500 mx-auto" />
            <h3 className="text-base font-bold text-cane-900">
              {t.marketplace.noListingsFound}
            </h3>
            <p className="text-xs text-cane-600">
              कृपया ज़िला या किस्म का फ़िल्टर बदलकर दोबारा देखें।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => {
              const highestBid = item.bids?.length > 0 ? item.bids[0] : null;

              return (
                <div
                  key={item.id}
                  className="bg-white border border-cane-200 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-cane-400 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Tag & Variety */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-lg font-black text-cane-950 block">
                          {item.variety}
                        </span>
                        <span className="text-xs text-cane-600 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-cane-500" />
                          <span>{item.village}, {item.tehsil}, {item.district}</span>
                        </span>
                      </div>
                      <StatusBadge status={item.status} type="listing" />
                    </div>

                    {/* Quantity & Harvest Status */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-cane-50/70 rounded-xl text-xs">
                      <div>
                        <span className="text-cane-500 block">कुल मात्रा:</span>
                        <span className="text-sm font-bold text-cane-950">
                          {item.quantityQuintals} क्विंटल
                        </span>
                      </div>
                      <div>
                        <span className="text-cane-500 block">कटाई स्थिति:</span>
                        <span className="text-xs font-semibold text-cane-800">
                          {item.harvestStatus === "STANDING_CROP"
                            ? t.listing.standingCrop
                            : item.harvestStatus === "FRESHLY_CUT"
                            ? t.listing.freshlyCut
                            : t.listing.cutWithin24}
                        </span>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="flex items-center justify-between pt-2 border-t border-cane-100">
                      <div>
                        <span className="text-[11px] text-cane-500 block">
                          {t.bidding.basePrice}
                        </span>
                        <span className="text-base font-black text-cane-900">
                          ₹{item.basePricePerQuintal}
                          <span className="text-xs font-normal text-cane-600">{t.perQuintal}</span>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-cane-500 block">
                          {t.bidding.currentHighest}
                        </span>
                        <span className="text-base font-black text-emerald-700">
                          {highestBid ? `₹${highestBid.bidPricePerQuintal}` : "कोई बोली नहीं"}
                          {highestBid && (
                            <span className="text-xs font-normal text-emerald-600">{t.perQuintal}</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-cane-500">
                      <span>किसान: {item.farmer?.name}</span>
                      <span>{item._count?.bids || 0} बोलियाँ लगाई गईं</span>
                    </div>
                  </div>

                  {/* Place Bid CTA */}
                  <Link
                    href={`/buyer/listings/${item.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cane-700 to-cane-600 hover:from-cane-800 hover:to-cane-700 text-white rounded-xl text-sm font-bold shadow-xs hover:shadow-sm transition-all"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>{t.marketplace.viewAndBid}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
