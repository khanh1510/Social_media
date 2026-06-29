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
import { PanelLeftClose, PanelLeftOpen, Search, Sun, Moon, ChevronDown, LogOut, User as UserIcon, LayoutDashboard, LayoutGrid, Crown, CreditCard, History, Webhook, Headphones, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useColorMode } from "@/contexts/ColorModeContext";
import { useLocale } from "@/contexts/LocaleContext";
import { useTranslations } from "next-intl";
import { formatVND } from "@/lib/format";
import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "./AppSidebar";

const SEARCH_ITEMS = [
  { label: "Tổng Quan", nameKey: "dashboard", href: "/dashboard", icon: LayoutDashboard, group: "pages" },
  { label: "Bảng Giá Dịch Vụ", nameKey: "services", href: "/services", icon: LayoutGrid, group: "pages" },
  { label: "Gói VIP", nameKey: "vip", href: "/vip", icon: Crown, group: "pages" },
  { label: "Nạp Tiền", nameKey: "deposit", href: "/deposit", icon: CreditCard, group: "pages" },
  { label: "Lịch Sử Giao Dịch", nameKey: "history", href: "/history", icon: History, group: "pages" },
  { label: "Tài Liệu API", nameKey: "api", href: "/api", icon: Webhook, group: "pages" },
  { label: "Hỗ Trợ", nameKey: "support", href: "/support", icon: Headphones, group: "pages" },
  { label: "Hồ Sơ", nameKey: "profile", href: "/profile", icon: UserIcon, group: "pages" },
  { label: "Facebook — Page Likes", href: "/seeding?platform=facebook&category=facebook-page-likes", icon: LayoutGrid, group: "services" },
  { label: "Facebook — Followers", href: "/seeding?platform=facebook&category=facebook-followers", icon: LayoutGrid, group: "services" },
  { label: "Facebook — Post Likes", href: "/seeding?platform=facebook&category=facebook-post-likes", icon: LayoutGrid, group: "services" },
  { label: "Facebook — Comments", href: "/seeding?platform=facebook&category=facebook-comments", icon: LayoutGrid, group: "services" },
  { label: "Facebook — Shares", href: "/seeding?platform=facebook&category=facebook-shares", icon: LayoutGrid, group: "services" },
  { label: "Facebook — Video Views", href: "/seeding?platform=facebook&category=facebook-video-views", icon: LayoutGrid, group: "services" },
  { label: "TikTok — Followers", href: "/seeding?platform=tiktok&category=tiktok-followers", icon: LayoutGrid, group: "services" },
  { label: "TikTok — Likes", href: "/seeding?platform=tiktok&category=tiktok-likes", icon: LayoutGrid, group: "services" },
  { label: "TikTok — Views", href: "/seeding?platform=tiktok&category=tiktok-views", icon: LayoutGrid, group: "services" },
  { label: "TikTok — Comments", href: "/seeding?platform=tiktok&category=tiktok-comments", icon: LayoutGrid, group: "services" },
  { label: "TikTok — Shares", href: "/seeding?platform=tiktok&category=tiktok-shares", icon: LayoutGrid, group: "services" },
  { label: "Instagram — Followers", href: "/seeding?platform=instagram&category=instagram-followers", icon: LayoutGrid, group: "services" },
  { label: "Instagram — Likes", href: "/seeding?platform=instagram&category=instagram-likes", icon: LayoutGrid, group: "services" },
  { label: "Instagram — Views", href: "/seeding?platform=instagram&category=instagram-views", icon: LayoutGrid, group: "services" },
  { label: "Instagram — Reels Views", href: "/seeding?platform=instagram&category=instagram-reels-views", icon: LayoutGrid, group: "services" },
  { label: "Instagram — Story Views", href: "/seeding?platform=instagram&category=instagram-story-views", icon: LayoutGrid, group: "services" },
  { label: "YouTube — Views", href: "/seeding?platform=youtube&category=youtube-views", icon: LayoutGrid, group: "services" },
  { label: "YouTube — Shorts Views", href: "/seeding?platform=youtube&category=youtube-shorts-views", icon: LayoutGrid, group: "services" },
  { label: "YouTube — Subscribers", href: "/seeding?platform=youtube&category=youtube-subscribers", icon: LayoutGrid, group: "services" },
  { label: "YouTube — Likes", href: "/seeding?platform=youtube&category=youtube-likes", icon: LayoutGrid, group: "services" },
  { label: "Twitter/X — Followers", href: "/seeding?platform=twitter&category=twitter-followers", icon: LayoutGrid, group: "services" },
  { label: "Twitter/X — Likes", href: "/seeding?platform=twitter&category=twitter-likes", icon: LayoutGrid, group: "services" },
  { label: "Twitter/X — Views", href: "/seeding?platform=twitter&category=twitter-views", icon: LayoutGrid, group: "services" },
  { label: "Telegram — Members", href: "/seeding?platform=telegram&category=telegram-members", icon: LayoutGrid, group: "services" },
  { label: "Telegram — Post Views", href: "/seeding?platform=telegram&category=telegram-post-views", icon: LayoutGrid, group: "services" },
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

// UK flag SVG inline (Union Jack đơn giản hóa)
function UKFlag() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32" style={{ borderRadius: 3, flexShrink: 0 }}>
      <rect width="32" height="32" fill="#012169" rx="2" />
      <path d="M0 0 L32 32 M32 0 L0 32" stroke="#FFF" strokeWidth="6" />
      <path d="M0 0 L32 32 M32 0 L0 32" stroke="#C8102E" strokeWidth="3" />
      <path d="M16 0 V32 M0 16 H32" stroke="#FFF" strokeWidth="10" />
      <path d="M16 0 V32 M0 16 H32" stroke="#C8102E" strokeWidth="5" />
    </svg>
  );
}

export default function AppHeader({ onMobileMenuOpen, onToggleCollapse, collapsed }: AppHeaderProps) {
  const sidebarW = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;
  const { user, wallet, logout } = useAuth();
  const { mode, setColorMode } = useColorMode();
  const { locale, setLocale } = useLocale();
  const t = useTranslations("header");
  const tNav = useTranslations("nav");
  // Nhãn hiển thị: trang dùng key dịch; dịch vụ giữ tên riêng
  const labelOf = (item: { label: string; nameKey?: string }) =>
    item.nameKey ? tNav(item.nameKey) : item.label;
  const router = useRouter();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [themeAnchor, setThemeAnchor] = useState<HTMLElement | null>(null);
  const [langAnchor, setLangAnchor] = useState<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? SEARCH_ITEMS.filter((item) =>
        labelOf(item).toLowerCase().includes(query.toLowerCase())
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
        bgcolor: (theme) => alpha(theme.palette.background.paper, 0.82),
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
        <Tooltip title={collapsed ? t("expandSidebar") : t("collapseSidebar")}>
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
        <Tooltip title={t("menu")}>
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
              placeholder={t("searchPlaceholder")}
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
                        {group === "pages" ? t("groupPages") : t("groupServices")}
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
                              {labelOf(item)}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                });
              })()}
              <Box sx={{ px: 1.5, py: 0.75, borderTop: "1px solid", borderColor: "divider", display: "flex", gap: 1.5 }}>
                {[["↑↓", t("searchMove")], ["↵", t("searchSelect")], ["Esc", t("searchClose")]].map(([key, desc]) => (
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
              <Typography sx={{ fontSize: "13px", color: "text.disabled" }}>{t("noResults", { query })}</Typography>
            </Box>
          )}
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Right: theme + language + account */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
          {/* Theme dropdown */}
          <Tooltip title={t("theme")}>
            <Box
              component="button"
              onClick={(e: React.MouseEvent<HTMLElement>) => setThemeAnchor(e.currentTarget)}
              sx={{
                display: "flex", alignItems: "center", gap: 0.25,
                height: 36, px: 0.75,
                border: "none", background: "none", cursor: "pointer",
                borderRadius: "9px",
                color: themeAnchor ? "info.main" : "text.secondary",
                bgcolor: themeAnchor ? alpha("#0EA5E9", 0.08) : "transparent",
                "&:hover": { bgcolor: alpha("#0EA5E9", 0.08), color: "info.main" },
                transition: "all 150ms ease",
              }}
            >
              {mode === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              <ChevronDown size={13} style={{ opacity: 0.6 }} />
            </Box>
          </Tooltip>
          <Menu
            anchorEl={themeAnchor}
            open={Boolean(themeAnchor)}
            onClose={() => setThemeAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{ paper: { sx: { mt: 0.75, minWidth: 160, borderRadius: "12px" } } }}
          >
            <Typography sx={{ px: 2, pt: 1, pb: 0.5, fontSize: "10px", fontWeight: 700, color: "text.disabled", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {t("theme")}
            </Typography>
            {([
              { value: "light" as const, label: t("themeLight"), icon: <Sun size={16} /> },
              { value: "dark" as const, label: t("themeDark"), icon: <Moon size={16} /> },
            ]).map((opt) => (
              <MenuItem
                key={opt.value}
                selected={mode === opt.value}
                onClick={() => { setColorMode(opt.value); setThemeAnchor(null); }}
                sx={{ gap: 1, fontSize: "13px" }}
              >
                <ListItemIcon sx={{ minWidth: "auto !important", color: mode === opt.value ? "info.main" : "text.secondary" }}>
                  {opt.icon}
                </ListItemIcon>
                <Box sx={{ flex: 1 }}>{opt.label}</Box>
                {mode === opt.value && <Check size={15} color="#0EA5E9" />}
              </MenuItem>
            ))}
          </Menu>

          {/* Language dropdown */}
          <Tooltip title={t("language")}>
            <Box
              component="button"
              onClick={(e: React.MouseEvent<HTMLElement>) => setLangAnchor(e.currentTarget)}
              sx={{
                display: "flex", alignItems: "center", gap: 0.25,
                height: 36, px: 0.75,
                border: "none", background: "none", cursor: "pointer",
                borderRadius: "9px",
                bgcolor: langAnchor ? alpha("#0F172A", 0.05) : "transparent",
                "&:hover": { bgcolor: alpha("#0F172A", 0.05) },
                transition: "all 150ms ease",
              }}
            >
              {locale === "vi" ? <VNFlag /> : <UKFlag />}
              <ChevronDown size={13} color="#94A3B8" />
            </Box>
          </Tooltip>
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{ paper: { sx: { mt: 0.75, minWidth: 180, borderRadius: "12px" } } }}
          >
            <Typography sx={{ px: 2, pt: 1, pb: 0.5, fontSize: "10px", fontWeight: 700, color: "text.disabled", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {t("language")}
            </Typography>
            {([
              { value: "vi" as const, label: t("languageVi"), icon: <VNFlag /> },
              { value: "en" as const, label: t("languageEn"), icon: <UKFlag /> },
            ]).map((opt) => (
              <MenuItem
                key={opt.value}
                selected={locale === opt.value}
                onClick={() => { setLocale(opt.value); setLangAnchor(null); }}
                sx={{ gap: 1, fontSize: "13px" }}
              >
                <ListItemIcon sx={{ minWidth: "auto !important" }}>{opt.icon}</ListItemIcon>
                <Box sx={{ flex: 1 }}>{opt.label}</Box>
                {locale === opt.value && <Check size={15} color="#0EA5E9" />}
              </MenuItem>
            ))}
          </Menu>

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
                    border: "2px solid",
                    borderColor: "background.paper",
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
                  border: "2px solid",
                  borderColor: "background.paper",
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
              {t("profile")}
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon><LogOut size={16} color="#EF4444" /></ListItemIcon>
              {t("logout")}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
