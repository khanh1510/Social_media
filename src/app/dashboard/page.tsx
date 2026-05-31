import { Box, Grid, Typography, Button, alpha } from "@mui/material";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import StatCard from "@/components/dashboard/StatCard";
import NotificationCard from "@/components/dashboard/NotificationCard";
import OrderStatistics from "@/components/dashboard/OrderStatistics";
import type { StatCardData, Notification } from "@/types";

const statCards: StatCardData[] = [
  {
    id: "balance",
    label: "Số Dư Hiện Tại",
    value: "0 ₫",
    icon: AccountBalanceWalletOutlinedIcon,
    color: "primary",
  },
  {
    id: "deposited",
    label: "Tổng Đã Nạp",
    value: "0 ₫",
    icon: SavingsOutlinedIcon,
    color: "success",
  },
  {
    id: "revenue",
    label: "Tổng Thu Nhập",
    value: "0 ₫",
    icon: TrendingUpOutlinedIcon,
    color: "info",
  },
  {
    id: "rank",
    label: "Hạng",
    value: "Đồng",
    icon: TrackChangesOutlinedIcon,
    color: "warning",
  },
];

const notifications: Notification[] = [
  {
    id: "1",
    userName: "Nguyễn Văn An",
    verified: true,
    platform: "facebook",
    timeAgo: "3 ngày",
    title: "Đơn hàng #FB-2401 đã hoàn thành",
    description: "Dịch vụ tăng 500 like Facebook của bạn đã được xử lý thành công. Cảm ơn bạn đã sử dụng dịch vụ.",
  },
  {
    id: "2",
    userName: "Trần Thị Bình",
    verified: false,
    platform: "tiktok",
    timeAgo: "5 ngày",
    title: "Đơn hàng #TK-1893 đang xử lý",
    description: "Dịch vụ tăng follow TikTok đang trong quá trình xử lý, dự kiến hoàn thành trong 24 giờ.",
  },
  {
    id: "3",
    userName: "Lê Minh Châu",
    verified: true,
    platform: "instagram",
    timeAgo: "1 tuần",
    title: "Nạp tiền thành công",
    description: "Tài khoản của bạn đã được cộng 200,000 ₫. Số dư khả dụng hiện tại: 200,000 ₫.",
  },
  {
    id: "4",
    userName: "Phạm Quốc Đạt",
    verified: true,
    platform: "youtube",
    timeAgo: "2 tuần",
    title: "Đơn hàng #YT-0562 hoàn thành",
    description: "1,000 view YouTube đã được thêm vào video của bạn. Hãy kiểm tra và phản hồi nếu có vấn đề.",
  },
];

export default function DashboardPage() {
  return (
    <Box sx={{ maxWidth: 1400 }}>
      {/* Welcome */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "24px" },
            fontWeight: 800,
            color: "text.primary",
            lineHeight: 1.3,
            letterSpacing: "-0.02em",
          }}
        >
          Xin chào, John 👋
        </Typography>
        <Typography sx={{ fontSize: "14px", color: "text.secondary", mt: 0.5 }}>
          Đây là tổng quan tài khoản của bạn hôm nay.
        </Typography>
      </Box>

      {/* Stat Cards — 4 cols on lg, 2 cols on xs */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid key={card.id} size={{ xs: 6, lg: 3 }}>
            <StatCard data={card} />
          </Grid>
        ))}
      </Grid>

      {/* Bottom section: Notifications (2/3) + Order Statistics (1/3) */}
      <Grid container spacing={{ xs: 1.5, sm: 2 }} sx={{ alignItems: "flex-start" }}>
        {/* LEFT: Notifications */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Section header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "9px",
                  bgcolor: alpha("#2563EB", 0.08),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NotificationsOutlinedIcon sx={{ fontSize: 16, color: "primary.main" }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
                  Thông Báo
                </Typography>
                <Typography sx={{ fontSize: "11px", color: "text.secondary" }}>
                  {notifications.length} thông báo mới
                </Typography>
              </Box>
            </Box>

            <Button
              size="small"
              endIcon={<ArrowForwardIcon sx={{ fontSize: "13px !important" }} />}
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: "primary.main",
                borderRadius: "8px",
                px: 1.25,
                py: 0.625,
                "&:hover": { bgcolor: alpha("#2563EB", 0.06) },
              }}
            >
              Xem Tất Cả
            </Button>
          </Box>

          {/* Notification list — stacked vertically */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {notifications.map((notif) => (
              <NotificationCard key={notif.id} notification={notif} />
            ))}
          </Box>
        </Grid>

        {/* RIGHT: Order Statistics */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <OrderStatistics />
        </Grid>
      </Grid>
    </Box>
  );
}
