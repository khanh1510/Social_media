"use client";

import { Box, Grid, Typography, Button, alpha } from "@mui/material";
import { Wallet, PiggyBank, TrendingUp, Target, ArrowRight, Bell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/dashboard/StatCard";
import NotificationCard from "@/components/dashboard/NotificationCard";
import OrderStatistics from "@/components/dashboard/OrderStatistics";
import { useAuth } from "@/contexts/AuthContext";
import { notificationsApi, ordersApi } from "@/lib/api";
import type { ApiNotification } from "@/lib/api/types";
import { formatVND } from "@/lib/format";
import type { StatCardData, Notification } from "@/types";

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

function toUiNotification(n: ApiNotification): Notification {
  return {
    id: n.id,
    userName: "Hệ thống",
    verified: true,
    platform: "global",
    timeAgo: timeAgo(n.createdAt),
    title: n.title,
    description: n.body,
  };
}

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

      {/* Stat Cards — 4 cols on lg, 2 cols on xs */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid key={card.id} size={{ xs: 6, lg: 3 }}>
            <StatCard data={card} />
          </Grid>
        ))}
      </Grid>

      {/* Bottom section: Notifications (2/3) + Order Statistics (1/3) */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ alignItems: "flex-start" }}>
        {/* LEFT: Notifications */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Section header */}
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
                  width: 30,
                  height: 30,
                  borderRadius: "9px",
                  bgcolor: alpha("#2563EB", 0.08),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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

            <Button
              size="small"
              endIcon={<ArrowRight size={13} />}
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "primary.main",
                borderRadius: "8px",
                px: 1.25,
                py: 0.625,
                "&:hover": { bgcolor: alpha("#2563EB", 0.06) },
              }}
            >
              Xem Tất Cả
            </Button>
          </Box>

          {/* Notification list — stacked vertically */}
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
        </Grid>

        {/* RIGHT: Order Statistics */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <OrderStatistics />
        </Grid>
      </Grid>
    </Box>
  );
}
