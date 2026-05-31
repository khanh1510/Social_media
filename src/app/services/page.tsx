"use client";

import { Box, Typography, InputBase, alpha, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { useState, useMemo } from "react";
import PlatformCategory from "@/components/services/PlatformCategory";
import { servicesData, platformColors } from "@/data/services";
import type { PlatformId } from "@/types";

const ALL = "all";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [activePlatform, setActivePlatform] = useState<PlatformId | "all">(ALL);

  const totalServices = servicesData.reduce((sum, p) => sum + p.services.length, 0);

  const filtered = useMemo(() => {
    return servicesData
      .filter((cat) => activePlatform === ALL || cat.id === activePlatform)
      .map((cat) => ({
        ...cat,
        services: cat.services.filter((s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          String(s.id).includes(search)
        ),
      }))
      .filter((cat) => cat.services.length > 0);
  }, [search, activePlatform]);

  const filteredTotal = filtered.reduce((sum, p) => sum + p.services.length, 0);

  return (
    <Box sx={{ maxWidth: 900 }}>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              width: 36, height: 36, borderRadius: "10px",
              bgcolor: alpha("#2563EB", 0.08),
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <LayersOutlinedIcon sx={{ fontSize: 19, color: "primary.main" }} />
          </Box>
          <Typography sx={{ fontSize: { xs: "20px", sm: "24px" }, fontWeight: 800, color: "text.primary", letterSpacing: "-0.02em" }}>
            Bảng Giá Dịch Vụ
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "13px", color: "text.secondary", ml: "52px" }}>
          Tất cả dịch vụ tăng tương tác mạng xã hội
        </Typography>
      </Box>

      {/* Search + filter bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
          mb: 3,
          p: 1.5,
          borderRadius: "14px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {/* Search input */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            height: 38,
            borderRadius: "10px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: alpha("#F8FAFC", 0.8),
            transition: "all 150ms ease",
            "&:focus-within": {
              borderColor: alpha("#2563EB", 0.4),
              boxShadow: `0 0 0 3px ${alpha("#2563EB", 0.08)}`,
              bgcolor: "background.paper",
            },
          }}
        >
          <SearchIcon sx={{ fontSize: 16, color: "text.disabled", flexShrink: 0 }} />
          <InputBase
            placeholder="Tìm kiếm dịch vụ hoặc ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              fontSize: "13px",
              "& input::placeholder": { color: "text.disabled", opacity: 1 },
              "& input": { p: 0 },
            }}
          />
          {search && (
            <Typography
              component="span"
              onClick={() => setSearch("")}
              sx={{
                fontSize: "11px", color: "text.disabled", cursor: "pointer", flexShrink: 0,
                "&:hover": { color: "text.secondary" },
              }}
            >
              ✕
            </Typography>
          )}
        </Box>

        {/* Platform filter tabs */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
          {/* All button */}
          <Box
            component="button"
            onClick={() => setActivePlatform(ALL)}
            sx={{
              px: 1.5, py: 0.625,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: activePlatform === ALL ? "primary.main" : "divider",
              bgcolor: activePlatform === ALL ? alpha("#2563EB", 0.08) : "transparent",
              color: activePlatform === ALL ? "primary.main" : "text.secondary",
              fontSize: "12px", fontWeight: 600,
              cursor: "pointer",
              transition: "all 150ms ease",
              "&:hover": { borderColor: "primary.light", color: "primary.main" },
            }}
          >
            Tất cả
          </Box>

          {servicesData.map((cat) => {
            const c = platformColors[cat.id];
            const isActive = activePlatform === cat.id;
            return (
              <Box
                key={cat.id}
                component="button"
                onClick={() => setActivePlatform(cat.id as PlatformId)}
                sx={{
                  px: 1.25, py: 0.625,
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: isActive ? c.text : "divider",
                  bgcolor: isActive ? c.bg : "transparent",
                  color: isActive ? c.text : "text.secondary",
                  fontSize: "12px", fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 150ms ease",
                  "&:hover": { borderColor: c.text, color: c.text, bgcolor: c.bg },
                }}
              >
                {cat.label}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Service categories */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
              Không tìm thấy dịch vụ phù hợp.
            </Typography>
          </Box>
        ) : (
          filtered.map((cat, i) => (
            <PlatformCategory key={cat.id} category={cat} defaultOpen={i === 0} />
          ))
        )}
      </Box>

      {/* Footer counter */}
      {filtered.length > 0 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Box
            sx={{
              display: "inline-flex", alignItems: "center", gap: 1,
              px: 2.5, py: 1,
              borderRadius: "99px",
              background: "linear-gradient(135deg, #F0F9FF, #ECFEFF, #EFF6FF)",
              border: "1px solid",
              borderColor: alpha("#0EA5E9", 0.2),
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>Tổng dịch vụ:</Typography>
            <Typography
              sx={{
                fontSize: "14px", fontWeight: 800,
                background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {filteredTotal}
            </Typography>
            <Typography sx={{ fontSize: "12px", color: "text.disabled" }}>/ {totalServices}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
