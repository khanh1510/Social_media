"use client";

import { Box, Typography, alpha, MenuItem, Select, FormControl } from "@mui/material";
import { Sparkles, Crown, Zap, Shield, Clock, TrendingUp, Layers, Star, Inbox } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import PlanCard from "@/components/vip/PlanCard";
import { vipPlans } from "@/data/vip";
import type { PlatformId, VipPlanDuration } from "@/types";

const ALL = "all";

const featureBadges = [
  { icon: <Zap size={12} />, labelKey: "badgeAutoInstant" },
  { icon: <Shield size={12} />, labelKey: "badgeSafe" },
  { icon: <Clock size={12} />, labelKey: "badgeCancelAnytime" },
  { icon: <TrendingUp size={12} />, labelKey: "badgeRefillWarranty" },
];

const platformOptions = [
  { value: ALL, labelKey: "platformAll", label: "" },
  { value: "facebook", labelKey: null, label: "Facebook" },
  { value: "tiktok", labelKey: null, label: "TikTok" },
  { value: "instagram", labelKey: null, label: "Instagram" },
  { value: "youtube", labelKey: null, label: "YouTube" },
  { value: "twitter", labelKey: null, label: "Twitter/X" },
  { value: "telegram", labelKey: null, label: "Telegram" },
];

const typeOptions = [
  { value: ALL, labelKey: "typeAll", label: "" },
  { value: "Like", labelKey: null, label: "Like" },
  { value: "Follow", labelKey: null, label: "Follow" },
  { value: "View", labelKey: null, label: "View" },
  { value: "Share", labelKey: null, label: "Share" },
];

export default function VipPage() {
  const t = useTranslations("vip");
  const [activeTab, setActiveTab] = useState<"available" | "mine">("available");
  const [platformFilter, setPlatformFilter] = useState<string>(ALL);
  const [typeFilter, setTypeFilter] = useState<string>(ALL);
  const [durations, setDurations] = useState<Record<string, VipPlanDuration>>({});

  const getSelectedDuration = (planId: string): VipPlanDuration =>
    durations[planId] ?? "30d";

  const handleSelectDuration = (planId: string, d: VipPlanDuration) =>
    setDurations((prev) => ({ ...prev, [planId]: d }));

  const filtered = useMemo(() => {
    return vipPlans.filter((p) => {
      const matchPlatform = platformFilter === ALL || p.platform === platformFilter;
      const matchType = typeFilter === ALL || p.serviceType === typeFilter;
      return matchPlatform && matchType;
    });
  }, [platformFilter, typeFilter]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Hero section — gradient sáng theo mẫu */}
      <Box
        sx={{
          position: "relative",
          mb: 3,
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid",
          borderColor: alpha("#0EA5E9", 0.2),
          background: (t) =>
            t.palette.mode === "dark"
              ? "linear-gradient(135deg, #0F1B2D 0%, #111827 50%, #0E1F2A 100%)"
              : "linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 50%, #ECFEFF 100%)",
          px: { xs: 3, sm: 4 },
          py: { xs: 3, sm: 3.5 },
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{ position: "absolute", top: -60, right: -40, width: 160, height: 160, borderRadius: "50%", background: alpha("#BAE6FD", 0.5), filter: "blur(40px)", pointerEvents: "none" }} />
        <Box sx={{ position: "absolute", bottom: -60, left: -30, width: 160, height: 160, borderRadius: "50%", background: alpha("#A5F3FC", 0.4), filter: "blur(40px)", pointerEvents: "none" }} />

        <Box sx={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Icon + title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
              <Box sx={{ position: "relative", flexShrink: 0 }}>
                <Box sx={{ position: "absolute", inset: 0, borderRadius: "14px", background: "linear-gradient(135deg, #38BDF8, #06B6D4)", filter: "blur(8px)", opacity: 0.4 }} />
                <Box sx={{
                  position: "relative",
                  width: 44, height: 44,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #38BDF8, #0EA5E9, #2563EB)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 4px 14px ${alpha("#0EA5E9", 0.35)}`,
                }}>
                  <Crown size={22} color="white" strokeWidth={2.2} />
                </Box>
              </Box>
              <Box>
                <Box sx={{
                  display: "inline-flex", alignItems: "center", gap: 0.5,
                  px: 1.5, py: 0.25, borderRadius: "99px", mb: 0.5,
                  bgcolor: (t) => alpha(t.palette.background.paper, 0.7),
                  border: `1px solid ${alpha("#0EA5E9", 0.25)}`,
                  backdropFilter: "blur(8px)",
                }}>
                  <Sparkles size={10} color="#0EA5E9" />
                  <Typography sx={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: "linear-gradient(90deg, #0284C7, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {t("autoSeeding")}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: { xs: "18px", sm: "22px" }, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.02em", color: "text.primary" }}>
                  <Box component="span" sx={{ background: "linear-gradient(90deg, #0EA5E9, #06B6D4, #2563EB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{t("heroTitlePrefix")}</Box> {t("heroTitleSuffix")}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 0.25 }}>
                  {t("heroSubtitle")}
                </Typography>
              </Box>
            </Box>

            {/* Feature badges */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {featureBadges.map((b) => (
                <Box
                  key={b.labelKey}
                  sx={{
                    display: "inline-flex", alignItems: "center", gap: 0.75,
                    px: 2.5, py: 1.25,
                    borderRadius: "8px",
                    bgcolor: (t) => alpha(t.palette.background.paper, 0.7),
                    border: `1px solid ${alpha("#0EA5E9", 0.2)}`,
                    backdropFilter: "blur(8px)",
                    color: "#0284C7",
                  }}
                >
                  {b.icon}
                  <Typography sx={{ fontSize: "11px", fontWeight: 600, color: "#0369A1" }}>
                    {t(b.labelKey)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tab bar */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0.5,
          mb: 2.5,
          p: 0.5,
          borderRadius: "14px",
          bgcolor: (t) => (t.palette.mode === "dark" ? alpha(t.palette.surface.hero, 0.6) : alpha("#F0F9FF", 0.8)),
          border: "1px solid",
          borderColor: alpha("#0EA5E9", 0.15),
        }}
      >
        {[
          { key: "available", label: t("tabAvailable"), icon: <Layers size={15} /> },
          { key: "mine", label: t("tabMine"), icon: <Crown size={15} /> },
        ].map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Box
              key={tab.key}
              component="button"
              onClick={() => setActiveTab(tab.key as "available" | "mine")}
              sx={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                gap: 0.75,
                py: 1.125,
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
                fontWeight: 700,
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
          <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
            <FormControl size="small">
              <Select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                sx={{
                  minWidth: 180, fontSize: "13px", fontWeight: 600, borderRadius: "99px",
                  bgcolor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.3) },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.6) },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0EA5E9" },
                }}
              >
                {platformOptions.map((o) => (
                  <MenuItem key={o.value} value={o.value} sx={{ fontSize: "13px" }}>{o.labelKey ? t(o.labelKey) : o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                sx={{
                  minWidth: 160, fontSize: "13px", fontWeight: 600, borderRadius: "99px",
                  bgcolor: "background.paper",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.3) },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: alpha("#0EA5E9", 0.6) },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0EA5E9" },
                }}
              >
                {typeOptions.map((o) => (
                  <MenuItem key={o.value} value={o.value} sx={{ fontSize: "13px" }}>{o.labelKey ? t(o.labelKey) : o.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography sx={{ fontSize: "12px", color: "text.secondary", ml: "auto" }}>
              <Box component="span" sx={{ fontWeight: 700, color: "#0284C7" }}>{filtered.length}</Box> {t("plansMatched")}
            </Typography>
          </Box>

          {/* Plan cards grid */}
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
                {t("noPlansMatched")}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: { xs: 2, sm: 2.5 } }}>
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
        <Box
          sx={{
            py: 10,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5,
            borderRadius: "16px",
            border: "1px dashed",
            borderColor: alpha("#0EA5E9", 0.25),
            bgcolor: (t) => (t.palette.mode === "dark" ? alpha(t.palette.surface.hero, 0.4) : alpha("#F0F9FF", 0.5)),
          }}
        >
          <Box sx={{ width: 56, height: 56, borderRadius: "16px", background: "linear-gradient(135deg, #0EA5E9, #06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
            <Inbox size={28} color="white" />
          </Box>
          <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "text.secondary" }}>
            {t("noPlansSubscribed")}
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "text.disabled", textAlign: "center", maxWidth: 280 }}>
            {t("minePromptEmpty")}
          </Typography>
          <Box
            component="button"
            onClick={() => setActiveTab("available")}
            sx={{
              mt: 1, px: 2.5, py: 1.25,
              borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
              color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer",
              boxShadow: `0 2px 10px ${alpha("#0EA5E9", 0.3)}`,
              "&:hover": { opacity: 0.9 },
            }}
          >
            {t("viewAvailable")}
          </Box>
        </Box>
      )}
    </Box>
  );
}
