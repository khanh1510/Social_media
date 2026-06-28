export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: string;
}

export interface StatCardData {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "info" | "warning";
}

export type ServiceStatus = "active" | "maintenance" | "slow";
export type ServiceSpeed = "fast" | "medium" | "slow";
export type PlatformId = "facebook" | "tiktok" | "instagram" | "youtube" | "twitter" | "google" | "telegram";

export interface Service {
  /** publicId từ backend — dùng làm `service` khi đặt đơn */
  id: number;
  /** UUID backend */
  uuid?: string;
  name: string;
  description?: string | null;
  min: number;
  max: number;
  price: number; // ₫ per 1 (backend rate / 1000)
  speed: ServiceSpeed;
  durationMin: number; // estimated minutes
  status: ServiceStatus;
  refill?: boolean;
  cancel?: boolean;
  dripfeed?: boolean;
  categorySlug?: string;
  /** averageTime gốc từ backend, vd "10-30 phút", "1-6 giờ" */
  averageTime?: string | null;
}

export interface PlatformCategory {
  id: PlatformId;
  label: string;
  color: string;       // CSS color token e.g. "blue" | "pink"
  services: Service[];
}

export type VipPlanDuration = "30d" | "3m" | "6m" | "1y";

export interface VipPlanPricing {
  duration: VipPlanDuration;
  label: string;
  discount: number; // 0 = no discount
  pricePerMonth: number; // ₫
}

export interface VipPlan {
  id: string;
  title: string;
  platform: PlatformId;
  serviceType: string; // e.g. "Like", "Follow", "View"
  description: string;
  minPerPost: number;
  maxPerPost: number;
  maxPostsPerDay: number;
  pricing: VipPlanPricing[];
  featured?: boolean;
}

// ── Seeding Orders ────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

export interface SeedingOrder {
  id: string;
  serviceId: number;
  serviceName: string;
  platform: PlatformId;
  serviceType: string;
  link: string;
  quantity: number;
  pricePerUnit: number; // ₫ per 1
  totalCost: number;    // ₫
  note?: string;
  status: OrderStatus;
  progress: number;     // 0–100
  createdAt: string;    // ISO date string
  startedAt?: string;
  completedAt?: string;
}

export interface Notification {
  id: string;
  userName: string;
  userAvatar?: string;
  verified: boolean;
  platform: "facebook" | "tiktok" | "instagram" | "youtube" | "twitter" | "global";
  timeAgo: string;
  title: string;
  description: string;
  isRead: boolean;
  notifType?: string;
}
