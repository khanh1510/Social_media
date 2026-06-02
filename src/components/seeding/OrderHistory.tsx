"use client";

import { Box, Typography, alpha, InputBase } from "@mui/material";
import { Search, ExternalLink, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";
import { mockOrders } from "@/data/orders";
import { platformColors } from "@/data/services";
import type { PlatformId, OrderStatus } from "@/types";

function formatVND(n: number) {
  return n.toLocaleString("vi-VN") + " ₫";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Chờ xử lý", color: "#F59E0B", bg: "#FFFBEB" },
  processing: { label: "Đang xử lý", color: "#3B82F6", bg: "#EFF6FF" },
  completed: { label: "Hoàn thành", color: "#10B981", bg: "#ECFDF5" },
  failed: { label: "Thất bại", color: "#EF4444", bg: "#FEF2F2" },
  refunded: { label: "Hoàn tiền", color: "#8B5CF6", bg: "#F5F3FF" },
};

const ALL_STATUS = "all";

interface Props {
  platform: PlatformId;
  serviceType: string;
}

export default function OrderHistory({ platform, serviceType }: Props) {
  const colors = platformColors[platform] ?? platformColors.facebook;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">(ALL_STATUS);

  const filtered = useMemo(() => {
    return mockOrders
      .filter((o) => o.platform === platform)
      .filter((o) => !serviceType || o.serviceType.toLowerCase() === serviceType.toLowerCase())
      .filter((o) => statusFilter === ALL_STATUS || o.status === statusFilter)
      .filter((o) =>
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        o.link.toLowerCase().includes(search.toLowerCase())
      );
  }, [platform, serviceType, statusFilter, search]);

  const statusOptions: Array<OrderStatus | "all"> = ["all", "pending", "processing", "completed", "failed", "refunded"];

  return (
    <Box>
      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        {/* Search */}
        <Box
          sx={{
            flex: 1, minWidth: 200,
            display: "flex", alignItems: "center", gap: 1,
            px: 1.5, height: 38,
            borderRadius: "10px",
            border: "1.5px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            "&:focus-within": {
              borderColor: alpha(colors.text, 0.4),
              boxShadow: `0 0 0 3px ${alpha(colors.text, 0.07)}`,
            },
          }}
        >
          <Search size={15} color="#94A3B8" />
          <InputBase
            placeholder="Tìm theo ID, tên dịch vụ, link..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{
              fontSize: "13px",
              "& input::placeholder": { color: "text.disabled", opacity: 1 },
              "& input": { p: 0 },
            }}
          />
        </Box>

        {/* Status filter chips */}
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          {statusOptions.map((s) => {
            const isActive = s === statusFilter;
            const cfg = s === "all" ? null : statusConfig[s];
            return (
              <Box
                key={s}
                component="button"
                onClick={() => setStatusFilter(s)}
                sx={{
                  px: 1.25, py: 0.5,
                  borderRadius: "8px",
                  border: "1.5px solid",
                  borderColor: isActive ? (cfg?.color ?? colors.text) : "divider",
                  bgcolor: isActive ? alpha(cfg?.color ?? colors.text, 0.08) : "transparent",
                  color: isActive ? (cfg?.color ?? colors.text) : "text.secondary",
                  fontSize: "12px", fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  "&:hover": {
                    borderColor: cfg?.color ?? colors.text,
                    color: cfg?.color ?? colors.text,
                  },
                }}
              >
                {s === "all" ? "Tất cả" : cfg?.label}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Table */}
      {filtered.length === 0 ? (
        <Box sx={{ py: 8, textAlign: "center" }}>
          <RefreshCw size={32} color="#CBD5E1" style={{ margin: "0 auto 12px" }} />
          <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
            Chưa có đơn hàng nào.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Table header */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 100px 110px 90px 90px",
              gap: 1,
              px: 1.5, py: 0.75,
              bgcolor: alpha("#F8FAFC", 0.8),
              borderRadius: "10px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {["ID", "Dịch vụ / Link", "Số lượng", "Thành tiền", "Trạng thái", "Ngày tạo"].map((h) => (
              <Typography key={h} sx={{ fontSize: "11px", fontWeight: 700, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {h}
              </Typography>
            ))}
          </Box>

          {/* Rows */}
          {filtered.map((order) => {
            const cfg = statusConfig[order.status];
            return (
              <Box
                key={order.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 100px 110px 90px 90px",
                  gap: 1,
                  px: 1.5, py: 1.25,
                  bgcolor: "background.paper",
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  alignItems: "center",
                  transition: "all 150ms ease",
                  "&:hover": {
                    borderColor: alpha(colors.text, 0.2),
                    boxShadow: `0 2px 12px ${alpha(colors.text, 0.08)}`,
                  },
                }}
              >
                {/* ID */}
                <Typography sx={{ fontSize: "12px", fontWeight: 700, color: colors.text, fontFamily: "monospace" }}>
                  {order.id}
                </Typography>

                {/* Service + link */}
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {order.serviceName}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                    <ExternalLink size={11} color="#94A3B8" />
                    <Typography
                      component="a"
                      href={order.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontSize: "11px", color: "text.disabled",
                        textDecoration: "none",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        maxWidth: 200,
                        display: "block",
                        "&:hover": { color: colors.text },
                      }}
                    >
                      {order.link}
                    </Typography>
                  </Box>
                  {/* Progress bar for active orders */}
                  {(order.status === "processing" || order.status === "pending") && (
                    <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ flex: 1, height: 4, borderRadius: "99px", bgcolor: alpha(colors.text, 0.1), overflow: "hidden" }}>
                        <Box
                          sx={{
                            height: "100%",
                            width: `${order.progress}%`,
                            borderRadius: "99px",
                            background: `linear-gradient(90deg, ${colors.text}, ${alpha(colors.text, 0.7)})`,
                            transition: "width 300ms ease",
                          }}
                        />
                      </Box>
                      <Typography sx={{ fontSize: "10px", fontWeight: 600, color: colors.text, flexShrink: 0 }}>
                        {order.progress}%
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Quantity */}
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary" }}>
                  {order.quantity.toLocaleString()}
                </Typography>

                {/* Cost */}
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: colors.text }}>
                  {formatVND(order.totalCost)}
                </Typography>

                {/* Status badge */}
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    px: 1, py: 0.375,
                    borderRadius: "8px",
                    bgcolor: cfg.bg,
                    border: "1px solid",
                    borderColor: alpha(cfg.color, 0.2),
                    width: "fit-content",
                  }}
                >
                  <Typography sx={{ fontSize: "11px", fontWeight: 700, color: cfg.color }}>
                    {cfg.label}
                  </Typography>
                </Box>

                {/* Date */}
                <Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
                  {formatDate(order.createdAt)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Footer count */}
      {filtered.length > 0 && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Typography sx={{ fontSize: "12px", color: "text.disabled" }}>
            {filtered.length} đơn hàng
          </Typography>
        </Box>
      )}
    </Box>
  );
}
