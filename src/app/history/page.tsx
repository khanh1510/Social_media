"use client";

import { Box, Typography, alpha, InputBase, MenuItem, Select, CircularProgress, Alert } from "@mui/material";
import { History, Download, RefreshCw, ArrowDown, ArrowUp, Star, RotateCcw, Search, SlidersHorizontal, CalendarDays, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { walletApi, ApiError } from "@/lib/api";
import type { WalletTransaction, PaginatedMeta } from "@/lib/api/types";

// ── Types ─────────────────────────────────────────────────
type TxType = "deposit" | "spend" | "vip" | "refund";
type TxStatus = "success" | "pending" | "failed";
type DateRange = "today" | "7d" | "30d" | "all";

interface DisplayTx {
  id: string;
  rawId: string;
  type: TxType;
  backendType: string;
  refType?: string;
  method: string;
  label: string;
  note: string;
  amount: number;
  balanceBefore?: string;
  balanceAfter?: string;
  status: TxStatus;
  date: string;
}

// ── Mapping backend → display ─────────────────────────────
const BACKEND_TYPE_MAP: Record<string, TxType> = {
  DEPOSIT:        "deposit",
  ORDER_DEDUCT:   "spend",
  ORDER_REFUND:   "refund",
  ADMIN_ADJUST:   "deposit",
  REFERRAL_BONUS: "deposit",
  WITHDRAWAL:     "spend",
};

const BACKEND_TYPE_LABEL: Record<string, string> = {
  DEPOSIT:        "Nạp tiền",
  ORDER_DEDUCT:   "Thanh toán đơn hàng",
  ORDER_REFUND:   "Hoàn tiền đơn hàng",
  ADMIN_ADJUST:   "Điều chỉnh bởi admin",
  REFERRAL_BONUS: "Thưởng giới thiệu",
  WITHDRAWAL:     "Rút tiền",
};

function mapTx(tx: WalletTransaction): DisplayTx {
  const amount = Number.parseFloat(tx.amount);
  const mapped = BACKEND_TYPE_MAP[tx.type] ?? (amount >= 0 ? "deposit" : "spend");
  // ADMIN_ADJUST âm → chi tiêu
  const type: TxType = mapped === "deposit" && amount < 0 ? "spend" : mapped;
  const status: TxStatus =
    tx.status === "PENDING"  ? "pending"
    : tx.status === "REVERSED" || tx.status === "FAILED" ? "failed"
    : "success";
  return {
    id:           tx.id.slice(0, 8).toUpperCase(),
    rawId:        tx.id,
    type,
    backendType:  tx.type,
    refType:      tx.refType ?? undefined,
    method:       tx.refType === "order" ? "Đơn hàng" : tx.refType === "manual" ? "Thủ công" : "Hệ thống",
    label:        BACKEND_TYPE_LABEL[tx.type] ?? tx.type,
    note:         tx.note ?? "",
    amount,
    balanceBefore: tx.balanceBefore,
    balanceAfter:  tx.balanceAfter,
    status,
    date:         tx.createdAt,
  };
}

// ── Config maps ───────────────────────────────────────────
const TYPE_CONFIG: Record<TxType, { label: string; icon: React.ReactNode; color: string; bg: string; isCredit: boolean }> = {
  deposit: { label: "Nạp tiền",  icon: <ArrowDown size={16} />, color: "#059669", bg: "rgba(16,185,129,0.1)",  isCredit: true },
  spend:   { label: "Chi tiêu",  icon: <ArrowUp   size={16} />, color: "#DC2626", bg: "rgba(220,38,38,0.08)",   isCredit: false },
  vip:     { label: "Mua VIP",   icon: <Star      size={16} />, color: "#0284C7", bg: "rgba(14,165,233,0.08)", isCredit: false },
  refund:  { label: "Hoàn tiền", icon: <RotateCcw size={16} />, color: "#0891B2", bg: "rgba(6,182,212,0.08)",  isCredit: true },
};

const STATUS_CONFIG: Record<TxStatus, { label: string; color: string; bg: string }> = {
  success: { label: "Thành công", color: "#059669", bg: "rgba(16,185,129,0.1)" },
  pending: { label: "Đang xử lý", color: "#D97706", bg: "rgba(245,158,11,0.1)" },
  failed:  { label: "Thất bại",   color: "#DC2626", bg: "rgba(220,38,38,0.08)" },
};

const DATE_PILLS: { key: DateRange; label: string }[] = [
  { key: "today", label: "Hôm nay" },
  { key: "7d",    label: "7 ngày" },
  { key: "30d",   label: "30 ngày" },
  { key: "all",   label: "Tất cả" },
];

const PAGE_SIZE = 20;

// ── Helpers ───────────────────────────────────────────────
function fmt(n: number) {
  return Math.abs(n).toLocaleString("vi-VN");
}
function fmtBalance(s?: string) {
  if (!s) return null;
  return Number.parseFloat(s).toLocaleString("vi-VN");
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function withinRange(iso: string, range: DateRange): boolean {
  if (range === "all") return true;
  const now = new Date();
  const d   = new Date(iso);
  const diffDays = (now.getTime() - d.getTime()) / 86400000;
  if (range === "today") return diffDays < 1 && now.getDate() === d.getDate();
  if (range === "7d")    return diffDays <= 7;
  if (range === "30d")   return diffDays <= 30;
  return true;
}

// ── Stat card ─────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", p: 1.75, transition: "all 180ms ease", "&:hover": { borderColor: alpha(color, 0.3), boxShadow: `0 4px 16px ${alpha(color, 0.1)}`, transform: "translateY(-1px)" } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: "8px", background: color, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 6px ${alpha(color, 0.3)}`, color: "white" }}>
          {icon}
        </Box>
        <Typography sx={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "text.disabled", lineHeight: 1.2 }}>
          {label}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: { xs: "15px", sm: "17px" }, fontWeight: 800, color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
        {value}
      </Typography>
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────
export default function HistoryPage() {
  const t = useTranslations("history");
  const [dateRange, setDateRange]     = useState<DateRange>("all");
  const [typeFilter, setTypeFilter]   = useState<string>("all");
  const [search, setSearch]           = useState("");
  const [transactions, setTransactions] = useState<DisplayTx[]>([]);
  const [meta, setMeta]               = useState<PaginatedMeta>({ page: 1, limit: PAGE_SIZE, total: 0 });
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(true);
  const [loadError, setLoadError]     = useState("");

  const fetchPage = useCallback(async (p: number) => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await walletApi.transactions(p, PAGE_SIZE);
      setTransactions(res.data.map(mapTx));
      setMeta(res.meta);
      setPage(p);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { void fetchPage(1); }, [fetchPage]);

  // Resolve display label/method per locale at render time
  const methodLabel = useCallback((refType?: string) =>
    refType === "order" ? t("methodOrder") : refType === "manual" ? t("methodManual") : t("methodSystem"),
  [t]);
  const typeLabelFor = useCallback((backendType: string) =>
    BACKEND_TYPE_LABEL[backendType] ? t(`backendTypeLabel.${backendType}`) : backendType,
  [t]);

  const localizedTx = useMemo(
    () => transactions.map((tx) => ({
      ...tx,
      label: typeLabelFor(tx.backendType),
      method: methodLabel(tx.refType),
    })),
    [transactions, typeLabelFor, methodLabel],
  );

  // Export CSV từ dữ liệu hiện tại
  function handleExportCsv() {
    const rows = [
      [t("csvId"), t("csvType"), t("csvDesc"), t("csvNote"), t("csvMethod"), t("csvAmount"), t("csvBalanceBefore"), t("csvBalanceAfter"), t("csvStatus"), t("csvDate")],
      ...localizedTx.map((tx) => [
        tx.id,
        tx.label,
        tx.label,
        tx.note,
        tx.method,
        (TYPE_CONFIG[tx.type].isCredit ? "+" : "-") + fmt(tx.amount),
        fmtBalance(tx.balanceBefore) ?? "",
        fmtBalance(tx.balanceAfter) ?? "",
        t(`statusLabel.${tx.status}`),
        fmtDate(tx.date),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const a   = document.createElement("a");
    a.href = url; a.download = t("csvFilename", { page }); a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = useMemo(() => {
    return localizedTx.filter((tx) => {
      if (!withinRange(tx.date, dateRange)) return false;
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (search && !tx.id.toLowerCase().includes(search.toLowerCase()) && !tx.label.toLowerCase().includes(search.toLowerCase()) && !tx.note.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [localizedTx, dateRange, typeFilter, search]);

  // Stat totals từ trang hiện tại
  const totalDeposit = transactions.filter(x => (x.type === "deposit" || x.type === "refund") && x.status === "success").reduce((s, x) => s + Math.abs(x.amount), 0);
  const totalSpend   = transactions.filter(x => x.type === "spend"  && x.status === "success").reduce((s, x) => s + Math.abs(x.amount), 0);
  const totalVip     = transactions.filter(x => x.type === "vip"    && x.status === "success").reduce((s, x) => s + Math.abs(x.amount), 0);
  const totalRefund  = transactions.filter(x => x.type === "refund" && x.status === "success").reduce((s, x) => s + Math.abs(x.amount), 0);

  const totalPages = Math.max(1, Math.ceil(meta.total / PAGE_SIZE));

  return (
    <Box sx={{ width: "100%" }}>
      {/* ── Hero ── */}
      <Box sx={{ position: "relative", overflow: "hidden", borderRadius: "18px", border: "1px solid", borderColor: alpha("#0EA5E9", 0.25), background: (t) => t.palette.surface.hero, px: { xs: 2.5, sm: 3 }, py: { xs: 2.5, sm: 3 }, mb: 3 }}>
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(14,165,233,0.18)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -30, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(6,182,212,0.15)", pointerEvents: "none" }} />

        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box sx={{ position: "absolute", inset: -4, borderRadius: "14px", background: "#0EA5E9", filter: "blur(8px)", opacity: 0.35 }} />
              <Box sx={{ position: "relative", width: 48, height: 48, borderRadius: "14px", background: "#0EA5E9", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(14,165,233,0.35)" }}>
                <History size={24} color="white" />
              </Box>
            </Box>
            <Box>
              <Typography sx={{ fontSize: { xs: "18px", sm: "22px" }, fontWeight: 800, color: "text.primary", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                {t("title")}
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 0.25 }}>
                {t("summary", { total: meta.total, page, totalPages })}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Box component="button" onClick={handleExportCsv} disabled={transactions.length === 0} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2, py: 1, borderRadius: "8px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", color: "text.secondary", fontSize: "12px", fontWeight: 600, cursor: "pointer", opacity: transactions.length === 0 ? 0.5 : 1, transition: "all 150ms ease", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}>
              <Download size={14} />
              {t("exportCsv")}
            </Box>
            <Box component="button" onClick={() => void fetchPage(page)} disabled={loading} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2, py: 1, borderRadius: "8px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", color: "text.secondary", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 150ms ease", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}>
              <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
              {t("refresh")}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Stat cards ── */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4,1fr)" }, gap: { xs: 1.5, sm: 2 }, mb: 3 }}>
        <StatCard icon={<ArrowDown size={15} />} label={t("statDeposit")} value={`${fmt(totalDeposit)} ₫`} color="#059669" />
        <StatCard icon={<ArrowUp   size={15} />} label={t("statSpend")}  value={`${fmt(totalSpend)} ₫`}   color="#DC2626" />
        <StatCard icon={<Star      size={15} />} label={t("statVip")}      value={`${fmt(totalVip)} ₫`}     color="#0284C7" />
        <StatCard icon={<RotateCcw size={15} />} label={t("statRefund")}    value={`${fmt(totalRefund)} ₫`}  color="#0891B2" />
      </Box>

      {/* ── Filter bar ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 2 }}>
        {/* Date range pills */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, p: 0.75, borderRadius: "99px", bgcolor: alpha("#0EA5E9", 0.06), border: "1px solid", borderColor: alpha("#0EA5E9", 0.15) }}>
          <CalendarDays size={15} color="#0EA5E9" style={{ marginLeft: 4, flexShrink: 0 }} />
          {DATE_PILLS.map((pill) => {
            const active = dateRange === pill.key;
            const pillLabel = pill.key === "today" ? t("datePillToday") : pill.key === "7d" ? t("datePill7d") : pill.key === "30d" ? t("datePill30d") : t("datePillAll");
            return (
              <Box key={pill.key} component="button" onClick={() => setDateRange(pill.key)} sx={{ px: 1.5, py: 0.625, borderRadius: "99px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 600, transition: "all 150ms ease", background: active ? "#0EA5E9" : "transparent", color: active ? "white" : "text.secondary", boxShadow: active ? "0 1px 6px rgba(14,165,233,0.3)" : "none" }}>
                {pillLabel}
              </Box>
            );
          })}
        </Box>

        {/* Type dropdown */}
        <Select size="small" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} sx={{ height: 36, fontSize: "12px", fontWeight: 600, borderRadius: "99px", minWidth: 150, "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.25) }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.5) } }}>
          <MenuItem value="all"     sx={{ fontSize: "12px" }}>{t("typeAll")}</MenuItem>
          <MenuItem value="deposit" sx={{ fontSize: "12px" }}>{t("typeDeposit")}</MenuItem>
          <MenuItem value="spend"   sx={{ fontSize: "12px" }}>{t("typeSpend")}</MenuItem>
          <MenuItem value="vip"     sx={{ fontSize: "12px" }}>{t("typeVip")}</MenuItem>
          <MenuItem value="refund"  sx={{ fontSize: "12px" }}>{t("typeRefund")}</MenuItem>
        </Select>

        {/* Search */}
        <Box sx={{ ml: "auto", flex: 1, maxWidth: 320, minWidth: 180, position: "relative", display: "flex", alignItems: "center" }}>
          <Search size={16} color="#94A3B8" style={{ position: "absolute", left: 12, flexShrink: 0 }} />
          <InputBase
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: "100%", pl: "36px", pr: search ? "70px" : "12px", height: 36, borderRadius: "99px", border: "1px solid", borderColor: alpha("#0EA5E9", 0.25), bgcolor: "background.paper", fontSize: "12px", transition: "all 150ms ease", "&:focus-within": { borderColor: alpha("#0EA5E9", 0.5), boxShadow: `0 0 0 3px ${alpha("#0EA5E9", 0.08)}` }, "& input": { p: 0 } }}
          />
          {search && (
            <Box component="button" onClick={() => setSearch("")} sx={{ position: "absolute", right: 6, px: 1.25, py: 0.375, borderRadius: "99px", border: "none", bgcolor: alpha("#0EA5E9", 0.1), color: "#0284C7", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
              {t("clear")}
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Loading / error ── */}
      {loading && <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>}
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}

      {/* ── Transaction list ── */}
      {!loading && (
        <Box sx={{ borderRadius: "16px", border: "2px dashed", borderColor: filtered.length === 0 ? alpha("#0EA5E9", 0.2) : "transparent", bgcolor: filtered.length === 0 ? alpha("#0EA5E9", 0.02) : "transparent", overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <Box sx={{ py: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 80, height: 80, borderRadius: "24px", background: (t) => t.palette.mode === "dark" ? alpha("#0EA5E9", 0.12) : "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SlidersHorizontal size={38} color="#0EA5E9" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                  {t("emptyTitle")}
                </Typography>
                <Typography sx={{ fontSize: "13px", color: "text.secondary", maxWidth: 320 }}>
                  {t("emptyDesc")}
                </Typography>
              </Box>
              <Box component={Link} href="/deposit" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2.5, py: 1.25, borderRadius: "8px", border: "none", background: "#0EA5E9", color: "white", fontSize: "13px", fontWeight: 700, textDecoration: "none", boxShadow: "0 2px 10px rgba(14,165,233,0.3)", transition: "all 180ms ease", "&:hover": { opacity: 0.9, transform: "translateY(-1px)" } }}>
                <Wallet size={16} />
                {t("depositNow")}
              </Box>
            </Box>
          ) : (
            <Box sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", overflow: "hidden" }}>
              {/* Table header */}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr auto", sm: "1fr 120px 110px 150px" }, px: { xs: 2, sm: 2.5 }, py: 1.25, borderBottom: "1px solid", borderColor: "divider", bgcolor: "surface.subtle" }}>
                {[t("colTransaction"), t("colMethod"), t("colStatus"), t("colAmount")].map((h, i) => (
                  <Typography key={h} sx={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "text.disabled", display: i > 1 ? { xs: "none", sm: "block" } : "block", textAlign: i === 3 ? "right" : "left" }}>
                    {h}
                  </Typography>
                ))}
              </Box>

              {/* Rows */}
              {filtered.map((tx, i) => {
                const tc = TYPE_CONFIG[tx.type];
                const sc = STATUS_CONFIG[tx.status];
                const balAfter = fmtBalance(tx.balanceAfter);

                return (
                  <Box key={tx.rawId} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr auto", sm: "1fr 120px 110px 150px" }, alignItems: "center", px: { xs: 2, sm: 2.5 }, py: { xs: 1.5, sm: 1.75 }, borderBottom: i < filtered.length - 1 ? "1px solid" : "none", borderColor: "divider", transition: "bgcolor 150ms ease", "&:hover": { bgcolor: "action.hover" }, gap: { xs: 1, sm: 0 } }}>
                    {/* Col 1: icon + label + note + id + date */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                      <Box sx={{ flexShrink: 0, width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 }, borderRadius: "10px", bgcolor: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", color: tc.color }}>
                        {tc.icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {tx.label}
                        </Typography>
                        {tx.note && (
                          <Typography sx={{ fontSize: "11px", color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {tx.note}
                          </Typography>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.25, flexWrap: "wrap" }}>
                          <Typography sx={{ fontSize: "10px", color: "text.disabled", fontFamily: "monospace" }}>{tx.id}</Typography>
                          <Typography sx={{ fontSize: "10px", color: "text.disabled" }}>·</Typography>
                          <Typography sx={{ fontSize: "10px", color: "text.disabled" }}>{fmtDate(tx.date)}</Typography>
                          <Box component="span" sx={{ display: { xs: "inline-block", sm: "none" }, px: 0.875, py: 0.125, borderRadius: "99px", bgcolor: sc.bg, color: sc.color, fontSize: "9px", fontWeight: 700 }}>
                            {t(`statusLabel.${tx.status}`)}
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                    {/* Col 2: method */}
                    <Typography sx={{ fontSize: "12px", color: "text.secondary", display: { xs: "none", sm: "block" } }}>
                      {tx.method}
                    </Typography>

                    {/* Col 3: status badge */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
                      <Box component="span" sx={{ px: 1.25, py: 0.375, borderRadius: "99px", bgcolor: sc.bg, color: sc.color, fontSize: "11px", fontWeight: 700 }}>
                        {t(`statusLabel.${tx.status}`)}
                      </Box>
                    </Box>

                    {/* Col 4: amount + balance after */}
                    <Box sx={{ textAlign: "right" }}>
                      <Typography sx={{ fontSize: { xs: "13px", sm: "14px" }, fontWeight: 800, color: tc.isCredit ? "#059669" : "#DC2626", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                        {tc.isCredit ? "+" : "−"}{fmt(tx.amount)} ₫
                      </Typography>
                      {balAfter !== null && (
                        <Typography sx={{ fontSize: "10px", color: "text.disabled", whiteSpace: "nowrap" }}>
                          {t("balancePrefix", { balance: balAfter })}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}

      {/* ── Pagination ── */}
      {!loading && meta.total > PAGE_SIZE && (
        <Box sx={{ mt: 2.5, display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
          <Box component="button" onClick={() => void fetchPage(page - 1)} disabled={page <= 1 || loading} sx={{ display: "inline-flex", alignItems: "center", gap: 0.375, px: 2.5, py: 1.25, borderRadius: "7px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", color: page <= 1 ? "text.disabled" : "text.secondary", fontSize: "12px", fontWeight: 600, cursor: page <= 1 ? "default" : "pointer", opacity: page <= 1 ? 0.5 : 1 }}>
            <ChevronLeft size={14} />
            {t("prev")}
          </Box>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
            const start = Math.max(1, Math.min(page - 2, totalPages - 4));
            const p     = start + idx;
            if (p > totalPages) return null;
            return (
              <Box key={p} component="button" onClick={() => void fetchPage(p)} sx={{ width: 30, height: 30, borderRadius: "7px", border: "1px solid", borderColor: p === page ? "#0EA5E9" : "divider", bgcolor: p === page ? alpha("#0EA5E9", 0.1) : "background.paper", color: p === page ? "#0284C7" : "text.secondary", fontSize: "12px", fontWeight: p === page ? 700 : 400, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p}
              </Box>
            );
          })}

          <Box component="button" onClick={() => void fetchPage(page + 1)} disabled={page >= totalPages || loading} sx={{ display: "inline-flex", alignItems: "center", gap: 0.375, px: 2.5, py: 1.25, borderRadius: "7px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper", color: page >= totalPages ? "text.disabled" : "text.secondary", fontSize: "12px", fontWeight: 600, cursor: page >= totalPages ? "default" : "pointer", opacity: page >= totalPages ? 0.5 : 1 }}>
            {t("next")}
            <ChevronRight size={14} />
          </Box>
        </Box>
      )}

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center" }}>
          <Typography sx={{ fontSize: "12px", color: "text.disabled" }}>
            {t("footerCount", { shown: filtered.length, total: meta.total })}
          </Typography>
        </Box>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Box>
  );
}
