"use client";

import { Box, Typography, alpha } from "@mui/material";
import { Sparkles, Star, CalendarDays, ThumbsUp, UserPlus, PlayCircle, Share2 } from "lucide-react";
import type { VipPlan, VipPlanDuration } from "@/types";
import { platformColors } from "@/data/services";

const serviceTypeIcons: Record<string, React.ReactNode> = {
  Like: <ThumbsUp size={11} />,
  Follow: <UserPlus size={11} />,
  View: <PlayCircle size={11} />,
  Share: <Share2 size={11} />,
};

const durationOrder: VipPlanDuration[] = ["30d", "3m", "6m", "1y"];

function formatPrice(n: number) {
  return n.toLocaleString("vi-VN");
}

function formatRange(min: number, max: number) {
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : String(n);
  return `${fmt(min)}–${fmt(max)}`;
}

interface PlanCardProps {
  plan: VipPlan;
  selectedDuration: VipPlanDuration;
  onSelectDuration: (id: string, d: VipPlanDuration) => void;
}

export default function PlanCard({ plan, selectedDuration, onSelectDuration }: PlanCardProps) {
  const colors = platformColors[plan.platform];
  const pricing = plan.pricing.find((p) => p.duration === selectedDuration) ?? plan.pricing[0];

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "18px",
        border: "2px solid",
        borderColor: plan.featured ? alpha("#0EA5E9", 0.35) : "divider",
        bgcolor: "background.paper",
        p: { xs: 2, sm: 2.5 },
        pt: plan.featured ? 3.5 : { xs: 2, sm: 2.5 },
        cursor: "pointer",
        transition: "all 220ms ease",
        boxShadow: plan.featured ? `0 4px 20px ${alpha("#0EA5E9", 0.12)}` : "0 1px 4px rgba(0,0,0,0.04)",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: plan.featured
            ? `0 12px 36px ${alpha("#0EA5E9", 0.18)}`
            : `0 8px 24px ${alpha(colors.text, 0.12)}`,
          borderColor: plan.featured ? alpha("#0EA5E9", 0.5) : alpha(colors.text, 0.3),
        },
      }}
    >
      {/* Featured badge */}
      {plan.featured && (
        <Box
          sx={{
            position: "absolute",
            top: -13,
            left: "50%",
            transform: "translateX(-50%)",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            px: 1.5,
            py: 0.375,
            borderRadius: "99px",
            background: "linear-gradient(135deg, #0EA5E9, #06B6D4, #3B82F6)",
            boxShadow: `0 2px 10px ${alpha("#0EA5E9", 0.4)}`,
            whiteSpace: "nowrap",
          }}
        >
          <Sparkles size={11} color="white" />
          <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "white", letterSpacing: "0.04em" }}>
            Đề xuất
          </Typography>
        </Box>
      )}

      {/* Icon + title */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
        <Box
          sx={{
            flexShrink: 0,
            width: 42,
            height: 42,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #0EA5E9, #3B82F6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 12px ${alpha("#0EA5E9", 0.3)}`,
          }}
        >
          <Star size={22} color="white" />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: { xs: "12px", sm: "13px" },
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.4,
              letterSpacing: "-0.01em",
            }}
          >
            {plan.title}
          </Typography>
          {/* Type chips */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.75, flexWrap: "wrap" }}>
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.375,
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                bgcolor: alpha("#0EA5E9", 0.1),
                color: "#0284C7",
                fontSize: "10px",
                fontWeight: 700,
                border: `1px solid ${alpha("#0EA5E9", 0.2)}`,
              }}
            >
              {serviceTypeIcons[plan.serviceType]}
              {plan.serviceType}
            </Box>
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.375,
                px: 1,
                py: 0.25,
                borderRadius: "6px",
                bgcolor: colors.bg,
                color: colors.text,
                fontSize: "10px",
                fontWeight: 700,
                border: `1px solid ${colors.border}`,
              }}
            >
              {plan.platform.charAt(0).toUpperCase() + plan.platform.slice(1)}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Description */}
      <Typography
        sx={{
          fontSize: "11px",
          color: "text.secondary",
          mb: 1.5,
          lineHeight: 1.5,
          px: 0.5,
          py: 0.5,
          borderRadius: "8px",
          bgcolor: alpha("#0F172A", 0.03),
        }}
      >
        {plan.description}
      </Typography>

      {/* Duration selector */}
      <Box sx={{ display: "flex", gap: 0.5, mb: 1.75, flexWrap: "wrap" }}>
        {plan.pricing.map((p) => {
          const active = selectedDuration === p.duration;
          return (
            <Box
              key={p.duration}
              component="button"
              onClick={() => onSelectDuration(plan.id, p.duration)}
              sx={{
                flex: 1,
                minWidth: 0,
                px: 0.75,
                py: 0.5,
                borderRadius: "8px",
                border: "1.5px solid",
                borderColor: active ? "#0EA5E9" : "divider",
                background: active ? "linear-gradient(135deg, #0EA5E9, #06B6D4)" : "transparent",
                color: active ? "white" : "text.secondary",
                fontSize: "10px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 150ms ease",
                whiteSpace: "nowrap",
                "&:hover": {
                  borderColor: "#0EA5E9",
                  color: active ? "white" : "#0284C7",
                },
              }}
            >
              {p.discount > 0 ? (
                <Box component="span" sx={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.3 }}>
                  <span>{p.label}</span>
                  <span style={{ fontSize: "9px", opacity: active ? 0.9 : 0.7 }}>-{p.discount}%</span>
                </Box>
              ) : (
                p.label
              )}
            </Box>
          );
        })}
      </Box>

      {/* Stats grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            borderRadius: "10px",
            bgcolor: alpha("#0EA5E9", 0.06),
            border: `1px solid ${alpha("#0EA5E9", 0.12)}`,
            p: 1,
          }}
        >
          <Typography sx={{ fontSize: "9px", color: "text.disabled", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", mb: 0.25 }}>
            Số lượng/bài
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#0284C7", fontVariantNumeric: "tabular-nums" }}>
            {formatRange(plan.minPerPost, plan.maxPerPost)}
          </Typography>
        </Box>
        <Box
          sx={{
            borderRadius: "10px",
            bgcolor: alpha("#10B981", 0.06),
            border: `1px solid ${alpha("#10B981", 0.12)}`,
            p: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.375, mb: 0.25 }}>
            <CalendarDays size={10} color="#94A3B8" />
            <Typography sx={{ fontSize: "9px", color: "text.disabled", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Bài/ngày
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#059669", fontVariantNumeric: "tabular-nums" }}>
            {plan.maxPostsPerDay}
          </Typography>
        </Box>
      </Box>

      {/* Price */}
      <Box
        sx={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 1,
          pt: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          {pricing.discount > 0 && (
            <Typography
              sx={{
                fontSize: "10px",
                color: "text.disabled",
                textDecoration: "line-through",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatPrice(plan.pricing[0].pricePerMonth)} ₫
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: { xs: "16px", sm: "18px" },
              fontWeight: 800,
              background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {formatPrice(pricing.pricePerMonth)} ₫
          </Typography>
          <Typography sx={{ fontSize: "10px", color: "text.disabled", fontWeight: 500 }}>
            / tháng
          </Typography>
        </Box>

        <Box
          component="button"
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 0.875,
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
            color: "white",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 150ms ease",
            boxShadow: `0 2px 8px ${alpha("#0EA5E9", 0.3)}`,
            whiteSpace: "nowrap",
            "&:hover": {
              transform: "scale(1.03)",
              boxShadow: `0 4px 16px ${alpha("#0EA5E9", 0.4)}`,
            },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          Đăng ký
        </Box>
      </Box>
    </Box>
  );
}
