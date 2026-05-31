'use client'
import NextLink from 'next/link'
import { Box, Container, Typography, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'
import InsightsIcon from '@mui/icons-material/Insights'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { gradientText, gradientBg } from '@/lib/theme'

const steps = [
  {
    number: '01',
    icon: <AppRegistrationIcon />,
    title: 'Tạo tài khoản',
    desc: 'Đăng ký miễn phí trong 30 giây. Không cần thẻ tín dụng, không phí ẩn.',
    color: '#0891B2',
    bg: '#ECFEFF',
  },
  {
    number: '02',
    icon: <AccountBalanceWalletIcon />,
    title: 'Nạp tiền vào ví',
    desc: 'Nạp tiền qua Momo, ZaloPay, VNPay hoặc chuyển khoản ngân hàng — xử lý tức thì.',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    number: '03',
    icon: <ShoppingCartCheckoutIcon />,
    title: 'Chọn dịch vụ & đặt đơn',
    desc: 'Chọn nền tảng, gói dịch vụ, nhập link trang cá nhân và xác nhận đơn hàng.',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    number: '04',
    icon: <InsightsIcon />,
    title: 'Theo dõi kết quả',
    desc: 'Xem tiến độ thực hiện theo thời gian thực trong trang quản lý đơn hàng của bạn.',
    color: '#16A34A',
    bg: '#F0FDF4',
  },
]

export default function HowItWorks() {
  return (
    <Box sx={{ backgroundColor: '#FFFFFF', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="overline"
            sx={{ color: '#0891B2', fontWeight: 700, letterSpacing: '0.1em', display: 'block', mb: 1.5 }}
          >
            QUY TRÌNH
          </Typography>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Chỉ{' '}
            <Box component="span" sx={gradientText}>4 bước</Box>
            {' '}đơn giản
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 460, mx: 'auto' }}>
            Từ lúc đăng ký đến khi nhận kết quả, mọi thứ đều nhanh gọn và minh bạch
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {steps.map((step, i) => (
            <Grid key={step.number} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  p: 3.5,
                  height: '100%',
                  border: '1px solid #E2E8F0',
                  borderRadius: 3,
                  backgroundColor: '#FFFFFF',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&:hover': {
                    boxShadow: `0 8px 24px ${step.color}18`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* Step number — top right */}
                <Typography
                  sx={{
                    position: 'absolute', top: 16, right: 20,
                    fontSize: '2.5rem', fontWeight: 900, lineHeight: 1,
                    color: '#CBD5E1', userSelect: 'none',
                  }}
                >
                  {step.number}
                </Typography>

                {/* Icon */}
                <Box
                  sx={{
                    width: 52, height: 52, borderRadius: '14px',
                    backgroundColor: step.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mb: 2.5, '& svg': { fontSize: 26, color: step.color },
                  }}
                >
                  {step.icon}
                </Box>

                <Typography variant="h4" sx={{ mb: 1, color: step.color, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Bước {i + 1}
                </Typography>
                <Typography variant="h4" sx={{ mb: 1 }}>{step.title}</Typography>
                <Typography variant="body2">{step.desc}</Typography>

                {/* Connector arrow between steps */}
                {i < steps.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'flex' },
                      position: 'absolute', right: -22, top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 2,
                      width: 44, height: 44,
                      borderRadius: '50%',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
