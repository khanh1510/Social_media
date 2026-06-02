"use client";

import { Box, Typography, alpha } from "@mui/material";
import { Zap, Clock } from "lucide-react";
import type { Service } from "@/types";

interface ServiceItemProps {
  service: Service;
  accentColor: string;
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}g ${m}p` : `${h} giờ`;
}

function formatRange(min: number, max: number) {
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : String(n);
  return `${fmt(min)} – ${fmt(max)}`;
}

const speedConfig = {
  fast: { label: "Nhanh", bg: "#DCFCE7", text: "#16A34A", border: "#BBF7D0" },
  medium: { label: "Vừa", bg: "#FEF9C3", text: "#CA8A04", border: "#FEF08A" },
  slow: { label: "Chậm", bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" },
};

const statusConfig = {
  maintenance: { label: "Bảo trì", bg: "#FEE2E2", text: "#DC2626" },
  active: null,
  slow: null,
};

export default function ServiceItem({ service, accentColor }: ServiceItemProps) {
  const speed = speedConfig[service.speed];
  const statusBadge = statusConfig[service.status];

  return (
    <Box
      role="button"
      tabIndex={0}
      sx={{
        position: "relative",
        borderRadius: "12px",
        border: "1px solid transparent",
        bgcolor: "background.paper",
        px: { xs: 1.5, sm: 2 },
        py: { xs: 1.25, sm: 1.5 },
        cursor: "pointer",
        transition: "all 180ms ease",
        "&:hover": {
          borderColor: alpha(accentColor, 0.3),
          bgcolor: alpha(accentColor, 0.03),
          boxShadow: `0 2px 12px ${alpha(accentColor, 0.1)}`,
          transform: "translateY(-1px)",
          "& .service-name": { color: accentColor },
          "& .service-id-box": { borderColor: alpha(accentColor, 0.4) },
          "& .price-box": { borderColor: alpha(accentColor, 0.4), boxShadow: `0 2px 8px ${alpha(accentColor, 0.15)}` },
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, gap: { xs: 1.5, sm: 2 } }}>
        {/* Service ID box */}
        <Box
          className="service-id-box"
          sx={{
            flexShrink: 0,
            width: { xs: 44, sm: 48 },
            height: { xs: 44, sm: 48 },
            borderRadius: "12px",
            border: "2px solid",
            borderColor: alpha(accentColor, 0.2),
            background: `linear-gradient(135deg, ${alpha(accentColor, 0.08)}, ${alpha(accentColor, 0.04)})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "border-color 180ms ease",
          }}
        >
          <Typography sx={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: alpha(accentColor, 0.5), lineHeight: 1 }}>
            SVR
          </Typography>
          <Typography sx={{ fontSize: { xs: "12px", sm: "13px" }, fontWeight: 800, color: accentColor, lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>
            {service.id}
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Name row */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
            <Typography
              className="service-name"
              sx={{
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 600,
                lineHeight: 1.4,
                color: "text.primary",
                transition: "color 180ms ease",
                flex: 1,
              }}
            >
              {service.name}
            </Typography>
            {statusBadge && (
              <Box
                component="span"
                sx={{
                  flexShrink: 0,
                  mt: 0.25,
                  px: 1,
                  height: 18,
                  borderRadius: "99px",
                  bgcolor: statusBadge.bg,
                  color: statusBadge.text,
                  fontSize: "9px",
                  fontWeight: 700,
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {statusBadge.label}
              </Box>
            )}
          </Box>

          {/* Meta row */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
              {/* Min-Max */}
              <Box
                component="span"
                sx={{
                  px: 1, py: 0.25, borderRadius: "6px",
                  bgcolor: alpha("#0F172A", 0.05),
                  fontSize: "10px", fontWeight: 600,
                  color: "text.secondary",
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {formatRange(service.min, service.max)}
              </Box>

              {/* Speed */}
              <Box
                component="span"
                sx={{
                  display: "inline-flex", alignItems: "center", gap: 0.375,
                  px: 1, py: 0.25, borderRadius: "6px",
                  bgcolor: speed.bg, color: speed.text,
                  border: `1px solid ${speed.border}`,
                  fontSize: "10px", fontWeight: 700,
                }}
              >
                <Zap size={10} />
                {speed.label}
              </Box>

              {/* Duration */}
              <Box
                component="span"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  alignItems: "center", gap: 0.375,
                  fontSize: "11px", fontWeight: 500,
                  color: "#0891B2",
                }}
              >
                <Clock size={12} />
                {formatDuration(service.durationMin)}
              </Box>
            </Box>

            {/* Price */}
            <Box
              className="price-box"
              sx={{
                flexShrink: 0,
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.625, sm: 0.75 },
                borderRadius: "9px",
                border: "2px solid",
                borderColor: alpha(accentColor, 0.2),
                background: `linear-gradient(135deg, ${alpha(accentColor, 0.1)}, ${alpha(accentColor, 0.05)})`,
                transition: "all 180ms ease",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "13px" },
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${accentColor}, #06B6D4)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  whiteSpace: "nowrap",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                }}
              >
                {service.price.toLocaleString("vi-VN")} ₫/1
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
