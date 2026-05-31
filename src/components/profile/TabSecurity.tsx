"use client";

import { Box, Typography, alpha, InputBase } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useState } from "react";

function PasswordField({ label, placeholder }: { label: string; placeholder: string }) {
  const [show, setShow] = useState(false);

  return (
    <Box>
      <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.secondary", mb: 0.75 }}>
        {label}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1.5,
          height: 40,
          borderRadius: "10px",
          border: "1.5px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "all 150ms ease",
          "&:focus-within": {
            borderColor: alpha("#2563EB", 0.4),
            boxShadow: `0 0 0 3px ${alpha("#2563EB", 0.08)}`,
          },
          gap: 1,
        }}
      >
        <InputBase
          type={show ? "text" : "password"}
          placeholder={placeholder}
          sx={{ flex: 1, fontSize: "13px", "& input": { p: 0 } }}
        />
        <Box
          component="button"
          onClick={() => setShow((v) => !v)}
          sx={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: "7px", border: "none",
            bgcolor: "transparent", color: "text.disabled", cursor: "pointer",
            flexShrink: 0,
            "&:hover": { color: "text.secondary" },
          }}
        >
          {show ? <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}
        </Box>
      </Box>
    </Box>
  );
}

export default function TabSecurity() {
  return (
    <Box sx={{ py: 3, maxWidth: 480 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <LockOutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
            Đổi Mật Khẩu
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
          Chọn mật khẩu mạnh, ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <PasswordField label="Mật khẩu hiện tại" placeholder="••••••••" />
        <PasswordField label="Mật khẩu mới" placeholder="••••••••" />
        <PasswordField label="Xác nhận mật khẩu mới" placeholder="••••••••" />
      </Box>

      <Box
        component="button"
        sx={{
          px: 3,
          py: 1,
          borderRadius: "10px",
          border: "none",
          background: "linear-gradient(135deg, #2563EB, #0EA5E9)",
          color: "white",
          fontSize: "13px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
          transition: "all 180ms ease",
          "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
          "&:active": { transform: "scale(0.98)" },
        }}
      >
        Cập nhật mật khẩu
      </Box>
    </Box>
  );
}
