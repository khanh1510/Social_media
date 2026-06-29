"use client";

import { Alert, Box, CircularProgress, Typography, alpha, InputBase } from "@mui/material";
import { Lock, Eye, EyeOff, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { authApi, ApiError } from "@/lib/api";

function PasswordField({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <Box>
      <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.secondary", mb: 0.75 }}>{label}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", px: 1.5, height: 40, borderRadius: "10px", border: "1.5px solid", borderColor: "divider", bgcolor: "background.paper", transition: "all 150ms ease", "&:focus-within": { borderColor: alpha("#2563EB", 0.4), boxShadow: `0 0 0 3px ${alpha("#2563EB", 0.08)}` }, gap: 1 }}>
        <InputBase type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} sx={{ flex: 1, fontSize: "13px", "& input": { p: 0 } }} />
        <Box component="button" type="button" onClick={() => setShow((v) => !v)} sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "7px", border: "none", bgcolor: "transparent", color: "text.disabled", cursor: "pointer", flexShrink: 0, "&:hover": { color: "text.secondary" } }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </Box>
      </Box>
    </Box>
  );
}

// ── 2FA Section ───────────────────────────────────────────────────────────────
type TwoFAStep = "idle" | "setup" | "enable" | "disable";

function TwoFASection() {
  const t = useTranslations("profile");
  const [step, setStep] = useState<TwoFAStep>("idle");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [enabled, setEnabled] = useState<boolean | null>(null);

  async function handleSetup() {
    setErr(""); setMsg(""); setLoading(true);
    try {
      const res = await authApi.setup2FA();
      setQrCode(res.qrCode);
      setSecret(res.secret);
      setStep("setup");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : t("twoFAInitFailed"));
    } finally { setLoading(false); }
  }

  async function handleEnable() {
    setErr(""); setLoading(true);
    try {
      await authApi.enable2FA(totpCode);
      setMsg(t("twoFAEnabled"));
      setEnabled(true);
      setStep("idle");
      setTotpCode("");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : t("otpInvalid"));
    } finally { setLoading(false); }
  }

  async function handleDisable() {
    setErr(""); setLoading(true);
    try {
      await authApi.disable2FA(totpCode);
      setMsg(t("twoFADisabled"));
      setEnabled(false);
      setStep("idle");
      setTotpCode("");
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : t("otpInvalid"));
    } finally { setLoading(false); }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
        <ShieldCheck size={16} color="#059669" />
        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
          {t("twoFATitle")}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 2 }}>
        {t("twoFASubtitle")}
      </Typography>

      {msg && <Alert severity="success" sx={{ mb: 1.5 }} onClose={() => setMsg("")}>{msg}</Alert>}
      {err && <Alert severity="error"   sx={{ mb: 1.5 }} onClose={() => setErr("")}>{err}</Alert>}

      {/* Trạng thái hiển thị */}
      {enabled !== null && (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.25, py: 0.375, borderRadius: "99px", mb: 1.5, bgcolor: enabled ? alpha("#059669", 0.08) : alpha("#DC2626", 0.08), color: enabled ? "#059669" : "#DC2626", border: `1px solid ${enabled ? alpha("#059669", 0.2) : alpha("#DC2626", 0.2)}` }}>
          {enabled ? <ShieldCheck size={13} /> : <ShieldOff size={13} />}
          <Typography sx={{ fontSize: "11px", fontWeight: 700 }}>{enabled ? t("statusOn") : t("statusOff")}</Typography>
        </Box>
      )}

      {step === "idle" && (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Box component="button" onClick={() => void handleSetup()} disabled={loading} sx={{ display: "inline-flex", alignItems: "center", gap: 0.625, px: 2, py: 1, borderRadius: "8px", border: "1px solid", borderColor: alpha("#059669", 0.3), bgcolor: alpha("#059669", 0.06), color: "#059669", fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "all 150ms ease", "&:hover": { bgcolor: alpha("#059669", 0.1) } }}>
            {loading ? <CircularProgress size={13} color="inherit" /> : <ShieldCheck size={14} />}
            {t("enable2FA")}
          </Box>
          <Box component="button" onClick={() => setStep("disable")} sx={{ display: "inline-flex", alignItems: "center", gap: 0.625, px: 2, py: 1, borderRadius: "8px", border: "1px solid", borderColor: alpha("#DC2626", 0.2), bgcolor: "transparent", color: "#DC2626", fontSize: "12px", fontWeight: 700, cursor: "pointer", "&:hover": { bgcolor: alpha("#DC2626", 0.05) } }}>
            <ShieldOff size={14} />
            {t("disable2FA")}
          </Box>
        </Box>
      )}

      {step === "setup" && (
        <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: alpha("#059669", 0.2), bgcolor: alpha("#059669", 0.02), p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary" }}>
            {t("scanQRStep")}
          </Typography>
          {qrCode && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={qrCode} alt="QR 2FA" style={{ width: 160, height: 160, borderRadius: 8, border: "1px solid #E2E8F0" }} />
          )}
          <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
            {t("manualEntry")} <Box component="code" sx={{ fontFamily: "monospace", fontSize: "11px", bgcolor: "surface.subtle", px: 0.75, py: 0.25, borderRadius: "4px" }}>{secret}</Box>
          </Typography>
          <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "text.primary" }}>
            {t("enterOtpStep")}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", px: 1.5, height: 38, borderRadius: "10px", border: "1.5px solid", borderColor: "divider", bgcolor: "background.paper" }}>
              <InputBase value={totpCode} onChange={(e) => setTotpCode(e.target.value)} placeholder="000000" inputProps={{ maxLength: 6 }} sx={{ fontSize: "16px", fontWeight: 700, letterSpacing: "0.15em", "& input": { p: 0, textAlign: "center" } }} />
            </Box>
            <Box component="button" onClick={() => void handleEnable()} disabled={loading || totpCode.length < 6} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2.5, py: 1.25, borderRadius: "8px", border: "none", background: "#059669", color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer", opacity: loading || totpCode.length < 6 ? 0.6 : 1 }}>
              {loading ? <CircularProgress size={13} color="inherit" /> : t("confirm")}
            </Box>
            <Box component="button" onClick={() => { setStep("idle"); setTotpCode(""); }} sx={{ px: 2.5, py: 1.25, borderRadius: "8px", border: "1px solid", borderColor: "divider", bgcolor: "transparent", color: "text.secondary", fontSize: "12px", cursor: "pointer" }}>{t("cancel")}</Box>
          </Box>
        </Box>
      )}

      {step === "disable" && (
        <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: alpha("#DC2626", 0.2), bgcolor: alpha("#DC2626", 0.02), p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
            {t("enterOtpToDisable")}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", px: 1.5, height: 38, borderRadius: "10px", border: "1.5px solid", borderColor: "divider", bgcolor: "background.paper" }}>
              <InputBase value={totpCode} onChange={(e) => setTotpCode(e.target.value)} placeholder="000000" inputProps={{ maxLength: 6 }} sx={{ fontSize: "16px", fontWeight: 700, letterSpacing: "0.15em", "& input": { p: 0, textAlign: "center" } }} />
            </Box>
            <Box component="button" onClick={() => void handleDisable()} disabled={loading || totpCode.length < 6} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2.5, py: 1.25, borderRadius: "8px", border: "none", background: "#DC2626", color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer", opacity: loading || totpCode.length < 6 ? 0.6 : 1 }}>
              {loading ? <CircularProgress size={13} color="inherit" /> : t("disable2FA")}
            </Box>
            <Box component="button" onClick={() => { setStep("idle"); setTotpCode(""); }} sx={{ px: 2.5, py: 1.25, borderRadius: "8px", border: "1px solid", borderColor: "divider", bgcolor: "transparent", color: "text.secondary", fontSize: "12px", cursor: "pointer" }}>{t("cancel")}</Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TabSecurity() {
  const t = useTranslations("profile");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm]         = useState("");
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [submitting, setSubmitting]   = useState(false);

  async function handleSubmit() {
    setError(""); setSuccess("");
    if (newPassword.length < 8) { setError(t("passwordMinChars")); return; }
    if (newPassword !== confirm) { setError(t("passwordMismatch")); return; }
    setSubmitting(true);
    try {
      await authApi.changePassword(oldPassword, newPassword);
      setSuccess(t("passwordChanged"));
      setOldPassword(""); setNewPassword(""); setConfirm("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("changePasswordFailed"));
    } finally { setSubmitting(false); }
  }

  return (
    <Box sx={{ py: 3, maxWidth: 480, display: "flex", flexDirection: "column", gap: 4 }}>

      {/* Đổi mật khẩu */}
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Lock size={16} color="#2563EB" />
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>{t("changePasswordTitle")}</Typography>
        </Box>
        <Typography sx={{ fontSize: "12px", color: "text.secondary", mb: 2 }}>
          {t("changePasswordSubtitle")}
        </Typography>

        {error   && <Alert severity="error"   sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2.5 }}>
          <PasswordField label={t("currentPassword")}    placeholder="••••••••" value={oldPassword} onChange={setOldPassword} />
          <PasswordField label={t("newPassword")}         placeholder="••••••••" value={newPassword} onChange={setNewPassword} />
          <PasswordField label={t("confirmNewPassword")}  placeholder="••••••••" value={confirm}     onChange={setConfirm} />
        </Box>

        <Box component="button" onClick={() => void handleSubmit()} disabled={submitting || !oldPassword || !newPassword} sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 2.5, py: 1.25, borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer", opacity: submitting || !oldPassword || !newPassword ? 0.6 : 1, boxShadow: "0 2px 8px rgba(37,99,235,0.25)", transition: "all 180ms ease", "&:hover": { opacity: 0.9, transform: "translateY(-1px)" }, "&:active": { transform: "scale(0.98)" } }}>
          {submitting && <CircularProgress size={14} color="inherit" />}
          {t("updatePassword")}
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={{ borderTop: "1px solid", borderColor: "divider" }} />

      {/* 2FA */}
      <TwoFASection />
    </Box>
  );
}
