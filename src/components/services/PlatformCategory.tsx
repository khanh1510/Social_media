"use client";

import { Box, Typography, Collapse, alpha } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import ServiceItem from "./ServiceItem";
import { platformColors } from "@/data/services";
import type { PlatformCategory as PlatformCategoryType } from "@/types";

// Platform logo SVGs (inline, brand colors)
const platformLogos: Record<string, React.ReactNode> = {
  facebook: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  tiktok: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#7C3AED">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  ),
  instagram: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="ig-cat" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="40%" stopColor="#F77737" />
          <stop offset="70%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <path fill="url(#ig-cat)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.163 12 18.163s6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  youtube: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#DC2626">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  twitter: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0284C7">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  google: (
    <svg width="22" height="22" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
  telegram: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0284C7">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
};

interface PlatformCategoryProps {
  category: PlatformCategoryType;
  defaultOpen?: boolean;
}

export default function PlatformCategory({ category, defaultOpen = false }: PlatformCategoryProps) {
  const [open, setOpen] = useState(defaultOpen);
  const colors = platformColors[category.id];
  const total = category.services.length;

  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: colors.border,
        overflow: "hidden",
        boxShadow: `0 1px 4px ${colors.glow}`,
        transition: "box-shadow 200ms ease",
        "&:hover": { boxShadow: `0 4px 16px ${colors.glow}` },
        position: "relative",
      }}
    >
      {/* Decorative corner glow */}
      <Box
        sx={{
          position: "absolute",
          top: -24,
          right: -24,
          width: 80,
          height: 80,
          borderRadius: "50%",
          bgcolor: colors.bg,
          filter: "blur(24px)",
          opacity: 0.6,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Category header button */}
      <Box
        component="button"
        onClick={() => setOpen((v) => !v)}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 2.5 },
          py: { xs: 1.5, sm: 2 },
          border: "none",
          cursor: "pointer",
          bgcolor: colors.bg,
          transition: "filter 150ms ease",
          "&:hover": { filter: "brightness(0.97)" },
          "&:active": { transform: "scale(0.999)" },
        }}
      >
        {/* Left: icon + title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            {/* Icon glow */}
            <Box
              sx={{
                position: "absolute",
                inset: -3,
                borderRadius: "14px",
                bgcolor: colors.bg,
                filter: "blur(6px)",
                opacity: 0.7,
              }}
            />
            <Box
              sx={{
                position: "relative",
                width: 42,
                height: 42,
                borderRadius: "12px",
                bgcolor: "white",
                boxShadow: `0 2px 8px ${colors.glow}, 0 0 0 2px ${alpha(colors.text, 0.1)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {platformLogos[category.id]}
            </Box>
          </Box>

          <Box sx={{ textAlign: "left" }}>
            <Typography sx={{ fontWeight: 700, fontSize: { xs: "14px", sm: "15px" }, color: colors.text, lineHeight: 1.3, letterSpacing: "-0.01em" }}>
              {category.label}
            </Typography>
            <Typography sx={{ fontSize: { xs: "10px", sm: "11px" }, color: "text.secondary", fontWeight: 500, lineHeight: 1.3 }}>
              {total} dịch vụ
            </Typography>
          </Box>
        </Box>

        {/* Right: count badge + chevron */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="span"
            sx={{
              px: 1.25,
              py: 0.25,
              borderRadius: "99px",
              bgcolor: "white",
              border: `1px solid ${colors.border}`,
              color: colors.text,
              fontSize: "11px",
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              boxShadow: `0 1px 3px ${colors.glow}`,
            }}
          >
            {total}
          </Box>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              bgcolor: alpha("#FFFFFF", 0.6),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <KeyboardArrowDownIcon
              sx={{
                fontSize: 18,
                color: colors.text,
                transition: "transform 250ms ease",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Service list */}
      <Collapse in={open} timeout={250}>
        <Box
          sx={{
            p: { xs: 1, sm: 1.5 },
            display: "flex",
            flexDirection: "column",
            gap: 0.75,
            background: `linear-gradient(to bottom, transparent, ${alpha(colors.bg, 0.3)})`,
          }}
        >
          {category.services.map((service) => (
            <ServiceItem key={service.id} service={service} accentColor={colors.text} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
