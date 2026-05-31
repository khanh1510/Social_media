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
  icon: React.ElementType;
  color: "primary" | "success" | "info" | "warning";
}

export type ServiceStatus = "active" | "maintenance" | "slow";
export type ServiceSpeed = "fast" | "medium" | "slow";
export type PlatformId = "facebook" | "tiktok" | "instagram" | "youtube" | "twitter" | "google" | "telegram";

export interface Service {
  id: number;
  name: string;
  min: number;
  max: number;
  price: number; // ₫ per 1
  speed: ServiceSpeed;
  durationMin: number; // estimated minutes
  status: ServiceStatus;
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

export interface Notification {
  id: string;
  userName: string;
  userAvatar?: string;
  verified: boolean;
  platform: "facebook" | "tiktok" | "instagram" | "youtube" | "twitter" | "global";
  timeAgo: string;
  title: string;
  description: string;
}
