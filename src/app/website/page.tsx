import { Box, Typography, alpha } from "@mui/material";
import { Globe, Wrench } from "lucide-react";

export default function WebsitePage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "20px",
          bgcolor: alpha("#2563EB", 0.08),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1,
        }}
      >
        <Globe size={36} color="#2563EB" />
      </Box>

      <Typography
        sx={{
          fontSize: { xs: "22px", sm: "28px" },
          fontWeight: 800,
          color: "text.primary",
          letterSpacing: "-0.02em",
        }}
      >
        Website Con
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 0.75,
          borderRadius: "999px",
          bgcolor: alpha("#F59E0B", 0.1),
          border: "1px solid",
          borderColor: alpha("#F59E0B", 0.25),
        }}
      >
        <Wrench size={14} color="#F59E0B" />
        <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#F59E0B" }}>
          Đang phát triển
        </Typography>
      </Box>

      <Typography
        sx={{
          fontSize: "14px",
          color: "text.secondary",
          maxWidth: 360,
          lineHeight: 1.6,
        }}
      >
        Tính năng quản lý website con đang được xây dựng. Vui lòng quay lại sau.
      </Typography>
    </Box>
  );
}
