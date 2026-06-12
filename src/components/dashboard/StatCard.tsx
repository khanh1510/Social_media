"use client";

import { Box, Card, Typography, alpha } from "@mui/material";
import type { StatCardData } from "@/types";

const colorMap = {
  primary: { main: "#2563EB", bg: "#EFF6FF", shadow: "rgba(37,99,235,0.15)" },
  success: { main: "#10B981", bg: "#ECFDF5", shadow: "rgba(16,185,129,0.15)" },
  info: { main: "#0EA5E9", bg: "#F0F9FF", shadow: "rgba(14,165,233,0.15)" },
  warning: { main: "#06B6D4", bg: "#ECFEFF", shadow: "rgba(6,182,212,0.15)" },
};

interface StatCardProps {
  data: StatCardData;
}

export default function StatCard({ data }: StatCardProps) {
  const colors = colorMap[data.color];

  return (
    <Card
      sx={{
        p: 2.5,
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "all 200ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 12px 32px ${colors.shadow}, 0 4px 12px rgba(0,0,0,0.05)`,
          borderColor: alpha(colors.main, 0.2),
          "& .stat-icon": {
            transform: "scale(1.08)",
          },
          "& .stat-bg-gradient": {
            opacity: 1,
          },
        },
      }}
    >
      {/* Decorative background gradient on hover */}
      <Box
        className="stat-bg-gradient"
        sx={{
          position: "absolute",
          inset: 0,
          background: alpha(colors.main, 0.06),
          opacity: 0,
          transition: "opacity 200ms ease",
          pointerEvents: "none",
        }}
      />

      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, position: "relative" }}>
        {/* Icon */}
        <Box
          className="stat-icon"
          sx={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            bgcolor: colors.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "transform 200ms ease",
            border: `1px solid ${alpha(colors.main, 0.1)}`,
          }}
        >
          {data.icon}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "10px",
              fontWeight: 600,
              color: "text.secondary",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              mb: 0.5,
              lineHeight: 1.4,
            }}
          >
            {data.label}
          </Typography>
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 800,
              color: "text.primary",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {data.value}
          </Typography>
        </Box>
      </Box>

      {/* Bottom accent line */}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 2,
          background: colors.main,
          opacity: 0,
          transition: "opacity 200ms ease",
          ".MuiCard-root:hover &": {
            opacity: 1,
          },
        }}
      />
    </Card>
  );
}
