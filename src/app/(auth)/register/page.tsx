"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Wheat, Store, UserPlus, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { SUGARCANE_DISTRICTS } from "@/lib/constants/districts";
import { registerFarmerAction, registerBuyerAction } from "@/server/actions/auth";
import { useSession } from "next-auth/react";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";

export default function RegisterPage() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [role, setRole] = useState<"FARMER" | "BUYER">("FARMER");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Common Fields
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [district, setDistrict] = useState(SUGARCANE_DISTRICTS[0].nameHi);

  // OTP Verification States
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const recaptchaVerifierRef = useRef<any>(null);

  // Farmer specific
  const [village, setVillage] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [totalLandAcres, setTotalLandAcres] = useState("");

  // Buyer specific
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<
    "SUGAR_MILL" | "JAGGERY_CRUSHER_KOLHU" | "KHANDSARI" | "TRADER_COMMISSION_AGENT"
  >("JAGGERY_CRUSHER_KOLHU");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");

  // If already authenticated, redirect to role home
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = (session.user as unknown as { role?: string })?.role;
      if (userRole === "FARMER") router.replace("/farmer/dashboard");
      else if (userRole === "BUYER") router.replace("/buyer/marketplace");
      else if (userRole === "ADMIN") router.replace("/admin/dashboard");
    }
  }, [status, session, router]);

  // Clean up recaptcha on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const handleSendOtp = async () => {
    setOtpError("");
    setErrorMsg("");

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setOtpError(
        language === "hi"
          ? "कृपया पहले 10 अंकों का मान्य भारतीय मोबाइल नंबर दर्ज करें"
          : "Please enter a valid 10-digit Indian mobile number"
      );
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth || !isFirebaseConfigured()) {
      setOtpError(
        language === "hi"
          ? "Firebase API Key सेट नहीं है। कृपया .env में अपनी Firebase कुंजियाँ जोड़ें।"
          : "Firebase is not configured. Please add Firebase keys to .env."
      );
      return;
    }

    setIsSendingOtp(true);

    try {
      const { RecaptchaVerifier, signInWithPhoneNumber } = await import("firebase/auth");

      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {}
        recaptchaVerifierRef.current = null;
      }

      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });

      const formattedPhone = `+91${phone}`;
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifierRef.current
      );

      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err: any) {
      console.error("Firebase OTP Send Error:", err);
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {}
        recaptchaVerifierRef.current = null;
      }

      const code = err?.code || "";
      const msg = err?.message || "";
      const currentHost = typeof window !== "undefined" ? window.location.hostname : "";

      if (code === "auth/unauthorized-domain") {
        setOtpError(
          `डोमेन अधिकृत नहीं है। कृपया Firebase Console ➔ Authentication ➔ Settings ➔ Authorized Domains में '${currentHost}' जोड़ें।`
        );
      } else if (code === "auth/operation-not-allowed") {
        setOtpError(
          "Firebase Console में Phone Authentication चालू नहीं है। कृपया Firebase Console ➔ Authentication ➔ Sign-in method में Phone को Enable और Save करें।"
        );
      } else if (code === "auth/invalid-phone-number") {
        setOtpError("अमान्य मोबाइल नंबर। कृपया सही 10 अंकों का नंबर जांचें।");
      } else if (code === "auth/too-many-requests") {
        setOtpError("अत्यधिक प्रयासों के कारण अस्थायी रोक। कृपया 10 मिनट बाद पुनः प्रयास करें।");
      } else if (code === "auth/quota-exceeded") {
        setOtpError("Firebase SMS दैनिक कोटा समाप्त हो गया है।");
      } else if (msg.includes("invalid-api-key") || msg.includes("api-key-not-valid")) {
        setOtpError("Firebase API Key अमान्य है। कृपया अपनी Firebase कुंजी जांचें।");
      } else {
        setOtpError(`OTP भेजने में विफल: ${code || msg || "कृपया पुनः प्रयास करें"}`);
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    if (!otp || otp.length < 6) {
      setOtpError(
        language === "hi"
          ? "कृपया 6 अंकों का सही OTP दर्ज करें"
          : "Please enter a 6-digit OTP"
      );
      return;
    }

    setIsVerifyingOtp(true);
    try {
      if (!confirmationResult) {
        throw new Error("पहले OTP भेजें");
      }
      await confirmationResult.confirm(otp);
      setOtpVerified(true);
      setOtpError("");
    } catch (err) {
      console.error("OTP verification error:", err);
      setOtpError(
        language === "hi"
          ? "गलत OTP दर्ज किया गया है। कृपया पुनः जांचें।"
          : "Invalid OTP. Please check and try again."
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Enforce OTP verification if Firebase is configured
    if (isFirebaseConfigured() && !otpVerified) {
      setErrorMsg(
        language === "hi"
          ? "कृपया खाता बनाने से पहले अपने मोबाइल नंबर पर OTP प्राप्त कर सत्यापन पूरा करें।"
          : "Please verify your mobile number with OTP before submitting."
      );
      setIsLoading(false);
      return;
    }

    try {
      if (role === "FARMER") {
        const res = await registerFarmerAction({
          phone,
          pin,
          name,
          district,
          village,
          tehsil,
          totalLandAcres: totalLandAcres ? Number(totalLandAcres) : undefined,
        });

        if (!res.success) {
          setErrorMsg(res.error?.messageHi || res.error?.message || "त्रुटि आई");
        } else {
          setSuccessMsg("खाता सफलतापूर्वक बन गया! अब आप लॉगिन कर सकते हैं।");
          setTimeout(() => router.push("/login"), 1500);
        }
      } else {
        const res = await registerBuyerAction({
          phone,
          pin,
          name,
          businessName,
          businessType,
          district,
          address,
          gstin: gstin || undefined,
        });

        if (!res.success) {
          setErrorMsg(res.error?.messageHi || res.error?.message || "त्रुटि आई");
        } else {
          setSuccessMsg("व्यापारी खाता सफलतापूर्वक बन गया! अब आप लॉगिन कर सकते हैं।");
          setTimeout(() => router.push("/login"), 1500);
        }
      }
    } catch {
      setErrorMsg("सर्वर से संपर्क करने में समस्या आई।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <div id="recaptcha-container"></div>
      <div className="bg-white border border-cane-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cane-100 flex items-center justify-center text-cane-700 mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-cane-950">
            {t.auth.registerTitle}
          </h1>
          <p className="text-xs sm:text-sm text-cane-600">
            {language === "hi"
              ? "गन्ना हाट में अपनी भूमिका चुनें और निःशुल्क खाता बनाएं"
              : "Choose your role and create a free account on GannaHaat"}
          </p>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-xs font-bold text-cane-900 mb-2">
            {t.auth.selectRole}
          </label>
          <div className="grid grid-cols-2 gap-3 p-1 bg-cane-50 rounded-2xl border border-cane-200">
            <button
              type="button"
              onClick={() => setRole("FARMER")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                role === "FARMER"
                  ? "bg-cane-700 text-white shadow-xs"
                  : "text-cane-900 hover:text-cane-700"
              }`}
            >
              <Wheat className="w-5 h-5" />
              <span>{t.roles.farmer}</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("BUYER")}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                role === "BUYER"
                  ? "bg-cane-700 text-white shadow-xs"
                  : "text-cane-900 hover:text-cane-700"
              }`}
            >
              <Store className="w-5 h-5" />
              <span>{t.roles.buyer}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={role === "FARMER" ? t.auth.nameLabel : "संपर्क सूत्र का नाम"}
              placeholder={role === "FARMER" ? "उदा. रमेश सिंह" : "उदा. राजेश सिंघल"}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div>
              <Input
                label={t.auth.phoneLabel}
                placeholder={t.auth.phonePlaceholder}
                type="tel"
                maxLength={10}
                required
                disabled={otpVerified}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, ""));
                  setOtpSent(false);
                  setOtp("");
                  setOtpError("");
                }}
                prefixText="+91"
              />

              {/* OTP Action Area */}
              <div className="mt-2">
                {!otpVerified ? (
                  <div>
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || phone.length !== 10}
                        className="text-xs font-bold text-cane-800 hover:text-cane-950 bg-cane-100 hover:bg-cane-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {isSendingOtp ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-cane-700" />
                        )}
                        {language === "hi" ? "OTP प्राप्त करें" : "Send OTP"}
                      </button>
                    ) : (
                      <div className="p-3 bg-cane-50 border border-cane-200 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cane-900">
                            {language === "hi" ? "6-अंकीय OTP दर्ज करें:" : "Enter 6-digit OTP:"}
                          </span>
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSendingOtp}
                            className="text-[11px] font-semibold text-cane-700 hover:text-cane-900 underline"
                          >
                            {language === "hi" ? "पुनः भेजें (Resend)" : "Resend OTP"}
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            placeholder="••••••"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            className="w-36 text-center tracking-widest font-mono text-base font-bold bg-white border border-cane-300 rounded-lg px-2 py-1.5 focus:border-cane-700 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={isVerifyingOtp || otp.length !== 6}
                            className="flex-1 bg-cane-700 hover:bg-cane-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                          >
                            {isVerifyingOtp && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {language === "hi" ? "सत्यापित करें" : "Verify OTP"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {language === "hi" ? "मोबाइल नंबर सत्यापित हो गया" : "Mobile number verified"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpVerified(false);
                        setOtpSent(false);
                        setOtp("");
                      }}
                      className="text-[11px] text-cane-600 hover:text-cane-900 underline font-normal"
                    >
                      {language === "hi" ? "बदलें" : "Change"}
                    </button>
                  </div>
                )}

                {otpError && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">
                    {otpError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t.auth.pinLabel}
              placeholder="••••"
              type="password"
              maxLength={4}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              helpText={language === "hi" ? "याद रखने योग्य 4 अंक (भविष्य में लॉगिन के लिए)" : "4-digit memorable PIN for future logins"}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-cane-950">
                {t.auth.districtLabel} <span className="text-red-500">*</span>
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-cane-300 bg-white py-3 px-3.5 text-cane-950 text-base focus:border-cane-600 focus:outline-hidden"
              >
                {SUGARCANE_DISTRICTS.map((d) => (
                  <option key={d.id} value={d.nameHi}>
                    {language === "hi" ? d.nameHi : d.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Farmer Specific Inputs */}
          {role === "FARMER" && (
            <div className="space-y-4 pt-2 border-t border-cane-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t.auth.tehsilLabel}
                  placeholder="उदा. बुढ़ाना, सरधना"
                  required
                  value={tehsil}
                  onChange={(e) => setTehsil(e.target.value)}
                />

                <Input
                  label={t.auth.villageLabel}
                  placeholder="गाँव का नाम"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                />
              </div>

              <Input
                label={language === "hi" ? "कुल कृषि भूमि (एकड़ में - वैकल्पिक)" : "Total Farm Land (Acres - Optional)"}
                placeholder="उदा. 8.5"
                type="number"
                step="0.5"
                value={totalLandAcres}
                onChange={(e) => setTotalLandAcres(e.target.value)}
              />
            </div>
          )}

          {/* Buyer Specific Inputs */}
          {role === "BUYER" && (
            <div className="space-y-4 pt-2 border-t border-cane-100">
              <Input
                label={t.auth.businessNameLabel}
                placeholder="उदा. त्रिवेणी शुगर मिल / किसान कोल्हू उद्योग"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-cane-950">
                  {t.auth.businessTypeLabel} <span className="text-red-500">*</span>
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
                  className="w-full rounded-xl border border-cane-300 bg-white py-3 px-3.5 text-cane-950 text-base focus:border-cane-600 focus:outline-hidden"
                >
                  <option value="JAGGERY_CRUSHER_KOLHU">
                    {language === "hi" ? "गुड़ कोल्हू / क्रेशर (Jaggery Crusher)" : "Jaggery Crusher / Kolhu"}
                  </option>
                  <option value="SUGAR_MILL">
                    {language === "hi" ? "चीनी मिल (Sugar Mill)" : "Sugar Mill"}
                  </option>
                  <option value="KHANDSARI">
                    {language === "hi" ? "खांडसारी इकाई (Khandsari Unit)" : "Khandsari Unit"}
                  </option>
                  <option value="TRADER_COMMISSION_AGENT">
                    {language === "hi" ? "व्यापारी / आढ़ती (Trader)" : "Trader / Commission Agent"}
                  </option>
                </select>
              </div>

              <Input
                label={language === "hi" ? "मिल / व्यापारिक स्थल का पूरा पता" : "Full Business Address"}
                placeholder="सड़क / बाईपास, तहसील"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <Input
                label={language === "hi" ? "जीएसटी नंबर (GSTIN - यदि उपलब्ध हो)" : "GSTIN (Optional)"}
                placeholder="09XXXXXXXXXXXXX"
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
              />
            </div>
          )}

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
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {t.auth.registerBtn}
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-semibold text-cane-700 hover:text-cane-900 hover:underline"
          >
            {t.auth.haveAccount}
          </Link>
        </div>
      </div>
    </div>
  );
}
