"use client";

import {
  Box,
  Card,
  Typography,
  alpha,
} from "@mui/material";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

export default function OrderStatistics() {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "10px",
            bgcolor: alpha("#2563EB", 0.08),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <InventoryOutlinedIcon sx={{ fontSize: 18, color: "primary.main" }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
            Order Statistics
          </Typography>
          <Typography sx={{ fontSize: "11px", color: "text.secondary", fontWeight: 400 }}>
            Overview
          </Typography>
        </Box>
      </Box>

      {/* Empty state */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          gap: 1.5,
          minHeight: 200,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "16px",
            bgcolor: alpha("#64748B", 0.06),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 0.5,
          }}
        >
          <InboxOutlinedIcon sx={{ fontSize: 28, color: "text.disabled" }} />
        </Box>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 600,
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          No orders yet
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            color: "text.disabled",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 180,
          }}
        >
          Statistics will appear here once you place your first order.
        </Typography>
      </Box>
    </Card>
  );
}
