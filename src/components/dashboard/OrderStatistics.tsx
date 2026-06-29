"use client";

import { Box, Card, Typography, alpha, CircularProgress } from "@mui/material";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ordersApi } from "@/lib/api";
import type { OrderStatus } from "@/lib/api/types";

interface StatusStat {
  status: OrderStatus;
  labelKey: string;
  color: string;
  bg: string;
  count: number;
}

const STATUS_CONFIG: Omit<StatusStat, "count">[] = [
  { status: "PENDING",     labelKey: "statusPending",    color: "#D97706", bg: "rgba(245,158,11,0.1)" },
  { status: "PROCESSING",  labelKey: "statusProcessing", color: "#2563EB", bg: "rgba(37,99,235,0.1)" },
  { status: "IN_PROGRESS", labelKey: "statusInProgress", color: "#0EA5E9", bg: "rgba(14,165,233,0.1)" },
  { status: "COMPLETED",   labelKey: "statusCompleted",  color: "#059669", bg: "rgba(16,185,129,0.1)" },
  { status: "PARTIAL",     labelKey: "statusPartial",    color: "#0891B2", bg: "rgba(6,182,212,0.1)" },
  { status: "CANCELED",    labelKey: "statusCanceled",   color: "#64748B", bg: "rgba(100,116,139,0.1)" },
  { status: "FAILED",      labelKey: "statusFailed",     color: "#DC2626", bg: "rgba(220,38,38,0.08)" },
];

export default function OrderStatistics() {
  const t = useTranslations("dashboardComponents");
  const [stats, setStats] = useState<StatusStat[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Gọi song song tất cả status + tổng
        const [totalRes, ...statusResults] = await Promise.all([
          ordersApi.list({ page: 1, limit: 1 }),
          ...STATUS_CONFIG.map((s) => ordersApi.list({ page: 1, limit: 1, status: s.status })),
        ]);
        if (cancelled) return;
        setTotal(totalRes.meta.total);
        setStats(
          STATUS_CONFIG.map((s, i) => ({
            ...s,
            count: statusResults[i].meta.total,
          })).filter((s) => s.count > 0),
        );
      } catch {
        // bỏ qua lỗi, giữ empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const activeStats = stats.filter((s) => s.count > 0);

  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5, py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 34, height: 34, borderRadius: "10px",
              bgcolor: alpha("#2563EB", 0.08),
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Package size={18} color="#2563EB" />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
              {t("orderStatsTitle")}
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
              {t("orderStatsSubtitle")}
            </Typography>
          </Box>
        </Box>
        {total !== null && (
          <Box
            sx={{
              px: 1.25, py: 0.375,
              borderRadius: "99px",
              bgcolor: alpha("#2563EB", 0.08),
              border: `1px solid ${alpha("#2563EB", 0.15)}`,
            }}
          >
            <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#2563EB" }}>
              {total.toLocaleString("vi-VN")}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        {loading ? (
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : activeStats.length === 0 ? (
          <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4, gap: 1 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: alpha("#64748B", 0.06), display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Package size={22} color="#94A3B8" />
            </Box>
            <Typography sx={{ fontSize: "13px", color: "text.secondary", textAlign: "center" }}>
              {t("noOrders")}
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "text.disabled", textAlign: "center", maxWidth: 160, lineHeight: 1.5 }}>
              {t("noOrdersHint")}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Progress bar tổng */}
            {total !== null && total > 0 && (
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: "flex", height: 6, borderRadius: "99px", overflow: "hidden", gap: "1px", bgcolor: "surface.subtle" }}>
                  {activeStats.map((s) => (
                    <Box
                      key={s.status}
                      sx={{
                        flex: s.count,
                        bgcolor: s.color,
                        minWidth: 4,
                        transition: "flex 300ms ease",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Danh sách status */}
            {activeStats.map((s) => (
              <Box
                key={s.status}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1.25,
                  py: 0.875,
                  borderRadius: "10px",
                  bgcolor: s.bg,
                  border: `1px solid ${alpha(s.color, 0.15)}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "text.primary" }}>
                    {t(s.labelKey)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Typography sx={{ fontSize: "13px", fontWeight: 700, color: s.color, fontVariantNumeric: "tabular-nums" }}>
                    {s.count.toLocaleString("vi-VN")}
                  </Typography>
                  {total !== null && total > 0 && (
                    <Typography sx={{ fontSize: "10px", color: "text.disabled", minWidth: 32, textAlign: "right" }}>
                      {Math.round((s.count / total) * 100)}%
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </>
        )}
      </Box>
    </Card>
  );
}