"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import {
  Wheat,
  Store,
  UserCheck,
  ShieldAlert,
  Menu,
  X,
  LogIn,
  PlusCircle,
  Gavel,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cane-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cane-700 to-cane-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Wheat className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-cane-950 tracking-tight block">
                {t.appName}
              </span>
              <span className="text-[10px] text-cane-700 font-semibold tracking-wider block -mt-1">
                KISAN MANDI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/buyer/marketplace"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-cane-900 hover:text-cane-700 hover:bg-cane-50 transition-colors"
            >
              <Store className="w-4 h-4 text-cane-600" />
              {t.nav.marketplace}
            </Link>

            <Link
              href="/farmer/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-cane-900 hover:text-cane-700 hover:bg-cane-50 transition-colors"
            >
              <Wheat className="w-4 h-4 text-cane-600" />
              {t.nav.farmerDashboard}
            </Link>

            <Link
              href="/buyer/my-bids"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-cane-900 hover:text-cane-700 hover:bg-cane-50 transition-colors"
            >
              <Gavel className="w-4 h-4 text-cane-600" />
              {t.nav.myBids}
            </Link>

            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-cane-800 hover:text-cane-950 hover:bg-cane-50 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-cane-600" />
              {t.nav.adminDashboard}
            </Link>
          </nav>

          {/* Actions & Language Switch */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />

            <Link
              href="/farmer/listings/new"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cane-700 to-cane-600 hover:from-cane-800 hover:to-cane-700 text-white rounded-lg text-sm font-semibold shadow-xs hover:shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              {t.nav.newListing}
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-2 border border-cane-300 text-cane-900 hover:bg-cane-50 rounded-lg text-sm font-semibold transition-colors"
            >
              <LogIn className="w-4 h-4 text-cane-700" />
              {t.nav.login}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-cane-800 hover:bg-cane-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-cane-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cane-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <Link
            href="/buyer/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-cane-900 hover:bg-cane-50"
          >
            <Store className="w-5 h-5 text-cane-600" />
            {t.nav.marketplace}
          </Link>

          <Link
            href="/farmer/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-cane-900 hover:bg-cane-50"
          >
            <Wheat className="w-5 h-5 text-cane-600" />
            {t.nav.farmerDashboard}
          </Link>

          <Link
            href="/buyer/my-bids"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-cane-900 hover:bg-cane-50"
          >
            <Gavel className="w-5 h-5 text-cane-600" />
            {t.nav.myBids}
          </Link>

          <Link
            href="/farmer/listings/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-cane-700 text-white rounded-xl text-base font-bold shadow-sm"
          >
            <PlusCircle className="w-5 h-5" />
            {t.nav.newListing}
          </Link>

          <div className="pt-2 border-t border-cane-100 flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-cane-900 font-semibold"
            >
              <LogIn className="w-4 h-4 text-cane-700" />
              {t.nav.login}
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-cane-600 font-medium"
            >
              {t.nav.adminDashboard}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
