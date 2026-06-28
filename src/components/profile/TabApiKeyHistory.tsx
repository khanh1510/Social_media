"use client";

import { Box, CircularProgress, Typography, alpha } from "@mui/material";
import { Key } from "lucide-react";
import { useEffect, useState } from "react";
import { usersApi } from "@/lib/api";
import type { ApiKey } from "@/lib/api/types";
import { formatDate } from "@/lib/format";

export default function TabApiKeyHistory() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi.apiKeys()
      .then(setKeys)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
          Lịch Sử API Key
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 0.25 }}>
          Danh sách API key đang hoạt động của tài khoản.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress size={24} />
        </Box>
      ) : keys.length === 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, py: 6, borderRadius: "14px", border: "1px dashed", borderColor: "divider", bgcolor: alpha("#0F172A", 0.02) }}>
          <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: alpha("#64748B", 0.08), display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Key size={22} color="#94A3B8" />
          </Box>
          <Typography sx={{ fontSize: "13px", color: "text.secondary" }}>Chưa có API key nào.</Typography>
          <Typography sx={{ fontSize: "12px", color: "text.disabled", textAlign: "center", maxWidth: 240, lineHeight: 1.6 }}>
            Tạo API key tại tab <strong>Thông Tin</strong> để sử dụng Public API v2.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {keys.map((k) => (
            <Box
              key={k.id}
              sx={{
                display: "flex", alignItems: "center", gap: 2,
                px: 2, py: 1.5,
                borderRadius: "12px",
                border: "1px solid", borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box sx={{ flexShrink: 0, width: 36, height: 36, borderRadius: "10px", bgcolor: alpha("#2563EB", 0.07), display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Key size={17} color="#2563EB" />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary" }}>
                  {k.name ?? "(không tên)"}
                </Typography>
                <Typography sx={{ fontSize: "11px", color: "text.disabled", fontFamily: "monospace" }}>
                  {k.keyPrefix ?? "sk-"}••••••
                </Typography>
              </Box>

              <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
                  Tạo: {formatDate(k.createdAt)}
                </Typography>
                <Typography sx={{ fontSize: "11px", color: k.lastUsedAt ? "#0284C7" : "text.disabled" }}>
                  {k.lastUsedAt ? `Dùng lần cuối: ${formatDate(k.lastUsedAt)}` : "Chưa sử dụng"}
                </Typography>
              </Box>

              {/* Trạng thái active */}
              <Box
                component="span"
                sx={{
                  flexShrink: 0,
                  px: 1, py: 0.25, borderRadius: "99px",
                  bgcolor: k.isActive !== false ? alpha("#059669", 0.08) : alpha("#DC2626", 0.08),
                  color: k.isActive !== false ? "#059669" : "#DC2626",
                  fontSize: "10px", fontWeight: 700,
                }}
              >
                {k.isActive !== false ? "Hoạt động" : "Vô hiệu"}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
