"use client";

// Fetch wrapper cho backend smm-panel.
// - Tự gắn Authorization: Bearer <accessToken>
// - Khi 401: tự gọi POST /auth/refresh rồi retry 1 lần
// - Lỗi backend theo format mặc định NestJS: { message: string | string[], error, statusCode }

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const ACCESS_KEY = "smm.accessToken";
const REFRESH_KEY = "smm.refreshToken";

export class ApiError extends Error {
  status: number;
  /** message gốc từ backend (có thể là mảng lỗi validation) */
  raw: string[];

  constructor(status: number, messages: string[]) {
    super(translateError(status, messages));
    this.status = status;
    this.raw = messages;
  }
}

// Map các message backend hay gặp → tiếng Việt
const ERROR_VI: Record<string, string> = {
  "Invalid credentials.": "Sai email/tên đăng nhập hoặc mật khẩu.",
  "User is not active.": "Tài khoản đang bị khóa hoặc chưa kích hoạt.",
  "Invalid 2FA code.": "Mã xác thực 2FA không đúng.",
  "Missing bearer token.": "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.",
  "Email already exists.": "Email đã được sử dụng.",
  "Username already exists.": "Tên đăng nhập đã được sử dụng.",
  "Insufficient balance.": "Số dư ví không đủ, vui lòng nạp thêm tiền.",
  "Service not found.": "Dịch vụ không tồn tại hoặc đã ngừng hoạt động.",
  "Order not found.": "Không tìm thấy đơn hàng.",
};

function translateError(status: number, messages: string[]): string {
  for (const m of messages) {
    if (ERROR_VI[m]) return ERROR_VI[m];
  }
  if (status === 429) return "Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.";
  if (status === 401) return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.";
  if (status === 403) return "Bạn không có quyền thực hiện thao tác này.";
  if (status >= 500) return "Hệ thống đang gặp sự cố, vui lòng thử lại sau.";
  return messages[0] ?? "Đã có lỗi xảy ra.";
}

export const tokenStore = {
  getAccess: () => (typeof window === "undefined" ? null : localStorage.getItem(ACCESS_KEY)),
  getRefresh: () => (typeof window === "undefined" ? null : localStorage.getItem(REFRESH_KEY)),
  set(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS_KEY, accessToken);
    localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Không gắn token (login/register/refresh) */
  public?: boolean;
  headers?: Record<string, string>;
}

async function parseError(res: Response): Promise<ApiError> {
  let messages: string[] = [];
  try {
    const json = await res.json();
    const m = json?.message ?? json?.error?.message;
    messages = Array.isArray(m) ? m : m ? [m] : [];
  } catch {
    // body không phải JSON
  }
  return new ApiError(res.status, messages);
}

// Single-flight refresh: nhiều request 401 cùng lúc chỉ refresh 1 lần
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = tokenStore.getRefresh();
      if (!refreshToken) return false;
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) {
          tokenStore.clear();
          return false;
        }
        const json = await res.json();
        if (json?.accessToken && json?.refreshToken) {
          tokenStore.set(json.accessToken, json.refreshToken);
          return true;
        }
        tokenStore.clear();
        return false;
      } catch {
        return false;
      } finally {
        // cho phép lần refresh kế tiếp
        setTimeout(() => (refreshPromise = null), 0);
      }
    })();
  }
  return refreshPromise;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const doFetch = async (): Promise<Response> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };
    if (!options.public) {
      const token = tokenStore.getAccess();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    return fetch(`${API_URL}${path}`, {
      method: options.method ?? "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  };

  let res = await doFetch();

  if (res.status === 401 && !options.public && tokenStore.getRefresh()) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await doFetch();
    }
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export { API_URL };
