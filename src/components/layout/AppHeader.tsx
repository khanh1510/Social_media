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
import { PanelLeftClose, PanelLeftOpen, Search, Sun, ChevronDown, LogOut, User as UserIcon, LayoutDashboard, LayoutGrid, Crown, CreditCard, History, Webhook, Headphones, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { formatVND } from "@/lib/format";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "./AppSidebar";

const SEARCH_ITEMS = [
  { label: "Tổng Quan", href: "/dashboard", icon: LayoutDashboard, group: "Trang" },
  { label: "Bảng Giá Dịch Vụ", href: "/services", icon: LayoutGrid, group: "Trang" },
  { label: "Gói VIP", href: "/vip", icon: Crown, group: "Trang" },
  { label: "Nạp Tiền", href: "/deposit", icon: CreditCard, group: "Trang" },
  { label: "Lịch Sử Giao Dịch", href: "/history", icon: History, group: "Trang" },
  { label: "Tài Liệu API", href: "/api", icon: Webhook, group: "Trang" },
  { label: "Hỗ Trợ", href: "/support", icon: Headphones, group: "Trang" },
  { label: "Hồ Sơ", href: "/profile", icon: UserIcon, group: "Trang" },
  { label: "Facebook — Page Likes", href: "/seeding?platform=facebook&category=facebook-page-likes", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Facebook — Followers", href: "/seeding?platform=facebook&category=facebook-followers", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Facebook — Post Likes", href: "/seeding?platform=facebook&category=facebook-post-likes", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Facebook — Comments", href: "/seeding?platform=facebook&category=facebook-comments", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Facebook — Shares", href: "/seeding?platform=facebook&category=facebook-shares", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Facebook — Video Views", href: "/seeding?platform=facebook&category=facebook-video-views", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "TikTok — Followers", href: "/seeding?platform=tiktok&category=tiktok-followers", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "TikTok — Likes", href: "/seeding?platform=tiktok&category=tiktok-likes", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "TikTok — Views", href: "/seeding?platform=tiktok&category=tiktok-views", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "TikTok — Comments", href: "/seeding?platform=tiktok&category=tiktok-comments", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "TikTok — Shares", href: "/seeding?platform=tiktok&category=tiktok-shares", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Instagram — Followers", href: "/seeding?platform=instagram&category=instagram-followers", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Instagram — Likes", href: "/seeding?platform=instagram&category=instagram-likes", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Instagram — Views", href: "/seeding?platform=instagram&category=instagram-views", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Instagram — Reels Views", href: "/seeding?platform=instagram&category=instagram-reels-views", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Instagram — Story Views", href: "/seeding?platform=instagram&category=instagram-story-views", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "YouTube — Views", href: "/seeding?platform=youtube&category=youtube-views", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "YouTube — Shorts Views", href: "/seeding?platform=youtube&category=youtube-shorts-views", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "YouTube — Subscribers", href: "/seeding?platform=youtube&category=youtube-subscribers", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "YouTube — Likes", href: "/seeding?platform=youtube&category=youtube-likes", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Twitter/X — Followers", href: "/seeding?platform=twitter&category=twitter-followers", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Twitter/X — Likes", href: "/seeding?platform=twitter&category=twitter-likes", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Twitter/X — Views", href: "/seeding?platform=twitter&category=twitter-views", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Telegram — Members", href: "/seeding?platform=telegram&category=telegram-members", icon: LayoutGrid, group: "Dịch vụ" },
  { label: "Telegram — Post Views", href: "/seeding?platform=telegram&category=telegram-post-views", icon: LayoutGrid, group: "Dịch vụ" },
];

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
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? SEARCH_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSelect = useCallback((href: string) => {
    setQuery("");
    setSearchOpen(false);
    router.push(href);
  }, [router]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

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
            position: "relative",
            ml: 1.5,
            width: 280,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              height: 36,
              borderRadius: "999px",
              border: "1px solid",
              borderColor: searchOpen ? alpha("#0EA5E9", 0.5) : "divider",
              bgcolor: searchOpen ? "background.paper" : alpha("#F8FAFC", 0.8),
              width: "100%",
              cursor: "text",
              transition: "all 150ms ease",
              boxShadow: searchOpen ? `0 0 0 3px ${alpha("#0EA5E9", 0.08)}` : "none",
              "&:hover": {
                bgcolor: "background.paper",
                borderColor: alpha("#0EA5E9", 0.4),
                boxShadow: `0 0 0 3px ${alpha("#0EA5E9", 0.08)}`,
              },
            }}
          >
            <Search size={16} color="#0EA5E9" style={{ flexShrink: 0 }} />
            <InputBase
              inputRef={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
                if (e.key === "Enter" && results[activeIdx]) { handleSelect(results[activeIdx].href); }
              }}
              placeholder="Tìm kiếm trang, dịch vụ..."
              sx={{
                flex: 1,
                fontSize: "13px",
                color: "text.secondary",
                "& input::placeholder": { color: "text.disabled", opacity: 1 },
                "& input": { p: 0 },
              }}
            />
            {query ? (
              <Box
                component="button"
                onClick={() => { setQuery(""); setSearchOpen(false); inputRef.current?.focus(); }}
                sx={{ display: "flex", border: "none", bgcolor: "transparent", cursor: "pointer", color: "text.disabled", p: 0, flexShrink: 0, "&:hover": { color: "text.secondary" } }}
              >
                <X size={14} />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex", alignItems: "center",
                  px: 0.75, py: 0.25, borderRadius: "5px",
                  border: "1px solid", borderColor: "divider",
                  bgcolor: "background.paper", flexShrink: 0,
                }}
              >
                <Typography sx={{ fontSize: "10px", color: "text.disabled", fontWeight: 600, lineHeight: 1 }}>⌘K</Typography>
              </Box>
            )}
          </Box>

          {/* Dropdown results */}
          {searchOpen && results.length > 0 && (
            <Box
              ref={dropdownRef}
              sx={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                right: 0,
                bgcolor: "background.paper",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                overflow: "hidden",
                zIndex: 9999,
              }}
            >
              {(() => {
                const groups = Array.from(new Set(results.map((r) => r.group)));
                let idx = -1;
                return groups.map((group) => {
                  const items = results.filter((r) => r.group === group);
                  return (
                    <Box key={group}>
                      <Typography sx={{ px: 1.5, pt: 1, pb: 0.5, fontSize: "10px", fontWeight: 700, color: "text.disabled", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {group}
                      </Typography>
                      {items.map((item) => {
                        idx++;
                        const localIdx = idx;
                        const Icon = item.icon;
                        const isActive = activeIdx === localIdx;
                        return (
                          <Box
                            key={item.href}
                            onMouseEnter={() => setActiveIdx(localIdx)}
                            onMouseDown={(e) => { e.preventDefault(); handleSelect(item.href); }}
                            sx={{
                              display: "flex", alignItems: "center", gap: 1.25,
                              px: 1.5, py: 0.875, cursor: "pointer",
                              bgcolor: isActive ? alpha("#0EA5E9", 0.07) : "transparent",
                              borderLeft: isActive ? `2px solid #0EA5E9` : "2px solid transparent",
                              transition: "all 100ms ease",
                            }}
                          >
                            <Box sx={{ width: 28, height: 28, borderRadius: "7px", bgcolor: alpha("#0EA5E9", 0.08), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Icon size={14} color="#0EA5E9" />
                            </Box>
                            <Typography sx={{ fontSize: "13px", fontWeight: isActive ? 600 : 500, color: isActive ? "text.primary" : "text.secondary" }}>
                              {item.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                });
              })()}
              <Box sx={{ px: 1.5, py: 0.75, borderTop: "1px solid", borderColor: "divider", display: "flex", gap: 1.5 }}>
                {[["↑↓", "Di chuyển"], ["↵", "Chọn"], ["Esc", "Đóng"]].map(([key, desc]) => (
                  <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ px: 0.625, py: 0.125, borderRadius: "4px", border: "1px solid", borderColor: "divider", bgcolor: alpha("#0F172A", 0.03) }}>
                      <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "text.disabled", lineHeight: 1.4 }}>{key}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: "10px", color: "text.disabled" }}>{desc}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* No results */}
          {searchOpen && query.trim().length > 0 && results.length === 0 && (
            <Box
              ref={dropdownRef}
              sx={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                bgcolor: "background.paper", borderRadius: "12px", border: "1px solid",
                borderColor: "divider", boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                px: 2, py: 2, zIndex: 9999, textAlign: "center",
              }}
            >
              <Typography sx={{ fontSize: "13px", color: "text.disabled" }}>Không tìm thấy kết quả cho &quot;{query}&quot;</Typography>
            </Box>
          )}
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
