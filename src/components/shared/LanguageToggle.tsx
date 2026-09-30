"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { language, setLanguage } = useTranslation();

  return (
    <div className={`inline-flex items-center bg-cane-100/70 border border-cane-300 rounded-full p-1 text-sm ${className}`}>
      <span className="flex items-center gap-1 pl-2 pr-1 text-cane-900 font-medium">
        <Languages className="w-4 h-4 text-cane-700" />
      </span>
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          language === "hi"
            ? "bg-cane-700 text-white shadow-sm"
            : "text-cane-900 hover:text-cane-700"
        }`}
      >
        हिंदी
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
          language === "en"
            ? "bg-cane-700 text-white shadow-sm"
            : "text-cane-900 hover:text-cane-700"
        }`}
      >
        English
      </button>
    </div>
  );
};
