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
  Chip,
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import KeyboardCommandKeyIcon from "@mui/icons-material/KeyboardCommandKey";
import ChevronDownIcon from "@mui/icons-material/ExpandMore";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
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
            {collapsed ? <MenuIcon sx={{ fontSize: 20 }} /> : <MenuOpenIcon sx={{ fontSize: 20 }} />}
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
            <MenuIcon sx={{ fontSize: 20 }} />
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
          <SearchIcon sx={{ fontSize: 16, color: "info.main", flexShrink: 0 }} />
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
            <KeyboardCommandKeyIcon sx={{ fontSize: 10, color: "text.disabled" }} />
            <Typography sx={{ fontSize: "10px", color: "text.disabled", fontWeight: 600, lineHeight: 1 }}>
              K
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
              <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
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
                  background: "linear-gradient(135deg, #38BDF8, #22D3EE, #3B82F6)",
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
                  JK
                </Avatar>
              </Box>
              {/* Online indicator */}
              <FiberManualRecordIcon
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  fontSize: 11,
                  color: "#10B981",
                  filter: "drop-shadow(0 0 0 2px white)",
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
                John Kenvin Mitnick
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
                0 ₫
              </Typography>
            </Box>

            {/* Chevron */}
            <ChevronDownIcon
              sx={{
                fontSize: 16,
                color: "text.disabled",
                display: { xs: "none", lg: "block" },
                flexShrink: 0,
              }}
            />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
