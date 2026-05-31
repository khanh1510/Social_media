import type { PlatformCategory } from "@/types";

export const platformColors: Record<string, { border: string; bg: string; text: string; badge: string; glow: string }> = {
  facebook: {
    border: "#BFDBFE",
    bg: "#EFF6FF",
    text: "#2563EB",
    badge: "#DBEAFE",
    glow: "rgba(37,99,235,0.12)",
  },
  tiktok: {
    border: "#E9D5FF",
    bg: "#F5F3FF",
    text: "#7C3AED",
    badge: "#EDE9FE",
    glow: "rgba(124,58,237,0.12)",
  },
  instagram: {
    border: "#FBCFE8",
    bg: "#FDF2F8",
    text: "#DB2777",
    badge: "#FCE7F3",
    glow: "rgba(219,39,119,0.12)",
  },
  youtube: {
    border: "#FECACA",
    bg: "#FEF2F2",
    text: "#DC2626",
    badge: "#FEE2E2",
    glow: "rgba(220,38,38,0.12)",
  },
  twitter: {
    border: "#BAE6FD",
    bg: "#F0F9FF",
    text: "#0284C7",
    badge: "#E0F2FE",
    glow: "rgba(2,132,199,0.12)",
  },
  google: {
    border: "#FED7AA",
    bg: "#FFF7ED",
    text: "#EA580C",
    badge: "#FFEDD5",
    glow: "rgba(234,88,12,0.12)",
  },
  telegram: {
    border: "#BAE6FD",
    bg: "#F0F9FF",
    text: "#0284C7",
    badge: "#E0F2FE",
    glow: "rgba(2,132,199,0.12)",
  },
};

export const servicesData: PlatformCategory[] = [
  {
    id: "facebook",
    label: "Facebook",
    color: "blue",
    services: [
      { id: 101, name: "Tăng theo dõi Facebook giá rẻ - tốc độ nhanh", min: 100, max: 50000, price: 7, speed: "fast", durationMin: 2, status: "active" },
      { id: 102, name: "Tăng like bài viết Facebook - bảo hành 30 ngày", min: 50, max: 10000, price: 12, speed: "fast", durationMin: 5, status: "active" },
      { id: 103, name: "Tăng share bài viết Facebook - tài khoản thật", min: 10, max: 5000, price: 25, speed: "medium", durationMin: 30, status: "active" },
      { id: 104, name: "Tăng mắt livestream Facebook - real time", min: 100, max: 2000, price: 150, speed: "fast", durationMin: 1, status: "active" },
      { id: 105, name: "Tăng comment Facebook - nội dung tùy chỉnh", min: 10, max: 1000, price: 80, speed: "slow", durationMin: 60, status: "maintenance" },
    ],
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "purple",
    services: [
      { id: 201, name: "Tăng follow TikTok - tài khoản Việt Nam", min: 100, max: 100000, price: 5, speed: "fast", durationMin: 3, status: "active" },
      { id: 202, name: "Tăng tim TikTok - bảo hành 7 ngày", min: 100, max: 50000, price: 4, speed: "fast", durationMin: 2, status: "active" },
      { id: 203, name: "Tăng view video TikTok - organic", min: 1000, max: 500000, price: 1, speed: "fast", durationMin: 10, status: "active" },
      { id: 204, name: "Tăng share TikTok - real account", min: 50, max: 10000, price: 20, speed: "medium", durationMin: 20, status: "active" },
    ],
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "pink",
    services: [
      { id: 301, name: "Tăng theo dõi Instagram - tài nguyên ẩn siêu VIP", min: 100, max: 10000, price: 15, speed: "fast", durationMin: 2, status: "maintenance" },
      { id: 302, name: "Tăng like ảnh Instagram - bảo hành 30 ngày", min: 50, max: 20000, price: 8, speed: "fast", durationMin: 5, status: "active" },
      { id: 303, name: "Tăng view Reels Instagram - tốc độ cao", min: 1000, max: 1000000, price: 1, speed: "fast", durationMin: 15, status: "active" },
      { id: 304, name: "Tăng comment Instagram - nội dung Việt", min: 10, max: 2000, price: 100, speed: "slow", durationMin: 120, status: "active" },
    ],
  },
  {
    id: "youtube",
    label: "YouTube",
    color: "red",
    services: [
      { id: 401, name: "Tăng view YouTube - giờ xem thật", min: 500, max: 100000, price: 3, speed: "medium", durationMin: 60, status: "active" },
      { id: 402, name: "Tăng subscriber YouTube - bảo hành 60 ngày", min: 100, max: 10000, price: 35, speed: "slow", durationMin: 120, status: "active" },
      { id: 403, name: "Tăng like video YouTube - tài khoản thật", min: 50, max: 5000, price: 18, speed: "fast", durationMin: 10, status: "active" },
    ],
  },
  {
    id: "twitter",
    label: "Twitter/X",
    color: "sky",
    services: [
      { id: 501, name: "Tăng follow Twitter/X - tài khoản quốc tế", min: 100, max: 50000, price: 10, speed: "fast", durationMin: 5, status: "active" },
      { id: 502, name: "Tăng like tweet Twitter/X", min: 50, max: 10000, price: 6, speed: "fast", durationMin: 3, status: "active" },
    ],
  },
  {
    id: "telegram",
    label: "Telegram",
    color: "sky",
    services: [
      { id: 601, name: "Tăng thành viên nhóm Telegram - thật 100%", min: 100, max: 50000, price: 8, speed: "medium", durationMin: 30, status: "active" },
      { id: 602, name: "Tăng view bài đăng Telegram channel", min: 500, max: 500000, price: 1, speed: "fast", durationMin: 5, status: "active" },
    ],
  },
];
