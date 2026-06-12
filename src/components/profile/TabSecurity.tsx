"use client";

import { Alert, Box, CircularProgress, Typography, alpha, InputBase } from "@mui/material";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { authApi, ApiError } from "@/lib/api";

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{ flex: 1, fontSize: "13px", "& input": { p: 0 } }}
        />
        <Box
          component="button"
          type="button"
          onClick={() => setShow((v) => !v)}
          sx={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: "7px", border: "none",
            bgcolor: "transparent", color: "text.disabled", cursor: "pointer",
            flexShrink: 0,
            "&:hover": { color: "text.secondary" },
          }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </Box>
      </Box>
    </Box>
  );
}

export default function TabSecurity() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccess("");
    if (newPassword.length < 8) {
      setError("Mật khẩu mới tối thiểu 8 ký tự.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setSubmitting(true);
    try {
      await authApi.changePassword(oldPassword, newPassword);
      setSuccess("Đổi mật khẩu thành công.");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Đổi mật khẩu thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ py: 3, maxWidth: 480 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Lock size={16} color="#2563EB" />
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
            Đổi Mật Khẩu
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
          Chọn mật khẩu mạnh, ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <PasswordField label="Mật khẩu hiện tại" placeholder="••••••••" value={oldPassword} onChange={setOldPassword} />
        <PasswordField label="Mật khẩu mới" placeholder="••••••••" value={newPassword} onChange={setNewPassword} />
        <PasswordField label="Xác nhận mật khẩu mới" placeholder="••••••••" value={confirm} onChange={setConfirm} />
      </Box>

      <Box
        component="button"
        onClick={handleSubmit}
        disabled={submitting || !oldPassword || !newPassword}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          px: 3,
          py: 1,
          borderRadius: "10px",
          border: "none",
          background: "#2563EB",
          color: "white",
          fontSize: "13px",
          fontWeight: 700,
          cursor: "pointer",
          opacity: submitting || !oldPassword || !newPassword ? 0.6 : 1,
          boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
          transition: "all 180ms ease",
          "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
          "&:active": { transform: "scale(0.98)" },
        }}
      >
        {submitting && <CircularProgress size={14} color="inherit" />}
        Cập nhật mật khẩu
      </Box>
    </Box>
  );
}
