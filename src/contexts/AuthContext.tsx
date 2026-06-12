"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi, walletApi } from "@/lib/api";
import { tokenStore } from "@/lib/api/client";
import { isLoginSuccess } from "@/lib/api/types";
import type { AuthUser, LoginResponse, Wallet } from "@/lib/api/types";

interface AuthContextValue {
  user: AuthUser | null;
  wallet: Wallet | null;
  /** true khi đang khôi phục phiên lúc mới load trang */
  loading: boolean;
  login: (identifier: string, password: string, totpCode?: string) => Promise<LoginResponse>;
  register: (data: { email: string; username: string; password: string; fullName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshWallet: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshWallet = useCallback(async () => {
    try {
      setWallet(await walletApi.me());
    } catch {
      // ví lỗi không chặn UI
    }
  }, []);

  const refreshUser = useCallback(async () => {
    setUser(await authApi.me());
  }, []);

  // Khôi phục phiên khi load trang
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!tokenStore.getAccess() && !tokenStore.getRefresh()) {
        setLoading(false);
        return;
      }
      try {
        const me = await authApi.me();
        if (cancelled) return;
        setUser(me);
        void refreshWallet();
      } catch {
        tokenStore.clear();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshWallet]);

  const login = useCallback(
    async (identifier: string, password: string, totpCode?: string) => {
      const res = await authApi.login(identifier, password, totpCode);
      if (isLoginSuccess(res)) {
        setUser(res.user);
        void refreshWallet();
      }
      return res;
    },
    [refreshWallet],
  );

  const register = useCallback(
    async (data: { email: string; username: string; password: string; fullName?: string }) => {
      const res = await authApi.register(data);
      if (isLoginSuccess(res)) {
        setUser(res.user);
        void refreshWallet();
      } else {
        // backend không auto-login sau register → login lại
        const loginRes = await authApi.login(data.email, data.password);
        if (isLoginSuccess(loginRes)) {
          setUser(loginRes.user);
          void refreshWallet();
        }
      }
    },
    [refreshWallet],
  );

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setWallet(null);
  }, []);

  const value = useMemo(
    () => ({ user, wallet, loading, login, register, logout, refreshWallet, refreshUser }),
    [user, wallet, loading, login, register, logout, refreshWallet, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
