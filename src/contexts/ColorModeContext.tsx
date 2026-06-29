"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ColorMode } from "@/theme/theme";

const STORAGE_KEY = "color-mode";

interface ColorModeContextValue {
  mode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

function getInitialMode(): ColorMode {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  // Lần đầu: theo preference hệ điều hành
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorMode>("light");

  // Khôi phục mode sau khi mount (tránh hydration mismatch)
  useEffect(() => {
    setMode(getInitialMode());
  }, []);

  // Đồng bộ vào localStorage + thuộc tính trên <html> để CSS/scrollbar khớp
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const setColorMode = useCallback((m: ColorMode) => setMode(m), []);
  const toggleColorMode = useCallback(
    () => setMode((prev) => (prev === "light" ? "dark" : "light")),
    [],
  );

  const value = useMemo(
    () => ({ mode, toggleColorMode, setColorMode }),
    [mode, toggleColorMode, setColorMode],
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error("useColorMode must be used within ColorModeProvider");
  return ctx;
}
