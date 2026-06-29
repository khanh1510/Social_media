"use client";

import { Box, Checkbox, CircularProgress, InputBase, MenuItem, Select, Tooltip, Typography, alpha } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ShoppingCart, History, RefreshCw, XCircle, RotateCcw, ExternalLink, CheckCircle2, Shield, Settings2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Suspense, useMemo, useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  siFacebook, siTiktok, siInstagram, siYoutube, siX, siTelegram,
} from "simple-icons";
import { toUiService, useCatalog } from "@/hooks/useCatalog";
import { ordersApi, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiOrder, OrderStatus } from "@/lib/api/types";
import type { Service } from "@/types";
import { formatDate, formatVND } from "@/lib/format";

// ── Platform config ───────────────────────────────────────
// Logo dùng currentColor → kế thừa màu accent đặt ở phần tử cha (theme-aware).
function SiIcon({ icon, size = 18 }: { icon: { path: string }; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}

interface PlatformConfig {
  label: string;
  color: string;
  activeBg: string;
  logo: React.ReactNode;
}

// Tạo cấu hình theo mode: TikTok/Twitter (vốn đen) đổi sang sáng ở dark mode;
// nền active pastel đổi sang tint loãng từ chính màu accent.
function getPlatformCfg(isDark: boolean): Record<string, PlatformConfig> {
  // TikTok/Twitter vốn dùng đen → vô hình trên nền tối. Dùng slate trung tính
  // (#94A3B8) ở dark: vừa đọc được làm chữ/viền/logo trên nền tối, vừa đủ đậm
  // để chữ trắng nổi khi dùng làm nền nút/badge.
  const mono = isDark ? "#94A3B8" : "#000000";
  const tint = (c: string) => alpha(c, isDark ? 0.18 : 0.12);
  const cfg = (label: string, color: string, icon: { path: string }): PlatformConfig => ({
    label,
    color,
    activeBg: tint(color),
    logo: <SiIcon icon={icon} size={20} />,
  });
  return {
    facebook:  cfg("Facebook",  "#1877F2", siFacebook),
    tiktok:    cfg("TikTok",    mono,      siTiktok),
    instagram: cfg("Instagram", "#C13584", siInstagram),
    youtube:   cfg("YouTube",   "#FF0000", siYoutube),
    twitter:   cfg("Twitter/X", mono,      siX),
    telegram:  cfg("Telegram",  "#229ED9", siTelegram),
  };
}

const STATUS_CFG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  PENDING:    { label: "Chờ xử lý",        color: "#CA8A04", bg: "#FEF9C3" },
  PROCESSING: { label: "Đang xử lý",       color: "#2563EB", bg: "#DBEAFE" },
  IN_PROGRESS:{ label: "Đang chạy",        color: "#0EA5E9", bg: "#E0F2FE" },
  COMPLETED:  { label: "Hoàn thành",       color: "#16A34A", bg: "#DCFCE7" },
  PARTIAL:    { label: "Hoàn thành 1 phần",color: "#D97706", bg: "#FEF3C7" },
  CANCELED:   { label: "Đã hủy",           color: "#64748B", bg: "#F1F5F9" },
  FAILED:     { label: "Thất bại",          color: "#DC2626", bg: "#FEE2E2" },
  ERROR:      { label: "Lỗi",               color: "#DC2626", bg: "#FEE2E2" },
};

const LIMIT_OPTIONS = [10, 25, 50, 100];

const ALL_COLS = [
  { key: "orderNumber", label: "Mã đơn" },
  { key: "link",        label: "Liên kết" },
  { key: "servicePublicId", label: "Object ID" },
  { key: "serviceName", label: "Dịch vụ" },
  { key: "quantity",    label: "Số lượng" },
  { key: "startCount",  label: "Đã bắt đầu" },
  { key: "remains",     label: "Tiến độ" },
  { key: "charge",      label: "Tổng tiền" },
  { key: "status",      label: "Trạng thái" },
  { key: "createdAt",   label: "Ngày tạo" },
] as const;
type ColKey = typeof ALL_COLS[number]["key"];

// ── Order History tab ─────────────────────────────────────
function OrderHistoryPanel() {
  const t = useTranslations("seeding");
  const [orders,    setOrders]    = useState<ApiOrder[]>([]);
  const [page,      setPage]      = useState(1);
  const [total,     setTotal]     = useState(0);
  const [limit,     setLimit]     = useState(10);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [msg,       setMsg]       = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [colVisible,  setColVisible]  = useState<Record<ColKey, boolean>>(
    Object.fromEntries(ALL_COLS.map((c) => [c.key, true])) as Record<ColKey, boolean>
  );
  const [showColMenu, setShowColMenu] = useState(false);
  const [filters, setFilters] = useState<Partial<Record<ColKey, string>>>({});
  const { refreshWallet } = useAuth();

  const load = useCallback(async (p: number, lim = limit) => {
    setLoading(true); setError("");
    try {
      const res = await ordersApi.list({ page: p, limit: lim });
      setOrders(res.data); setTotal(res.meta.total); setPage(p);
      setLastUpdated(new Date());
    } catch (e) { setError(e instanceof ApiError ? e.message : t("errLoadHistory")); }
    finally { setLoading(false); }
  }, [limit, t]);

  useEffect(() => { void load(1); }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => void load(page), 30000);
    return () => clearInterval(id);
  }, [autoRefresh, page, load]);

  async function handleCancel(id: string) {
    try { await ordersApi.cancel(id); setMsg(t("cancelRequested")); void refreshWallet(); void load(page); }
    catch (e) { setMsg(e instanceof ApiError ? e.message : t("cancelFailed")); }
  }
  async function handleRefill(id: string) {
    try { await ordersApi.refill(id); setMsg(t("refillRequested")); }
    catch (e) { setMsg(e instanceof ApiError ? e.message : t("refillFailed")); }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const selectedSet = new Set(selectedIds);
  const allSelected = orders.length > 0 && orders.every((o) => selectedSet.has(o.id));
  const someSelected = orders.some((o) => selectedSet.has(o.id)) && !allSelected;

  function toggleAll() {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(orders.map((o) => o.id));
  }
  function toggleOne(id: string) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  const visibleCols = ALL_COLS.filter((c) => colVisible[c.key]);

  const btnBase = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    border: "1px solid", borderColor: "divider", borderRadius: "7px",
    bgcolor: "background.paper", cursor: "pointer", transition: "all 120ms",
    "&:hover": { borderColor: "#2563EB", color: "#2563EB" },
  };

  const agoCopy = lastUpdated
    ? (() => {
        const s = Math.round((Date.now() - lastUpdated.getTime()) / 1000);
        if (s < 60) return t("secondsAgo", { n: s });
        return t("minutesAgo", { n: Math.round(s / 60) });
      })()
    : "—";

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>

      {/* ── Toolbar ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1.25, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box component="button" onClick={() => void load(page)}
          sx={{ ...btnBase, gap: 0.5, px: 2, py: 0.75, fontSize: "12px", color: "text.secondary" }}>
          <RefreshCw size={13} /> {t("refresh")}
        </Box>

        {/* Auto refresh toggle */}
        <Box component="button" onClick={() => setAutoRefresh((v) => !v)}
          sx={{ ...btnBase, gap: 0.5, px: 2, py: 0.75, fontSize: "12px", color: autoRefresh ? "#2563EB" : "text.secondary", borderColor: autoRefresh ? "#2563EB" : "divider", bgcolor: autoRefresh ? alpha("#2563EB", 0.06) : "background.paper" }}>
          <RefreshCw size={13} style={{ animation: autoRefresh ? "spin 2s linear infinite" : "none" }} />
          {autoRefresh ? "On" : "Off"}
        </Box>

        <Box sx={{ flex: 1 }} />
        <Typography sx={{ fontSize: "12px", color: "text.disabled" }}>
          {t("lastUpdated")}: {agoCopy}
        </Typography>
      </Box>

      {/* ── Messages ── */}
      {(msg || error) && (
        <Box sx={{ px: 2, pt: 1 }}>
          {msg   && <Box sx={{ px: 2.5, py: 1.25, borderRadius: "8px", bgcolor: alpha("#2563EB", 0.07), color: "#2563EB",  fontSize: "12px", mb: 0.5 }}>{msg}</Box>}
          {error && <Box sx={{ px: 2.5, py: 1.25, borderRadius: "8px", bgcolor: alpha("#DC2626", 0.07), color: "#DC2626", fontSize: "12px" }}>{error}</Box>}
        </Box>
      )}

      {/* ── Title + col settings ── */}
      <Box sx={{ display: "flex", alignItems: "center", px: 2, pt: 1.5, pb: 1 }}>
        <Typography sx={{ fontSize: "14px", fontWeight: 700, flex: 1 }}>{t("orderHistory")}</Typography>
        <Box sx={{ position: "relative" }}>
          <Tooltip title={t("showColumns")}>
            <Box component="button" onClick={() => setShowColMenu((v) => !v)}
              sx={{ ...btnBase, width: 32, height: 32, color: showColMenu ? "#2563EB" : "text.secondary" }}>
              <Settings2 size={16} />
            </Box>
          </Tooltip>
          {showColMenu && (
            <Box sx={{ position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 20, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: "10px", p: 1, minWidth: 180, boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}>
              {ALL_COLS.map((col) => (
                <Box key={col.key} component="button" onClick={() => setColVisible((v) => ({ ...v, [col.key]: !v[col.key] }))}
                  sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", px: 1, py: 0.625, border: "none", bgcolor: "transparent", cursor: "pointer", borderRadius: "6px", "&:hover": { bgcolor: alpha("#2563EB", 0.06) } }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: "3px", border: "1.5px solid", borderColor: colVisible[col.key] ? "#2563EB" : "#CBD5E1", bgcolor: colVisible[col.key] ? "#2563EB" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {colVisible[col.key] && <Box component="span" sx={{ color: "white", fontSize: "9px", lineHeight: 1, fontWeight: 800 }}>✓</Box>}
                  </Box>
                  <Typography sx={{ fontSize: "12px", color: "text.primary" }}>{t(`col.${col.key}`)}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Table ── */}
      <Box sx={{ overflowX: "auto" }}>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <Box component="thead">
            {/* Header row */}
            <Box component="tr" sx={{ bgcolor: "surface.muted" }}>
              <Box component="th" sx={{ width: 36, px: 1.5, py: 1, textAlign: "center", borderBottom: "1px solid", borderColor: "divider" }}>
                <Checkbox size="small" checked={allSelected} indeterminate={someSelected}
                  onChange={toggleAll} sx={{ p: 0, "& .MuiSvgIcon-root": { fontSize: 16 } }} />
              </Box>
              <Box component="th" sx={{ px: 1.5, py: 1, textAlign: "left", borderBottom: "1px solid", borderColor: "divider", whiteSpace: "nowrap", fontSize: "11px", fontWeight: 700, color: "text.secondary", letterSpacing: "0.04em", textTransform: "uppercase" }}>{t("actions")}</Box>
              {visibleCols.map((col) => (
                <Box key={col.key} component="th" sx={{ px: 1.5, py: 1, textAlign: "left", borderBottom: "1px solid", borderColor: "divider", whiteSpace: "nowrap", fontSize: "11px", fontWeight: 700, color: "text.secondary", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {t(`col.${col.key}`)}
                </Box>
              ))}
            </Box>
            {/* Filter row */}
            <Box component="tr" sx={{ bgcolor: "background.paper" }}>
              <Box component="td" colSpan={2} sx={{ px: 1.5, py: 0.625, borderBottom: "1px solid", borderColor: "divider" }}>
                <InputBase placeholder={t("searchPlaceholder")} value={filters.orderNumber ?? ""} onChange={(e) => setFilters((f) => ({ ...f, orderNumber: e.target.value }))}
                  sx={{ fontSize: "12px", width: "100%", "& input": { p: 0, color: "#94A3B8" } }} />
              </Box>
              {visibleCols.map((col) => (
                <Box key={col.key} component="td" sx={{ px: 1.5, py: 0.625, borderBottom: "1px solid", borderColor: "divider" }}>
                  {["link","serviceName","servicePublicId","quantity","startCount","charge"].includes(col.key) ? (
                    <InputBase placeholder={t(`col.${col.key}`)} value={filters[col.key] ?? ""} onChange={(e) => setFilters((f) => ({ ...f, [col.key]: e.target.value }))}
                      sx={{ fontSize: "12px", width: "100%", "& input": { p: 0, color: "#94A3B8" } }} />
                  ) : <Box />}
                </Box>
              ))}
            </Box>
          </Box>

          <Box component="tbody">
            {loading ? (
              <Box component="tr">
                <Box component="td" colSpan={visibleCols.length + 2} sx={{ textAlign: "center", py: 6 }}>
                  <CircularProgress size={24} />
                </Box>
              </Box>
            ) : orders.length === 0 ? (
              <Box component="tr">
                <Box component="td" colSpan={visibleCols.length + 2} sx={{ textAlign: "center", py: 6, color: "text.disabled", fontSize: "13px" }}>
                  {t("noData")}
                </Box>
              </Box>
            ) : orders.map((order, i) => {
              const st = STATUS_CFG[order.status] ?? STATUS_CFG.PENDING;
              const done = order.quantity - (order.remains ?? order.quantity);
              const pct = order.status === "COMPLETED" ? 100 : Math.round((done / order.quantity) * 100);
              const isSelected = selectedSet.has(order.id);
              const canCancel = order.status === "PENDING" || order.status === "PROCESSING";
              const canRefill = order.status === "COMPLETED" || order.status === "PARTIAL";
              return (
                <Box key={order.id} component="tr"
                  sx={{ bgcolor: isSelected ? alpha("#2563EB", 0.04) : i % 2 === 0 ? "background.paper" : "surface.subtle", "&:hover": { bgcolor: alpha("#2563EB", 0.03) } }}>
                  {/* Checkbox */}
                  <Box component="td" sx={{ px: 1.5, py: 1, textAlign: "center", borderBottom: "1px solid", borderColor: "divider" }}>
                    <Checkbox size="small" checked={isSelected} onChange={() => toggleOne(order.id)} sx={{ p: 0, "& .MuiSvgIcon-root": { fontSize: 16 } }} />
                  </Box>
                  {/* Actions */}
                  <Box component="td" sx={{ px: 1, py: 1, borderBottom: "1px solid", borderColor: "divider", whiteSpace: "nowrap" }}>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {canCancel && (
                        <Tooltip title={t("cancelOrder")}>
                          <Box component="button" onClick={() => void handleCancel(order.id)}
                            sx={{ width: 28, height: 28, border: "1px solid", borderColor: alpha("#DC2626", 0.3), borderRadius: "7px", bgcolor: "transparent", color: "#DC2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { bgcolor: alpha("#DC2626", 0.06) } }}>
                            <XCircle size={13} />
                          </Box>
                        </Tooltip>
                      )}
                      {canRefill && (
                        <Tooltip title={t("warranty")}>
                          <Box component="button" onClick={() => void handleRefill(order.id)}
                            sx={{ width: 28, height: 28, border: "1px solid", borderColor: alpha("#0EA5E9", 0.3), borderRadius: "7px", bgcolor: "transparent", color: "#0EA5E9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", "&:hover": { bgcolor: alpha("#0EA5E9", 0.06) } }}>
                            <RotateCcw size={13} />
                          </Box>
                        </Tooltip>
                      )}
                      {!canCancel && !canRefill && <Box sx={{ width: 26 }} />}
                    </Box>
                  </Box>
                  {/* Data cols */}
                  {visibleCols.map((col) => {
                    let cell: React.ReactNode = "—";
                    switch (col.key) {
                      case "orderNumber":
                        cell = <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#2563EB" }}>#{order.orderNumber}</Typography>;
                        break;
                      case "link":
                        cell = (
                          <Typography component="a" href={order.link} target="_blank" rel="noopener noreferrer"
                            sx={{ fontSize: "12px", color: "#2563EB", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 0.4, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", "&:hover": { textDecoration: "underline" } }}>
                            <ExternalLink size={10} style={{ flexShrink: 0 }} />{order.link}
                          </Typography>
                        );
                        break;
                      case "servicePublicId":
                        cell = <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>{order.servicePublicId ?? "—"}</Typography>;
                        break;
                      case "serviceName":
                        cell = <Typography sx={{ fontSize: "12px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.serviceName ?? "—"}</Typography>;
                        break;
                      case "quantity":
                        cell = <Typography sx={{ fontSize: "12px" }}>{order.quantity.toLocaleString("vi-VN")}</Typography>;
                        break;
                      case "startCount":
                        cell = <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>{order.startCount ?? 0}</Typography>;
                        break;
                      case "remains":
                        cell = (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 80 }}>
                            <Box sx={{ flex: 1, height: 4, borderRadius: "2px", bgcolor: alpha("#2563EB", 0.12), overflow: "hidden" }}>
                              <Box sx={{ height: "100%", width: `${Number.isFinite(pct) ? pct : 0}%`, bgcolor: "#2563EB", borderRadius: "2px" }} />
                            </Box>
                            <Typography sx={{ fontSize: "11px", color: "text.secondary", minWidth: 28 }}>{Number.isFinite(pct) ? pct : 0}%</Typography>
                          </Box>
                        );
                        break;
                      case "charge":
                        cell = <Typography sx={{ fontSize: "12px", fontWeight: 700 }}>{formatVND(order.charge)}</Typography>;
                        break;
                      case "status":
                        cell = <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "6px", bgcolor: st.bg, color: st.color, fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap" }}>{t(`status.${order.status}`)}</Box>;
                        break;
                      case "createdAt":
                        cell = <Typography sx={{ fontSize: "12px", color: "text.secondary", whiteSpace: "nowrap" }}>{formatDate(order.createdAt)}</Typography>;
                        break;
                    }
                    return (
                      <Box key={col.key} component="td" sx={{ px: 1.5, py: 1, borderBottom: "1px solid", borderColor: "divider", verticalAlign: "middle" }}>
                        {cell}
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* ── Pagination ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.25, borderTop: "1px solid", borderColor: "divider", flexWrap: "wrap" }}>
        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>{t("rowsPerPage")}</Typography>
        <Select size="small" value={limit} onChange={(e) => { const l = Number(e.target.value); setLimit(l); void load(1, l); }}
          sx={{ fontSize: "12px", height: 28, "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" }, "& .MuiSelect-select": { py: 0.375, pr: "28px !important" } }}>
          {LIMIT_OPTIONS.map((v) => <MenuItem key={v} value={v} sx={{ fontSize: "12px" }}>{v}</MenuItem>)}
        </Select>

        <Box sx={{ flex: 1 }} />

        {selectedIds.length > 0 && (
          <Typography sx={{ fontSize: "12px", color: "#2563EB" }}>{t("selectedCount", { n: selectedIds.length })}</Typography>
        )}

        {/* Page nav */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {[
            { icon: <ChevronFirst size={14} />, onClick: () => void load(1), disabled: page <= 1 },
            { icon: <ChevronLeft size={14} />, onClick: () => void load(page - 1), disabled: page <= 1 },
          ].map(({ icon, onClick, disabled }, i) => (
            <Box key={i} component="button" onClick={onClick} disabled={disabled}
              sx={{ ...btnBase, width: 28, height: 28, color: "text.secondary", opacity: disabled ? 0.35 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
              {icon}
            </Box>
          ))}
          <Typography sx={{ fontSize: "12px", color: "text.secondary", px: 1, minWidth: 40, textAlign: "center" }}>{page}/{totalPages}</Typography>
          {[
            { icon: <ChevronRightIcon size={14} />, onClick: () => void load(page + 1), disabled: page >= totalPages },
            { icon: <ChevronLast size={14} />, onClick: () => void load(totalPages), disabled: page >= totalPages },
          ].map(({ icon, onClick, disabled }, i) => (
            <Box key={i} component="button" onClick={onClick} disabled={disabled}
              sx={{ ...btnBase, width: 28, height: 28, color: "text.secondary", opacity: disabled ? 0.35 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
              {icon}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ── Main content ──────────────────────────────────────────
function SeedingContent() {
  const t = useTranslations("seeding");
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();
  const PLATFORM_CFG = useMemo(() => getPlatformCfg(theme.palette.mode === "dark"), [theme.palette.mode]);
  const { platforms, loading: catalogLoading, servicesByCategorySlug, servicesByPlatform } = useCatalog();
  const { wallet, refreshWallet } = useAuth();

  const tab = searchParams.get("tab") === "history" ? "history" : "order";

  // Ưu tiên thứ tự platform: facebook trước, rồi các platform còn lại theo thứ tự backend
  const PLATFORM_ORDER = ["facebook", "tiktok", "instagram", "youtube", "twitter", "telegram"];
  const platformList = useMemo(() => {
    const slugs = platforms.map((p) => p.slug);
    return [
      ...PLATFORM_ORDER.filter((s) => slugs.includes(s)),
      ...slugs.filter((s) => !PLATFORM_ORDER.includes(s)),
    ];
  }, [platforms]);
  const rawPlatform = searchParams.get("platform") ?? "";
  const platform = platformList.includes(rawPlatform) ? rawPlatform : (platformList[0] ?? "facebook");

  // Category children of active platform — chỉ giữ category có ít nhất 1 service
  const categories = useMemo(() => {
    const p = platforms.find((x) => x.slug === platform);
    return (p?.children ?? [])
      .map((c) => ({ key: c.slug, label: c.label }))
      .filter((c) => servicesByCategorySlug(c.key).length > 0);
  }, [platforms, platform, servicesByCategorySlug]);

  // Active category (serviceType param)
  const rawType = searchParams.get("serviceType") ?? "";
  const categorySlug = useMemo(() => {
    if (categories.some((c) => c.key === rawType)) return rawType;
    return categories[0]?.key ?? "";
  }, [categories, rawType]);

  // Services list for current category
  const services = useMemo(() => {
    const inCat = categorySlug ? servicesByCategorySlug(categorySlug) : [];
    const list = inCat.length > 0 ? inCat : servicesByPlatform(platform);
    return list.map(toUiService);
  }, [categorySlug, platform, servicesByCategorySlug, servicesByPlatform]);

  // Form state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [link,     setLink]     = useState("");
  const [quantity, setQuantity] = useState("");
  const [note,     setNote]     = useState("");
  const [submitting,setSubmitting] = useState(false);
  const [submitted, setSubmitted]  = useState(false);
  const [error,    setError]    = useState("");
  const [createdOrder, setCreatedOrder] = useState<ApiOrder | null>(null);

  const activeService = (selectedService && services.find((s) => s.id === selectedService.id)) ?? services[0] ?? null;
  const qty = Math.min(Math.max(Number(quantity) || (activeService?.min ?? 0), activeService?.min ?? 0), activeService?.max ?? 0);
  const totalCost = activeService ? qty * activeService.price : 0;
  const balance = wallet ? Number(wallet.balance) : 0;

  // Reset selection when category changes
  useEffect(() => { setSelectedService(null); setError(""); }, [categorySlug]);

  function navigate(params: Record<string, string>) {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([k, v]) => sp.set(k, v));
    router.push(`/seeding?${sp.toString()}`);
  }

  async function handleSubmit() {
    if (!link.trim() || !activeService || submitting) return;
    setError(""); setSubmitting(true);
    try {
      const order = await ordersApi.create({
        service: activeService.id,
        link: link.trim(),
        quantity: qty,
        ...(note.trim() ? { note: note.trim() } : {}),
        idempotencyKey: crypto.randomUUID(),
      });
      setCreatedOrder(order);
      setSubmitted(true);
      setLink(""); setQuantity(""); setNote("");
      void refreshWallet();
      setTimeout(() => { setSubmitted(false); setCreatedOrder(null); }, 6000);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t("orderFailed"));
    } finally { setSubmitting(false); }
  }

  const pcfg = PLATFORM_CFG[platform] ?? { label: platform, color: "#475569", activeBg: "#F1F5F9", logo: null };

  if (catalogLoading) {
    return <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 0 }}>

      {/* ── Tab bar ── */}
      <Box sx={{ p: 1, bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 0.75, p: 0.5, borderRadius: "10px", bgcolor: "surface.subtle" }}>
          {([
            { key: "order",   label: t("tabOrder"),   icon: <ShoppingCart size={14} /> },
            { key: "history", label: t("tabHistory"), icon: <History size={14} /> },
          ] as const).map(({ key, label, icon }) => {
            const active = tab === key;
            return (
              <Box key={key} component="button" onClick={() => navigate({ tab: key })}
                sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, px: 2, py: 1, border: "none", borderRadius: "8px", bgcolor: active ? "background.paper" : "transparent", color: active ? pcfg.color : "text.secondary", fontSize: "13px", fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 150ms ease", boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none", "&:hover": { color: active ? pcfg.color : "text.primary" } }}>
                {icon}{label}
              </Box>
            );
          })}
        </Box>
      </Box>

      {tab === "history" ? (
        <Box sx={{ bgcolor: "background.paper", borderRadius: "0 0 16px 16px", border: "1px solid", borderTop: "none", borderColor: "divider" }}>
          <OrderHistoryPanel />
        </Box>
      ) : (
        <>
          {/* ── Platform tabs ── */}
          <Box sx={{ p: 1, bgcolor: "background.paper", border: "1px solid", borderTop: "none", borderColor: "divider", overflowX: "auto", "&::-webkit-scrollbar": { height: "3px" } }}>
            <Box sx={{ display: "flex", gap: 0.75, minWidth: "max-content" }}>
              {platformList.map((pid) => {
                const cfg = PLATFORM_CFG[pid] ?? { label: pid, color: "#475569", activeBg: "#F1F5F9", logo: null };
                const isActive = pid === platform;
                return (
                  <Box key={pid} component="button" onClick={() => navigate({ platform: pid, serviceType: "", tab: "order" })}
                    sx={{ display: "flex", alignItems: "center", gap: 0.875, px: 1.75, py: 0.875, border: "1.5px solid", borderColor: isActive ? cfg.color : "divider", borderRadius: "9px", bgcolor: isActive ? cfg.activeBg : "background.paper", color: isActive ? cfg.color : "text.secondary", fontSize: "13px", fontWeight: isActive ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", transition: "all 150ms", boxShadow: isActive ? `0 2px 8px ${alpha(cfg.color, 0.18)}` : "none", "&:hover": { borderColor: cfg.color, color: cfg.color, bgcolor: alpha(cfg.color, 0.05) } }}>
                    <Box component="span" sx={{ display: "inline-flex", color: cfg.color }}>{cfg.logo}</Box>{cfg.label}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* ── Main body: form left + info panel right ── */}
          <Box sx={{ display: "flex", gap: 0, alignItems: "flex-start", border: "1px solid", borderTop: "none", borderColor: "divider", borderRadius: "0 0 16px 16px", overflow: "hidden" }}>

            {/* Left: Form */}
            <Box sx={{ flex: 1, minWidth: 0, p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: 3, borderRight: "1px solid", borderColor: "divider" }}>

              {/* Step 1: Chọn dịch vụ */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: pcfg.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ fontSize: "11px", fontWeight: 800, color: "white" }}>1</Typography>
                  </Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>{t("step1Title")}</Typography>
                </Box>

                {/* Category dropdown */}
                <Box sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 0.5 }}>{t("selectServiceLabel")}</Typography>
                  <Select size="small" value={categorySlug} onChange={(e) => navigate({ platform, serviceType: e.target.value, tab: "order" })}
                    fullWidth sx={{ fontSize: "13px", borderRadius: "8px", "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" } }}>
                    {categories.map((c) => (
                      <MenuItem key={c.key} value={c.key} sx={{ fontSize: "13px" }}>{c.label}</MenuItem>
                    ))}
                  </Select>
                </Box>
              </Box>

              {/* Step 2: Máy chủ (server/service selection) */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: pcfg.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontSize: "11px", fontWeight: 800, color: "white" }}>2</Typography>
                    </Box>
                    <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>{t("step2Title")}</Typography>
                    <Box sx={{ px: 0.75, py: 0.125, borderRadius: "5px", bgcolor: alpha(pcfg.color, 0.1), color: pcfg.color, fontSize: "11px", fontWeight: 700 }}>{services.length}</Box>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
                  {services.length === 0 ? (
                    <Typography sx={{ fontSize: "13px", color: "text.disabled", py: 2, textAlign: "center" }}>{t("noServices")}</Typography>
                  ) : services.map((svc) => {
                    const isActive = (selectedService ?? services[0])?.id === svc.id;
                    return (
                      <Box key={svc.id} onClick={() => setSelectedService(svc)}
                        sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.25, borderRadius: "10px", border: "1.5px solid", borderColor: isActive ? pcfg.color : "divider", bgcolor: isActive ? alpha(pcfg.color, 0.04) : "background.paper", cursor: "pointer", transition: "all 150ms", "&:hover": { borderColor: pcfg.color } }}>
                        {/* Radio */}
                        <Box sx={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid", borderColor: isActive ? pcfg.color : "#CBD5E1", bgcolor: isActive ? pcfg.color : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {isActive && <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "white" }} />}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Typography sx={{ fontSize: "11px", fontWeight: 700, color: alpha(pcfg.color, 0.7), fontVariantNumeric: "tabular-nums" }}>{svc.id}</Typography>
                            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary", flex: 1 }}>{svc.name}</Typography>
                            {svc.refill && <Box sx={{ px: 0.75, py: 0.125, borderRadius: "5px", bgcolor: "#DCFCE7", color: "#16A34A", fontSize: "10px", fontWeight: 700 }}>{t("badgeRefill")}</Box>}
                            {svc.cancel && <Box sx={{ px: 0.75, py: 0.125, borderRadius: "5px", bgcolor: "#F1F5F9", color: "#64748B", fontSize: "10px", fontWeight: 700 }}>{t("badgeCancel")}</Box>}
                            {svc.dripfeed && <Box sx={{ px: 0.75, py: 0.125, borderRadius: "5px", bgcolor: "#E0F2FE", color: "#0284C7", fontSize: "10px", fontWeight: 700 }}>{t("badgeDripfeed")}</Box>}
                          </Box>
                          <Box sx={{ display: "flex", gap: 1.5, mt: 0.25, flexWrap: "wrap" }}>
                            <Typography sx={{ fontSize: "11px", color: "text.disabled" }}>Min: {svc.min.toLocaleString()} · Max: {svc.max.toLocaleString()}</Typography>
                            <Typography sx={{ fontSize: "11px", fontWeight: 700, color: pcfg.color }}>{svc.price.toLocaleString("vi-VN")} ₫/1</Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Step 3: Chi tiết */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: pcfg.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ fontSize: "11px", fontWeight: 800, color: "white" }}>3</Typography>
                  </Box>
                  <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>{t("step3Title")}</Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {/* Link */}
                  <Box>
                    <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 0.5 }}>{t("linkLabel")}</Typography>
                    <Box sx={{ px: 1.5, height: 40, borderRadius: "8px", border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", "&:focus-within": { borderColor: pcfg.color, boxShadow: `0 0 0 3px ${alpha(pcfg.color, 0.08)}` } }}>
                      <InputBase value={link} onChange={(e) => setLink(e.target.value)} placeholder={t("linkPlaceholder")} fullWidth sx={{ fontSize: "13px", "& input": { p: 0 } }} />
                    </Box>
                    {activeService && (
                      <Typography sx={{ fontSize: "11px", color: "text.disabled", mt: 0.4 }}>
                        {t("linkExample")}: https://facebook.com/yourpage
                      </Typography>
                    )}
                  </Box>

                  {/* Quantity */}
                  {activeService && (
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>{t("quantityLabel")}</Typography>
                        <Typography sx={{ fontSize: "11px", color: "text.disabled" }}>{t("min")} {activeService.min.toLocaleString()} · {t("max")} {activeService.max.toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ px: 1.5, height: 40, borderRadius: "8px", border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", "&:focus-within": { borderColor: pcfg.color, boxShadow: `0 0 0 3px ${alpha(pcfg.color, 0.08)}` } }}>
                        <InputBase type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder={String(activeService.min)} fullWidth sx={{ fontSize: "13px", "& input": { p: 0 } }} />
                      </Box>
                    </Box>
                  )}

                  {/* Note */}
                  <Box>
                    <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 0.5 }}>{t("noteLabel")} <Box component="span" sx={{ color: "text.disabled" }}>{t("optional")}</Box></Typography>
                    <Box sx={{ borderRadius: "8px", border: "1px solid", borderColor: "divider", "&:focus-within": { borderColor: pcfg.color, boxShadow: `0 0 0 3px ${alpha(pcfg.color, 0.08)}` } }}>
                      <InputBase multiline minRows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("notePlaceholder")} fullWidth sx={{ px: 1.5, py: 1, fontSize: "13px" }} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Right: Info + Summary */}
            <Box sx={{ width: { xs: "100%", md: 320 }, flexShrink: 0, display: "flex", flexDirection: "column" }}>

              {/* Service info */}
              {activeService && (
                <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Typography sx={{ fontSize: "13px", fontWeight: 700, color: pcfg.color, mb: 1.5 }}>{activeService.name}</Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {[
                      { label: t("infoAvgTime"), value: activeService.averageTime ?? "—" },
                      { label: t("infoSpeed"), value: activeService.speed === "fast" ? t("speedFast") : activeService.speed === "slow" ? t("speedSlow") : t("speedMedium") },
                      { label: t("infoRefill"), value: activeService.refill ? t("yes") : t("no") },
                      { label: t("infoCancel"), value: activeService.cancel ? t("yes") : t("no") },
                      { label: t("infoDripfeed"), value: activeService.dripfeed ? t("yes") : t("no") },
                    ].map(({ label, value }) => (
                      <Box key={label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>{label}</Typography>
                        <Box sx={{ px: 1, py: 0.25, borderRadius: "6px", bgcolor: alpha(pcfg.color, 0.08), color: pcfg.color, fontSize: "12px", fontWeight: 600 }}>{value}</Box>
                      </Box>
                    ))}
                  </Box>
                  {activeService.description && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "text.secondary", mb: 0.5 }}>{t("serviceDescription")}</Typography>
                      <Box sx={{ p: 1.25, borderRadius: "8px", bgcolor: "surface.muted", border: "1px solid", borderColor: "divider" }}>
                        <Typography sx={{ fontSize: "12px", color: "text.secondary", lineHeight: 1.6 }}>{activeService.description}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Summary + Submit */}
              <Box sx={{ p: 2.5 }}>
                <Typography sx={{ fontSize: "13px", fontWeight: 700, mb: 1.5 }}>{t("orderSummary")}</Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mb: 1.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>{t("summaryQuantity")}</Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>{qty > 0 ? qty.toLocaleString("vi-VN") : 0}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>{t("summaryPricePer1000")}</Typography>
                    <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
                      {activeService ? `${(activeService.price * 1000).toLocaleString("vi-VN")} ₫/1000` : "—"}
                    </Typography>
                  </Box>
                  <Box sx={{ height: "1px", bgcolor: "divider", my: 0.5 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 700 }}>{t("summaryTotal")}</Typography>
                    <Typography sx={{ fontSize: "16px", fontWeight: 800, color: pcfg.color }}>
                      {totalCost > 0 ? `${totalCost.toLocaleString("vi-VN")} ₫` : "0 ₫"}
                    </Typography>
                  </Box>
                </Box>

                {/* Balance */}
                <Box sx={{ px: 2.5, py: 1.25, borderRadius: "8px", bgcolor: alpha("#10B981", 0.07), border: "1px solid", borderColor: alpha("#10B981", 0.15), mb: 1.5 }}>
                  <Typography sx={{ fontSize: "12px", color: "#059669", fontWeight: 600 }}>
                    {t("balance")}: {balance.toLocaleString("vi-VN")} ₫
                  </Typography>
                </Box>

                {error && <Box sx={{ mb: 1.5, px: 1.5, py: 1, borderRadius: "8px", bgcolor: alpha("#DC2626", 0.07), color: "#DC2626", fontSize: "12px" }}>{error}</Box>}
                {submitted && createdOrder && (
                  <Box sx={{ mb: 1.5, px: 1.5, py: 1, borderRadius: "8px", bgcolor: alpha("#10B981", 0.07), color: "#059669", fontSize: "12px", display: "flex", alignItems: "center", gap: 0.75 }}>
                    <CheckCircle2 size={14} /> {t("orderPlaced", { n: createdOrder.orderNumber })}
                  </Box>
                )}

                <Box component="button" onClick={() => void handleSubmit()}
                  disabled={!activeService || !link.trim() || submitting || submitted}
                  sx={{ width: "100%", py: 1.5, borderRadius: "8px", border: "none", bgcolor: submitted ? "#10B981" : pcfg.color, color: "white", fontSize: "13px", fontWeight: 700, cursor: !activeService || !link.trim() ? "not-allowed" : "pointer", opacity: !activeService || !link.trim() ? 0.65 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.75, transition: "all 150ms", "&:hover:not(:disabled)": { opacity: 0.9 } }}>
                  {submitting ? <><CircularProgress size={15} color="inherit" />{t("submitting")}</> : submitted ? <><CheckCircle2 size={15} />{t("submitDone")}</> : <><ShoppingCart size={15} />{t("submitConfirm")}</>}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ── Terms ── */}
          <Box sx={{ mt: 2, p: 2.5, borderRadius: "14px", border: "1px solid", borderColor: alpha("#2563EB", 0.15), bgcolor: (t) => t.palette.surface.hero }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
              <Box sx={{ width: 22, height: 22, borderRadius: "6px", bgcolor: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield size={13} color="white" />
              </Box>
              <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#2563EB" }}>{t("termsTitle")}</Typography>
            </Box>
            <Box component="ol" sx={{ m: 0, pl: 2.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
              {[
                t("terms0"),
                t("terms1"),
                t("terms2"),
                t("terms3"),
                t("terms4"),
              ].map((term, i) => (
                <Box key={i} component="li" sx={{ fontSize: "12px", color: "text.secondary", lineHeight: 1.6 }}>{term}</Box>
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default function SeedingPage() {
  return (
    <Suspense>
      <SeedingContent />
    </Suspense>
  );
}
