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
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import WebhookIcon from "@mui/icons-material/Webhook";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_WIDTH_COLLAPSED = 68;

const platformLogos: Record<string, React.ReactNode> = {
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#010101">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="ig-g" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="25%" stopColor="#FCAF45" />
          <stop offset="50%" stopColor="#F77737" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <path fill="url(#ig-g)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF0000">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  twitter: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#000">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  google: (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
  telegram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#2CA5E0">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
};

const mainNavItems = [
  { id: "dashboard", label: "Tổng Quan", icon: TerminalOutlinedIcon, href: "/dashboard", activeGlow: true },
  { id: "services", label: "Bảng Giá Dịch Vụ", icon: LayersOutlinedIcon, href: "/services" },
  { id: "vip", label: "Gói VIP", icon: EmojiEventsOutlinedIcon, href: "/vip", badge: "NEW" },
  { id: "profile", label: "Hồ Sơ", icon: PersonOutlineOutlinedIcon, href: "/profile" },
  { id: "deposit", label: "Nạp Tiền", icon: CreditCardOutlinedIcon, href: "/deposit" },
  { id: "history", label: "Lịch Sử Giao Dịch", icon: HistoryOutlinedIcon, href: "/history" },
  { id: "api", label: "Tài Liệu API", icon: WebhookIcon, href: "/api" },
  { id: "support", label: "Hỗ Trợ", icon: HeadsetMicOutlinedIcon, href: "/support" },
  { id: "website", label: "Website Con", icon: LanguageOutlinedIcon, href: "/website" },
];

const serviceItems = [
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "twitter", label: "Twitter/X" },
  { id: "google", label: "Google" },
  { id: "telegram", label: "Telegram" },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export default function AppSidebar({ collapsed = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();
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
              background: "linear-gradient(135deg, #1724C9 0%, #0092FF 60%, #45B2FF 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
            }}
          >
            <Typography sx={{ color: "white", fontWeight: 800, fontSize: "12px" }}>SM</Typography>
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
              SocialMedia.vn
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "text.secondary", lineHeight: 1.3 }}>
              socialmedia.vn
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
                      bgcolor: isActive ? alpha("#2563EB", 0.1) : alpha("#0F172A", 0.04),
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
                      background: isActive ? "linear-gradient(135deg, #3B82F6, #2563EB)" : "transparent",
                      transition: "all 150ms ease",
                      ...(isActive && { boxShadow: `0 4px 10px ${alpha("#2563EB", 0.35)}` }),
                    }}
                  >
                    <Icon sx={{ fontSize: 17, color: isActive ? "white" : "text.secondary" }} />
                  </Box>

                  {/* Label — hidden when collapsed */}
                  {!collapsed && (
                    <>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: isActive ? 700 : 500,
                          color: isActive ? "primary.main" : alpha("#0F172A", 0.7),
                          flex: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.label}
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
                            background: "linear-gradient(90deg, #0EA5E9, #06B6D4)",
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
                    <Tooltip title={item.label} placement="right" arrow>
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
              Sản Phẩm & Dịch Vụ
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
                    bgcolor: isOpen ? alpha("#0F172A", 0.04) : "transparent",
                    "&:hover": { bgcolor: alpha("#0F172A", 0.05) },
                    transition: "all 200ms ease",
                  }}
                >
                  <Box
                    sx={{
                      width: 34, height: 34, borderRadius: "10px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                      bgcolor: alpha("#0F172A", 0.04),
                    }}
                  >
                    {platformLogos[service.id]}
                  </Box>

                  {!collapsed && (
                    <>
                      <Typography sx={{ fontSize: "13px", fontWeight: 500, color: alpha("#0F172A", 0.7), flex: 1 }}>
                        {service.label}
                      </Typography>
                      <ChevronRightIcon
                        sx={{
                          fontSize: 16, color: "text.disabled", flexShrink: 0,
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
                      {["Theo dõi", "Tương tác", "View"].map((sub) => (
                        <ListItemButton
                          key={sub}
                          sx={{
                            borderRadius: "8px", py: 0.75, px: 1.5,
                            "&:hover": { bgcolor: alpha("#0F172A", 0.05) },
                          }}
                        >
                          <Typography sx={{ fontSize: "12px", fontWeight: 500, color: alpha("#0F172A", 0.6) }}>
                            {sub}
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
