"use client";

import { apiFetch, tokenStore } from "./client";
import type {
  ApiKey,
  ApiNotification,
  ApiOrder,
  ApiService,
  AuthUser,
  CategoryNode,
  LoginResponse,
  OrderStatus,
  Paginated,
  PaymentGateway,
  PaymentIntent,
  Wallet,
  WalletTransaction,
} from "./types";
import { isLoginSuccess } from "./types";

export const authApi = {
  async login(identifier: string, password: string, totpCode?: string) {
    const res = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      public: true,
      body: { identifier, password, ...(totpCode ? { totpCode } : {}) },
    });
    if (isLoginSuccess(res)) {
      tokenStore.set(res.accessToken, res.refreshToken);
    }
    return res;
  },

  async register(data: { email: string; username: string; password: string; fullName?: string }) {
    const res = await apiFetch<LoginResponse>("/auth/register", {
      method: "POST",
      public: true,
      body: data,
    });
    if (isLoginSuccess(res)) {
      tokenStore.set(res.accessToken, res.refreshToken);
    }
    return res;
  },

  me: () => apiFetch<AuthUser>("/auth/me"),

  async logout() {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } finally {
      tokenStore.clear();
    }
  },

  changePassword: (oldPassword: string, newPassword: string) =>
    apiFetch("/auth/password/change", {
      method: "PATCH",
      body: { oldPassword, newPassword },
    }),

  setup2FA: () => apiFetch<{ secret: string; qrCode: string }>("/auth/2fa/setup", { method: "POST" }),
  enable2FA: (totpCode: string) => apiFetch("/auth/2fa/enable", { method: "POST", body: { totpCode } }),
  disable2FA: (totpCode: string) => apiFetch("/auth/2fa/disable", { method: "POST", body: { totpCode } }),
};

export const walletApi = {
  me: () => apiFetch<Wallet>("/wallet/me"),
  transactions: (page = 1, limit = 20) =>
    apiFetch<Paginated<WalletTransaction>>(`/wallet/me/transactions?page=${page}&limit=${limit}`),
};

export const servicesApi = {
  list: (params: { platformSlug?: string; categoryId?: string; q?: string; page?: number; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.platformSlug) qs.set("platformSlug", params.platformSlug);
    if (params.categoryId) qs.set("categoryId", params.categoryId);
    if (params.q) qs.set("q", params.q);
    qs.set("page", String(params.page ?? 1));
    qs.set("limit", String(params.limit ?? 100));
    return apiFetch<ApiService[]>(`/services?${qs.toString()}`);
  },
  categoryTree: () => apiFetch<CategoryNode[]>("/categories/tree"),
};

export const ordersApi = {
  list: (params: { page?: number; limit?: number; status?: OrderStatus } = {}) => {
    const qs = new URLSearchParams();
    qs.set("page", String(params.page ?? 1));
    qs.set("limit", String(params.limit ?? 20));
    if (params.status) qs.set("status", params.status);
    return apiFetch<Paginated<ApiOrder>>(`/orders?${qs.toString()}`);
  },
  get: (id: string) => apiFetch<ApiOrder>(`/orders/${id}`),
  create: (data: { service: number; link: string; quantity: number; note?: string; idempotencyKey?: string }) =>
    apiFetch<ApiOrder>("/orders", { method: "POST", body: data }),
  cancel: (id: string) => apiFetch<ApiOrder>(`/orders/${id}/cancel`, { method: "POST" }),
  refill: (id: string) => apiFetch(`/orders/${id}/refill`, { method: "POST" }),
};

export const paymentsApi = {
  gateways: () => apiFetch<PaymentGateway[]>("/payments/gateways"),
  createIntent: (data: { amount: string; gateway: string; returnUrl?: string }) =>
    apiFetch<PaymentIntent>("/payments/intent", { method: "POST", body: data }),
  getIntent: (id: string) => apiFetch<PaymentIntent>(`/payments/intent/${id}`),
  history: (page = 1, limit = 20) =>
    apiFetch<Paginated<PaymentIntent>>(`/payments/me/history?page=${page}&limit=${limit}`),
};

export const usersApi = {
  me: () => apiFetch<AuthUser>("/users/me"),
  updateMe: (data: { fullName?: string }) => apiFetch<AuthUser>("/users/me", { method: "PATCH", body: data }),
  apiKeys: () => apiFetch<ApiKey[]>("/users/me/api-keys"),
  createApiKey: (name: string) =>
    apiFetch<ApiKey>("/users/me/api-keys", { method: "POST", body: { name } }),
  deleteApiKey: (id: string) => apiFetch(`/users/me/api-keys/${id}`, { method: "DELETE" }),
};

export const ticketsApi = {
  list: (page = 1, limit = 20) =>
    apiFetch<import("./types").Paginated<import("./types").Ticket>>(`/tickets?page=${page}&limit=${limit}`),
  get: (id: string) =>
    apiFetch<import("./types").Ticket>(`/tickets/${id}`),
  create: (data: { subject: string; body: string; priority?: "low" | "normal" | "high"; orderId?: string }) =>
    apiFetch<import("./types").Ticket>("/tickets", { method: "POST", body: data }),
  reply: (id: string, body: string) =>
    apiFetch<import("./types").Ticket>(`/tickets/${id}/messages`, { method: "POST", body: { body } }),
  close: (id: string) =>
    apiFetch<{ success: boolean }>(`/tickets/${id}/close`, { method: "POST" }),
};

export const notificationsApi = {
  me: () => apiFetch<ApiNotification[] | Paginated<ApiNotification>>("/notifications/me"),
  markRead: (id: string) => apiFetch(`/notifications/${id}/read`, { method: "POST" }),
};

export { ApiError } from "./client";
export * from "./types";
