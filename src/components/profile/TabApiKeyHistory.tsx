"use client";

import { Box, Typography, alpha } from "@mui/material";
import { Key } from "lucide-react";

const mockApiHistory = [
  { id: 1, key: "sk-live-4xKz9mN2pQrT8vW...", action: "Tạo mới", time: "31/05/2026 14:30", ip: "113.161.xx.xx" },
  { id: 2, key: "sk-live-1aYb7nMqRsUvDjE...", action: "Tạo mới", time: "15/04/2026 10:22", ip: "42.112.xx.xx" },
  { id: 3, key: "sk-live-9cZw5kPtGhNxFoL...", action: "Tạo mới", time: "02/03/2026 08:11", ip: "171.244.xx.xx" },
];

const actionColors: Record<string, { bg: string; text: string }> = {
  "Tạo mới": { bg: alpha("#2563EB", 0.08), text: "#2563EB" },
  "Vô hiệu hoá": { bg: alpha("#DC2626", 0.08), text: "#DC2626" },
};

export default function TabApiKeyHistory() {
  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
          Lịch Sử API Key
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 0.25 }}>
          Các lần tạo mới hoặc thu hồi API key của tài khoản.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {mockApiHistory.map((h) => {
          const ac = actionColors[h.action] ?? actionColors["Tạo mới"];
          return (
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
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: alpha("#0F172A", 0.04),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Key size={17} color="#94A3B8" />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary", fontFamily: "monospace" }}>
                  {h.key}
                </Typography>
                <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
                  {h.ip} · {h.time}
                </Typography>
              </Box>

              <Box
                component="span"
                sx={{
                  px: 1.25, py: 0.25,
                  borderRadius: "99px",
                  bgcolor: ac.bg, color: ac.text,
                  fontSize: "10px", fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {h.action}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
