"use client";

import { Box, Typography, alpha, InputBase, MenuItem, Select, CircularProgress, Alert } from "@mui/material";
import { History, Download, RefreshCw, ArrowDown, ArrowUp, Star, RotateCcw, Search, SlidersHorizontal, CalendarDays, Wallet } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { walletApi, ApiError } from "@/lib/api";

// ── Types ────────────────────────────────────────────────
type TxType = "deposit" | "spend" | "vip" | "refund";
type TxStatus = "success" | "pending" | "failed";
type DateRange = "today" | "7d" | "30d" | "all";

interface Transaction {
  id: string;
  type: TxType;
  method: string;
  description: string;
  amount: number;
  status: TxStatus;
  date: string; // ISO
}

// Map giao dịch ví backend (TransactionType/TransactionStatus) → shape hiển thị
const BACKEND_TYPE_MAP: Record<string, TxType> = {
  DEPOSIT: "deposit",
  ORDER_DEDUCT: "spend",
  ORDER_REFUND: "refund",
  ADMIN_ADJUST: "deposit",
  REFERRAL_BONUS: "deposit",
};

const BACKEND_TYPE_LABEL: Record<string, string> = {
  DEPOSIT: "Nạp tiền",
  ORDER_DEDUCT: "Thanh toán đơn hàng",
  ORDER_REFUND: "Hoàn tiền đơn hàng",
  ADMIN_ADJUST: "Điều chỉnh bởi admin",
  REFERRAL_BONUS: "Thưởng giới thiệu",
};

// ── Config maps ──────────────────────────────────────────
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

// ── Helpers ──────────────────────────────────────────────
function fmt(n: number) {
  return Math.abs(n).toLocaleString("vi-VN");
}
function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function withinRange(iso: string, range: DateRange): boolean {
  if (range === "all") return true;
  const now = new Date();
  const d = new Date(iso);
  const diffDays = (now.getTime() - d.getTime()) / 86400000;
  if (range === "today") return diffDays < 1 && now.getDate() === d.getDate();
  if (range === "7d")    return diffDays <= 7;
  if (range === "30d")   return diffDays <= 30;
  return true;
}

// ── Stat card ────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <Box
      sx={{
        borderRadius: "14px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        p: 1.75,
        transition: "all 180ms ease",
        "&:hover": {
          borderColor: alpha(color, 0.3),
          boxShadow: `0 4px 16px ${alpha(color, 0.1)}`,
          transform: "translateY(-1px)",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.25 }}>
        <Box
          sx={{
            width: 28, height: 28, borderRadius: "8px",
            background: color,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 2px 6px ${alpha(color, 0.3)}`,
            color: "white",
          }}
        >
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

// ── Page ─────────────────────────────────────────────────
export default function HistoryPage() {
  const [dateRange, setDateRange]   = useState<DateRange>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [search, setSearch]         = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await walletApi.transactions(1, 100);
        if (cancelled) return;
        setTransactions(
          res.data.map((tx) => {
            const amount = Number.parseFloat(tx.amount);
            const mapped = BACKEND_TYPE_MAP[tx.type] ?? (amount >= 0 ? "deposit" : "spend");
            // ADMIN_ADJUST có thể âm → coi là chi tiêu
            const type: TxType = mapped === "deposit" && amount < 0 ? "spend" : mapped;
            const status: TxStatus =
              (tx as { status?: string }).status === "PENDING" ? "pending"
              : (tx as { status?: string }).status === "REVERSED" ? "failed"
              : "success";
            return {
              id: tx.id.slice(0, 8).toUpperCase(),
              type,
              method: "Hệ thống",
              description: tx.description || (tx as { note?: string }).note || BACKEND_TYPE_LABEL[tx.type] || tx.type,
              amount,
              status,
              date: tx.createdAt,
            };
          }),
        );
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : "Không tải được lịch sử giao dịch.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (!withinRange(tx.date, dateRange)) return false;
      if (typeFilter !== "all" && tx.type !== typeFilter) return false;
      if (methodFilter !== "all" && tx.method !== methodFilter) return false;
      if (search && !tx.id.toLowerCase().includes(search.toLowerCase()) && !tx.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, dateRange, typeFilter, methodFilter, search]);

  // Stat totals (from full dataset, not filtered)
  const totalDeposit = transactions.filter(t => (t.type === "deposit" || t.type === "refund") && t.status === "success").reduce((s, t) => s + t.amount, 0);
  const totalSpend   = transactions.filter(t => t.type === "spend"   && t.status === "success").reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalVip     = transactions.filter(t => t.type === "vip"     && t.status === "success").reduce((s, t) => s + Math.abs(t.amount), 0);
  const totalRefund  = transactions.filter(t => t.type === "refund"  && t.status === "success").reduce((s, t) => s + t.amount, 0);

  const allMethods = Array.from(new Set(transactions.map(t => t.method)));

  return (
    <Box sx={{ width: "100%" }}>
      {/* ── Hero ── */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "18px",
          border: "1px solid",
          borderColor: alpha("#0EA5E9", 0.25),
          background: "#F0F9FF",
          px: { xs: 2.5, sm: 3 },
          py: { xs: 2.5, sm: 3 },
          mb: 3,
        }}
      >
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
                Lịch sử giao dịch
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 0.25 }}>
                Tổng{" "}
                <Box component="span" sx={{ fontWeight: 700, color: "#0284C7" }}>{transactions.length}</Box>
                {" "}giao dịch · trang 1/1
              </Typography>
            </Box>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              component="button"
              sx={{
                display: "inline-flex", alignItems: "center", gap: 0.75,
                px: 2, py: 0.875,
                borderRadius: "99px",
                border: "1.5px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                color: "text.secondary",
                fontSize: "12px", fontWeight: 600,
                cursor: "pointer",
                transition: "all 150ms ease",
                "&:hover": { borderColor: "primary.main", color: "primary.main", transform: "translateY(-1px)", boxShadow: "0 2px 8px rgba(37,99,235,0.1)" },
              }}
            >
              <Download size={15} />
              Xuất CSV
            </Box>
            <Box
              component="button"
              sx={{
                display: "inline-flex", alignItems: "center", gap: 0.75,
                px: 2, py: 0.875,
                borderRadius: "99px",
                border: "1.5px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                color: "text.secondary",
                fontSize: "12px", fontWeight: 600,
                cursor: "pointer",
                transition: "all 150ms ease",
                "&:hover": { borderColor: "primary.main", color: "primary.main", transform: "translateY(-1px)" },
              }}
            >
              <RefreshCw size={15} />
              Làm mới
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Stat cards ── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4,1fr)" },
          gap: { xs: 1.5, sm: 2 },
          mb: 3,
        }}
      >
        <StatCard icon={<ArrowDown size={15} />} label="Tổng nạp + thưởng" value={`${fmt(totalDeposit)} ₫`} color="#059669" />
        <StatCard icon={<ArrowUp   size={15} />} label="Tổng đã chi"       value={`${fmt(totalSpend)} ₫`}   color="#DC2626" />
        <StatCard icon={<Star      size={15} />} label="Mua VIP"           value={`${fmt(totalVip)} ₫`}     color="#0284C7" />
        <StatCard icon={<RotateCcw size={15} />} label="Hoàn tiền"         value={`${fmt(totalRefund)} ₫`}  color="#0891B2" />
      </Box>

      {/* ── Filter bar ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        {/* Date range pills */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            p: 0.75,
            borderRadius: "99px",
            bgcolor: alpha("#0EA5E9", 0.06),
            border: "1px solid",
            borderColor: alpha("#0EA5E9", 0.15),
          }}
        >
          <CalendarDays size={15} color="#0EA5E9" style={{ marginLeft: 4, flexShrink: 0 }} />
          {DATE_PILLS.map((pill) => {
            const active = dateRange === pill.key;
            return (
              <Box
                key={pill.key}
                component="button"
                onClick={() => setDateRange(pill.key)}
                sx={{
                  px: 1.5, py: 0.625,
                  borderRadius: "99px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px", fontWeight: 600,
                  transition: "all 150ms ease",
                  background: active ? "#0EA5E9" : "transparent",
                  color: active ? "white" : "text.secondary",
                  boxShadow: active ? "0 1px 6px rgba(14,165,233,0.3)" : "none",
                  "&:hover": { color: active ? "white" : "#0284C7" },
                }}
              >
                {pill.label}
              </Box>
            );
          })}
        </Box>

        {/* Type dropdown */}
        <Select
          size="small"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{
            height: 36,
            fontSize: "12px",
            fontWeight: 600,
            borderRadius: "99px",
            minWidth: 150,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.25) },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.5) },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0EA5E9" },
          }}
        >
          <MenuItem value="all" sx={{ fontSize: "12px" }}>Loại: Tất cả</MenuItem>
          <MenuItem value="deposit" sx={{ fontSize: "12px" }}>Nạp tiền</MenuItem>
          <MenuItem value="spend"   sx={{ fontSize: "12px" }}>Chi tiêu</MenuItem>
          <MenuItem value="vip"     sx={{ fontSize: "12px" }}>Mua VIP</MenuItem>
          <MenuItem value="refund"  sx={{ fontSize: "12px" }}>Hoàn tiền</MenuItem>
        </Select>

        {/* Method dropdown */}
        <Select
          size="small"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          sx={{
            height: 36,
            fontSize: "12px",
            fontWeight: 600,
            borderRadius: "99px",
            minWidth: 170,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.25) },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.5) },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0EA5E9" },
          }}
        >
          <MenuItem value="all" sx={{ fontSize: "12px" }}>Phương thức: Tất cả</MenuItem>
          {allMethods.map((m) => (
            <MenuItem key={m} value={m} sx={{ fontSize: "12px" }}>{m}</MenuItem>
          ))}
        </Select>

        {/* Search */}
        <Box
          sx={{
            ml: "auto",
            flex: 1,
            maxWidth: 320,
            minWidth: 180,
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search size={16} color="#94A3B8" style={{ position: "absolute", left: 12, flexShrink: 0 }} />
          <InputBase
            placeholder="Tìm theo mã giao dịch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: "100%",
              pl: "36px",
              pr: search ? "70px" : "12px",
              height: 36,
              borderRadius: "99px",
              border: "1px solid",
              borderColor: alpha("#0EA5E9", 0.25),
              bgcolor: "background.paper",
              fontSize: "12px",
              transition: "all 150ms ease",
              "&:focus-within": {
                borderColor: alpha("#0EA5E9", 0.5),
                boxShadow: `0 0 0 3px ${alpha("#0EA5E9", 0.08)}`,
              },
              "& input": { p: 0 },
            }}
          />
          {search && (
            <Box
              component="button"
              onClick={() => setSearch("")}
              sx={{
                position: "absolute",
                right: 6,
                px: 1.25,
                py: 0.375,
                borderRadius: "99px",
                border: "none",
                bgcolor: alpha("#0EA5E9", 0.1),
                color: "#0284C7",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { bgcolor: alpha("#0EA5E9", 0.18) },
              }}
            >
              Xóa
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Loading / error ── */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}

      {/* ── Transaction list ── */}
      {!loading && (
      <Box
        sx={{
          borderRadius: "16px",
          border: "2px dashed",
          borderColor: filtered.length === 0 ? alpha("#0EA5E9", 0.2) : "transparent",
          bgcolor: filtered.length === 0 ? alpha("#0EA5E9", 0.02) : "transparent",
          overflow: "hidden",
        }}
      >
        {filtered.length === 0 ? (
          /* Empty state */
          <Box sx={{ py: 10, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 80, height: 80,
                borderRadius: "24px",
                background: "#EFF6FF",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <SlidersHorizontal size={38} color="#0EA5E9" />
            </Box>
            <Box>
              <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "text.primary", mb: 0.5 }}>
                Chưa có giao dịch nào
              </Typography>
              <Typography sx={{ fontSize: "13px", color: "text.secondary", maxWidth: 320 }}>
                Khi bạn nạp tiền, đặt đơn hoặc mua VIP, các giao dịch sẽ hiện ra ở đây.
              </Typography>
            </Box>
            <Box
              component={Link}
              href="/deposit"
              sx={{
                display: "inline-flex", alignItems: "center", gap: 0.75,
                px: 3, py: 1.125,
                borderRadius: "99px",
                border: "none",
                background: "#0EA5E9",
                color: "white",
                fontSize: "13px", fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 10px rgba(14,165,233,0.3)",
                transition: "all 180ms ease",
                "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
              }}
            >
              <Wallet size={16} />
              Nạp tiền ngay
            </Box>
          </Box>
        ) : (
          /* Transaction rows */
          <Box
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr auto", sm: "1fr 140px 110px 120px" },
                px: { xs: 2, sm: 2.5 },
                py: 1.25,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: alpha("#0F172A", 0.02),
              }}
            >
              {["Giao dịch", "Phương thức", "Trạng thái", "Số tiền"].map((h, i) => (
                <Typography
                  key={h}
                  sx={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "text.disabled",
                    display: i > 1 ? { xs: "none", sm: "block" } : "block",
                    textAlign: i === 3 ? "right" : "left",
                  }}
                >
                  {h}
                </Typography>
              ))}
            </Box>

            {/* Rows */}
            {filtered.map((tx, i) => {
              const tc = TYPE_CONFIG[tx.type];
              const sc = STATUS_CONFIG[tx.status];
              const isCredit = tc.isCredit;

              return (
                <Box
                  key={tx.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr auto", sm: "1fr 140px 110px 120px" },
                    alignItems: "center",
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 1.5, sm: 1.75 },
                    borderBottom: i < filtered.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                    transition: "bgcolor 150ms ease",
                    "&:hover": { bgcolor: alpha("#0F172A", 0.015) },
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  {/* Col 1: icon + description + id + date */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: { xs: 36, sm: 40 },
                        height: { xs: 36, sm: 40 },
                        borderRadius: "10px",
                        bgcolor: tc.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: tc.color,
                      }}
                    >
                      {tc.icon}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "text.primary",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tx.description}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.25 }}>
                        <Typography sx={{ fontSize: "10px", color: "text.disabled", fontFamily: "monospace" }}>
                          {tx.id}
                        </Typography>
                        <Typography sx={{ fontSize: "10px", color: "text.disabled" }}>·</Typography>
                        <Typography sx={{ fontSize: "10px", color: "text.disabled" }}>
                          {fmtDate(tx.date)}
                        </Typography>
                        {/* On mobile show status badge inline */}
                        <Box
                          component="span"
                          sx={{
                            display: { xs: "inline-block", sm: "none" },
                            px: 0.875,
                            py: 0.125,
                            borderRadius: "99px",
                            bgcolor: sc.bg,
                            color: sc.color,
                            fontSize: "9px",
                            fontWeight: 700,
                          }}
                        >
                          {sc.label}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Col 2: method */}
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "text.secondary",
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    {tx.method}
                  </Typography>

                  {/* Col 3: status badge */}
                  <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
                    <Box
                      component="span"
                      sx={{
                        px: 1.25, py: 0.375,
                        borderRadius: "99px",
                        bgcolor: sc.bg,
                        color: sc.color,
                        fontSize: "11px",
                        fontWeight: 700,
                      }}
                    >
                      {sc.label}
                    </Box>
                  </Box>

                  {/* Col 4: amount */}
                  <Typography
                    sx={{
                      fontSize: { xs: "13px", sm: "14px" },
                      fontWeight: 800,
                      color: isCredit ? "#059669" : "#DC2626",
                      fontVariantNumeric: "tabular-nums",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isCredit ? "+" : "−"}{fmt(tx.amount)} ₫
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
      )}

      {/* Footer count */}
      {filtered.length > 0 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Typography sx={{ fontSize: "12px", color: "text.disabled" }}>
            Hiển thị{" "}
            <Box component="span" sx={{ fontWeight: 700, color: "text.secondary" }}>{filtered.length}</Box>
            {" "}/ {transactions.length} giao dịch
          </Typography>
        </Box>
      )}
    </Box>
  );
}
