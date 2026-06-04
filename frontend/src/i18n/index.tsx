"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import fr from "./fr";
import en from "./en";

export type Locale = "fr" | "en";

const dictionaries: Record<Locale, Record<string, string>> = { fr, en };

function detectLocale(): Locale {
  if (typeof window === "undefined") return "fr";
  const stored = localStorage.getItem("locale");
  if (stored === "fr" || stored === "en") return stored;
  const browserLang = navigator.language || (navigator as any).userLanguage || "fr";
  return browserLang.startsWith("en") ? "en" : "fr";
}

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "fr",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  // Default "fr" — works on SSR and first render, no hydration mismatch
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    // Detect real locale client-side after hydration
    setLocaleState(detectLocale());
  }, []);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("locale", l);
    document.documentElement.lang = l;
  }

  function t(key: string): string {
    return dictionaries[locale]?.[key] || dictionaries.fr[key] || key;
  }

  // Always wrap in Provider so t() never returns the raw key
  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  return useContext(I18nContext);
}
