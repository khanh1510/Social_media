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
import { useTranslations } from "next-intl";

const USERNAME_RE = /^[a-z0-9_]{3,32}$/;

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, register } = useAuth();
  const t = useTranslations("register");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!USERNAME_RE.test(username)) {
      setError(t("usernameInvalid"));
      return;
    }
    if (password.length < 8) {
      setError(t("passwordMinChars"));
      return;
    }
    if (password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }

    setSubmitting(true);
    try {
      await register({
        email: email.trim(),
        username: username.trim(),
        password,
        fullName: fullName.trim() || undefined,
      });
      router.replace("/dashboard");
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
      <Paper elevation={0} sx={{ p: 4, width: "100%", maxWidth: 440, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
        <Typography sx={{ fontSize: 24, fontWeight: 800, mb: 0.5 }}>{t("title")}</Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 3 }}>
          {t("subtitle")}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField label={t("emailLabel")} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth autoFocus />
          <TextField
            label={t("usernameLabel")}
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
            fullWidth
            helperText={t("usernameHelper")}
          />
          <TextField label={t("fullNameLabel")} value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth />
          <TextField label={t("passwordLabel")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth helperText={t("passwordHelper")} />
          <TextField label={t("confirmLabel")} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required fullWidth />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
            sx={{ borderRadius: "10px", fontWeight: 700, textTransform: "none", py: 1.25 }}
          >
            {submitting ? <CircularProgress size={22} color="inherit" /> : t("submit")}
          </Button>
        </Box>

        <Typography sx={{ fontSize: 13.5, color: "text.secondary", mt: 2.5, textAlign: "center" }}>
          {t("hasAccount")}{" "}
          <Link href="/login" style={{ color: "#0EA5E9", fontWeight: 600, textDecoration: "none" }}>
            {t("login")}
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
