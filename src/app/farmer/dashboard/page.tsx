"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Wheat,
  PlusCircle,
  Gavel,
  CheckCircle2,
  XCircle,
  Phone,
  Building2,
  Calendar,
  Sparkles,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { acceptBidAction, rejectBidAction } from "@/server/actions/farmer";

export default function FarmerDashboard() {
  const { t, language } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Load demo farmer data
  const loadData = async () => {
    try {
      const res = await fetch("/api/farmer/me");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAccept = async (bidId: string, farmerId: string) => {
    setActionInProgress(bidId);
    try {
      const res = await acceptBidAction(bidId, farmerId);
      if (res.success) {
        setNotification(
          language === "hi"
            ? "🎉 बधाई! बोली स्वीकार कर ली गई है और सौदा पक्का हो गया है।"
            : "🎉 Congratulations! Bid accepted and deal locked."
        );
        loadData();
      } else {
        alert(res.error?.messageHi || res.error?.message);
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (bidId: string, farmerId: string) => {
    setActionInProgress(bidId);
    try {
      const res = await rejectBidAction(bidId, farmerId);
      if (res.success) {
        setNotification(
          language === "hi" ? "बोली अस्वीकार कर दी गई।" : "Bid rejected."
        );
        loadData();
      }
    } finally {
      setActionInProgress(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-cane-700 font-bold">
        {t.loading}
      </div>
    );
  }

  const farmer = data || {
    name: "चौधरी रमेश सिंह",
    phone: "9876543210",
    farmerProfile: {
      village: "शाहपुर",
      tehsil: "बुढ़ाना",
      district: "मुज़फ़्फ़रनगर",
      totalLandAcres: 12.5,
    },
    listings: [],
  };

  const totalQuintals = farmer.listings.reduce(
    (acc: number, item: any) => acc + Number(item.quantityQuintals || 0),
    0
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Farmer Greeting Banner */}
      <div className="bg-white border border-cane-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cane-700 to-cane-500 flex items-center justify-center text-white text-2xl font-black shadow-md">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-cane-950">
                {farmer.name}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cane-100 text-cane-800 font-bold border border-cane-300">
                {t.roles.farmer}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cane-600 flex items-center gap-1.5 mt-1">
              <MapPin className="w-4 h-4 text-cane-600 shrink-0" />
              <span>
                {farmer.farmerProfile?.village}, {farmer.farmerProfile?.tehsil},{" "}
                {farmer.farmerProfile?.district} ({farmer.farmerProfile?.totalLandAcres || 10} एकड़ कृषि भूमि)
              </span>
            </p>
          </div>
        </div>

        <Link
          href="/farmer/listings/new"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cane-700 to-cane-600 hover:from-cane-800 hover:to-cane-700 text-white rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t.nav.newListing}</span>
        </Link>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-sm flex items-center justify-between">
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="text-xs text-emerald-800 underline"
          >
            बंद करें
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-cane-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-cane-600 uppercase tracking-wider block">
            {language === "hi" ? "कुल गन्ना फसलें" : "Total Crop Listings"}
          </span>
          <span className="text-3xl font-black text-cane-950 mt-1 block">
            {farmer.listings.length}
          </span>
          <span className="text-xs text-cane-500 mt-1 block">
            कुल मात्रा: {totalQuintals} क्विंटल
          </span>
        </div>

        <div className="bg-white border border-cane-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-cane-600 uppercase tracking-wider block">
            {language === "hi" ? "आई हुई कुल बोलियाँ" : "Total Bids Received"}
          </span>
          <span className="text-3xl font-black text-cane-950 mt-1 block">
            {farmer.listings.reduce((acc: number, l: any) => acc + (l.bids?.length || 0), 0)}
          </span>
          <span className="text-xs text-cane-500 mt-1 block">
            चीनी मिलों व कोल्हू द्वारा
          </span>
        </div>

        <div className="bg-white border border-cane-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-cane-600 uppercase tracking-wider block">
            {language === "hi" ? "सौदा पक्का (बिका हुआ)" : "Sold / Completed"}
          </span>
          <span className="text-3xl font-black text-emerald-700 mt-1 block">
            {farmer.listings.filter((l: any) => l.status === "SOLD").length}
          </span>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">
            सफलतापूर्वक संपन्न
          </span>
        </div>
      </div>

      {/* Listings and Received Bids Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-cane-950 flex items-center gap-2">
            <Wheat className="w-5 h-5 text-cane-700" />
            <span>{t.nav.myListings}</span>
          </h2>
          <span className="text-xs text-cane-600 font-semibold">
            {farmer.listings.length} {t.marketplace.totalListingsFound}
          </span>
        </div>

        {farmer.listings.length === 0 ? (
          <div className="bg-white border border-dashed border-cane-300 rounded-3xl p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cane-100 flex items-center justify-center text-cane-700 mx-auto">
              <Wheat className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-cane-900">
              {language === "hi"
                ? "अभी आपने कोई गन्ने की फसल नहीं जोड़ी है"
                : "You haven't listed any sugarcane crop yet"}
            </h3>
            <p className="text-xs sm:text-sm text-cane-600 max-w-md mx-auto">
              {language === "hi"
                ? "सीधे राज्य भर के चीनी मिलों और गुड़ व्यापारियों से उच्चतम भाव पाने के लिए अपनी फसल अभी सूचीबद्ध करें।"
                : "List your crop now to receive competitive bids from sugar mills and jaggery crushers."}
            </p>
            <Link
              href="/farmer/listings/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-cane-700 text-white rounded-xl font-bold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.nav.newListing}</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {farmer.listings.map((listing: any) => {
              const highestBid = listing.bids?.length > 0 ? listing.bids[0] : null;
              const acceptedBid = listing.bids?.find((b: any) => b.status === "ACCEPTED");

              return (
                <div
                  key={listing.id}
                  className="bg-white border border-cane-200 rounded-3xl p-6 shadow-xs space-y-6 hover:border-cane-300 transition-colors"
                >
                  {/* Top Bar of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cane-100">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-black text-cane-950">
                          {listing.variety}
                        </span>
                        <StatusBadge status={listing.status} type="listing" />
                      </div>
                      <div className="text-xs text-cane-600 flex items-center gap-2 flex-wrap">
                        <span>📍 {listing.village}, {listing.tehsil}, {listing.district}</span>
                        {listing.landmark && <span>({listing.landmark})</span>}
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-cane-500 block">
                        {t.bidding.basePrice}
                      </span>
                      <span className="text-xl font-black text-cane-900">
                        ₹{listing.basePricePerQuintal}
                        <span className="text-xs font-normal text-cane-600">{t.perQuintal}</span>
                      </span>
                    </div>
                  </div>

                  {/* Crop Quick Specs Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-cane-50/60 border border-cane-100 text-xs">
                    <div>
                      <span className="text-cane-500 block font-medium">कुल मात्रा:</span>
                      <span className="text-sm font-bold text-cane-950">
                        {listing.quantityQuintals} क्विंटल
                      </span>
                    </div>
                    <div>
                      <span className="text-cane-500 block font-medium">कटाई की स्थिति:</span>
                      <span className="text-sm font-bold text-cane-950">
                        {listing.harvestStatus === "STANDING_CROP"
                          ? t.listing.standingCrop
                          : listing.harvestStatus === "FRESHLY_CUT"
                          ? t.listing.freshlyCut
                          : t.listing.cutWithin24}
                      </span>
                    </div>
                    <div>
                      <span className="text-cane-500 block font-medium">उच्चतम बोली:</span>
                      <span className="text-sm font-bold text-cane-950">
                        {highestBid ? `₹${highestBid.bidPricePerQuintal}/क्विंटल` : "कोई बोली नहीं"}
                      </span>
                    </div>
                    <div>
                      <span className="text-cane-500 block font-medium">प्राप्त बोलियाँ:</span>
                      <span className="text-sm font-bold text-cane-950">
                        {listing.bids?.length || 0} बोलियाँ
                      </span>
                    </div>
                  </div>

                  {/* Accepted Deal Showcase (When Sold) */}
                  {acceptedBid && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{t.bidding.dealSuccessAlert}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-emerald-100 text-xs">
                        <div>
                          <span className="text-cane-500 block">खरीदार / मिल:</span>
                          <span className="font-bold text-cane-950 text-sm">
                            {acceptedBid.buyer?.buyerProfile?.businessName || acceptedBid.buyer?.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-cane-500 block">संपर्क मोबाइल नंबर:</span>
                          <a
                            href={`tel:${acceptedBid.buyer?.phone}`}
                            className="font-bold text-emerald-700 text-sm flex items-center gap-1 hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>+91 {acceptedBid.buyer?.phone}</span>
                          </a>
                        </div>
                        <div>
                          <span className="text-cane-500 block">स्वीकृत दर व कुल राशि:</span>
                          <span className="font-black text-cane-950 text-sm">
                            ₹{acceptedBid.bidPricePerQuintal}/क्विंटल (कुल: ₹{acceptedBid.totalAmount})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bids Drawer / Table */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-cane-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Gavel className="w-4 h-4 text-cane-700" />
                        <span>{t.nav.receivedBids}</span>
                      </span>
                      <span className="text-xs font-normal text-cane-500">
                        (उच्चतम भाव से क्रमबद्ध)
                      </span>
                    </h3>

                    {listing.bids && listing.bids.length > 0 ? (
                      <div className="divide-y divide-cane-100 border border-cane-200 rounded-2xl overflow-hidden">
                        {listing.bids.map((bid: any) => {
                          const isAccepting = actionInProgress === bid.id;
                          return (
                            <div
                              key={bid.id}
                              className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                                bid.status === "ACCEPTED"
                                  ? "bg-emerald-50/70"
                                  : "hover:bg-cane-50/50"
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-cane-950 text-sm">
                                    {bid.buyer?.buyerProfile?.businessName || bid.buyer?.name || "खरीदार"}
                                  </span>
                                  <StatusBadge status={bid.status} type="bid" />
                                </div>
                                <p className="text-xs text-cane-600">
                                  भुगतान: <strong>{bid.paymentTerms}</strong>
                                  {bid.notes && <span> • नोट: "{bid.notes}"</span>}
                                </p>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-6">
                                <div className="text-right">
                                  <span className="text-lg font-black text-cane-950 block">
                                    ₹{bid.bidPricePerQuintal}
                                    <span className="text-xs font-normal text-cane-600">{t.perQuintal}</span>
                                  </span>
                                  <span className="text-[11px] text-cane-500 block">
                                    कुल: ₹{bid.totalAmount}
                                  </span>
                                </div>

                                {listing.status !== "SOLD" && bid.status === "PENDING" && (
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="primary"
                                      isLoading={isAccepting}
                                      onClick={() => handleAccept(bid.id, farmer.id)}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>स्वीकार करें</span>
                                    </Button>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      disabled={isAccepting}
                                      onClick={() => handleReject(bid.id, farmer.id)}
                                      className="text-red-600 hover:bg-red-50 border-red-200"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      <span>अस्वीकार</span>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-cane-500 italic p-3 bg-cane-50/50 rounded-xl">
                        {language === "hi"
                          ? "अभी इस फसल पर कोई बोली प्राप्त नहीं हुई है। मिलों द्वारा बोली लगाए जाने पर यहाँ दिखाई देगी।"
                          : "No bids received on this listing yet. They will appear here once placed by buyers."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
