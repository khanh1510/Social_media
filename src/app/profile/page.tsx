"use client";

import { Box, Typography, alpha } from "@mui/material";
import { Camera, User, Shield, History, Key } from "lucide-react";
import { siTelegram } from "simple-icons";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import TabInfo from "@/components/profile/TabInfo";
import TabSecurity from "@/components/profile/TabSecurity";
import TabTelegram from "@/components/profile/TabTelegram";
import TabLoginHistory from "@/components/profile/TabLoginHistory";
import TabApiKeyHistory from "@/components/profile/TabApiKeyHistory";

type TabKey = "overview" | "security" | "telegram" | "login-history" | "apikey-history";

const TABS: { key: TabKey; labelKey: string; icon: React.ReactNode }[] = [
  { key: "overview", labelKey: "tabInfo", icon: <User size={15} /> },
  { key: "security", labelKey: "tabSecurity", icon: <Shield size={15} /> },
  { key: "telegram", labelKey: "tabTelegram", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill={`#${siTelegram.hex}`}><path d={siTelegram.path} /></svg> },
  { key: "login-history", labelKey: "tabLoginHistory", icon: <History size={15} /> },
  { key: "apikey-history", labelKey: "tabApiKeyHistory", icon: <Key size={15} /> },
];

const BANNER_GRADIENT = "#1E3A5F";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const { user } = useAuth();
  const t = useTranslations("profile");

  return (
    <Box sx={{ width: "100%" }}>
      {/* Profile card */}
      <Box
        sx={{
          borderRadius: "18px",
          border: "1px solid",
          borderColor: alpha("#0EA5E9", 0.2),
          overflow: "hidden",
          boxShadow: `0 1px 8px ${alpha("#0EA5E9", 0.08)}`,
        }}
      >
        {/* Banner */}
        <Box
          sx={{
            height: { xs: 100, sm: 140, md: 180 },
            background: BANNER_GRADIENT,
            position: "relative",
          }}
        >
          {/* Decorative blobs */}
          <Box sx={{ position: "absolute", top: -30, right: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(14,165,233,0.3)", pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", bottom: -20, left: "30%", width: 120, height: 120, borderRadius: "50%", background: "rgba(6,182,212,0.25)", pointerEvents: "none" }} />

          {/* Avatar positioned at bottom-left of banner */}
          <Box
            sx={{
              position: "absolute",
              bottom: { xs: -32, sm: -40, md: -48 },
              left: { xs: 16, sm: 32 },
              zIndex: 10,
            }}
          >
            <Box sx={{ position: "relative" }}>
              {/* Avatar circle */}
              <Box
                sx={{
                  width: { xs: 64, sm: 80, md: 96 },
                  height: { xs: 64, sm: 80, md: 96 },
                  borderRadius: "50%",
                  border: "4px solid",
                  borderColor: "background.paper",
                  bgcolor: "background.paper",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#DBEAFE",
                }}
              >
                <User size={46} color="#93C5FD" />
              </Box>

              {/* Camera button */}
              <Box
                component="button"
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: { xs: 26, sm: 30 },
                  height: { xs: 26, sm: 30 },
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: "background.paper",
                  background: "#0EA5E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(14,165,233,0.4)",
                  transition: "transform 150ms ease",
                  "&:hover": { transform: "scale(1.1)" },
                }}
                title={t("changeAvatar")}
              >
                <Camera size={15} color="white" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Name / email under banner */}
        <Box
          sx={{
            px: { xs: 2, sm: 4 },
            pt: { xs: "44px", sm: "56px", md: "64px" },
            pb: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography sx={{ fontSize: { xs: "16px", sm: "18px" }, fontWeight: 700, color: "text.primary", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
            {user?.fullName || user?.username || ""}
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "text.secondary", mt: 0.25 }}>
            {user?.email ?? ""}
          </Typography>
          <Typography sx={{ fontSize: "12px", color: "text.disabled", mt: 0.25 }}>
            @{user?.username ?? ""}
          </Typography>
        </Box>
      </Box>

      {/* Tab bar */}
      <Box
        sx={{
          mt: 3,
          p: 0.75,
          borderRadius: "14px",
          bgcolor: "surface.subtle",
          border: "1px solid",
          borderColor: "divider",
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(5, 1fr)" },
          gap: 0.5,
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <Box
              key={tab.key}
              component="button"
              onClick={() => setActiveTab(tab.key)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.625,
                px: 1,
                py: 1,
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                transition: "all 200ms ease",
                background: active
                  ? "#2563EB"
                  : "transparent",
                color: active ? "white" : "text.secondary",
                fontSize: { xs: "11px", sm: "12px" },
                fontWeight: 600,
                boxShadow: active ? "0 2px 10px rgba(37,99,235,0.3)" : "none",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: active ? undefined : alpha("#2563EB", 0.06),
                  color: active ? "white" : "primary.main",
                },
              }}
            >
              {tab.icon}
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                {t(tab.labelKey)}
              </Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                {t(tab.labelKey).split(" ")[0]}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Tab content */}
      <Box
        sx={{
          mt: 1,
          borderRadius: "14px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          px: { xs: 2, sm: 3 },
          minHeight: 300,
        }}
      >
        {activeTab === "overview" && <TabInfo />}
        {activeTab === "security" && <TabSecurity />}
        {activeTab === "telegram" && <TabTelegram />}
        {activeTab === "login-history" && <TabLoginHistory />}
        {activeTab === "apikey-history" && <TabApiKeyHistory />}
      </Box>
    </Box>
  );
}
