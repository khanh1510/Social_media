"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import viMessages from "../../messages/vi.json";
import enMessages from "../../messages/en.json";
import viPagesA from "../../messages/pagesA.vi.json";
import enPagesA from "../../messages/pagesA.en.json";
import viPagesB from "../../messages/pagesB.vi.json";
import enPagesB from "../../messages/pagesB.en.json";
import viPagesC from "../../messages/pagesC.vi.json";
import enPagesC from "../../messages/pagesC.en.json";

export type Locale = "vi" | "en";

const STORAGE_KEY = "locale";
// Gộp các nhóm message: file core (vi/en) + 3 nhóm trang (pagesA/B/C)
const MESSAGES = {
  vi: { ...viMessages, ...viPagesA, ...viPagesB, ...viPagesC },
  en: { ...enMessages, ...enPagesA, ...enPagesB, ...enPagesC },
} as const;

interface LocaleContextValue {
  locale: Locale;
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "vi";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "vi" || stored === "en") return stored;
  // Lần đầu: theo ngôn ngữ trình duyệt, mặc định tiếng Việt
  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "vi";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("vi");

  // Khôi phục locale sau khi mount (tránh hydration mismatch)
  useEffect(() => {
    setLocaleState(getInitialLocale());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.setAttribute("lang", locale);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggleLocale = useCallback(
    () => setLocaleState((prev) => (prev === "vi" ? "en" : "vi")),
    [],
  );

  const value = useMemo(
    () => ({ locale, toggleLocale, setLocale }),
    [locale, toggleLocale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider
        locale={locale}
        messages={MESSAGES[locale]}
        timeZone="Asia/Ho_Chi_Minh"
        now={new Date()}
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
