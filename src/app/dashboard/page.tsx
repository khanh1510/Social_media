"use client";

import { Box, Grid, Typography, Button, Chip, alpha, CircularProgress } from "@mui/material";
import { Wallet, PiggyBank, TrendingUp, Target, Bell, Package, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import NotificationCard from "@/components/dashboard/NotificationCard";
import OrderStatistics from "@/components/dashboard/OrderStatistics";
import { useAuth } from "@/contexts/AuthContext";
import { notificationsApi, ordersApi } from "@/lib/api";
import type { ApiNotification, ApiOrder, OrderStatus } from "@/lib/api/types";
import { formatVND } from "@/lib/format";
import type { StatCardData, Notification } from "@/types";

// ── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} phút`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày`;
  return `${Math.floor(days / 7)} tuần`;
}

// Map notification title (English → Vietnamese)
const NOTIF_TITLE_MAP: Record<string, string> = {
  "Welcome to SignalGit": "Chào mừng bạn!",
  "Account Created": "Tài khoản đã được tạo",
  "Order Completed": "Đơn hàng hoàn thành",
  "Order Failed": "Đơn hàng thất bại",
  "Payment Received": "Thanh toán thành công",
  "Deposit Confirmed": "Nạp tiền thành công",
  "Refund Processed": "Hoàn tiền thành công",
  "Password Changed": "Mật khẩu đã thay đổi",
};

// Map backend notification type → platform icon
const NOTIF_TYPE_PLATFORM: Record<string, Notification["platform"]> = {
  order_update:   "global",
  order_created:  "global",
  payment:        "global",
  deposit:        "global",
  refund:         "global",
  system:         "global",
  promotion:      "global",
};

function toUiNotification(n: ApiNotification): Notification {
  return {
    id: n.id,
    userName: "Hệ thống",
    verified: true,
    platform: NOTIF_TYPE_PLATFORM[n.type] ?? "global",
    timeAgo: timeAgo(n.createdAt),
    title: NOTIF_TITLE_MAP[n.title] ?? n.title,
    description: n.body,
    isRead: n.readAt !== null,
    notifType: n.type,
  };
}

// ── Order status config ───────────────────────────────────────────────────────
const ORDER_STATUS: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:     { label: "Chờ xử lý",   color: "#D97706" },
  PROCESSING:  { label: "Đang xử lý",  color: "#2563EB" },
  IN_PROGRESS: { label: "Đang chạy",   color: "#0EA5E9" },
  COMPLETED:   { label: "Hoàn thành",  color: "#059669" },
  PARTIAL:     { label: "Một phần",    color: "#0891B2" },
  CANCELED:    { label: "Đã huỷ",      color: "#64748B" },
  FAILED:      { label: "Thất bại",    color: "#DC2626" },
  ERROR:       { label: "Lỗi",         color: "#DC2626" },
};

// ── Recent Orders mini component ──────────────────────────────────────────────
function RecentOrdersSection() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    ordersApi.list({ page: 1, limit: 5 }).then((res) => {
      if (!cancelled) setOrders(res.data);
    }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
      <CircularProgress size={24} />
    </Box>
  );

  if (orders.length === 0) return (
    <Box sx={{ py: 3, textAlign: "center" }}>
      <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>
        Chưa có đơn hàng nào.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {orders.map((o) => {
        const s = ORDER_STATUS[o.status] ?? { label: o.status, color: "#64748B" };
        return (
          <Box
            key={o.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              transition: "all 150ms ease",
              "&:hover": { borderColor: alpha("#2563EB", 0.2), bgcolor: alpha("#2563EB", 0.02) },
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 32, height: 32, borderRadius: "9px",
                bgcolor: alpha("#2563EB", 0.08),
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Package size={15} color="#2563EB" />
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "12px", fontWeight: 600, color: "text.primary",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  lineHeight: 1.4,
                }}
              >
                #{o.orderNumber} · {o.serviceName ?? "Dịch vụ"}
              </Typography>
              <Typography
                sx={{
                  fontSize: "11px", color: "text.secondary",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}
              >
                {o.link} · {o.quantity.toLocaleString("vi-VN")} đơn vị
              </Typography>
            </Box>

            {/* Right side */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5, flexShrink: 0 }}>
              <Chip
                label={s.label}
                size="small"
                sx={{
                  height: 18, fontSize: "10px", fontWeight: 600,
                  color: s.color, bgcolor: alpha(s.color, 0.08),
                  border: `1px solid ${alpha(s.color, 0.2)}`,
                  "& .MuiChip-label": { px: 0.75 },
                }}
              />
              <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "text.primary", fontVariantNumeric: "tabular-nums" }}>
                {formatVND(o.charge)}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user, wallet, refreshWallet } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);

  useEffect(() => {
    void refreshWallet();
    (async () => {
      try {
        const res = await notificationsApi.me();
        const list = Array.isArray(res) ? res : res.data;
        setNotifications(list.slice(0, 5).map(toUiNotification));
      } catch {
        // thông báo lỗi không chặn dashboard
      }
    })();
    (async () => {
      try {
        const res = await ordersApi.list({ page: 1, limit: 1 });
        setTotalOrders(res.meta.total);
      } catch {
        // bỏ qua
      }
    })();
  }, [refreshWallet]);

  const statCards: StatCardData[] = useMemo(
    () => [
      {
        id: "balance",
        label: "Số Dư Hiện Tại",
        value: wallet ? formatVND(wallet.balance) : "—",
        icon: <Wallet size={22} color="#2563EB" />,
        color: "primary",
      },
      {
        id: "deposited",
        label: "Tổng Đã Nạp",
        value: wallet ? formatVND(wallet.totalDeposited) : "—",
        icon: <PiggyBank size={22} color="#10B981" />,
        color: "success",
      },
      {
        id: "spent",
        label: "Tổng Đã Chi",
        value: wallet ? formatVND(wallet.totalSpent) : "—",
        icon: <TrendingUp size={22} color="#0EA5E9" />,
        color: "info",
      },
      {
        id: "orders",
        label: "Tổng Đơn Hàng",
        value: totalOrders !== null ? totalOrders.toLocaleString("vi-VN") : "—",
        icon: <Target size={22} color="#06B6D4" />,
        color: "warning",
      },
    ],
    [wallet, totalOrders],
  );

  const greetName = user?.fullName || user?.username || "";

  return (
    <Box sx={{ width: "100%" }}>
      {/* Welcome */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "24px" },
            fontWeight: 800,
            color: "text.primary",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
          }}
        >
          Xin chào, {greetName} 👋
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "text.secondary", mt: 0.5 }}>
          Đây là tổng quan tài khoản của bạn hôm nay.
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid key={card.id} size={{ xs: 6, lg: 3 }}>
            <StatCard data={card} />
          </Grid>
        ))}
      </Grid>

      {/* Bottom section */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ alignItems: "flex-start" }}>
        {/* LEFT: Notifications + Recent Orders */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Notifications */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 30, height: 30, borderRadius: "9px",
                      bgcolor: alpha("#2563EB", 0.08),
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Bell size={16} color="#2563EB" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
                      Thông Báo
                    </Typography>
                    <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
                      {notifications.length} thông báo
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {notifications.length === 0 ? (
                  <Typography sx={{ fontSize: "13px", color: "text.secondary", py: 3, textAlign: "center" }}>
                    Chưa có thông báo nào.
                  </Typography>
                ) : (
                  notifications.map((notif) => (
                    <NotificationCard key={notif.id} notification={notif} />
                  ))
                )}
              </Box>
            </Box>

            {/* Recent Orders */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 30, height: 30, borderRadius: "9px",
                      bgcolor: alpha("#0EA5E9", 0.08),
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Package size={16} color="#0EA5E9" />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
                      Đơn Hàng Gần Đây
                    </Typography>
                    <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
                      5 đơn mới nhất
                    </Typography>
                  </Box>
                </Box>
                <Button
                  component={Link}
                  href="/seeding"
                  size="small"
                  endIcon={<ExternalLink size={12} />}
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#0EA5E9",
                    borderRadius: "8px",
                    px: 1.25,
                    py: 0.625,
                    "&:hover": { bgcolor: alpha("#0EA5E9", 0.06) },
                  }}
                >
                  Đặt đơn mới
                </Button>
              </Box>

              <RecentOrdersSection />
            </Box>
          </Box>
        </Grid>

        {/* RIGHT: Order Statistics */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <OrderStatistics />
        </Grid>
      </Grid>
    </Box>
  );
}