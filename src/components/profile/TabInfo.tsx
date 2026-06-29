"use client";

import { Alert, Box, CircularProgress, IconButton, InputBase, Tooltip, Typography, alpha } from "@mui/material";
import { Copy, Plus, Trash2, Check, Pencil, X, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { usersApi, ApiError } from "@/lib/api";
import type { ApiKey } from "@/lib/api/types";
import { formatDate } from "@/lib/format";

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary", letterSpacing: "-0.01em" }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 0.25 }}>
        {subtitle}
      </Typography>
    </Box>
  );
}

const ROLE_LABEL_KEY: Record<string, string> = {
  SUPER_ADMIN: "roleSuperAdmin",
  ADMIN: "roleAdmin",
  STAFF: "roleStaff",
  RESELLER: "roleReseller",
  USER: "roleUser",
};

const STATUS_CONFIG: Record<string, { labelKey: string; color: string; bg: string }> = {
  ACTIVE:               { labelKey: "statusActive",               color: "#059669", bg: alpha("#059669", 0.08) },
  SUSPENDED:            { labelKey: "statusSuspended",            color: "#D97706", bg: alpha("#D97706", 0.08) },
  BANNED:               { labelKey: "statusBanned",              color: "#DC2626", bg: alpha("#DC2626", 0.08) },
  PENDING_VERIFICATION: { labelKey: "statusPendingVerification", color: "#0284C7", bg: alpha("#0284C7", 0.08) },
};

export default function TabInfo() {
  const t = useTranslations("profile");
  const { user, refreshUser } = useAuth();

  // ── fullName edit ────────────────────────────────────────
  const [editing, setEditing]     = useState(false);
  const [fullName, setFullName]   = useState(user?.fullName ?? "");
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState("");
  const [saveErr, setSaveErr]     = useState("");

  async function handleSaveName() {
    setSaveMsg(""); setSaveErr("");
    setSaving(true);
    try {
      await usersApi.updateMe({ fullName: fullName.trim() || undefined });
      await refreshUser();
      setSaveMsg(t("fullNameUpdated"));
      setEditing(false);
    } catch (err) {
      setSaveErr(err instanceof ApiError ? err.message : t("updateFailed"));
    } finally {
      setSaving(false);
    }
  }

  // ── API keys ─────────────────────────────────────────────
  const [keys, setKeys]             = useState<ApiKey[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating]     = useState(false);
  const [keyMsg, setKeyMsg]         = useState("");
  const [keyErr, setKeyErr]         = useState("");
  const [freshKey, setFreshKey]     = useState<ApiKey | null>(null);
  const [copied, setCopied]         = useState(false);

  useEffect(() => {
    (async () => {
      try { setKeys(await usersApi.apiKeys()); }
      catch { /* hiện rỗng */ }
      finally { setLoadingKeys(false); }
    })();
  }, []);

  async function handleCreate() {
    if (creating) return;
    setKeyErr(""); setKeyMsg("");
    const name = newKeyName.trim() || `key-${Date.now() % 10000}`;
    setCreating(true);
    try {
      const created = await usersApi.createApiKey(name);
      setFreshKey(created);
      setNewKeyName("");
      setKeys(await usersApi.apiKeys());
    } catch (err) {
      setKeyErr(err instanceof ApiError ? err.message : t("createKeyFailed"));
    } finally { setCreating(false); }
  }

  async function handleDelete(id: string) {
    setKeyErr(""); setKeyMsg("");
    try {
      await usersApi.deleteApiKey(id);
      setKeys((prev) => prev.filter((k) => k.id !== id));
      if (freshKey?.id === id) setFreshKey(null);
      setKeyMsg(t("keyRevoked"));
    } catch (err) {
      setKeyErr(err instanceof ApiError ? err.message : t("revokeKeyFailed"));
    }
  }

  function handleCopy(value: string) {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const statusCfg = STATUS_CONFIG[user?.status ?? ""] ?? null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, py: 3 }}>

      {/* ── Tài khoản ─────────────────────────────────────── */}
      <Box>
        <SectionTitle title={t("accountTitle")} subtitle={t("accountSubtitle")} />
        <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>

          {/* Tên đăng nhập */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, px: 2, borderBottom: "1px solid", borderColor: "divider", gap: 2 }}>
            <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>{t("username")}</Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary" }}>{user?.username ?? "—"}</Typography>
          </Box>

          {/* Email */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, px: 2, borderBottom: "1px solid", borderColor: "divider", gap: 2 }}>
            <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>{t("email")}</Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary", wordBreak: "break-all", textAlign: "right" }}>{user?.email ?? "—"}</Typography>
          </Box>

          {/* Họ tên — có thể sửa */}
          <Box sx={{ py: 1.5, px: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>{t("fullName")}</Typography>
              {!editing ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary" }}>
                    {user?.fullName || <Box component="span" sx={{ color: "text.disabled", fontStyle: "italic" }}>{t("notSet")}</Box>}
                  </Typography>
                  <Tooltip title={t("edit")}>
                    <IconButton size="small" onClick={() => { setFullName(user?.fullName ?? ""); setEditing(true); setSaveMsg(""); setSaveErr(""); }} sx={{ color: "text.disabled", "&:hover": { color: "#2563EB" } }}>
                      <Pencil size={13} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flex: 1, justifyContent: "flex-end" }}>
                  <Box sx={{ display: "flex", alignItems: "center", px: 1.25, height: 32, borderRadius: "8px", border: "1.5px solid", borderColor: alpha("#2563EB", 0.4), bgcolor: "background.paper", flex: 1, maxWidth: 220 }}>
                    <InputBase value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("fullNamePlaceholder")} sx={{ fontSize: "13px", "& input": { p: 0 } }} autoFocus />
                  </Box>
                  <Tooltip title={t("save")}>
                    <IconButton size="small" onClick={handleSaveName} disabled={saving} sx={{ color: "#059669", "&:hover": { bgcolor: alpha("#059669", 0.08) } }}>
                      {saving ? <CircularProgress size={13} /> : <Save size={13} />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("cancel")}>
                    <IconButton size="small" onClick={() => setEditing(false)} sx={{ color: "text.disabled" }}>
                      <X size={13} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
            {saveMsg && <Typography sx={{ fontSize: "11px", color: "#059669", mt: 0.5 }}>{saveMsg}</Typography>}
            {saveErr && <Typography sx={{ fontSize: "11px", color: "#DC2626", mt: 0.5 }}>{saveErr}</Typography>}
          </Box>

          {/* Vai trò */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, px: 2, borderBottom: "1px solid", borderColor: "divider", gap: 2 }}>
            <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>{t("role")}</Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary" }}>
              {ROLE_LABEL_KEY[user?.role ?? ""] ? t(ROLE_LABEL_KEY[user?.role ?? ""]) : (user?.role ?? "—")}
            </Typography>
          </Box>

          {/* Trạng thái tài khoản */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, px: 2, gap: 2 }}>
            <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>{t("status")}</Typography>
            {statusCfg ? (
              <Box component="span" sx={{ px: 1.25, py: 0.25, borderRadius: "99px", bgcolor: statusCfg.bg, color: statusCfg.color, fontSize: "11px", fontWeight: 700 }}>
                {t(statusCfg.labelKey)}
              </Box>
            ) : (
              <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary" }}>{user?.status ?? "—"}</Typography>
            )}
          </Box>

        </Box>
      </Box>

      {/* ── API Keys ──────────────────────────────────────── */}
      <Box>
        <SectionTitle title={t("apiKeysTitle")} subtitle={t("apiKeysSubtitle")} />

        {keyMsg && <Alert severity="success" sx={{ mb: 1.5 }} onClose={() => setKeyMsg("")}>{keyMsg}</Alert>}
        {keyErr && <Alert severity="error"   sx={{ mb: 1.5 }} onClose={() => setKeyErr("")}>{keyErr}</Alert>}

        {/* Key vừa tạo */}
        {freshKey?.key && (
          <Alert severity="warning" sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: "12px", mb: 0.5 }}>
              {t("saveKeyNow")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "12px", fontFamily: "monospace", fontWeight: 700, wordBreak: "break-all" }}>
                {freshKey.key}
              </Typography>
              <Tooltip title={copied ? t("copied") : t("copy")}>
                <IconButton size="small" onClick={() => handleCopy(freshKey.key!)}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </IconButton>
              </Tooltip>
            </Box>
          </Alert>
        )}

        {/* Create row */}
        <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", px: 1.5, height: 38, borderRadius: "10px", border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
            <InputBase placeholder={t("newKeyPlaceholder")} value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} fullWidth sx={{ fontSize: "13px", "& input": { p: 0 } }} onKeyDown={(e) => { if (e.key === "Enter") void handleCreate(); }} />
          </Box>
          <Box component="button" onClick={() => void handleCreate()} disabled={creating} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2.5, py: 1.25, borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontSize: "12px", fontWeight: 600, cursor: "pointer", opacity: creating ? 0.6 : 1, whiteSpace: "nowrap" }}>
            <Plus size={14} />
            {creating ? t("creating") : t("createKey")}
          </Box>
        </Box>

        {/* Key list */}
        {loadingKeys ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}><CircularProgress size={22} /></Box>
        ) : keys.length === 0 ? (
          <Typography sx={{ fontSize: "12px", color: "text.disabled" }}>{t("noApiKeys")}</Typography>
        ) : (
          <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            {keys.map((k, i) => (
              <Box key={k.id} sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.25, borderBottom: i < keys.length - 1 ? "1px solid" : "none", borderColor: "divider" }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>{k.name ?? t("unnamedKey")}</Typography>
                  <Typography sx={{ fontSize: "11px", color: "text.disabled", fontFamily: "monospace" }}>
                    {k.keyPrefix ?? "sk-"}•••••• · {t("keyCreatedAt", { date: formatDate(k.createdAt) })}
                    {k.lastUsedAt ? ` · ${t("keyLastUsed", { date: formatDate(k.lastUsedAt) })}` : ` · ${t("keyNeverUsed")}`}
                  </Typography>
                </Box>
                <Tooltip title={t("revokeKey")}>
                  <IconButton size="small" onClick={() => void handleDelete(k.id)} sx={{ color: "#DC2626" }}>
                    <Trash2 size={15} />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        )}

        <Typography sx={{ fontSize: "11px", color: "text.disabled", mt: 1 }}>
          {t("apiKeysFootnote")}
        </Typography>
      </Box>
    </Box>
  );
}
