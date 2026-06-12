"use client";

import { Alert, Box, CircularProgress, IconButton, InputBase, Tooltip, Typography } from "@mui/material";
import { Copy, Plus, Trash2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usersApi, ApiError } from "@/lib/api";
import type { ApiKey } from "@/lib/api/types";
import { formatDate } from "@/lib/format";

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        py: 1.5,
        px: 2,
        borderBottom: last ? "none" : "1px solid",
        borderColor: "divider",
        gap: 2,
      }}
    >
      <Typography sx={{ fontSize: "13px", color: "text.secondary", flexShrink: 0 }}>{label}</Typography>
      <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "text.primary", textAlign: "right", wordBreak: "break-all" }}>
        {value}
      </Typography>
    </Box>
  );
}

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

export default function TabInfo() {
  const { user } = useAuth();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // key vừa tạo — backend chỉ trả full key đúng 1 lần
  const [freshKey, setFreshKey] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setKeys(await usersApi.apiKeys());
      } catch {
        // bỏ qua, hiện danh sách rỗng
      } finally {
        setLoadingKeys(false);
      }
    })();
  }, []);

  async function handleCreate() {
    if (creating) return;
    setError("");
    setMessage("");
    const name = newKeyName.trim() || `key-${Date.now() % 10000}`;
    setCreating(true);
    try {
      const created = await usersApi.createApiKey(name);
      setFreshKey(created);
      setNewKeyName("");
      setKeys(await usersApi.apiKeys());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Tạo API key thất bại.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setError("");
    setMessage("");
    try {
      await usersApi.deleteApiKey(id);
      setKeys((prev) => prev.filter((k) => k.id !== id));
      if (freshKey?.id === id) setFreshKey(null);
      setMessage("Đã thu hồi API key.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Thu hồi API key thất bại.");
    }
  }

  function handleCopy(value: string) {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5, py: 3 }}>
      {/* Account section */}
      <Box>
        <SectionTitle title="Tài khoản" subtitle="Thông tin cá nhân của bạn" />
        <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
          <InfoRow label="Tên đăng nhập" value={user?.username ?? "—"} />
          <InfoRow label="Email" value={user?.email ?? "—"} />
          <InfoRow label="Họ tên" value={user?.fullName || "—"} />
          <InfoRow label="Vai trò" value={ROLE_LABEL[user?.role ?? ""] ?? user?.role ?? "—"} last />
        </Box>
      </Box>

      {/* API Keys section */}
      <Box>
        <SectionTitle title="API Keys" subtitle="Dùng cho Public API v2 — tối đa 5 key" />

        {message && <Alert severity="success" sx={{ mb: 1.5 }} onClose={() => setMessage("")}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 1.5 }} onClose={() => setError("")}>{error}</Alert>}

        {/* Key vừa tạo — hiển thị 1 lần duy nhất */}
        {freshKey?.key && (
          <Alert severity="warning" sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: "12px", mb: 0.5 }}>
              Lưu key này ngay — sẽ không hiển thị lại lần nữa:
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
          <Box
            sx={{
              flex: 1,
              display: "flex", alignItems: "center",
              px: 1.5, height: 38,
              borderRadius: "10px",
              border: "1px solid", borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <InputBase
              placeholder="Tên key mới (vd: my-bot)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              fullWidth
              sx={{ fontSize: "13px", "& input": { p: 0 } }}
            />
          </Box>
          <Box
            component="button"
            onClick={handleCreate}
            disabled={creating}
            sx={{
              display: "inline-flex", alignItems: "center", gap: 0.75,
              px: 2,
              borderRadius: "10px",
              border: "none",
              background: "#2563EB",
              color: "white",
              fontSize: "12px", fontWeight: 600,
              cursor: "pointer",
              opacity: creating ? 0.6 : 1,
            }}
          >
            <Plus size={14} />
            {creating ? "Đang tạo..." : "Tạo key"}
          </Box>
        </Box>

        {/* Key list */}
        {loadingKeys ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={22} />
          </Box>
        ) : keys.length === 0 ? (
          <Typography sx={{ fontSize: "12px", color: "text.disabled" }}>
            Chưa có API key nào.
          </Typography>
        ) : (
          <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
            {keys.map((k, i) => (
              <Box
                key={k.id}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5,
                  px: 2, py: 1.25,
                  borderBottom: i < keys.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>{k.name ?? "(không tên)"}</Typography>
                  <Typography sx={{ fontSize: "11px", color: "text.disabled", fontFamily: "monospace" }}>
                    {k.keyPrefix}.•••••• · tạo {formatDate(k.createdAt)}
                    {k.lastUsedAt ? ` · dùng lần cuối ${formatDate(k.lastUsedAt)}` : ""}
                  </Typography>
                </Box>
                <Tooltip title="Thu hồi key">
                  <IconButton size="small" onClick={() => handleDelete(k.id)} sx={{ color: "#DC2626" }}>
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
