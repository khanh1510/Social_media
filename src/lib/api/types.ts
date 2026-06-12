// Types khớp response thật của backend smm-panel (NestJS).
// Lưu ý: tiền luôn là string DECIMAL (vd "10.5000"), rate là giá trên 1000 đơn vị.

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "STAFF" | "RESELLER" | "USER";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "PENDING_VERIFICATION";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName?: string | null;
  role: UserRole;
  status: UserStatus;
}

export interface LoginSuccess {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface LoginRequires2FA {
  requires2FA: true;
}

export type LoginResponse = LoginSuccess | LoginRequires2FA;

export function isLoginSuccess(r: LoginResponse): r is LoginSuccess {
  return (r as LoginSuccess).accessToken !== undefined;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: string;
  currency: string;
  totalDeposited: string;
  totalSpent: string;
}

export type TransactionType =
  | "DEPOSIT"
  | "ORDER_PAYMENT"
  | "REFUND"
  | "ADJUSTMENT"
  | "WITHDRAWAL";

export interface WalletTransaction {
  id: string;
  type: string;
  amount: string;
  balanceBefore?: string;
  balanceAfter?: string;
  description?: string | null;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sortOrder: number;
  isActive: boolean;
  allowedTypes: string[];
  parentId: string | null;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

export type ServiceType =
  | "DEFAULT"
  | "CUSTOM_COMMENTS"
  | "MENTIONS"
  | "PACKAGE"
  | "DRIP_FEED"
  | "SUBSCRIPTIONS"
  | "POLL";

export interface ApiService {
  id: string;
  publicId: number;
  name: string;
  description?: string | null;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  type: ServiceType;
  /** Giá trên 1000 đơn vị, string DECIMAL */
  rate: string;
  min: number;
  max: number;
  dripfeed: boolean;
  refill: boolean;
  cancel: boolean;
  averageTime?: string | null;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PARTIAL"
  | "CANCELED"
  | "FAILED"
  | "ERROR";

export interface ApiOrder {
  id: string;
  orderNumber: number;
  serviceId: string;
  servicePublicId?: number;
  serviceName?: string;
  link: string;
  quantity: number;
  startCount: number | null;
  remains: number | null;
  /** Tổng tiền, string DECIMAL */
  charge: string;
  currency: string;
  status: OrderStatus;
  createdAt: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface PaymentGateway {
  name: string;
  active: boolean;
}

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "REFUNDED";

export interface PaymentIntent {
  id: string;
  gateway: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  redirectUrl?: string | null;
  clientSecret?: string | null;
  qrCode?: string | null;
  createdAt?: string;
  expiresAt?: string | null;
  [key: string]: unknown;
}

export interface ApiNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export interface ApiKey {
  id: string;
  name?: string | null;
  keyPrefix?: string;
  /** Chỉ trả về đầy đủ ngay khi tạo */
  key?: string;
  isActive?: boolean;
  createdAt: string;
  lastUsedAt?: string | null;
  expiresAt?: string | null;
}
