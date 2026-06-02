"use client";

import { Box, Typography, alpha } from "@mui/material";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PlusCircle, ClipboardList } from "lucide-react";
import ServiceTypeSidebar from "@/components/seeding/ServiceTypeSidebar";
import CreateOrderForm from "@/components/seeding/CreateOrderForm";
import OrderHistory from "@/components/seeding/OrderHistory";
import { serviceTypesByPlatform } from "@/data/orders";
import { platformColors } from "@/data/services";
import type { PlatformId } from "@/types";

const VALID_PLATFORMS: PlatformId[] = ["facebook", "tiktok", "instagram", "youtube", "twitter", "google", "telegram"];

function SeedingContent() {
  const searchParams = useSearchParams();

  const rawPlatform = searchParams.get("platform") ?? "facebook";
  const platform: PlatformId = VALID_PLATFORMS.includes(rawPlatform as PlatformId)
    ? (rawPlatform as PlatformId)
    : "facebook";

  const types = serviceTypesByPlatform[platform] ?? [];
  const rawType = searchParams.get("serviceType") ?? types[0]?.key ?? "";
  const serviceType = types.some((t) => t.key === rawType) ? rawType : (types[0]?.key ?? "");

  const rawTab = searchParams.get("tab") ?? "order";
  const tab: "order" | "history" = rawTab === "history" ? "history" : "order";

  const colors = platformColors[platform] ?? platformColors.facebook;
  const typeLabel = types.find((t) => t.key === serviceType)?.label ?? serviceType;

  return (
    <Box sx={{ maxWidth: 1200, display: "flex", gap: 2.5, alignItems: "flex-start" }}>
      {/* Left: platform + service type sidebar */}
      <ServiceTypeSidebar activePlatform={platform} activeServiceType={serviceType} />

      {/* Right: main content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Page header */}
        <Box sx={{ mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 36, height: 36, borderRadius: "10px",
                bgcolor: alpha(colors.text, 0.1),
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <PlusCircle size={18} color={colors.text} />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "22px" },
                fontWeight: 800,
                color: "text.primary",
                letterSpacing: "-0.02em",
              }}
            >
              Đơn Seeding — {typeLabel}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "13px", color: "text.secondary", ml: "52px" }}>
            Tạo và quản lý đơn hàng tăng tương tác mạng xã hội
          </Typography>
        </Box>

        {/* Tab bar */}
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            mb: 2,
            p: 0.5,
            bgcolor: alpha("#F8FAFC", 0.8),
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "12px",
            width: "fit-content",
          }}
        >
          {([
            { key: "order", label: "Tạo đơn", icon: <PlusCircle size={15} /> },
            { key: "history", label: "Lịch sử đơn", icon: <ClipboardList size={15} /> },
          ] as const).map(({ key, label, icon }) => {
            const isActive = tab === key;
            return (
              <Box
                key={key}
                component="a"
                href={`/seeding?platform=${platform}&serviceType=${encodeURIComponent(serviceType)}&tab=${key}`}
                sx={{
                  display: "flex", alignItems: "center", gap: 0.75,
                  px: 1.5, py: 0.75,
                  borderRadius: "9px",
                  textDecoration: "none",
                  fontSize: "13px", fontWeight: 600,
                  transition: "all 150ms ease",
                  bgcolor: isActive ? "background.paper" : "transparent",
                  color: isActive ? colors.text : "text.secondary",
                  boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  border: isActive ? `1px solid ${alpha(colors.text, 0.15)}` : "1px solid transparent",
                  "&:hover": {
                    color: isActive ? colors.text : "text.primary",
                    bgcolor: isActive ? "background.paper" : alpha("#0F172A", 0.03),
                  },
                }}
              >
                {icon}
                {label}
              </Box>
            );
          })}
        </Box>

        {/* Content panel */}
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            p: { xs: 2, sm: 2.5 },
          }}
        >
          {tab === "order" ? (
            <CreateOrderForm platform={platform} serviceType={serviceType} />
          ) : (
            <OrderHistory platform={platform} serviceType={serviceType} />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function SeedingPage() {
  return (
    <Suspense>
      <SeedingContent />
    </Suspense>
  );
}
