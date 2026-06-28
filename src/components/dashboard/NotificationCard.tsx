"use client";

import { Box, Card, Typography, Avatar, alpha } from "@mui/material";
import { Globe, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { notificationsApi } from "@/lib/api";
import type { Notification } from "@/types";

const platformColors: Record<Notification["platform"], string> = {
  facebook:  "#1877F2",
  tiktok:    "#010101",
  instagram: "#E1306C",
  youtube:   "#FF0000",
  twitter:   "#1DA1F2",
  global:    "#64748B",
};

interface NotificationCardProps {
  notification: Notification;
}

export default function NotificationCard({ notification }: NotificationCardProps) {
  const [read, setRead] = useState(notification.isRead);
  const platformColor = platformColors[notification.platform];

  async function handleMarkRead() {
    if (read) return;
    setRead(true);
    try {
      await notificationsApi.markRead(notification.id);
    } catch {
      // rollback nếu lỗi
      setRead(false);
    }
  }

  return (
    <Card
      onClick={() => void handleMarkRead()}
      sx={{
        p: 0,
        borderRadius: "14px",
        border: "1px solid",
        borderColor: read ? "divider" : alpha("#2563EB", 0.25),
        bgcolor: read ? "background.paper" : alpha("#2563EB", 0.025),
        overflow: "hidden",
        cursor: read ? "default" : "pointer",
        transition: "all 200ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          borderColor: alpha("#2563EB", 0.2),
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2, pt: 2, pb: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid",
          borderColor: alpha("#0F172A", 0.06),
        }}
      >
        {/* Avatar */}
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <Avatar
            src={notification.userAvatar}
            sx={{
              width: 40, height: 40,
              bgcolor: "primary.main",
              fontSize: "14px",
              fontWeight: 700,
              border: "2px solid",
              borderColor: "divider",
            }}
          >
            {notification.userName.slice(0, 2).toUpperCase()}
          </Avatar>
          {notification.verified && (
            <Box
              sx={{
                position: "absolute", bottom: -2, right: -2,
                width: 16, height: 16, borderRadius: "50%",
                bgcolor: "background.paper",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <BadgeCheck size={14} color="#2563EB" />
            </Box>
          )}
        </Box>

        {/* User info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "13px", fontWeight: 700, color: "text.primary",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}
          >
            {notification.userName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
            <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
              {notification.timeAgo}
            </Typography>
            <Typography sx={{ fontSize: "11px", color: "text.disabled" }}>·</Typography>
            <Globe size={12} color={platformColor} />
            <Typography sx={{ fontSize: "11px", color: platformColor, fontWeight: 500, textTransform: "capitalize" }}>
              {notification.platform}
            </Typography>
          </Box>
        </Box>

        {/* Unread dot */}
        {!read && (
          <Box
            sx={{
              width: 8, height: 8, borderRadius: "50%",
              bgcolor: "#2563EB",
              flexShrink: 0,
              boxShadow: `0 0 0 2px ${alpha("#2563EB", 0.2)}`,
            }}
          />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography
          sx={{
            fontSize: "13px", fontWeight: read ? 500 : 700,
            color: "text.primary", mb: 0.5, lineHeight: 1.4,
          }}
        >
          {notification.title}
        </Typography>
        <Typography
          sx={{
            fontSize: "12px", color: "text.secondary", lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {notification.description}
        </Typography>
      </Box>
    </Card>
  );
}
