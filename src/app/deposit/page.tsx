"use client";

import { Box, Typography, alpha } from "@mui/material";
import { Wallet, PlusCircle, History, CircleDollarSign, CreditCard, MessageSquare, Check, Mail, Info, Inbox } from "lucide-react";
import { siTelegram } from "simple-icons";
import { useState } from "react";

// Payment gateway definitions
type GatewayId = "admin" | "acb" | "vietcombank" | "techcombank" | "mbbank" | "tpbank";

interface Gateway {
  id: GatewayId;
  name: string;
  subtitle: string;
  color: string;
  isAdmin?: boolean;
}

const GATEWAYS: Gateway[] = [
  { id: "admin", name: "Liên hệ Admin", subtitle: "Chuyển khoản thủ công", color: "#2563EB", isAdmin: true },
  { id: "acb", name: "ACB", subtitle: "Ngân hàng ACB", color: "#0052A5" },
  { id: "vietcombank", name: "Vietcombank", subtitle: "Ngân hàng VCB", color: "#007B40" },
  { id: "techcombank", name: "Techcombank", subtitle: "Ngân hàng TCB", color: "#CC0000" },
  { id: "mbbank", name: "MB Bank", subtitle: "Ngân hàng MB", color: "#7B3F9E" },
  { id: "tpbank", name: "TPBank", subtitle: "Ngân hàng TPBank", color: "#FF6600" },
];

// Bank abbreviations displayed as text logos
function BankLogo({ gateway }: { gateway: Gateway }) {
  if (gateway.isAdmin) {
    return <MessageSquare size={20} color={gateway.color} />;
  }
  return (
    <Typography
      sx={{
        fontSize: "11px",
        fontWeight: 900,
        color: gateway.color,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      {gateway.name.replace(" ", "\n")}
    </Typography>
  );
}

// Contact channels shown when Admin is selected
const CONTACT_CHANNELS = [
  { icon: <Mail size={18} color="white" />, label: "Email", value: "support@socialmedia.vn", color: "#2563EB" },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d={siTelegram.path} /></svg>, label: "Telegram", value: "@SocialMediaVN", color: "#0284C7" },
];

// Mock history
const HISTORY = [
  { id: "TXN-001", method: "ACB", amount: 500000, status: "success", time: "31/05/2026 14:32" },
  { id: "TXN-002", method: "Liên hệ Admin", amount: 200000, status: "success", time: "28/05/2026 09:14" },
  { id: "TXN-003", method: "Vietcombank", amount: 1000000, status: "pending", time: "25/05/2026 17:48" },
];

const STATUS_CONFIG = {
  success: { label: "Thành công", bg: alpha("#10B981", 0.1), color: "#059669" },
  pending: { label: "Đang xử lý", bg: alpha("#F59E0B", 0.1), color: "#D97706" },
  failed: { label: "Thất bại", bg: alpha("#EF4444", 0.1), color: "#DC2626" },
};

export default function DepositPage() {
  const [activeTab, setActiveTab] = useState<"methods" | "history">("methods");
  const [selectedGateway, setSelectedGateway] = useState<GatewayId>("admin");

  const gateway = GATEWAYS.find((g) => g.id === selectedGateway)!;

  return (
    <Box sx={{ maxWidth: 860 }}>
      {/* Hero section */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "18px",
          border: "1px solid",
          borderColor: alpha("#0EA5E9", 0.25),
          background: "linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 50%, #ECFEFF 100%)",
          px: { xs: 2.5, sm: 3 },
          py: { xs: 2.5, sm: 3 },
          mb: 3,
        }}
      >
        {/* Blobs */}
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -30, left: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          {/* Left: icon + title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box sx={{ position: "absolute", inset: -4, borderRadius: "14px", background: "linear-gradient(135deg, #0EA5E9, #06B6D4)", filter: "blur(8px)", opacity: 0.4 }} />
              <Box
                sx={{
                  position: "relative",
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #0EA5E9, #06B6D4, #3B82F6)",
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
                Xin chào <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>mitnicklegend_4036</Box>, chọn phương thức và nạp ngay
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
              <Typography sx={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.disabled" }}>
                Số dư hiện tại
              </Typography>
              <Typography sx={{ fontSize: { xs: "15px", sm: "17px" }, fontWeight: 800, color: "#0284C7", fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}>
                0 ₫
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
                background: active ? "linear-gradient(135deg, #0EA5E9, #06B6D4)" : "transparent",
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
                  background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
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
              {GATEWAYS.map((gw) => {
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
              /* Bank transfer panel */
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
                  Thông tin chuyển khoản — {gateway.name}
                </Typography>

                {/* Bank info rows */}
                {[
                  { label: "Ngân hàng", value: gateway.name },
                  { label: "Số tài khoản", value: "1234 5678 9012 3456" },
                  { label: "Chủ tài khoản", value: "NGUYEN VAN A" },
                  { label: "Chi nhánh", value: "Hồ Chí Minh" },
                  { label: "Nội dung CK", value: "NAP mitnicklegend_4036" },
                ].map((row, i, arr) => (
                  <Box
                    key={row.label}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1.25,
                      borderBottom: i < arr.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                      gap: 2,
                    }}
                  >
                    <Typography sx={{ fontSize: "12px", color: "text.secondary", flexShrink: 0 }}>{row.label}</Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontWeight: row.label === "Nội dung CK" ? 800 : 600,
                        color: row.label === "Nội dung CK" ? gateway.color : "text.primary",
                        fontFamily: row.label === "Số tài khoản" || row.label === "Nội dung CK" ? "monospace" : "inherit",
                        textAlign: "right",
                        wordBreak: "break-all",
                      }}
                    >
                      {row.value}
                    </Typography>
                  </Box>
                ))}

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
                    Nhập đúng nội dung chuyển khoản để hệ thống tự động xác nhận. Thời gian xử lý: <Box component="strong" sx={{ color: "text.primary" }}>5–15 phút</Box>.
                  </Typography>
                </Box>
              </Box>
            )}

            {/* CTA button */}
            <Box sx={{ mt: 2.5 }}>
              <Box
                component="button"
                disabled={gateway.isAdmin}
                sx={{
                  width: "100%",
                  py: 1.375,
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
                  color: "white",
                  fontSize: { xs: "13px", sm: "14px" },
                  fontWeight: 700,
                  cursor: gateway.isAdmin ? "default" : "pointer",
                  opacity: gateway.isAdmin ? 0.6 : 1,
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
                {gateway.isAdmin ? "Vui lòng liên hệ Admin" : `Xác nhận nạp tiền qua ${gateway.name}`}
              </Box>
              <Typography sx={{ fontSize: "11px", color: "text.disabled", textAlign: "center", mt: 1 }}>
                {gateway.isAdmin
                  ? "Nhắn tin cho Admin để được hỗ trợ nạp tiền"
                  : "Sau khi chuyển khoản, nhấn xác nhận để hệ thống kiểm tra"}
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

          {HISTORY.length === 0 ? (
            <Box sx={{ py: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
              <Inbox size={36} color="#94A3B8" />
              <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>Chưa có giao dịch nào.</Typography>
            </Box>
          ) : (
            <Box>
              {HISTORY.map((tx, i) => {
                const st = STATUS_CONFIG[tx.status as keyof typeof STATUS_CONFIG];
                return (
                  <Box
                    key={tx.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      px: { xs: 2, sm: 3 },
                      py: 1.75,
                      borderBottom: i < HISTORY.length - 1 ? "1px solid" : "none",
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
                        {tx.method}
                      </Typography>
                      <Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
                        {tx.id} · {tx.time}
                      </Typography>
                    </Box>

                    {/* Amount + status */}
                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#059669", fontVariantNumeric: "tabular-nums" }}>
                        +{tx.amount.toLocaleString("vi-VN")} ₫
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
