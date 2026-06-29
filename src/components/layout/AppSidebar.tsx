"use client";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Chip,
  Divider,
  Collapse,
  Tooltip,
  alpha,
} from "@mui/material";
import { LayoutDashboard, LayoutGrid, Crown, User, CreditCard, History, Webhook, Headphones, ChevronRight } from "lucide-react";
import {
  siFacebook, siTiktok, siInstagram, siYoutube, siX, siGoogle, siTelegram,
} from "simple-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 68;

function SiIcon({ icon, size = 18, color }: { icon: { path: string }; size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} role="img" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

const platformLogos: Record<string, React.ReactNode> = {
  facebook: <SiIcon icon={siFacebook} color={`#${siFacebook.hex}`} />,
  tiktok: <SiIcon icon={siTiktok} color="currentColor" />,
  instagram: <SiIcon icon={siInstagram} color="#C13584" />,
  youtube: <SiIcon icon={siYoutube} color={`#${siYoutube.hex}`} />,
  twitter: <SiIcon icon={siX} color="currentColor" />,
  google: <SiIcon icon={siGoogle} color={`#${siGoogle.hex}`} />,
  telegram: <SiIcon icon={siTelegram} color={`#${siTelegram.hex}`} />,
};

const mainNavItems: { id: string; label: string; icon: React.ElementType; href: string; activeGlow?: boolean; badge?: string }[] = [
  { id: "dashboard", label: "Tổng Quan", icon: LayoutDashboard, href: "/dashboard", activeGlow: true },
  { id: "services", label: "Bảng Giá Dịch Vụ", icon: LayoutGrid, href: "/services" },
  { id: "vip", label: "Gói VIP", icon: Crown, href: "/vip", badge: "NEW" },
  { id: "profile", label: "Hồ Sơ", icon: User, href: "/profile" },
  { id: "deposit", label: "Nạp Tiền", icon: CreditCard, href: "/deposit" },
  { id: "history", label: "Lịch Sử Giao Dịch", icon: History, href: "/history" },
  { id: "api", label: "Tài Liệu API", icon: Webhook, href: "/api" },
  { id: "support", label: "Hỗ Trợ", icon: Headphones, href: "/support" },
];

const serviceItems = [
  {
    id: "facebook", label: "Facebook",
    subs: [
      { slug: "facebook-page-likes", label: "Page Likes" },
      { slug: "facebook-followers", label: "Followers" },
      { slug: "facebook-post-likes", label: "Post Likes" },
      { slug: "facebook-comments", label: "Comments" },
      { slug: "facebook-shares", label: "Shares" },
      { slug: "facebook-video-views", label: "Video Views" },
    ],
  },
  {
    id: "tiktok", label: "TikTok",
    subs: [
      { slug: "tiktok-followers", label: "Followers" },
      { slug: "tiktok-likes", label: "Likes" },
      { slug: "tiktok-views", label: "Views" },
      { slug: "tiktok-comments", label: "Comments" },
      { slug: "tiktok-shares", label: "Shares" },
    ],
  },
  {
    id: "instagram", label: "Instagram",
    subs: [
      { slug: "instagram-followers", label: "Followers" },
      { slug: "instagram-likes", label: "Likes" },
      { slug: "instagram-views", label: "Views" },
      { slug: "instagram-reels-views", label: "Reels Views" },
      { slug: "instagram-story-views", label: "Story Views" },
    ],
  },
  {
    id: "youtube", label: "YouTube",
    subs: [
      { slug: "youtube-views", label: "Views" },
      { slug: "youtube-shorts-views", label: "Shorts Views" },
      { slug: "youtube-subscribers", label: "Subscribers" },
      { slug: "youtube-likes", label: "Likes" },
    ],
  },
  {
    id: "twitter", label: "Twitter/X",
    subs: [
      { slug: "twitter-followers", label: "Followers" },
      { slug: "twitter-likes", label: "Likes" },
      { slug: "twitter-views", label: "Views" },
    ],
  },
  {
    id: "telegram", label: "Telegram",
    subs: [
      { slug: "telegram-members", label: "Members" },
      { slug: "telegram-post-views", label: "Post Views" },
    ],
  },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export default function AppSidebar({ collapsed = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const tNav = useTranslations("nav");
  const tSeeding = useTranslations("seedingTypes");
  const [openService, setOpenService] = useState<string | null>(null);

  const handleServiceToggle = (id: string) => {
    if (!collapsed) setOpenService((prev) => (prev === id ? null : id));
  };

  const width = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <Box
      component="nav"
      sx={{
        width,
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1200,
        transition: "width 250ms ease",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          transition: "width 250ms ease",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            px: collapsed ? 1.25 : 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            minHeight: 60,
            flexShrink: 0,
            overflow: "hidden",
            transition: "padding 250ms ease",
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "#1724C9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            }}
          >
            <Typography sx={{ color: "white", fontWeight: 800, fontSize: "12px" }}>SG</Typography>
          </Box>
          <Box
            sx={{
              minWidth: 0,
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              overflow: "hidden",
              transition: "opacity 200ms ease, width 250ms ease",
              whiteSpace: "nowrap",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "14px", color: "text.primary", lineHeight: 1.3 }}>
              SignalGit
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "text.secondary", lineHeight: 1.3 }}>
              {tNav("panelTitle")}
            </Typography>
          </Box>
        </Box>

        {/* Scrollable nav */}
        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", px: collapsed ? 1 : 1.5, py: 1.5, transition: "padding 250ms ease" }}>
          {/* Group 1: Main menu */}
          <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.25, mb: 0.5 }}>
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;

              const button = (
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={isActive}
                  onClick={onClose}
                  sx={{
                    borderRadius: "11px",
                    py: 1.125,
                    px: collapsed ? 1 : 1.25,
                    gap: collapsed ? 0 : 1.25,
                    justifyContent: collapsed ? "center" : "flex-start",
                    position: "relative",
                    overflow: "visible",
                    minWidth: 0,
                    transition: "all 200ms ease",
                    ...(isActive && {
                      bgcolor: alpha("#2563EB", 0.08),
                      "&::before": !collapsed
                        ? {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "18%",
                            height: "64%",
                            width: 3,
                            borderRadius: "0 3px 3px 0",
                            bgcolor: "primary.main",
                          }
                        : {},
                    }),
                    "&.Mui-selected": {
                      bgcolor: alpha("#2563EB", 0.08),
                      "&:hover": { bgcolor: alpha("#2563EB", 0.1) },
                    },
                    "&:hover": {
                      bgcolor: isActive ? alpha("#2563EB", 0.1) : "sidebar.hoverItemBg",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: isActive ? "#3B82F6" : "transparent",
                      transition: "all 150ms ease",
                      ...(isActive && { boxShadow: `0 4px 10px ${alpha("#2563EB", 0.35)}` }),
                      "& svg": { color: isActive ? "#FFFFFF" : "text.secondary" },
                    }}
                  >
                    <Icon size={17} />
                  </Box>

                  {/* Label — hidden when collapsed */}
                  {!collapsed && (
                    <>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "primary.main" : "text.primary",
                          flex: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {tNav(item.id)}
                      </Typography>

                      {isActive && (
                        <Box
                          sx={{
                            width: 8, height: 8, borderRadius: "50%",
                            bgcolor: "primary.main",
                            boxShadow: "0 0 6px rgba(37,99,235,0.6)",
                            flexShrink: 0,
                          }}
                        />
                      )}

                      {item.badge && !isActive && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: 17, fontSize: "9px", fontWeight: 700,
                            background: "#0EA5E9",
                            color: "white", border: "none", borderRadius: "5px",
                            "& .MuiChip-label": { px: 0.75 },
                          }}
                        />
                      )}
                    </>
                  )}
                </ListItemButton>
              );

              return (
                <ListItem key={item.id} disablePadding>
                  {collapsed ? (
                    <Tooltip title={tNav(item.id)} placement="right" arrow>
                      <Box sx={{ width: "100%" }}>{button}</Box>
                    </Tooltip>
                  ) : (
                    button
                  )}
                </ListItem>
              );
            })}
          </List>

          {/* Divider + Group label */}
          <Divider sx={{ my: 1.5 }} />

          {!collapsed && (
            <Typography
              sx={{
                fontSize: "10px", fontWeight: 700, color: "text.disabled",
                letterSpacing: "0.1em", textTransform: "uppercase",
                px: 1.25, mb: 1,
              }}
            >
              {tNav("sectionProducts")}
            </Typography>
          )}

          {/* Group 2: Services */}
          <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            {serviceItems.map((service) => {
              const isOpen = openService === service.id && !collapsed;

              const trigger = (
                <ListItemButton
                  onClick={() => handleServiceToggle(service.id)}
                  sx={{
                    borderRadius: "11px",
                    py: 1,
                    px: collapsed ? 1 : 1.25,
                    gap: collapsed ? 0 : 1.25,
                    justifyContent: collapsed ? "center" : "flex-start",
                    bgcolor: isOpen ? "sidebar.hoverItemBg" : "transparent",
                    "&:hover": { bgcolor: "sidebar.hoverItemBg" },
                    transition: "all 200ms ease",
                  }}
                >
                  <Box
                    sx={{
                      width: 34, height: 34, borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      bgcolor: "sidebar.hoverItemBg",
                      // TikTok & Twitter/X dùng currentColor → kế thừa màu này
                      color: "text.primary",
                    }}
                  >
                    {platformLogos[service.id]}
                  </Box>

                  {!collapsed && (
                    <>
                      <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary", flex: 1 }}>
                        {service.label}
                      </Typography>
                      <ChevronRight
                        size={16}
                        color="#94A3B8"
                        style={{
                          flexShrink: 0,
                          transition: "transform 200ms ease",
                          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        }}
                      />
                    </>
                  )}
                </ListItemButton>
              );

              return (
                <ListItem key={service.id} disablePadding sx={{ flexDirection: "column", alignItems: "stretch" }}>
                  {collapsed ? (
                    <Tooltip title={service.label} placement="right" arrow>
                      <Box sx={{ width: "100%" }}>{trigger}</Box>
                    </Tooltip>
                  ) : (
                    trigger
                  )}

                  <Collapse in={isOpen} timeout={200}>
                    <Box sx={{ pl: 2, pt: 0.5, pb: 0.5 }}>
                      {service.subs.map((sub) => (
                        <ListItemButton
                          key={sub.slug}
                          component={Link}
                          href={`/seeding?platform=${service.id}&serviceType=${encodeURIComponent(sub.slug)}&tab=order`}
                          onClick={onClose}
                          sx={{
                            borderRadius: "8px", py: 0.75, px: 1.5,
                            "&:hover": { bgcolor: "sidebar.hoverItemBg" },
                          }}
                        >
                          <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "text.secondary" }}>
                            {tSeeding(sub.slug)}
                          </Typography>
                        </ListItemButton>
                      ))}
                    </Box>
                  </Collapse>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>
    </Box>
  );
}
