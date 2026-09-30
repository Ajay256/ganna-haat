"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { StatusBadge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Wheat,
  ArrowLeft,
  Gavel,
  Coins,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { placeBidAction } from "@/server/actions/buyer";

export default function BuyerListingDetailsPage() {
  const { t, language } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Bid form state
  const [bidPrice, setBidPrice] = useState("");
  const [paymentTerms, setPaymentTerms] = useState(
    "कांटे पर तौल के तुरंत बाद आरटीजीएस / बैंक ट्रांसफर"
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadListing = async () => {
    try {
      const res = await fetch(`/api/listings/${id}`);
      if (res.ok) {
        const json = await res.json();
        setListing(json);
        if (json?.basePricePerQuintal) {
          setBidPrice(String(Number(json.basePricePerQuintal) + 5)); // Suggest base price + 5
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadListing();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-cane-700 font-bold">
        {t.loading}
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-cane-950">गन्ने की लिस्टिंग नहीं मिली</h2>
        <Link href="/buyer/marketplace" className="text-sm text-cane-700 underline font-semibold">
          मंडी में वापस जाएं
        </Link>
      </div>
    );
  }

  const highestBid = listing.bids?.length > 0 ? listing.bids[0] : null;
  const estTotalPayment =
    bidPrice && listing.quantityQuintals
      ? Number(bidPrice) * Number(listing.quantityQuintals)
      : 0;

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Demo buyer ID: Triveni Sugar Mill
      const buyerRes = await fetch("/api/buyer/me");
      const buyerData = await buyerRes.json();
      const buyerId = buyerData?.id || "demo-buyer-id";

      const res = await placeBidAction(buyerId, {
        listingId: listing.id,
        bidPricePerQuintal: Number(bidPrice),
        paymentTerms,
        notes: notes || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error?.messageHi || res.error?.message || "बोली लगाने में त्रुटि");
      } else {
        setSuccessMsg("🎉 आपकी बोली सफलतापूर्वक दर्ज कर ली गई है!");
        setTimeout(() => router.push("/buyer/my-bids"), 1500);
      }
    } catch {
      setErrorMsg("सर्वर से संपर्क करने में असमर्थ।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <Link
        href="/buyer/marketplace"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-cane-700 hover:text-cane-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.back}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Crop Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-cane-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-cane-600 block uppercase tracking-wider">
                  गन्ना फसल विवरण
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-cane-950 mt-1">
                  {listing.variety}
                </h1>
                <p className="text-xs text-cane-600 flex items-center gap-1.5 mt-1.5">
                  <MapPin className="w-4 h-4 text-cane-600 shrink-0" />
                  <span>
                    {listing.village}, {listing.tehsil}, {listing.district}{" "}
                    {listing.landmark && `(${listing.landmark})`}
                  </span>
                </p>
              </div>
              <StatusBadge status={listing.status} type="listing" />
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-cane-50/70 border border-cane-100 text-xs">
              <div>
                <span className="text-cane-500 block">कुल गन्ने की मात्रा:</span>
                <span className="text-base font-black text-cane-950 mt-0.5 block">
                  {listing.quantityQuintals} क्विंटल
                </span>
                <span className="text-[10px] text-cane-600">
                  ≈ {Math.round(Number(listing.quantityQuintals) / 45)} ट्रॉली
                </span>
              </div>

              <div>
                <span className="text-cane-500 block">कटाई की स्थिति:</span>
                <span className="text-sm font-bold text-cane-950 mt-0.5 block">
                  {listing.harvestStatus === "STANDING_CROP"
                    ? t.listing.standingCrop
                    : listing.harvestStatus === "FRESHLY_CUT"
                    ? t.listing.freshlyCut
                    : t.listing.cutWithin24}
                </span>
              </div>

              <div>
                <span className="text-cane-500 block">किसान का आधार भाव:</span>
                <span className="text-base font-black text-cane-950 mt-0.5 block">
                  ₹{listing.basePricePerQuintal}
                  <span className="text-xs font-normal text-cane-600">{t.perQuintal}</span>
                </span>
              </div>
            </div>

            {/* Live Bids Overview on this Listing */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-cane-950 flex items-center gap-2">
                <Gavel className="w-4 h-4 text-cane-700" />
                <span>इस फसल पर अब तक लगी बोलियाँ</span>
              </h3>

              {listing.bids && listing.bids.length > 0 ? (
                <div className="divide-y divide-cane-100 border border-cane-200 rounded-2xl overflow-hidden text-xs">
                  {listing.bids.map((b: any, idx: number) => (
                    <div
                      key={b.id}
                      className="p-3.5 flex items-center justify-between bg-white hover:bg-cane-50/40"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-cane-950">
                          {idx === 0 ? "🥇 उच्चतम बोली" : `बोली #${idx + 1}`}
                        </span>
                        <p className="text-[11px] text-cane-500">
                          भुगतान: {b.paymentTerms}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-700 block">
                          ₹{b.bidPricePerQuintal}/क्विंटल
                        </span>
                        <span className="text-[10px] text-cane-500">
                          कुल: ₹{Number(b.totalAmount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-cane-500 italic p-3 bg-cane-50/50 rounded-xl">
                  अभी तक किसी व्यापारी ने बोली नहीं लगाई है। आप पहली बोली लगा सकते हैं!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Place Bid Action Form */}
        <div className="space-y-6">
          <div className="bg-white border-2 border-cane-400 rounded-3xl p-6 shadow-md space-y-5 sticky top-24">
            <div className="space-y-1 border-b border-cane-100 pb-3">
              <div className="flex items-center gap-1.5 text-cane-800 text-xs font-bold">
                <Gavel className="w-4 h-4 text-cane-700" />
                <span>{t.bidding.placeBidTitle}</span>
              </div>
              <h2 className="text-xl font-black text-cane-950">
                अपनी बोली दर्ज करें
              </h2>
              <p className="text-[11px] text-cane-600">
                न्यूनतम भाव: <strong>₹{listing.basePricePerQuintal}/क्विंटल</strong>
              </p>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-4">
              <Input
                label={t.bidding.bidPriceLabel}
                type="number"
                min={Number(listing.basePricePerQuintal)}
                max={1200}
                required
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                prefixText="₹"
                helpText={`आधार भाव (₹${listing.basePricePerQuintal}) से अधिक या बराबर`}
              />

              {/* Total Computed Value */}
              <div className="p-3 rounded-xl bg-cane-50 border border-cane-200">
                <span className="text-[11px] text-cane-600 font-semibold block">
                  {t.bidding.totalEstAmount}:
                </span>
                <span className="text-xl font-black text-cane-950 mt-0.5 block">
                  ₹{estTotalPayment.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-cane-500">
                  ({listing.quantityQuintals} क्विंटल × ₹{bidPrice || 0})
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-cane-950">
                  {t.bidding.paymentTermsLabel} <span className="text-red-500">*</span>
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full rounded-xl border border-cane-300 bg-white py-2.5 px-3 text-cane-950 text-xs focus:border-cane-600 focus:outline-hidden"
                >
                  <option value="कांटे पर तौल के तुरंत बाद आरटीजीएस / बैंक ट्रांसफर">
                    कांटे पर तौल के तुरंत बाद आरटीजीएस / बैंक ट्रांसफर
                  </option>
                  <option value="तौल होते ही 100% नकद भुगतान">
                    तौल होते ही 100% नकद भुगतान
                  </option>
                  <option value="24 घंटे के अंदर बैंक खाते में सीधा भुगतान">
                    24 घंटे के अंदर बैंक खाते में सीधा भुगतान
                  </option>
                  <option value="उठान के समय 50% एडवांस, बाकी तौल पर">
                    उठान के समय 50% एडवांस, बाकी तौल पर
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-cane-950">
                  {t.bidding.notesLabel}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="उदा. ट्रॉली/ट्रक हमारी ओर से उपलब्ध कराया जाएगा"
                  className="w-full rounded-xl border border-cane-300 bg-white p-3 text-cane-950 text-xs focus:border-cane-600 focus:outline-hidden"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
                size="lg"
              >
                {t.bidding.placeBidBtn}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
