"use client";

import { Box, Typography, alpha, InputBase, Tooltip } from "@mui/material";
import { Copy, RotateCw, Eye, EyeOff, Check } from "lucide-react";
import { useState } from "react";

const MOCK_API_KEY = "sk-live-4xKz9mN2pQrT8vWsLbJhYcFdGaEiOuX";

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        py: 1.5,
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

export default function TabInfo() {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerated, setRegenerated] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MOCK_API_KEY).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setRegenerated(true);
    setTimeout(() => setRegenerated(false), 2000);
  };

  const maskedKey = showKey ? MOCK_API_KEY : MOCK_API_KEY.replace(/./g, "•").slice(0, 32);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 5, py: 3 }}>
      {/* Account section */}
      <Box>
        <SectionTitle title="Account" subtitle="Your personal information" />
        <Box sx={{ borderRadius: "14px", border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
          <InfoRow label="Username" value="mitnicklegend_4036" />
          <InfoRow label="Email" value="mitnicklegend@gmail.com" />
          <InfoRow label="Member since" value="31/05/2026" last />
        </Box>
      </Box>

      {/* API Key section */}
      <Box>
        <SectionTitle title="API Key" subtitle="Manage your API authentication" />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
          {/* Masked key input row */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              px: 1.5,
              py: 1,
              borderRadius: "10px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: alpha("#0F172A", 0.03),
              gap: 1,
            }}
          >
            <InputBase
              readOnly
              value={maskedKey}
              sx={{
                flex: 1,
                fontSize: "12px",
                fontFamily: "monospace",
                color: "text.primary",
                "& input": { p: 0 },
              }}
            />
            <Tooltip title={showKey ? "Ẩn" : "Hiển thị"}>
              <Box
                component="button"
                onClick={() => setShowKey((v) => !v)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  border: "none",
                  bgcolor: "transparent",
                  color: "text.disabled",
                  cursor: "pointer",
                  flexShrink: 0,
                  "&:hover": { bgcolor: alpha("#0F172A", 0.05), color: "text.secondary" },
                }}
              >
                {showKey
                  ? <EyeOff size={16} />
                  : <Eye size={16} />}
              </Box>
            </Tooltip>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              component="button"
              onClick={handleCopy}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 0.875,
                borderRadius: "10px",
                border: "1.5px solid",
                borderColor: copied ? "success.main" : "divider",
                bgcolor: copied ? alpha("#10B981", 0.06) : "background.paper",
                color: copied ? "success.main" : "text.secondary",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 180ms ease",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Đã copy" : "Copy"}
            </Box>

            <Box
              component="button"
              onClick={handleRegenerate}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 0.875,
                borderRadius: "10px",
                border: "none",
                background: regenerated
                  ? "linear-gradient(135deg, #10B981, #059669)"
                  : "linear-gradient(135deg, #2563EB, #0EA5E9)",
                color: "white",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 180ms ease",
                boxShadow: regenerated
                  ? "0 2px 8px rgba(16,185,129,0.3)"
                  : "0 2px 8px rgba(37,99,235,0.25)",
                "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              <RotateCw size={14} />
              {regenerated ? "Đã tạo mới" : "Regenerate"}
            </Box>
          </Box>

          <Typography sx={{ fontSize: "11px", color: "text.disabled" }}>
            Regenerating sẽ vô hiệu hoá key cũ ngay lập tức.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
