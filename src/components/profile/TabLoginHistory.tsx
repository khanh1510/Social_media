"use client";

import { Box, Typography, alpha } from "@mui/material";
import { History } from "lucide-react";

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

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          py: 6,
          borderRadius: "14px",
          border: "1px dashed",
          borderColor: "divider",
          bgcolor: alpha("#0F172A", 0.02),
        }}
      >
        <Box
          sx={{
            width: 44, height: 44, borderRadius: "12px",
            bgcolor: alpha("#64748B", 0.08),
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <History size={22} color="#94A3B8" />
        </Box>
        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.secondary" }}>
          Tính năng chưa khả dụng
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "text.disabled", textAlign: "center", maxWidth: 280, lineHeight: 1.6 }}>
          Backend chưa cung cấp API lịch sử đăng nhập. Tính năng này sẽ được bổ sung trong phiên bản tiếp theo.
        </Typography>
      </Box>
    </Box>
  );
}
