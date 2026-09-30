"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface BadgeProps {
  status: string;
  type?: "listing" | "bid";
  className?: string;
}

export const StatusBadge: React.FC<BadgeProps> = ({
  status,
  type = "listing",
  className = "",
}) => {
  const { t } = useTranslation();

  const getStyleAndLabel = () => {
    if (type === "listing") {
      switch (status) {
        case "APPROVED":
          return {
            bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
            dot: "bg-emerald-500",
            label: t.listing.statusBadge.APPROVED,
          };
        case "PENDING_APPROVAL":
          return {
            bg: "bg-amber-100 text-amber-800 border-amber-300",
            dot: "bg-amber-500",
            label: t.listing.statusBadge.PENDING_APPROVAL,
          };
        case "SOLD":
          return {
            bg: "bg-blue-100 text-blue-800 border-blue-300",
            dot: "bg-blue-500",
            label: t.listing.statusBadge.SOLD,
          };
        case "REJECTED":
          return {
            bg: "bg-rose-100 text-rose-800 border-rose-300",
            dot: "bg-rose-500",
            label: t.listing.statusBadge.REJECTED,
          };
        case "EXPIRED":
        case "CANCELLED":
          return {
            bg: "bg-gray-100 text-gray-700 border-gray-300",
            dot: "bg-gray-400",
            label:
              status === "EXPIRED"
                ? t.listing.statusBadge.EXPIRED
                : t.listing.statusBadge.CANCELLED,
          };
        default:
          return {
            bg: "bg-gray-100 text-gray-800 border-gray-200",
            dot: "bg-gray-400",
            label: status,
          };
      }
    } else {
      // type === 'bid'
      switch (status) {
        case "PENDING":
          return {
            bg: "bg-amber-100 text-amber-800 border-amber-300",
            dot: "bg-amber-500",
            label: t.bidding.bidStatus.PENDING,
          };
        case "ACCEPTED":
          return {
            bg: "bg-emerald-100 text-emerald-800 border-emerald-400 font-bold",
            dot: "bg-emerald-600",
            label: t.bidding.bidStatus.ACCEPTED,
          };
        case "REJECTED":
          return {
            bg: "bg-rose-100 text-rose-800 border-rose-300",
            dot: "bg-rose-500",
            label: t.bidding.bidStatus.REJECTED,
          };
        case "WITHDRAWN":
          return {
            bg: "bg-gray-100 text-gray-600 border-gray-300",
            dot: "bg-gray-400",
            label: t.bidding.bidStatus.WITHDRAWN,
          };
        default:
          return {
            bg: "bg-gray-100 text-gray-800 border-gray-200",
            dot: "bg-gray-400",
            label: status,
          };
      }
    }
  };

  const { bg, dot, label } = getStyleAndLabel();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
};
