"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { hi } from "./dictionaries/hi";
import { en } from "./dictionaries/en";

export type Language = "hi" | "en";
export type Dictionary = typeof hi;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "hi",
  setLanguage: () => {},
  t: hi,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLangState] = useState<Language>("hi");

  useEffect(() => {
    // 1. Check localStorage first
    const saved = localStorage.getItem("ganna_language") as Language | null;
    if (saved === "hi" || saved === "en") {
      setLangState(saved);
      return;
    }

    // 2. Check cookie
    const match = document.cookie.match(/ganna_language=(hi|en)/);
    if (match && (match[1] === "hi" || match[1] === "en")) {
      setLangState(match[1]);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLangState(lang);
    localStorage.setItem("ganna_language", lang);
    document.cookie = `ganna_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const t = language === "en" ? (en as unknown as Dictionary) : hi;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
