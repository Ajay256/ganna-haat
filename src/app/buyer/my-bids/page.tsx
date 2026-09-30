"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Gavel,
  Store,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Wheat,
  ArrowRight,
} from "lucide-react";
import { withdrawBidAction } from "@/server/actions/buyer";

export default function MyBidsPage() {
  const { t, language } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch("/api/buyer/me");
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

  const handleWithdraw = async (bidId: string, buyerId: string) => {
    if (!confirm(language === "hi" ? "क्या आप यह बोली वापस लेना चाहते हैं?" : "Withdraw this bid?")) {
      return;
    }
    setWithdrawingId(bidId);
    try {
      const res = await withdrawBidAction(bidId, buyerId);
      if (res.success) {
        loadData();
      } else {
        alert(res.error?.messageHi || res.error?.message);
      }
    } finally {
      setWithdrawingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-cane-700 font-bold">
        {t.loading}
      </div>
    );
  }

  const buyer = data || {
    name: "राजेश सिंघल (प्रबंधक)",
    buyerProfile: {
      businessName: "त्रिवेणी शुगर मिल, खतौली",
      district: "मुज़फ़्फ़रनगर",
    },
    bids: [],
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white border border-cane-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cane-700 to-cane-500 flex items-center justify-center text-white text-2xl font-black shadow-md">
            🏢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-cane-950">
                {buyer.buyerProfile?.businessName || buyer.name}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cane-100 text-cane-800 font-bold border border-cane-300">
                {t.roles.buyer}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-cane-600 mt-1">
              संपर्क सूत्र: {buyer.name} • ज़िला: {buyer.buyerProfile?.district}
            </p>
          </div>
        </div>

        <Link
          href="/buyer/marketplace"
          className="inline-flex items-center gap-2 px-5 py-3 bg-cane-700 hover:bg-cane-800 text-white rounded-xl text-sm font-bold transition-all shadow-xs"
        >
          <Store className="w-4 h-4" />
          <span>{t.nav.marketplace}</span>
        </Link>
      </div>

      {/* Bids List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-cane-950 flex items-center gap-2">
          <Gavel className="w-5 h-5 text-cane-700" />
          <span>{t.nav.myBids} ({buyer.bids.length})</span>
        </h2>

        {buyer.bids.length === 0 ? (
          <div className="bg-white border border-dashed border-cane-300 rounded-3xl p-12 text-center space-y-4">
            <Gavel className="w-12 h-12 text-cane-500 mx-auto" />
            <h3 className="text-base font-bold text-cane-900">
              {language === "hi"
                ? "आपने अभी कोई बोली नहीं लगाई है"
                : "You haven't placed any bids yet"}
            </h3>
            <p className="text-xs text-cane-600">
              मंडी में जाएं और अपने मनपसंद गन्ने की फसल पर सीधी बोली लगाएं।
            </p>
            <Link
              href="/buyer/marketplace"
              className="inline-flex items-center gap-2 px-5 py-3 bg-cane-700 text-white rounded-xl font-bold text-sm"
            >
              <span>{t.nav.marketplace} देखें</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {buyer.bids.map((bid: any) => {
              const isWithdrawing = withdrawingId === bid.id;
              const isAccepted = bid.status === "ACCEPTED";
              const farmer = bid.listing?.farmer;

              return (
                <div
                  key={bid.id}
                  className={`bg-white border rounded-3xl p-6 shadow-xs space-y-4 transition-all ${
                    isAccepted
                      ? "border-emerald-400 bg-emerald-50/20"
                      : "border-cane-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-cane-950">
                          {bid.listing?.variety}
                        </span>
                        <StatusBadge status={bid.status} type="bid" />
                      </div>
                      <p className="text-xs text-cane-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-cane-500" />
                        <span>
                          {bid.listing?.village}, {bid.listing?.tehsil}, {bid.listing?.district}
                        </span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-cane-500 block">आपकी बोली दर:</span>
                      <span className="text-xl font-black text-cane-900">
                        ₹{bid.bidPricePerQuintal}
                        <span className="text-xs font-normal text-cane-600">{t.perQuintal}</span>
                      </span>
                      <span className="text-xs text-cane-500 block">
                        कुल अनुमानित: ₹{Number(bid.totalAmount).toLocaleString("en-IN")} ({bid.listing?.quantityQuintals} क्विंटल)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-cane-50/70 rounded-xl text-xs text-cane-700">
                    <span>भुगतान की शर्तें: <strong>{bid.paymentTerms}</strong></span>
                    {bid.notes && <span className="block mt-0.5">नोट: "{bid.notes}"</span>}
                  </div>

                  {/* Accepted Deal Showcase */}
                  {isAccepted && (
                    <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        <span>सौदा पक्का! किसान का संपर्क विवरण अनलॉक हो गया है:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white rounded-xl text-xs">
                        <div>
                          <span className="text-cane-500 block">किसान का नाम:</span>
                          <span className="font-bold text-cane-950 text-sm">{farmer?.name}</span>
                        </div>
                        <div>
                          <span className="text-cane-500 block">सीधा फोन नंबर:</span>
                          <a
                            href={`tel:${farmer?.phone}`}
                            className="font-bold text-emerald-700 text-sm flex items-center gap-1 hover:underline"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>+91 {farmer?.phone}</span>
                          </a>
                        </div>
                        <div>
                          <span className="text-cane-500 block">खेत का स्थान:</span>
                          <span className="font-semibold text-cane-900">
                            गाँव: {bid.listing?.village}, {bid.listing?.tehsil} ({bid.listing?.landmark || "सड़क के पास"})
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-cane-100 text-xs">
                    <Link
                      href={`/buyer/listings/${bid.listingId}`}
                      className="font-semibold text-cane-700 hover:text-cane-900 flex items-center gap-1"
                    >
                      <span>फसल का पूरा विवरण देखें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {bid.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        isLoading={isWithdrawing}
                        onClick={() => handleWithdraw(bid.id, buyer.id)}
                        className="text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t.bidding.withdrawBidBtn}</span>
                      </Button>
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
