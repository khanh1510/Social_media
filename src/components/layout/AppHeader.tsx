"use client";

import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  alpha,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { PanelLeftClose, PanelLeftOpen, Search, Sun, ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { formatVND } from "@/lib/format";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "./AppSidebar";

interface AppHeaderProps {
  onMobileMenuOpen: () => void;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
}

// Vietnam flag SVG inline
function VNFlag() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" style={{ borderRadius: 3, flexShrink: 0 }}>
      <rect width="32" height="32" fill="#DA251D" rx="2" />
      <polygon
        fill="#FFCD00"
        points="16,6 18.5,13 26,13 20,17.5 22.5,25 16,20 9.5,25 12,17.5 6,13 13.5,13"
      />
    </svg>
  );
}

export default function AppHeader({ onMobileMenuOpen, onToggleCollapse, collapsed }: AppHeaderProps) {
  const sidebarW = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;
  const { user, wallet, logout } = useAuth();
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const displayName = user?.fullName || user?.username || "";
  const initials = displayName
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleLogout() {
    setMenuAnchor(null);
    await logout();
    router.replace("/login");
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { xs: "100%", md: `calc(100% - ${sidebarW}px)` },
        ml: { xs: 0, md: `${sidebarW}px` },
        transition: "width 250ms ease, margin-left 250ms ease",
        bgcolor: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        color: "text.primary",
        zIndex: (theme) => theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "60px !important",
          px: { xs: 1.5, sm: 2.5 },
          gap: 1,
        }}
      >
        {/* Collapse sidebar toggle — desktop */}
        <Tooltip title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}>
          <IconButton
            onClick={onToggleCollapse}
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              color: "text.secondary",
              flexShrink: 0,
              display: { xs: "none", md: "flex" },
              "&:hover": { bgcolor: alpha("#0F172A", 0.06), color: "text.primary" },
              transition: "all 150ms ease",
            }}
          >
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </IconButton>
        </Tooltip>

        {/* Mobile menu toggle */}
        <Tooltip title="Menu">
          <IconButton
            onClick={onMobileMenuOpen}
            size="small"
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              color: "text.secondary",
              flexShrink: 0,
              display: { xs: "flex", md: "none" },
              "&:hover": { bgcolor: alpha("#0F172A", 0.06), color: "text.primary" },
              transition: "all 150ms ease",
            }}
          >
            <PanelLeftOpen size={20} />
          </IconButton>
        </Tooltip>

        {/* Search bar — ẩn trên mobile nhỏ */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            gap: 1,
            ml: 1.5,
            px: 1.5,
            height: 36,
            borderRadius: "999px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: alpha("#F8FAFC", 0.8),
            width: 280,
            cursor: "text",
            transition: "all 150ms ease",
            "&:hover": {
              bgcolor: "background.paper",
              borderColor: alpha("#0EA5E9", 0.4),
              boxShadow: `0 0 0 3px ${alpha("#0EA5E9", 0.08)}`,
            },
          }}
        >
          <Search size={16} color="#0EA5E9" style={{ flexShrink: 0 }} />
          <InputBase
            placeholder="Tìm kiếm trang, dịch vụ..."
            sx={{
              flex: 1,
              fontSize: "13px",
              color: "text.secondary",
              "& input::placeholder": { color: "text.disabled", opacity: 1 },
              "& input": { p: 0 },
            }}
          />
          {/* ⌘K shortcut badge */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              px: 0.75,
              py: 0.25,
              borderRadius: "5px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: "10px", color: "text.disabled", fontWeight: 600, lineHeight: 1 }}>
              ⌘K
            </Typography>
          </Box>
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Right: theme + language + account */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
          {/* Theme toggle */}
          <Tooltip title="Chọn giao diện">
            <IconButton
              size="small"
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                color: "text.secondary",
                "&:hover": { bgcolor: alpha("#0EA5E9", 0.08), color: "info.main" },
                transition: "all 150ms ease",
              }}
            >
              <Sun size={18} />
            </IconButton>
          </Tooltip>

          {/* Language */}
          <Tooltip title="Tiếng Việt">
            <IconButton
              size="small"
              sx={{
                width: 36,
                height: 36,
                borderRadius: "9px",
                "&:hover": { bgcolor: alpha("#0F172A", 0.05) },
                transition: "all 150ms ease",
              }}
            >
              <VNFlag />
            </IconButton>
          </Tooltip>

          {/* Account button */}
          <Box
            component="button"
            onClick={(e: React.MouseEvent<HTMLElement>) => setMenuAnchor(e.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              cursor: "pointer",
              border: "none",
              background: "none",
              borderRadius: "999px",
              pl: 0.5,
              pr: { xs: 0.5, lg: 1.5 },
              py: 0.5,
              "&:hover": { bgcolor: alpha("#0EA5E9", 0.06) },
              transition: "all 150ms ease",
            }}
          >
            {/* Avatar with gradient ring + online dot */}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box
                sx={{
                  p: "2px",
                  borderRadius: "50%",
                  background: "#38BDF8",
                  boxShadow: "0 2px 8px rgba(14,165,233,0.3)",
                }}
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    fontSize: "11px",
                    fontWeight: 700,
                    bgcolor: "primary.main",
                    border: "2px solid white",
                  }}
                >
                  {initials || "?"}
                </Avatar>
              </Box>
              {/* Online indicator */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  bgcolor: "#10B981",
                  border: "2px solid white",
                }}
              />
            </Box>

            {/* Name + balance — hidden on mobile */}
            <Box sx={{ display: { xs: "none", lg: "block" }, textAlign: "left", minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "text.primary",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {displayName}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "success.main",
                  lineHeight: 1.2,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {wallet ? formatVND(wallet.balance) : "—"}
              </Typography>
            </Box>

            {/* Chevron */}
            <Box sx={{ display: { xs: "none", lg: "block" }, flexShrink: 0, lineHeight: 0 }}>
              <ChevronDown size={16} color="#94A3B8" />
            </Box>
          </Box>

          {/* Account menu */}
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>{displayName}</Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setMenuAnchor(null); router.push("/profile"); }}>
              <ListItemIcon><UserIcon size={16} /></ListItemIcon>
              Hồ sơ
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon><LogOut size={16} color="#EF4444" /></ListItemIcon>
              Đăng xuất
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
