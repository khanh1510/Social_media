"use client";

import { Box, Typography, alpha, MenuItem, Select, FormControl } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import BoltIcon from "@mui/icons-material/Bolt";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LoopIcon from "@mui/icons-material/Loop";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import { useState, useMemo } from "react";
import PlanCard from "@/components/vip/PlanCard";
import { vipPlans } from "@/data/vip";
import type { PlatformId, VipPlanDuration } from "@/types";

const ALL = "all";

const featureBadges = [
  { icon: <BoltIcon sx={{ fontSize: 13, color: "#0EA5E9" }} />, label: "Auto tức thì" },
  { icon: <ShieldOutlinedIcon sx={{ fontSize: 13, color: "#10B981" }} />, label: "An toàn 100%" },
  { icon: <CancelOutlinedIcon sx={{ fontSize: 13, color: "#F59E0B" }} />, label: "Huỷ bất kỳ lúc nào" },
  { icon: <LoopIcon sx={{ fontSize: 13, color: "#8B5CF6" }} />, label: "Bảo hành refill" },
];

const platformOptions: { value: string; label: string }[] = [
  { value: ALL, label: "Tất cả nền tảng" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter/X" },
  { value: "telegram", label: "Telegram" },
];

export default function VipPage() {
  const [activeTab, setActiveTab] = useState<"available" | "mine">("available");
  const [platformFilter, setPlatformFilter] = useState<string>(ALL);
  const [durations, setDurations] = useState<Record<string, VipPlanDuration>>({});

  const getSelectedDuration = (planId: string): VipPlanDuration =>
    durations[planId] ?? "30d";

  const handleSelectDuration = (planId: string, d: VipPlanDuration) =>
    setDurations((prev) => ({ ...prev, [planId]: d }));

  const filtered = useMemo(() => {
    return vipPlans.filter((p) => platformFilter === ALL || p.platform === platformFilter);
  }, [platformFilter]);

  return (
    <Box sx={{ maxWidth: 1100 }}>
      {/* Hero section */}
      <Box
        sx={{
          position: "relative",
          mb: 3,
          borderRadius: "20px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0C2340 100%)",
          p: { xs: 3, sm: 4 },
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -30, left: -30, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Icon */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
            boxShadow: `0 4px 16px ${alpha("#0EA5E9", 0.4)}`,
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 24, color: "white" }} />
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "22px", sm: "28px" },
            fontWeight: 900,
            background: "linear-gradient(135deg, #E0F2FE, #BAE6FD, #67E8F9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          Gói Auto Seeding
        </Typography>
        <Typography sx={{ fontSize: { xs: "13px", sm: "14px" }, color: alpha("#BAE6FD", 0.8), mb: 2.5, maxWidth: 480, lineHeight: 1.6 }}>
          Mua 1 lần — mỗi post mới tự động được seed theo gói.
        </Typography>

        {/* Feature badges */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {featureBadges.map((b) => (
            <Box
              key={b.label}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.625,
                px: 1.5,
                py: 0.625,
                borderRadius: "99px",
                bgcolor: alpha("#FFFFFF", 0.08),
                border: `1px solid ${alpha("#FFFFFF", 0.12)}`,
                backdropFilter: "blur(8px)",
              }}
            >
              {b.icon}
              <Typography sx={{ fontSize: "11px", fontWeight: 600, color: alpha("#FFFFFF", 0.9) }}>
                {b.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Tab bar */}
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          mb: 2.5,
          p: 0.5,
          borderRadius: "14px",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          width: "fit-content",
        }}
      >
        {[
          { key: "available", label: "Gói có sẵn", icon: <LayersOutlinedIcon sx={{ fontSize: 15 }} /> },
          { key: "mine", label: "Của tôi", icon: <WorkspacePremiumIcon sx={{ fontSize: 15 }} /> },
        ].map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Box
              key={tab.key}
              component="button"
              onClick={() => setActiveTab(tab.key as "available" | "mine")}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 0.875,
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                transition: "all 180ms ease",
                background: active
                  ? "linear-gradient(135deg, #0EA5E9, #06B6D4)"
                  : "transparent",
                color: active ? "white" : "text.secondary",
                boxShadow: active ? `0 2px 10px ${alpha("#0EA5E9", 0.3)}` : "none",
                fontSize: "13px",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: active ? undefined : alpha("#0EA5E9", 0.06),
                  color: active ? "white" : "#0284C7",
                },
              }}
            >
              {tab.icon}
              {tab.label}
            </Box>
          );
        })}
      </Box>

      {activeTab === "available" ? (
        <>
          {/* Filter bar */}
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              mb: 3,
              p: 1.5,
              borderRadius: "14px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                displayEmpty
                sx={{
                  fontSize: "13px",
                  fontWeight: 600,
                  borderRadius: "10px",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.4) },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0EA5E9" },
                }}
              >
                {platformOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: "13px" }}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography sx={{ fontSize: "12px", color: "text.secondary", ml: "auto" }}>
              <Box component="span" sx={{ fontWeight: 700, color: "#0284C7" }}>{filtered.length}</Box> gói phù hợp
            </Typography>
          </Box>

          {/* Plan cards grid */}
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
                Không có gói nào phù hợp.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  lg: "1fr 1fr 1fr",
                },
                gap: { xs: 2, sm: 2.5 },
              }}
            >
              {filtered.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  selectedDuration={getSelectedDuration(plan.id)}
                  onSelectDuration={handleSelectDuration}
                />
              ))}
            </Box>
          )}
        </>
      ) : (
        /* "My plans" empty state */
        <Box
          sx={{
            py: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            borderRadius: "16px",
            border: "1px dashed",
            borderColor: alpha("#0EA5E9", 0.25),
            bgcolor: alpha("#0EA5E9", 0.02),
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.4,
            }}
          >
            <InboxOutlinedIcon sx={{ fontSize: 28, color: "white" }} />
          </Box>
          <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "text.secondary" }}>
            Bạn chưa đăng ký gói nào
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "text.disabled", textAlign: "center", maxWidth: 280 }}>
            Chọn tab "Gói có sẵn" để khám phá các gói Auto Seeding và đăng ký ngay.
          </Typography>
          <Box
            component="button"
            onClick={() => setActiveTab("available")}
            sx={{
              mt: 1,
              px: 2.5,
              py: 1,
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
              color: "white",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 2px 10px ${alpha("#0EA5E9", 0.3)}`,
              "&:hover": { opacity: 0.9 },
            }}
          >
            Xem gói có sẵn
          </Box>
        </Box>
      )}
    </Box>
  );
}
