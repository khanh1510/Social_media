"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import { isLoginSuccess } from "@/lib/api/types";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const t = useTranslations("login");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Đã đăng nhập rồi thì về dashboard
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await login(identifier.trim(), password, requires2FA ? totpCode.trim() : undefined);
      if (isLoginSuccess(res)) {
        router.replace("/dashboard");
      } else {
        setRequires2FA(true);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("connectionError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: (t) => t.palette.surface.hero,
        p: 2,
      }}
    >
      <Paper elevation={0} sx={{ p: 4, width: "100%", maxWidth: 420, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
        <Typography sx={{ fontSize: 24, fontWeight: 800, mb: 0.5 }}>{t("title")}</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 3 }}>
          {t("subtitle")}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label={t("identifierLabel")}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            fullWidth
            autoFocus
            disabled={requires2FA}
          />
          <TextField
            label={t("passwordLabel")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            disabled={requires2FA}
          />
          {requires2FA && (
            <TextField
              label={t("totpLabel")}
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              required
              fullWidth
              autoFocus
              slotProps={{ htmlInput: { maxLength: 6, inputMode: "numeric" } }}
              helperText={t("totpHelper")}
            />
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
            sx={{ borderRadius: "10px", fontWeight: 700, textTransform: "none", py: 1.25 }}
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : requires2FA ? t("verify") : t("submit")}
          </Button>
        </Box>

        <Typography sx={{ fontSize: 13.5, color: "text.secondary", mt: 2.5, textAlign: "center" }}>
          {t("noAccount")}{" "}
          <Link href="/register" style={{ color: "#0EA5E9", fontWeight: 600, textDecoration: "none" }}>
            {t("registerNow")}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
