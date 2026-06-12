"use client";

import { Box, Typography, Collapse, alpha } from "@mui/material";
import { ChevronDown } from "lucide-react";
import {
  siFacebook, siTiktok, siInstagram, siYoutube, siX, siGoogle, siTelegram,
} from "simple-icons";
import { useState } from "react";
import ServiceItem from "./ServiceItem";
import { platformColors } from "@/data/services";
import type { PlatformCategory as PlatformCategoryType } from "@/types";

function SiIcon({ icon, size = 22, color }: { icon: { path: string }; size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} role="img" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

const platformLogos: Record<string, React.ReactNode> = {
  facebook: <SiIcon icon={siFacebook} color={`#${siFacebook.hex}`} />,
  tiktok: <SiIcon icon={siTiktok} color="#010101" />,
  instagram: <SiIcon icon={siInstagram} color="#C13584" />,
  youtube: <SiIcon icon={siYoutube} color={`#${siYoutube.hex}`} />,
  twitter: <SiIcon icon={siX} color="#000000" />,
  google: <SiIcon icon={siGoogle} color={`#${siGoogle.hex}`} />,
  telegram: <SiIcon icon={siTelegram} color={`#${siTelegram.hex}`} />,
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
            <ChevronDown
              size={18}
              color={colors.text}
              style={{
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
            background: alpha(colors.bg, 0.3),
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
