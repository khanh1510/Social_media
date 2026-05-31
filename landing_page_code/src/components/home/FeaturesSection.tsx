'use client'
import { Box, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import BoltIcon from '@mui/icons-material/Bolt'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import HeadphonesIcon from '@mui/icons-material/Headphones'
import ShieldIcon from '@mui/icons-material/Shield'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

const features = [
  {
    icon: <TrendingUpIcon sx={{ fontSize: { xs: 28, md: 32, xl: 36 }, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
    hoverGlow: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
    title: 'Tiếp Cận & Tăng Trưởng Lớn',
    desc: 'Tăng độ nhận diện thương hiệu và followers nhanh chóng trên tất cả các nền tảng mạng xã hội lớn.',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: { xs: 28, md: 32, xl: 36 }, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    hoverGlow: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    title: 'Tương Tác Thực',
    desc: 'Nhận được likes, comments, shares và views thực từ người dùng hoạt động để tăng tương tác.',
  },
  {
    icon: <BoltIcon sx={{ fontSize: { xs: 28, md: 32, xl: 36 }, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6, #8B5CF6)',
    hoverGlow: 'linear-gradient(135deg, #06B6D4, #3B82F6, #8B5CF6)',
    title: 'Giao Hàng Tức Thì',
    desc: 'Dịch vụ bắt đầu ngay sau khi đặt hàng – thấy kết quả trong vài phút.',
  },
  {
    icon: <RocketLaunchIcon sx={{ fontSize: { xs: 28, md: 32, xl: 36 }, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    hoverGlow: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    title: 'Giá Cả Phải Chăng',
    desc: 'Dịch vụ chất lượng cao với giá thấp nhất, không phí ẩn.',
  },
  {
    icon: <HeadphonesIcon sx={{ fontSize: { xs: 28, md: 32, xl: 36 }, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    hoverGlow: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
    title: 'Hỗ Trợ 24/7',
    desc: 'Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ bạn mọi lúc.',
  },
  {
    icon: <ShieldIcon sx={{ fontSize: { xs: 28, md: 32, xl: 36 }, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
    hoverGlow: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
    title: 'Đặt Hàng Dễ Dàng & An Toàn',
    desc: 'Bảng điều khiển thân thiện với thanh toán an toàn và theo dõi đơn hàng đầy đủ.',
  },
]

export default function FeaturesSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        py: { xs: 8, md: 10, xl: 12 },
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #DBEAFE 0%, #fff 100%)',
      }}
    >
      {/* Grid background */}
      <Box aria-hidden sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      {/* Floating orbs */}
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <Box sx={{
          position: 'absolute', top: 0, right: '25%',
          width: { xs: 200, md: 300, xl: 400 }, height: { xs: 200, md: 300, xl: 400 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(59,130,246,0.12) 50%, rgba(139,92,246,0.18) 100%)',
          filter: 'blur(80px)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: 0, left: '25%',
          width: { xs: 180, md: 260, xl: 350 }, height: { xs: 180, md: 260, xl: 350 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.12) 50%, rgba(14,165,233,0.18) 100%)',
          filter: 'blur(80px)',
        }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 7, xl: 8 } }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            px: 2, py: 1, mb: 3, borderRadius: 99,
            background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
            border: '1px solid rgba(6,182,212,0.2)',
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 14, color: '#0891B2' }} />
            <Typography sx={{
              fontSize: { xs: '0.75rem', md: '0.875rem' }, fontWeight: 500,
              background: 'linear-gradient(135deg, #0891B2, #2563EB)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Ưu Điểm
            </Typography>
          </Box>

          <Typography variant="h2" sx={{
            mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem', lg: '1.875rem' }, fontWeight: 700,
            background: 'linear-gradient(135deg, #0891B2, #2563EB, #7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Tại Sao Chọn SocialBoost VN?
          </Typography>

          <Typography sx={{ color: '#475569', fontSize: { xs: '0.875rem', md: '1rem' }, maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}>
            Khám phá những lợi thế khi chọn SocialBoost VN – dịch vụ seeding mạng xã hội hàng đầu Việt Nam cho tăng trưởng thực sự.
          </Typography>
        </Box>

        {/* Feature cards */}
        <Grid container spacing={{ xs: 2, md: 3, xl: 4 }}>
          {features.map((f) => (
            <Grid key={f.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 2.5, md: 3, xl: 4 },
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(226,232,240,0.5)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.3s',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(6,182,212,0.1)',
                    borderColor: 'rgba(6,182,212,0.3)',
                    transform: 'translateY(-2px)',
                    '& .feat-glow': { opacity: 0.2 },
                    '& .feat-corner': { opacity: 0.2 },
                  },
                }}
              >
                {/* Hover glow overlay */}
                <Box className="feat-glow" sx={{
                  position: 'absolute', inset: -4,
                  background: f.hoverGlow,
                  borderRadius: 3,
                  filter: 'blur(20px)',
                  opacity: 0,
                  transition: 'opacity 0.5s',
                  pointerEvents: 'none',
                  zIndex: 0,
                }} />

                {/* Corner glow */}
                <Box className="feat-corner" sx={{
                  position: 'absolute', bottom: -32, right: -32,
                  width: 96, height: 96,
                  background: f.hoverGlow,
                  borderRadius: '50%',
                  filter: 'blur(20px)',
                  opacity: 0,
                  transition: 'opacity 0.5s',
                  pointerEvents: 'none',
                }} />

                {/* Icon */}
                <Box sx={{ position: 'relative', zIndex: 1, mb: { xs: 2, md: 2.5, xl: 3 } }}>
                  <Box sx={{
                    width: { xs: 56, md: 64, xl: 72 },
                    height: { xs: 56, md: 64, xl: 72 },
                    borderRadius: 3,
                    background: f.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    {f.icon}
                  </Box>
                </Box>

                {/* Text */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography sx={{
                    fontWeight: 600, mb: 0.75,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    color: '#1E293B',
                  }}>
                    {f.title}
                  </Typography>
                  <Typography sx={{
                    fontSize: { xs: '0.6875rem', md: '0.75rem' },
                    color: '#475569', lineHeight: 1.7,
                  }}>
                    {f.desc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
