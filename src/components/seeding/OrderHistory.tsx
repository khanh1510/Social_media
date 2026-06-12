"use client";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import { ExternalLink, RefreshCw, XCircle, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ordersApi, ApiError } from "@/lib/api";
import type { ApiOrder, OrderStatus } from "@/lib/api/types";
import { formatDate, formatVND } from "@/lib/format";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Chờ xử lý", color: "#CA8A04", bg: "#FEF9C3" },
  PROCESSING: { label: "Đang xử lý", color: "#2563EB", bg: "#DBEAFE" },
  IN_PROGRESS: { label: "Đang chạy", color: "#0EA5E9", bg: "#E0F2FE" },
  COMPLETED: { label: "Hoàn thành", color: "#16A34A", bg: "#DCFCE7" },
  PARTIAL: { label: "Hoàn thành 1 phần", color: "#D97706", bg: "#FEF3C7" },
  CANCELED: { label: "Đã hủy", color: "#64748B", bg: "#F1F5F9" },
  FAILED: { label: "Thất bại", color: "#DC2626", bg: "#FEE2E2" },
  ERROR: { label: "Lỗi", color: "#DC2626", bg: "#FEE2E2" },
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const { refreshWallet } = useAuth();

  const LIMIT = 10;

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await ordersApi.list({ page: p, limit: LIMIT });
      setOrders(res.data);
      setTotal(res.meta.total);
      setPage(p);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Không tải được lịch sử đơn.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // defer để tránh setState đồng bộ trong effect (react-hooks/set-state-in-effect)
    const id = window.setTimeout(() => void load(1), 0);
    return () => window.clearTimeout(id);
  }, [load]);

  async function handleCancel(id: string) {
    setActionMsg("");
    try {
      await ordersApi.cancel(id);
      setActionMsg("Đã gửi yêu cầu hủy đơn.");
      void refreshWallet();
      void load(page);
    } catch (err) {
      setActionMsg(err instanceof ApiError ? err.message : "Hủy đơn thất bại.");
    }
  }

  async function handleRefill(id: string) {
    setActionMsg("");
    try {
      await ordersApi.refill(id);
      setActionMsg("Đã gửi yêu cầu bảo hành (refill).");
    } catch (err) {
      setActionMsg(err instanceof ApiError ? err.message : "Yêu cầu refill thất bại.");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontSize: "14px", fontWeight: 700 }}>
          Lịch sử đơn ({total})
        </Typography>
        <Tooltip title="Tải lại">
          <IconButton size="small" onClick={() => load(page)}>
            <RefreshCw size={16} />
          </IconButton>
        </Tooltip>
      </Box>

      {actionMsg && <Alert severity="info" sx={{ mb: 2 }} onClose={() => setActionMsg("")}>{actionMsg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
            Chưa có đơn hàng nào. Hãy tạo đơn đầu tiên ở tab Tạo đơn.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {orders.map((order) => {
            const st = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
            const done = order.quantity - (order.remains ?? order.quantity);
            const progress = order.status === "COMPLETED"
              ? 100
              : Math.round((done / order.quantity) * 100);
            return (
              <Box
                key={order.id}
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                  "&:hover": { borderColor: alpha("#0EA5E9", 0.4) },
                  transition: "all 150ms ease",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#0EA5E9", fontVariantNumeric: "tabular-nums" }}>
                    #{order.orderNumber}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", fontWeight: 600, flex: 1, minWidth: 180 }}>
                    {order.serviceName ?? `Dịch vụ ${order.servicePublicId ?? ""}`}
                  </Typography>
                  <Chip
                    label={st.label}
                    size="small"
                    sx={{ bgcolor: st.bg, color: st.color, fontWeight: 700, fontSize: "11px", height: 22 }}
                  />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.75, flexWrap: "wrap" }}>
                  <Typography
                    component="a"
                    href={order.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontSize: "12px", color: "text.secondary", textDecoration: "none",
                      display: "inline-flex", alignItems: "center", gap: 0.5,
                      maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      "&:hover": { color: "#0EA5E9" },
                    }}
                  >
                    <ExternalLink size={12} style={{ flexShrink: 0 }} />
                    {order.link}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
                    SL: <b>{order.quantity.toLocaleString("vi-VN")}</b>
                  </Typography>
                  {order.startCount !== null && (
                    <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
                      Bắt đầu: <b>{order.startCount.toLocaleString("vi-VN")}</b>
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
                    Tiến độ: <b>{Number.isFinite(progress) ? progress : 0}%</b>
                  </Typography>
                  <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "text.primary" }}>
                    {formatVND(order.charge)}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "text.disabled", ml: "auto" }}>
                    {formatDate(order.createdAt)}
                  </Typography>

                  {(order.status === "PENDING" || order.status === "PROCESSING") && (
                    <Tooltip title="Hủy đơn">
                      <IconButton size="small" onClick={() => handleCancel(order.id)} sx={{ color: "#DC2626" }}>
                        <XCircle size={15} />
                      </IconButton>
                    </Tooltip>
                  )}
                  {(order.status === "COMPLETED" || order.status === "PARTIAL") && (
                    <Tooltip title="Yêu cầu bảo hành (refill)">
                      <IconButton size="small" onClick={() => handleRefill(order.id)} sx={{ color: "#0EA5E9" }}>
                        <RotateCcw size={15} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
          <Button size="small" disabled={page <= 1} onClick={() => load(page - 1)}>
            Trước
          </Button>
          <Typography sx={{ fontSize: "13px", alignSelf: "center", color: "text.secondary" }}>
            Trang {page}/{totalPages}
          </Typography>
          <Button size="small" disabled={page >= totalPages} onClick={() => load(page + 1)}>
            Sau
          </Button>
        </Box>
      )}
    </Box>
  );
}
