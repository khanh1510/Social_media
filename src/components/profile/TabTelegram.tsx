"use client";

import { Box, Typography, alpha, InputBase } from "@mui/material";
import { Link } from "lucide-react";
import { siTelegram } from "simple-icons";

export default function TabTelegram() {
  return (
    <Box sx={{ py: 3, maxWidth: 480 }}>
      {/* Telegram logo header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            background: "#0284C7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(2,132,199,0.3)",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d={siTelegram.path} /></svg>
        </Box>
        <Box>
          <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "text.primary" }}>
            Liên kết Telegram
          </Typography>
          <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
            Nhận thông báo đơn hàng qua Telegram bot.
          </Typography>
        </Box>
      </Box>

      {/* Steps */}
      <Box
        sx={{
          borderRadius: "14px",
          border: "1px solid",
          borderColor: alpha("#0284C7", 0.2),
          bgcolor: alpha("#0284C7", 0.03),
          p: 2,
          mb: 2.5,
        }}
      >
        <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "text.primary", mb: 1.5 }}>
          Hướng dẫn liên kết
        </Typography>
        {[
          'Mở Telegram, tìm bot @SocialMediaVN_Bot',
          'Gửi lệnh /start để khởi động bot',
          'Bot sẽ gửi cho bạn một mã liên kết 6 chữ số',
          'Nhập mã đó vào ô bên dưới và nhấn Liên kết',
        ].map((step, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.25, mb: 1 }}>
            <Box
              sx={{
                flexShrink: 0,
                width: 20,
                height: 20,
                borderRadius: "99px",
                background: "#0284C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 0.125,
              }}
            >
              <Typography sx={{ fontSize: "10px", fontWeight: 800, color: "white" }}>{i + 1}</Typography>
            </Box>
            <Typography sx={{ fontSize: "12px", color: "text.secondary", lineHeight: 1.5 }}>{step}</Typography>
          </Box>
        ))}
      </Box>

      {/* Input + button */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            px: 1.5,
            height: 40,
            borderRadius: "10px",
            border: "1.5px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: "all 150ms ease",
            "&:focus-within": {
              borderColor: alpha("#0284C7", 0.4),
              boxShadow: `0 0 0 3px ${alpha("#0284C7", 0.08)}`,
            },
          }}
        >
          <InputBase
            placeholder="Nhập mã 6 chữ số..."
            inputProps={{ maxLength: 6 }}
            sx={{ flex: 1, fontSize: "13px", letterSpacing: "0.1em", "& input": { p: 0 } }}
          />
        </Box>
        <Box
          component="button"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.625,
            px: 2,
            py: 1,
            borderRadius: "10px",
            border: "none",
            background: "#0284C7",
            color: "white",
            fontSize: "12px",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(2,132,199,0.3)",
            transition: "all 180ms ease",
            "&:hover": { opacity: 0.9, transform: "translateY(-1px)" },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          <Link size={15} />
          Liên kết
        </Box>
      </Box>
    </Box>
  );
}
