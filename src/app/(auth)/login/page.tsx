"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Wheat, Store, ShieldAlert, LogIn } from "lucide-react";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [selectedRole, setSelectedRole] = useState<"FARMER" | "BUYER" | "ADMIN">("FARMER");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // If already authenticated, redirect to role home
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = (session.user as unknown as { role?: string })?.role;
      if (role === "FARMER") router.replace("/farmer/dashboard");
      else if (role === "BUYER") router.replace("/buyer/marketplace");
      else if (role === "ADMIN") router.replace("/admin/dashboard");
    }
  }, [status, session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        phone,
        pin,
        redirect: false,
      });

      if (res?.error) {
        setErrorMsg(
          language === "hi"
            ? "मोबाइल नंबर या पिन अमान्य है। कृपया पुनः प्रयास करें।"
            : "Invalid mobile number or PIN. Please try again."
        );
      } else {
        // Redirect based on ACTUAL role from server session — not the UI tab
        // getSession() returns the fresh session after signIn resolves
        const { getSession } = await import("next-auth/react");
        const session = await getSession();
        const role = (session?.user as unknown as { role?: string })?.role;

        if (role === "FARMER") router.push("/farmer/dashboard");
        else if (role === "BUYER") router.push("/buyer/marketplace");
        else if (role === "ADMIN") router.push("/admin/dashboard");
        else router.push("/");

        router.refresh();
      }
    } catch {
      setErrorMsg("लॉगिन में तकनीकी समस्या आई।");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white border border-cane-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cane-100 flex items-center justify-center text-cane-700 mx-auto">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-cane-950">
            {t.auth.loginTitle}
          </h1>
          <p className="text-xs sm:text-sm text-cane-600">
            {language === "hi"
              ? "अपने पंजीकृत मोबाइल नंबर और 4-अंकीय पिन से लॉगिन करें"
              : "Login using your registered mobile number and 4-digit PIN"}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-bold text-cane-900 mb-2">
            {t.auth.selectRole}
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-cane-50 rounded-2xl border border-cane-200">
            <button
              type="button"
              onClick={() => setSelectedRole("FARMER")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                selectedRole === "FARMER"
                  ? "bg-cane-700 text-white shadow-xs"
                  : "text-cane-800 hover:text-cane-950"
              }`}
            >
              <Wheat className="w-4 h-4 mb-1" />
              <span>{t.roles.farmer}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("BUYER")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                selectedRole === "BUYER"
                  ? "bg-cane-700 text-white shadow-xs"
                  : "text-cane-800 hover:text-cane-950"
              }`}
            >
              <Store className="w-4 h-4 mb-1" />
              <span>{t.roles.buyer}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("ADMIN")}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                selectedRole === "ADMIN"
                  ? "bg-cane-700 text-white shadow-xs"
                  : "text-cane-800 hover:text-cane-950"
              }`}
            >
              <ShieldAlert className="w-4 h-4 mb-1" />
              <span>{t.roles.admin}</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label={t.auth.phoneLabel}
            placeholder={t.auth.phonePlaceholder}
            type="tel"
            maxLength={10}
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            prefixText="+91"
          />

          <Input
            label={t.auth.pinLabel}
            placeholder={t.auth.pinPlaceholder}
            type="password"
            maxLength={4}
            required
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {t.auth.loginBtn}
          </Button>
        </form>

        {/* Link to Register */}
        <div className="text-center pt-2">
          <Link
            href="/register"
            className="text-xs sm:text-sm font-semibold text-cane-700 hover:text-cane-900 hover:underline"
          >
            {t.auth.noAccount}
          </Link>
        </div>
      </div>
    </div>
  );
}
