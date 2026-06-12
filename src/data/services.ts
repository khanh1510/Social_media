// Chỉ còn bảng màu theo platform — danh sách dịch vụ lấy từ backend qua useCatalog().
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
