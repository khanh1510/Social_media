"use client";

import { Box, Typography, alpha, Alert, CircularProgress, InputBase } from "@mui/material";
import { Wallet, PlusCircle, History, CircleDollarSign, CreditCard, MessageSquare, Check, Mail, Info, Inbox, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { paymentsApi, ApiError } from "@/lib/api";
import type { PaymentIntent } from "@/lib/api/types";
import { formatVND } from "@/lib/format";

// Cổng thanh toán: "admin" là kênh thủ công, còn lại lấy từ backend GET /payments/gateways
interface Gateway {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  isAdmin?: boolean;
}

const ADMIN_GATEWAY: Gateway = { id: "admin", name: "Liên hệ Admin", subtitle: "Chuyển khoản thủ công", color: "#2563EB", isAdmin: true };

// Chỉ hiển thị các cổng được phép: liên hệ thủ công + VNPay + MoMo
const GATEWAY_DISPLAY: Record<string, { name: string; subtitle: string; color: string }> = {
  vnpay: { name: "VNPay", subtitle: "QR / Thẻ nội địa", color: "#005BAA" },
  momo: { name: "MoMo", subtitle: "Ví điện tử MoMo", color: "#A50064" },
};
const ALLOWED_GATEWAYS = Object.keys(GATEWAY_DISPLAY);

const GATEWAY_LOGOS: Record<string, string> = {
  vnpay: "/logos/vnpay.jpg",
  momo: "/logos/momo.png",
};

function BankLogo({ gateway }: { gateway: Gateway }) {
  if (gateway.isAdmin) {
    return <MessageSquare size={20} color={gateway.color} />;
  }
  const src = GATEWAY_LOGOS[gateway.id];
  if (src) {
    return <img src={src} alt={gateway.name} style={{ width: 48, height: 28, objectFit: "contain" }} />;
  }
  return (
    <Typography
      sx={{
        fontSize: "11px",
        fontWeight: 800,
        color: gateway.color,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      {gateway.name.replace(" ", "\n")}
    </Typography>
  );
}

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000, 1000000];

// Contact channels shown when Admin is selected
const CONTACT_CHANNELS = [
  { icon: <Mail size={18} color="white" />, label: "Email", value: "support@socialmedia.vn", color: "#2563EB" },
];

const STATUS_CONFIG = {
  PAID: { label: "Thành công", bg: alpha("#10B981", 0.1), color: "#059669" },
  PENDING: { label: "Đang xử lý", bg: alpha("#F59E0B", 0.1), color: "#D97706" },
  FAILED: { label: "Thất bại", bg: alpha("#EF4444", 0.1), color: "#DC2626" },
  EXPIRED: { label: "Hết hạn", bg: alpha("#94A3B8", 0.1), color: "#64748B" },
  REFUNDED: { label: "Đã hoàn", bg: alpha("#0EA5E9", 0.1), color: "#0284C7" },
};

export default function DepositPage() {
  const { user, wallet } = useAuth();
  const [activeTab, setActiveTab] = useState<"methods" | "history">("methods");
  const [selectedGateway, setSelectedGateway] = useState<string>("admin");
  const [gateways, setGateways] = useState<Gateway[]>([ADMIN_GATEWAY]);
  const [amount, setAmount] = useState<number>(100000);
  const [creating, setCreating] = useState(false);
  const [intentError, setIntentError] = useState("");
  const [createdIntent, setCreatedIntent] = useState<PaymentIntent | null>(null);
  const [history, setHistory] = useState<PaymentIntent[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await paymentsApi.gateways();
        setGateways([
          ADMIN_GATEWAY,
          ...list
            .filter((g) => g.active && ALLOWED_GATEWAYS.includes(g.name))
            .map((g) => ({
              id: g.name,
              ...GATEWAY_DISPLAY[g.name],
            })),
        ]);
      } catch {
        // giữ tối thiểu kênh admin
      }
    })();
    (async () => {
      try {
        const res = await paymentsApi.history(1, 20);
        setHistory(res.data);
      } catch {
        // bỏ qua
      } finally {
        setHistoryLoading(false);
      }
    })();
  }, []);

  async function handleCreateIntent() {
    if (creating) return;
    setIntentError("");
    setCreatedIntent(null);
    if (!amount || amount < 10000) {
      setIntentError("Số tiền nạp tối thiểu 10.000 ₫.");
      return;
    }
    setCreating(true);
    try {
      const intent = await paymentsApi.createIntent({
        amount: String(amount),
        gateway: selectedGateway,
        returnUrl: window.location.origin + "/deposit",
      });
      setCreatedIntent(intent);
      if (intent.redirectUrl) {
        window.open(intent.redirectUrl, "_blank", "noopener");
      }
      // làm mới lịch sử
      try {
        const res = await paymentsApi.history(1, 20);
        setHistory(res.data);
      } catch { /* bỏ qua */ }
    } catch (err) {
      setIntentError(err instanceof ApiError ? err.message : "Không tạo được yêu cầu nạp tiền.");
    } finally {
      setCreating(false);
    }
  }

  const gateway = gateways.find((g) => g.id === selectedGateway) ?? ADMIN_GATEWAY;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Hero section */}
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
        {/* Blobs */}
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(14,165,233,0.18)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -30, left: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(6,182,212,0.15)", pointerEvents: "none" }} />

        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          {/* Left: icon + title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box sx={{ position: "absolute", inset: -4, borderRadius: "14px", background: "#0EA5E9", filter: "blur(8px)", opacity: 0.4 }} />
              <Box
                sx={{
                  position: "relative",
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  background: "#0EA5E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
                }}
              >
                <Wallet size={24} color="white" />
              </Box>
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: { xs: "18px", sm: "22px" }, fontWeight: 800, color: "text.primary", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                Nạp tiền
              </Typography>
              <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 0.25 }}>
                Xin chào <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>{user?.username ?? ""}</Box>, chọn phương thức và nạp ngay
              </Typography>
            </Box>
          </Box>

          {/* Right: balance card */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2,
              py: 1.25,
              borderRadius: "12px",
              bgcolor: alpha("#FFFFFF", 0.7),
              border: "1px solid",
              borderColor: alpha("#0EA5E9", 0.15),
              backdropFilter: "blur(8px)",
            }}
          >
            <CircleDollarSign size={20} color="#0EA5E9" style={{ flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontSize: "9px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.disabled" }}>
                Số dư hiện tại
              </Typography>
              <Typography sx={{ fontSize: { xs: "15px", sm: "17px" }, fontWeight: 800, color: "#0284C7", fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}>
                {wallet ? formatVND(wallet.balance) : "—"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tab bar */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0.5,
          p: 0.5,
          borderRadius: "12px",
          bgcolor: alpha("#0EA5E9", 0.06),
          border: "1px solid",
          borderColor: alpha("#0EA5E9", 0.12),
          mb: 2.5,
        }}
      >
        {[
          { key: "methods", label: "Nạp Tiền", icon: <PlusCircle size={15} /> },
          { key: "history", label: "Lịch Sử", icon: <History size={15} /> },
        ].map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Box
              key={tab.key}
              component="button"
              onClick={() => setActiveTab(tab.key as "methods" | "history")}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                py: 1,
                borderRadius: "9px",
                border: "none",
                cursor: "pointer",
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 600,
                transition: "all 200ms ease",
                background: active ? "#0EA5E9" : "transparent",
                color: active ? "white" : "text.secondary",
                boxShadow: active ? "0 2px 8px rgba(14,165,233,0.3)" : "none",
                "&:hover": {
                  bgcolor: active ? undefined : alpha("#0EA5E9", 0.07),
                  color: active ? "white" : "#0284C7",
                },
              }}
            >
              {tab.icon}
              {tab.label}
            </Box>
          );
        })}
      </Box>

      {/* Tab: Nạp Tiền */}
      {activeTab === "methods" && (
        <Box
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: alpha("#0EA5E9", 0.2),
            bgcolor: "background.paper",
            boxShadow: `0 1px 6px ${alpha("#0EA5E9", 0.06)}`,
            overflow: "hidden",
          }}
        >
          {/* Gateway selector section */}
          <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2.5, sm: 3 }, pb: 2 }}>
            {/* Section label */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  background: "#0EA5E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(14,165,233,0.3)",
                }}
              >
                <CreditCard size={15} color="white" />
              </Box>
              <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary" }}>
                Cổng Thanh Toán
              </Typography>
            </Box>

            {/* Gateway grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                  lg: "repeat(6, 1fr)",
                },
                gap: 1,
              }}
            >
              {gateways.map((gw) => {
                const isSelected = selectedGateway === gw.id;
                return (
                  <Box
                    key={gw.id}
                    component="button"
                    onClick={() => setSelectedGateway(gw.id)}
                    sx={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 1.25,
                      py: 1.125,
                      borderRadius: "12px",
                      border: "2px solid",
                      borderColor: isSelected ? gw.color : "divider",
                      bgcolor: isSelected ? alpha(gw.color, 0.06) : "background.paper",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                      textAlign: "left",
                      "&:hover": {
                        borderColor: gw.color,
                        bgcolor: alpha(gw.color, 0.04),
                        transform: "translateY(-1px)",
                        boxShadow: `0 4px 12px ${alpha(gw.color, 0.15)}`,
                      },
                    }}
                  >
                    {/* Logo box */}
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        border: "1px solid",
                        borderColor: isSelected ? alpha(gw.color, 0.3) : "divider",
                        bgcolor: isSelected ? alpha(gw.color, 0.08) : alpha("#0F172A", 0.02),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 200ms ease",
                        overflow: "hidden",
                      }}
                    >
                      <BankLogo gateway={gw} />
                    </Box>

                    {/* Name */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: isSelected ? gw.color : "text.primary",
                          lineHeight: 1.3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {gw.name}
                      </Typography>
                      <Typography sx={{ fontSize: "10px", color: "text.disabled", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {gw.subtitle}
                      </Typography>
                    </Box>

                    {/* Check badge */}
                    {isSelected && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          width: 18,
                          height: 18,
                          borderRadius: "99px",
                          bgcolor: gw.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Check size={11} color="white" />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Detail panel */}
          <Box sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2.5, sm: 3 } }}>
            {gateway.isAdmin ? (
              /* Admin contact panel */
              <Box
                sx={{
                  borderRadius: "14px",
                  border: "1px solid",
                  borderColor: alpha(gateway.color, 0.2),
                  bgcolor: alpha(gateway.color, 0.03),
                  p: { xs: 2, sm: 2.5 },
                }}
              >
                <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "flex-start" } }}>
                  {/* Icon */}
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 44,
                      height: 44,
                      borderRadius: "12px",
                      bgcolor: gateway.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 4px 12px ${alpha(gateway.color, 0.3)}`,
                    }}
                  >
                    <MessageSquare size={22} color="white" />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "14px", fontWeight: 700, color: gateway.color, mb: 0.5 }}>
                      Liên hệ Admin để nạp tiền
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 2 }}>
                      Liên hệ qua các kênh bên dưới để được hỗ trợ nạp tiền nhanh chóng.
                    </Typography>

                    {/* Contact channels */}
                    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, mb: 2 }}>
                      {CONTACT_CHANNELS.map((ch) => (
                        <Box
                          key={ch.label}
                          component="a"
                          href={ch.label === "Email" ? `mailto:${ch.value}` : "#"}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 0.75,
                            p: { xs: 1.25, sm: 1.5 },
                            borderRadius: "12px",
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: alpha(ch.color, 0.2),
                            textDecoration: "none",
                            transition: "all 180ms ease",
                            "&:hover": {
                              borderColor: ch.color,
                              boxShadow: `0 2px 10px ${alpha(ch.color, 0.15)}`,
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 32, sm: 36 },
                              height: { xs: 32, sm: 36 },
                              borderRadius: "99px",
                              bgcolor: ch.color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: `0 2px 8px ${alpha(ch.color, 0.3)}`,
                              transition: "transform 150ms ease",
                              "&:hover": { transform: "scale(1.08)" },
                            }}
                          >
                            {ch.icon}
                          </Box>
                          <Typography sx={{ fontSize: "11px", fontWeight: 700, color: ch.color }}>{ch.label}</Typography>
                          <Typography sx={{ fontSize: "10px", color: "text.disabled", textAlign: "center", wordBreak: "break-all" }}>{ch.value}</Typography>
                        </Box>
                      ))}
                    </Box>

                    {/* Info note */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        p: 1.5,
                        borderRadius: "10px",
                        bgcolor: "background.paper",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Info size={14} color={gateway.color} style={{ flexShrink: 0, marginTop: 1 }} />
                      <Typography sx={{ fontSize: "11px", color: "text.secondary", lineHeight: 1.5 }}>
                        Admin sẽ gửi thông tin tài khoản ngân hàng và xác nhận giao dịch sau khi bạn chuyển khoản. Thời gian xử lý: <Box component="strong" sx={{ color: "text.primary" }}>5–15 phút</Box>.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ) : (
              /* Gateway deposit panel */
              <Box
                sx={{
                  borderRadius: "14px",
                  border: "1px solid",
                  borderColor: alpha(gateway.color, 0.2),
                  bgcolor: alpha(gateway.color, 0.02),
                  p: { xs: 2, sm: 2.5 },
                }}
              >
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: gateway.color, mb: 2 }}>
                  Nạp tiền qua {gateway.name}
                </Typography>

                {/* Amount input */}
                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.secondary", mb: 0.75 }}>
                  Số tiền cần nạp (VND)
                </Typography>
                <Box
                  sx={{
                    display: "flex", alignItems: "center", gap: 1,
                    px: 1.5, height: 44,
                    borderRadius: "10px",
                    border: "1.5px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    "&:focus-within": {
                      borderColor: alpha(gateway.color, 0.5),
                      boxShadow: `0 0 0 3px ${alpha(gateway.color, 0.08)}`,
                    },
                  }}
                >
                  <CircleDollarSign size={16} color={gateway.color} style={{ flexShrink: 0 }} />
                  <InputBase
                    type="number"
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="100000"
                    fullWidth
                    sx={{ fontSize: "14px", fontWeight: 700, "& input": { p: 0 } }}
                  />
                  <Typography sx={{ fontSize: "12px", color: "text.disabled", flexShrink: 0 }}>
                    = {formatVND(amount || 0)}
                  </Typography>
                </Box>

                {/* Quick amounts */}
                <Box sx={{ display: "flex", gap: 0.75, mt: 1.25, flexWrap: "wrap" }}>
                  {QUICK_AMOUNTS.map((qa) => (
                    <Box
                      key={qa}
                      component="button"
                      type="button"
                      onClick={() => setAmount(qa)}
                      sx={{
                        px: 1.25, py: 0.5,
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: amount === qa ? gateway.color : "divider",
                        bgcolor: amount === qa ? alpha(gateway.color, 0.06) : "background.paper",
                        color: amount === qa ? gateway.color : "text.secondary",
                        fontSize: "12px", fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {formatVND(qa)}
                    </Box>
                  ))}
                </Box>

                {/* Kết quả tạo yêu cầu */}
                {intentError && <Alert severity="error" sx={{ mt: 2 }}>{intentError}</Alert>}
                {createdIntent && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Đã tạo yêu cầu nạp <b>{formatVND(createdIntent.amount)}</b> qua <b>{gateway.name}</b>.
                    {createdIntent.redirectUrl ? (
                      <>
                        {" "}
                        <Box
                          component="a"
                          href={createdIntent.redirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: "inherit", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 0.5 }}
                        >
                          Mở trang thanh toán <ExternalLink size={12} />
                        </Box>
                      </>
                    ) : (
                      " Theo dõi trạng thái ở tab Lịch Sử."
                    )}
                  </Alert>
                )}

                {/* Info note */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 2,
                    p: 1.5,
                    borderRadius: "10px",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Info size={14} color={gateway.color} style={{ flexShrink: 0, marginTop: 1 }} />
                  <Typography sx={{ fontSize: "11px", color: "text.secondary", lineHeight: 1.5 }}>
                    Sau khi thanh toán thành công, số dư sẽ được cộng tự động qua webhook. Yêu cầu nạp hết hạn sau <Box component="strong" sx={{ color: "text.primary" }}>60 phút</Box>.
                  </Typography>
                </Box>
              </Box>
            )}

            {/* CTA button */}
            <Box sx={{ mt: 2.5 }}>
              <Box
                component="button"
                disabled={gateway.isAdmin || creating}
                onClick={() => void handleCreateIntent()}
                sx={{
                  width: "100%",
                  py: 1.375,
                  borderRadius: "12px",
                  border: "none",
                  background: "#2563EB",
                  color: "white",
                  fontSize: { xs: "13px", sm: "14px" },
                  fontWeight: 700,
                  cursor: gateway.isAdmin ? "default" : "pointer",
                  opacity: gateway.isAdmin || creating ? 0.6 : 1,
                  boxShadow: "0 2px 10px rgba(37,99,235,0.25)",
                  transition: "all 200ms ease",
                  "&:not(:disabled):hover": {
                    opacity: 0.92,
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 18px rgba(37,99,235,0.35)",
                  },
                  "&:active": { transform: "scale(0.99)" },
                }}
              >
                {gateway.isAdmin
                  ? "Vui lòng liên hệ Admin"
                  : creating
                  ? "Đang tạo yêu cầu..."
                  : `Xác nhận nạp ${formatVND(amount || 0)} qua ${gateway.name}`}
              </Box>
              <Typography sx={{ fontSize: "11px", color: "text.disabled", textAlign: "center", mt: 1 }}>
                {gateway.isAdmin
                  ? "Nhắn tin cho Admin để được hỗ trợ nạp tiền"
                  : "Hệ thống sẽ tạo yêu cầu thanh toán và chuyển bạn tới cổng thanh toán"}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Tab: Lịch Sử */}
      {activeTab === "history" && (
        <Box
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box sx={{ px: { xs: 2, sm: 3 }, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary" }}>
              Lịch sử nạp tiền
            </Typography>
          </Box>

          {historyLoading ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : history.length === 0 ? (
            <Box sx={{ py: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
              <Inbox size={36} color="#94A3B8" />
              <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>Chưa có giao dịch nào.</Typography>
            </Box>
          ) : (
            <Box>
              {history.map((tx, i) => {
                const st = STATUS_CONFIG[tx.status] ?? STATUS_CONFIG.PENDING;
                const display = GATEWAY_DISPLAY[tx.gateway];
                return (
                  <Box
                    key={tx.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: { xs: 2, sm: 3 },
                      py: 1.75,
                      borderBottom: i < history.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        flexShrink: 0,
                        width: 38,
                        height: 38,
                        borderRadius: "10px",
                        bgcolor: alpha("#0EA5E9", 0.08),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Wallet size={18} color="#0284C7" />
                    </Box>

                    {/* Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary" }}>
                        {display?.name ?? tx.gateway}
                      </Typography>
                      <Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
                        {tx.id.slice(0, 8).toUpperCase()}
                        {tx.createdAt ? ` · ${new Date(tx.createdAt).toLocaleString("vi-VN")}` : ""}
                      </Typography>
                    </Box>

                    {/* Amount + status */}
                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#059669", fontVariantNumeric: "tabular-nums" }}>
                        +{formatVND(tx.amount)}
                      </Typography>
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          px: 1,
                          py: 0.125,
                          borderRadius: "99px",
                          bgcolor: st.bg,
                          color: st.color,
                          fontSize: "10px",
                          fontWeight: 700,
                          mt: 0.25,
                        }}
                      >
                        {st.label}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
