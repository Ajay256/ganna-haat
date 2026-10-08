"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShieldAlert,
  Wheat,
  Store,
  Gavel,
  CheckCircle2,
  XCircle,
  Users,
  Eye,
  AlertTriangle,
  MapPin,
  TrendingUp,
} from "lucide-react";
import {
  approveListingAction,
  rejectListingAction,
  toggleUserStatusAction,
} from "@/server/actions/admin";

export default function AdminDashboardPage() {
  const { t, language } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PENDING" | "USERS" | "BIDS">("PENDING");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch("/api/admin/dashboard");
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

  const handleApprove = async (listingId: string) => {
    setActionInProgress(listingId);
    try {
      // Seeded admin ID or session
      const res = await approveListingAction(listingId);
      if (res.success) {
        setNotification(
          language === "hi"
            ? "गन्ना लिस्टिंग स्वीकृत कर दी गई और अब लाइव मंडी में सक्रिय है।"
            : "Listing approved and published to live mandi."
        );
        loadData();
      } else {
        alert(res.error?.messageHi || res.error?.message);
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (listingId: string) => {
    const reason = prompt(
      language === "hi"
        ? "अस्वीकृति का कारण दर्ज करें (उदा. अनुचित भाव / अधूरी जानकारी):"
        : "Enter reason for rejection:"
    );
    if (!reason) return;

    setActionInProgress(listingId);
    try {
      const res = await rejectListingAction(listingId, reason);
      if (res.success) {
        setNotification(
          language === "hi" ? "लिस्टिंग अस्वीकृत कर दी गई।" : "Listing rejected."
        );
        loadData();
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggleUser = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    if (
      !confirm(
        language === "hi"
          ? `क्या आप इस उपयोगकर्ता को ${newStatus === "SUSPENDED" ? "निलंबित (Block)" : "सक्रिय (Activate)"} करना चाहते हैं?`
          : `Change status to ${newStatus}?`
      )
    )
      return;

    try {
      const res = await toggleUserStatusAction(userId, newStatus as any);
      if (res.success) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-cane-700 font-bold">
        {t.loading}
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalFarmers: 0,
    totalBuyers: 0,
    activeListings: 0,
    pendingListings: 0,
    totalBids: 0,
    soldListings: 0,
  };

  const pendingListings = data?.pendingApprovalListings || [];
  const allUsers = data?.allUsers || [];
  const recentBids = data?.recentBids || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Header */}
      <div className="bg-white border border-cane-200 rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cane-900 text-white flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-cane-950">
              {t.admin.title}
            </h1>
            <p className="text-xs sm:text-sm text-cane-600">
              {language === "hi"
                ? "राज्य स्तरीय गन्ना नीलामी नियंत्रण, लिस्टिंग सत्यापन एवं उपयोगकर्ता प्रबंधन"
                : "State Sugarcane Auction Control, Listing Verification & User Management"}
            </p>
          </div>
        </div>
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-cane-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-cane-600 block uppercase">
            {t.admin.kpis.totalFarmers}
          </span>
          <span className="text-2xl font-black text-cane-950 mt-1 block">
            {kpis.totalFarmers}
          </span>
        </div>

        <div className="bg-white border border-cane-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-cane-600 block uppercase">
            {t.admin.kpis.totalBuyers}
          </span>
          <span className="text-2xl font-black text-cane-950 mt-1 block">
            {kpis.totalBuyers}
          </span>
        </div>

        <div className="bg-white border border-cane-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-cane-600 block uppercase">
            {t.admin.kpis.activeListings}
          </span>
          <span className="text-2xl font-black text-cane-950 mt-1 block">
            {kpis.activeListings}
          </span>
        </div>

        <div className="bg-white border border-amber-300 bg-amber-50/50 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 block uppercase">
            {t.admin.kpis.pendingApprovals}
          </span>
          <span className="text-2xl font-black text-amber-900 mt-1 block">
            {kpis.pendingListings}
          </span>
        </div>

        <div className="bg-white border border-cane-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-cane-600 block uppercase">
            {t.admin.kpis.totalBids}
          </span>
          <span className="text-2xl font-black text-cane-950 mt-1 block">
            {kpis.totalBids}
          </span>
        </div>

        <div className="bg-white border border-emerald-300 bg-emerald-50/50 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 block uppercase">
            {t.admin.kpis.completedDeals}
          </span>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">
            {kpis.soldListings}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cane-200 pb-2">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "PENDING"
              ? "bg-cane-700 text-white"
              : "text-cane-800 hover:bg-cane-100"
          }`}
        >
          <Wheat className="w-4 h-4" />
          <span>
            {t.admin.tabs.pendingApprovals} ({pendingListings.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab("USERS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "USERS"
              ? "bg-cane-700 text-white"
              : "text-cane-800 hover:bg-cane-100"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.admin.tabs.users} ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("BIDS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === "BIDS"
              ? "bg-cane-700 text-white"
              : "text-cane-800 hover:bg-cane-100"
          }`}
        >
          <Gavel className="w-4 h-4" />
          <span>{t.admin.tabs.bids} ({recentBids.length})</span>
        </button>
      </div>

      {/* TAB 1: Pending Approvals */}
      {activeTab === "PENDING" && (
        <div className="space-y-4">
          {pendingListings.length === 0 ? (
            <div className="bg-white border border-cane-200 rounded-3xl p-10 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-cane-950">
                {language === "hi"
                  ? "कोई नई लिस्टिंग सत्यापन हेतु लंबित नहीं है"
                  : "All sugarcane listings have been reviewed"}
              </h3>
              <p className="text-xs text-cane-600">सभी फसलें स्वीकृत और लाइव मंडी में सक्रिय हैं।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingListings.map((item: any) => {
                const isProcessing = actionInProgress === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-amber-200 rounded-3xl p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
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

                    <div className="grid grid-cols-2 gap-2 p-3 bg-amber-50/50 rounded-xl text-xs">
                      <div>
                        <span className="text-cane-500 block">किसान:</span>
                        <span className="font-bold text-cane-950">{item.farmer?.name}</span>
                        <span className="text-[11px] text-cane-600 block">+91 {item.farmer?.phone}</span>
                      </div>
                      <div>
                        <span className="text-cane-500 block">मात्रा व अपेक्षित भाव:</span>
                        <span className="font-bold text-cane-950">{item.quantityQuintals} क्विंटल</span>
                        <span className="text-[11px] text-cane-600 block">₹{item.basePricePerQuintal}/क्विंटल</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-cane-100">
                      <Button
                        size="sm"
                        variant="primary"
                        isLoading={isProcessing}
                        onClick={() => handleApprove(item.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.admin.approveBtn}</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isProcessing}
                        onClick={() => handleReject(item.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>{t.admin.rejectBtn}</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Users Management */}
      {activeTab === "USERS" && (
        <div className="bg-white border border-cane-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cane-50 border-b border-cane-200 text-cane-900 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">उपयोगकर्ता / नाम</th>
                  <th className="p-3.5">भूमिका (Role)</th>
                  <th className="p-3.5">मोबाइल</th>
                  <th className="p-3.5">स्थान / ज़िला</th>
                  <th className="p-3.5">स्थिति</th>
                  <th className="p-3.5 text-right">कार्यवाही</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cane-100">
                {allUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-cane-50/50">
                    <td className="p-3.5 font-bold text-cane-950">
                      {u.name}
                      {u.buyerProfile?.businessName && (
                        <span className="block text-[11px] font-normal text-cane-600">
                          {u.buyerProfile.businessName}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-cane-100 text-cane-800 font-semibold text-[10px]">
                        {u.role === "FARMER" ? "🌾 किसान" : u.role === "BUYER" ? "🏢 खरीदार" : "🛡️ एडमिन"}
                      </span>
                    </td>
                    <td className="p-3.5 text-cane-700 font-mono">+91 {u.phone}</td>
                    <td className="p-3.5 text-cane-600">
                      {u.farmerProfile?.district || u.buyerProfile?.district || "उत्तर प्रदेश"}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {u.status === "ACTIVE" ? "सक्रिय" : "निलंबित"}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.role !== "ADMIN" && (
                        <button
                          onClick={() => handleToggleUser(u.id, u.status)}
                          className="text-xs font-semibold text-cane-700 hover:text-red-700 underline"
                        >
                          {u.status === "ACTIVE" ? t.admin.blockUser : t.admin.activateUser}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Bids Monitoring */}
      {activeTab === "BIDS" && (
        <div className="bg-white border border-cane-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cane-50 border-b border-cane-200 text-cane-900 font-bold uppercase text-[11px]">
                <tr>
                  <th className="p-3.5">खरीदार / मिल</th>
                  <th className="p-3.5">फसल</th>
                  <th className="p-3.5">बोली भाव (₹/क्विंटल)</th>
                  <th className="p-3.5">कुल अनुमानित राशि</th>
                  <th className="p-3.5">स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cane-100">
                {recentBids.map((b: any) => (
                  <tr key={b.id} className="hover:bg-cane-50/50">
                    <td className="p-3.5 font-bold text-cane-950">
                      {b.buyer?.buyerProfile?.businessName || b.buyer?.name}
                    </td>
                    <td className="p-3.5 text-cane-700">
                      {b.listing?.variety} ({b.listing?.district})
                    </td>
                    <td className="p-3.5 font-black text-cane-950">
                      ₹{b.bidPricePerQuintal}/क्विंटल
                    </td>
                    <td className="p-3.5 text-cane-700 font-mono">
                      ₹{Number(b.totalAmount).toLocaleString("en-IN")}
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={b.status} type="bid" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
