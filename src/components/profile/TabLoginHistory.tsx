"use client";

import { Box, Typography, alpha } from "@mui/material";
import { Monitor, Smartphone, CheckCircle } from "lucide-react";

const mockHistory = [
  { id: 1, device: "Chrome / Windows 11", ip: "113.161.xx.xx", location: "Hồ Chí Minh, VN", time: "31/05/2026 14:32", current: true, mobile: false },
  { id: 2, device: "Safari / iPhone 15", ip: "42.112.xx.xx", location: "Hà Nội, VN", time: "30/05/2026 09:14", current: false, mobile: true },
  { id: 3, device: "Firefox / macOS", ip: "171.244.xx.xx", location: "Đà Nẵng, VN", time: "28/05/2026 21:05", current: false, mobile: false },
  { id: 4, device: "Chrome / Android", ip: "103.75.xx.xx", location: "Hồ Chí Minh, VN", time: "25/05/2026 17:48", current: false, mobile: true },
];

export default function TabLoginHistory() {
  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
          Lịch Sử Đăng Nhập
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 0.25 }}>
          Các phiên đăng nhập gần đây vào tài khoản của bạn.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {mockHistory.map((h) => (
          <Box
            key={h.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 2,
              py: 1.5,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: h.current ? alpha("#2563EB", 0.25) : "divider",
              bgcolor: h.current ? alpha("#2563EB", 0.03) : "background.paper",
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: 38,
                height: 38,
                borderRadius: "10px",
                bgcolor: h.current ? alpha("#2563EB", 0.1) : alpha("#0F172A", 0.04),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {h.mobile
                ? <Smartphone size={18} color={h.current ? "#2563EB" : "#94A3B8"} />
                : <Monitor size={18} color={h.current ? "#2563EB" : "#94A3B8"} />}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {h.device}
                </Typography>
                {h.current && (
                  <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.375, px: 0.75, py: 0.25, borderRadius: "99px", bgcolor: alpha("#10B981", 0.1), color: "#059669", fontSize: "10px", fontWeight: 700 }}>
                    <CheckCircle size={10} />
                    Hiện tại
                  </Box>
                )}
              </Box>
              <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
                {h.ip} · {h.location}
              </Typography>
            </Box>

            <Typography sx={{ fontSize: "11px", color: "text.disabled", flexShrink: 0, textAlign: "right" }}>
              {h.time}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
