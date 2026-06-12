"use client";

import { Box, Typography, alpha } from "@mui/material";
import Link from "next/link";
import {
  siFacebook, siTiktok, siInstagram, siYoutube, siX, siGoogle, siTelegram,
} from "simple-icons";
import type { CatalogPlatform } from "@/hooks/useCatalog";
import type { PlatformId } from "@/types";

function SiIcon({ icon, size = 18, color }: { icon: { path: string }; size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} role="img" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

const platformConfig: Record<PlatformId, {
  label: string;
  color: string;
  bg: string;
  logo: React.ReactNode;
}> = {
  facebook: {
    label: "Facebook",
    color: `#${siFacebook.hex}`,
    bg: "#EBF5FF",
    logo: <SiIcon icon={siFacebook} color={`#${siFacebook.hex}`} size={20} />,
  },
  tiktok: {
    label: "TikTok",
    color: "#000000",
    bg: "#F0F0F0",
    logo: <SiIcon icon={siTiktok} color="#000000" size={20} />,
  },
  instagram: {
    label: "Instagram",
    color: "#C13584",
    bg: "#FDF2F8",
    logo: <SiIcon icon={siInstagram} color="#C13584" size={20} />,
  },
  youtube: {
    label: "YouTube",
    color: `#${siYoutube.hex}`,
    bg: "#FFF5F5",
    logo: <SiIcon icon={siYoutube} color={`#${siYoutube.hex}`} size={20} />,
  },
  twitter: {
    label: "Twitter/X",
    color: "#000000",
    bg: "#F5F5F5",
    logo: <SiIcon icon={siX} color="#000000" size={20} />,
  },
  google: {
    label: "Google",
    color: `#${siGoogle.hex}`,
    bg: "#FFF8F0",
    logo: <SiIcon icon={siGoogle} color={`#${siGoogle.hex}`} size={20} />,
  },
  telegram: {
    label: "Telegram",
    color: `#${siTelegram.hex}`,
    bg: "#EFF8FF",
    logo: <SiIcon icon={siTelegram} color={`#${siTelegram.hex}`} size={20} />,
  },
};

interface Props {
  /** Danh sách platform (category cha) từ backend */
  platforms: CatalogPlatform[];
  activePlatform: PlatformId;
  /** Slug category con đang chọn */
  activeCategorySlug: string;
}

export default function ServiceTypeSidebar({ platforms, activePlatform, activeCategorySlug }: Props) {
  const config = platformConfig[activePlatform] ?? platformConfig.facebook;
  const activeCatalog = platforms.find((p) => p.slug === activePlatform);
  const serviceTypes = (activeCatalog?.children ?? []).map((c) => ({ key: c.slug, label: c.label }));
  // Chỉ hiện platform có trong catalog backend và có config màu/logo
  const platformOrder = platforms
    .map((p) => p.slug)
    .filter((slug): slug is PlatformId => slug in platformConfig);

  return (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {/* Platform picker */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "14px",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          p: 1,
        }}
      >
        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "text.disabled", letterSpacing: "0.08em", textTransform: "uppercase", px: 1, pb: 0.75 }}>
          Nền tảng
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          {platformOrder.map((pid) => {
            const pcfg = platformConfig[pid];
            const isActive = pid === activePlatform;
            const firstType = platforms.find((p) => p.slug === pid)?.children[0]?.slug ?? "";
            return (
              <Box
                key={pid}
                component={Link}
                href={`/seeding?platform=${pid}&serviceType=${encodeURIComponent(firstType)}&tab=order`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  px: 1,
                  py: 0.75,
                  borderRadius: "9px",
                  textDecoration: "none",
                  transition: "all 150ms ease",
                  bgcolor: isActive ? alpha(pcfg.color, 0.08) : "transparent",
                  border: "1px solid",
                  borderColor: isActive ? alpha(pcfg.color, 0.25) : "transparent",
                  "&:hover": {
                    bgcolor: alpha(pcfg.color, 0.06),
                    borderColor: alpha(pcfg.color, 0.15),
                  },
                }}
              >
                <Box
                  sx={{
                    width: 28, height: 28, borderRadius: "8px",
                    bgcolor: isActive ? pcfg.bg : alpha("#0F172A", 0.04),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {pcfg.logo}
                </Box>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? pcfg.color : "text.secondary",
                    lineHeight: 1,
                  }}
                >
                  {pcfg.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Service type list for active platform */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: "14px",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          p: 1,
        }}
      >
        <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "text.disabled", letterSpacing: "0.08em", textTransform: "uppercase", px: 1, pb: 0.75 }}>
          Loại dịch vụ
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          {serviceTypes.map(({ key, label }) => {
            const isActive = key === activeCategorySlug;
            return (
              <Box
                key={key}
                component={Link}
                href={`/seeding?platform=${activePlatform}&serviceType=${encodeURIComponent(key)}&tab=order`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.25,
                  py: 0.875,
                  borderRadius: "9px",
                  textDecoration: "none",
                  transition: "all 150ms ease",
                  bgcolor: isActive ? alpha(config.color, 0.08) : "transparent",
                  border: "1px solid",
                  borderColor: isActive ? alpha(config.color, 0.2) : "transparent",
                  "&:hover": {
                    bgcolor: alpha(config.color, 0.05),
                    borderColor: alpha(config.color, 0.12),
                  },
                }}
              >
                {isActive && (
                  <Box
                    sx={{
                      width: 6, height: 6, borderRadius: "50%",
                      bgcolor: config.color,
                      flexShrink: 0,
                    }}
                  />
                )}
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? config.color : "text.secondary",
                    pl: isActive ? 0 : 1.75,
                  }}
                >
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
