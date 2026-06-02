"use client";

import { Box, Typography, alpha } from "@mui/material";
import { Camera, User, Shield, History, Key } from "lucide-react";
import { siTelegram } from "simple-icons";
import { useState } from "react";
import TabInfo from "@/components/profile/TabInfo";
import TabSecurity from "@/components/profile/TabSecurity";
import TabTelegram from "@/components/profile/TabTelegram";
import TabLoginHistory from "@/components/profile/TabLoginHistory";
import TabApiKeyHistory from "@/components/profile/TabApiKeyHistory";

type TabKey = "overview" | "security" | "telegram" | "login-history" | "apikey-history";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "overview", label: "Thông Tin", icon: <User size={15} /> },
  { key: "security", label: "Bảo Mật", icon: <Shield size={15} /> },
  { key: "telegram", label: "Telegram", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill={`#${siTelegram.hex}`}><path d={siTelegram.path} /></svg> },
  { key: "login-history", label: "Lịch Sử Đăng Nhập", icon: <History size={15} /> },
  { key: "apikey-history", label: "Lịch Sử API Key", icon: <Key size={15} /> },
];

const BANNER_GRADIENT = "linear-gradient(135deg, #1E3A5F 0%, #0C4A6E 40%, #0369A1 70%, #0284C7 100%)";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <Box sx={{ maxWidth: 860 }}>
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
          <Box sx={{ position: "absolute", top: -30, right: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
          <Box sx={{ position: "absolute", bottom: -20, left: "30%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

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
                  background: "linear-gradient(135deg, #DBEAFE, #E0F2FE)",
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
                  background: "linear-gradient(135deg, #0EA5E9, #06B6D4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(14,165,233,0.4)",
                  transition: "transform 150ms ease",
                  "&:hover": { transform: "scale(1.1)" },
                }}
                title="Đổi avatar"
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
            John Kenvin Mitnick
          </Typography>
          <Typography sx={{ fontSize: "13px", color: "text.secondary", mt: 0.25 }}>
            mitnicklegend@gmail.com
          </Typography>
          <Typography sx={{ fontSize: "12px", color: "text.disabled", mt: 0.25 }}>
            @mitnicklegend_4036
          </Typography>
        </Box>
      </Box>

      {/* Tab bar */}
      <Box
        sx={{
          mt: 3,
          p: 0.75,
          borderRadius: "14px",
          bgcolor: alpha("#0F172A", 0.04),
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
                  ? "linear-gradient(135deg, #2563EB, #0EA5E9)"
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
                {tab.label}
              </Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                {tab.label.split(" ")[0]}
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
