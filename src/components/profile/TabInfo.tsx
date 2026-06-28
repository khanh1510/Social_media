"use client";

import { Alert, Box, CircularProgress, IconButton, InputBase, Tooltip, Typography, alpha } from "@mui/material";
import { Copy, Plus, Trash2, Check, Pencil, X, Save } from "lucide-react";
import { useEffect, useState } from "react";
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

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "Quản trị tối cao",
  ADMIN: "Quản trị viên",
  STAFF: "Nhân viên",
  RESELLER: "Đại lý",
  USER: "Thành viên",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE:               { label: "Hoạt động",        color: "#059669", bg: alpha("#059669", 0.08) },
  SUSPENDED:            { label: "Tạm khoá",          color: "#D97706", bg: alpha("#D97706", 0.08) },
  BANNED:               { label: "Bị cấm",            color: "#DC2626", bg: alpha("#DC2626", 0.08) },
  PENDING_VERIFICATION: { label: "Chờ xác minh",      color: "#0284C7", bg: alpha("#0284C7", 0.08) },
};

export default function TabInfo() {
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
      setSaveMsg("Đã cập nhật họ tên.");
      setEditing(false);
    } catch (err) {
      setSaveErr(err instanceof ApiError ? err.message : "Cập nhật thất bại.");
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
      setKeyErr(err instanceof ApiError ? err.message : "Tạo API key thất bại.");
    } finally { setCreating(false); }
  }

  async function handleDelete(id: string) {
    setKeyErr(""); setKeyMsg("");
    try {
      await usersApi.deleteApiKey(id);
      setKeys((prev) => prev.filter((k) => k.id !== id));
      if (freshKey?.id === id) setFreshKey(null);
      setKeyMsg("Đã thu hồi API key.");
    } catch (err) {
      setKeyErr(err instanceof ApiError ? err.message : "Thu hồi API key thất bại.");
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
        <SectionTitle title="Tài khoản" subtitle="Thông tin cá nhân của bạn" />
        <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>

          {/* Tên đăng nhập */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, px: 2, borderBottom: "1px solid", borderColor: "divider", gap: 2 }}>
            <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>Tên đăng nhập</Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary" }}>{user?.username ?? "—"}</Typography>
          </Box>

          {/* Email */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, px: 2, borderBottom: "1px solid", borderColor: "divider", gap: 2 }}>
            <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>Email</Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary", wordBreak: "break-all", textAlign: "right" }}>{user?.email ?? "—"}</Typography>
          </Box>

          {/* Họ tên — có thể sửa */}
          <Box sx={{ py: 1.5, px: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>Họ tên</Typography>
              {!editing ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary" }}>
                    {user?.fullName || <Box component="span" sx={{ color: "text.disabled", fontStyle: "italic" }}>Chưa đặt</Box>}
                  </Typography>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton size="small" onClick={() => { setFullName(user?.fullName ?? ""); setEditing(true); setSaveMsg(""); setSaveErr(""); }} sx={{ color: "text.disabled", "&:hover": { color: "#2563EB" } }}>
                      <Pencil size={13} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flex: 1, justifyContent: "flex-end" }}>
                  <Box sx={{ display: "flex", alignItems: "center", px: 1.25, height: 32, borderRadius: "8px", border: "1.5px solid", borderColor: alpha("#2563EB", 0.4), bgcolor: "background.paper", flex: 1, maxWidth: 220 }}>
                    <InputBase value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Họ và tên..." sx={{ fontSize: "13px", "& input": { p: 0 } }} autoFocus />
                  </Box>
                  <Tooltip title="Lưu">
                    <IconButton size="small" onClick={handleSaveName} disabled={saving} sx={{ color: "#059669", "&:hover": { bgcolor: alpha("#059669", 0.08) } }}>
                      {saving ? <CircularProgress size={13} /> : <Save size={13} />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Huỷ">
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
            <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>Vai trò</Typography>
            <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary" }}>
              {ROLE_LABEL[user?.role ?? ""] ?? user?.role ?? "—"}
            </Typography>
          </Box>

          {/* Trạng thái tài khoản */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1.5, px: 2, gap: 2 }}>
            <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>Trạng thái</Typography>
            {statusCfg ? (
              <Box component="span" sx={{ px: 1.25, py: 0.25, borderRadius: "99px", bgcolor: statusCfg.bg, color: statusCfg.color, fontSize: "11px", fontWeight: 700 }}>
                {statusCfg.label}
              </Box>
            ) : (
              <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary" }}>{user?.status ?? "—"}</Typography>
            )}
          </Box>

        </Box>
      </Box>

      {/* ── API Keys ──────────────────────────────────────── */}
      <Box>
        <SectionTitle title="API Keys" subtitle="Dùng cho Public API v2 — tối đa 5 key" />

        {keyMsg && <Alert severity="success" sx={{ mb: 1.5 }} onClose={() => setKeyMsg("")}>{keyMsg}</Alert>}
        {keyErr && <Alert severity="error"   sx={{ mb: 1.5 }} onClose={() => setKeyErr("")}>{keyErr}</Alert>}

        {/* Key vừa tạo */}
        {freshKey?.key && (
          <Alert severity="warning" sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: "12px", mb: 0.5 }}>
              Lưu key này ngay — sẽ không hiển thị lại:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "12px", fontFamily: "monospace", fontWeight: 700, wordBreak: "break-all" }}>
                {freshKey.key}
              </Typography>
              <Tooltip title={copied ? "Đã copy" : "Copy"}>
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
            <InputBase placeholder="Tên key mới (vd: my-bot)" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} fullWidth sx={{ fontSize: "13px", "& input": { p: 0 } }} onKeyDown={(e) => { if (e.key === "Enter") void handleCreate(); }} />
          </Box>
          <Box component="button" onClick={() => void handleCreate()} disabled={creating} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2.5, py: 1.25, borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontSize: "12px", fontWeight: 600, cursor: "pointer", opacity: creating ? 0.6 : 1, whiteSpace: "nowrap" }}>
            <Plus size={14} />
            {creating ? "Đang tạo..." : "Tạo key"}
          </Box>
        </Box>

        {/* Key list */}
        {loadingKeys ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}><CircularProgress size={22} /></Box>
        ) : keys.length === 0 ? (
          <Typography sx={{ fontSize: "12px", color: "text.disabled" }}>Chưa có API key nào.</Typography>
        ) : (
          <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            {keys.map((k, i) => (
              <Box key={k.id} sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 1.25, borderBottom: i < keys.length - 1 ? "1px solid" : "none", borderColor: "divider" }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>{k.name ?? "(không tên)"}</Typography>
                  <Typography sx={{ fontSize: "11px", color: "text.disabled", fontFamily: "monospace" }}>
                    {k.keyPrefix ?? "sk-"}•••••• · tạo {formatDate(k.createdAt)}
                    {k.lastUsedAt ? ` · dùng lần cuối ${formatDate(k.lastUsedAt)}` : " · chưa sử dụng"}
                  </Typography>
                </Box>
                <Tooltip title="Thu hồi key">
                  <IconButton size="small" onClick={() => void handleDelete(k.id)} sx={{ color: "#DC2626" }}>
                    <Trash2 size={15} />
                  </IconButton>
                </Tooltip>
              </Box>
            ))}
          </Box>
        )}

        <Typography sx={{ fontSize: "11px", color: "text.disabled", mt: 1 }}>
          Key đầy đủ chỉ hiển thị một lần khi tạo. Thu hồi key sẽ vô hiệu hóa ngay lập tức.
        </Typography>
      </Box>
    </Box>
  );
}
