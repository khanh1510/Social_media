'use client'
import NextLink from 'next/link'
import { Box, Container, Typography, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import InstagramIcon from '@mui/icons-material/Instagram'
import GlobeIcon from '@mui/icons-material/Language'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FacebookIcon from '@mui/icons-material/Facebook'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { gradientBg } from '@/lib/theme'

const platforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    sub: 'Followers & Tương Tác',
    icon: <InstagramIcon sx={{ fontSize: { xs: 24, md: 28, xl: 32 }, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #06B6D4, #2563EB)',
    desc: 'Followers, likes, views, comments, reels views chất lượng cao – tài khoản thực & hoạt động với giao hàng nhanh và bảo hành refill.',
    serviceCount: '2,500+',
    startFrom: '$0.001',
    delay: '0ms',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    sub: 'Tăng Trưởng Viral',
    icon: <GlobeIcon sx={{ fontSize: { xs: 24, md: 28, xl: 32 }, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #14B8A6, #06B6D4)',
    desc: 'Tăng followers, likes, views, shares & live stream views TikTok ngay lập tức. Hoàn hảo để viral.',
    serviceCount: '1,800+',
    startFrom: '$0.002',
    delay: '100ms',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    sub: 'Sẵn Sàng Kiếm Tiền',
    icon: <YouTubeIcon sx={{ fontSize: { xs: 24, md: 28, xl: 32 }, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
    desc: 'Views, giờ xem, subscribers, likes & comments sẵn sàng bật kiếm tiền. An toàn cho AdSense.',
    serviceCount: '3,200+',
    startFrom: '$0.003',
    delay: '200ms',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    sub: 'Tăng Page & Bài Viết',
    icon: <FacebookIcon sx={{ fontSize: { xs: 24, md: 28, xl: 32 }, color: '#fff' }} />,
    gradient: 'linear-gradient(135deg, #3B82F6, #0EA5E9)',
    desc: 'Likes trang, tương tác bài viết, followers, comments, shares – giá rẻ và đáng tin cậy.',
    serviceCount: '1,500+',
    startFrom: '$0.001',
    delay: '300ms',
  },
]

export default function PlatformGrid() {
  return (
    <Box
      id="services"
      component="section"
      sx={{
        py: { xs: 7, md: 8, xl: 12 },
        background: 'linear-gradient(180deg, #F8FAFF 0%, #EFF6FF 100%)',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 5, md: 6, xl: 7 } }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.75,
            px: 1.5, py: 0.5, mb: 2, borderRadius: 99,
            background: gradientBg,
          }}>
            <AutoAwesomeIcon sx={{ fontSize: 14, color: '#fff' }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', letterSpacing: '0.02em' }}>
              Dịch Vụ SMM Cao Cấp
            </Typography>
          </Box>

          <Typography variant="h2" sx={{
            mb: 1.5,
            fontSize: { xs: '1.5rem', sm: '1.875rem' },
            fontWeight: 600,
            background: 'linear-gradient(135deg, #0891B2, #2563EB, #7C3AED)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Tăng Trưởng Mọi Nền Tảng
          </Typography>

          <Typography sx={{ color: '#4B5563', fontSize: { xs: '0.875rem', md: '1rem' }, maxWidth: 640, mx: 'auto', lineHeight: 1.7 }}>
            Seeding mạng xã hội rẻ nhất & nhanh nhất Việt Nam – Bắt đầu ngay, Chất lượng cao, Bảo hành Refill, Hỗ trợ 24/7.
          </Typography>
          <Typography sx={{ mt: 1, fontSize: { xs: '0.875rem', md: '1rem' }, fontWeight: 600, color: '#1F2937' }}>
            Phát triển mạng xã hội với giá không thể tốt hơn!
          </Typography>
        </Box>

        {/* Platform cards */}
        <Grid container spacing={{ xs: 2, md: 3, xl: 4 }} sx={{ mb: { xs: 5, md: 6, xl: 7 } }}>
          {platforms.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  p: { xs: 2, md: 2.5, xl: 3 },
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(241,245,249,0.5)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.3s, transform 0.3s',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                    transform: 'translateY(-3px)',
                  },
                  animation: `fadeInUp 0.5s ease ${p.delay} both`,
                }}
              >
                {/* Corner decoration */}
                <Box sx={{
                  position: 'absolute', top: 0, right: 0,
                  width: { xs: 56, md: 64, xl: 80 },
                  height: { xs: 56, md: 64, xl: 80 },
                  background: p.gradient,
                  borderBottomLeftRadius: '100%',
                  opacity: 0.07,
                  pointerEvents: 'none',
                }} />

                {/* Icon */}
                <Box sx={{ textAlign: 'center', mb: { xs: 1.5, md: 2, xl: 2.5 } }}>
                  <Box sx={{
                    width: { xs: 48, md: 56, xl: 64 },
                    height: { xs: 48, md: 56, xl: 64 },
                    borderRadius: 2,
                    background: p.gradient,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mx: 'auto',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}>
                    {p.icon}
                  </Box>
                </Box>

                {/* Text */}
                <Box sx={{ textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontSize: { xs: '1rem', md: '1.125rem' }, fontWeight: 600, color: '#1F2937', mb: 0.5 }}>
                    {p.name}
                  </Typography>
                  <Typography sx={{ fontSize: { xs: '0.6875rem', md: '0.75rem' }, color: '#6B7280', fontWeight: 500, mb: { xs: 1, md: 1.5 } }}>
                    {p.sub}
                  </Typography>
                  <Typography sx={{
                    fontSize: { xs: '0.6875rem', md: '0.75rem' },
                    color: '#4B5563', lineHeight: 1.6,
                    mb: { xs: 1.5, md: 2 },
                    minHeight: { md: 48 },
                    flexGrow: 1,
                  }}>
                    {p.desc}
                  </Typography>

                  {/* Stats row */}
                  <Box sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    mb: { xs: 1.5, md: 2 },
                    py: { xs: 1, md: 1.25 }, px: { xs: 1.5, md: 2 },
                    borderRadius: 2,
                    backgroundColor: 'rgba(248,250,252,0.8)',
                    border: '1px solid rgba(241,245,249,0.5)',
                  }}>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography sx={{ fontSize: '0.625rem', color: '#6B7280' }}>Dịch Vụ</Typography>
                      <Typography sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, fontWeight: 600, color: '#1F2937' }}>
                        {p.serviceCount}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ fontSize: '0.625rem', color: '#6B7280' }}>Từ</Typography>
                      <Typography sx={{
                        fontSize: { xs: '0.75rem', md: '0.875rem' }, fontWeight: 600,
                        background: p.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>
                        {p.startFrom}
                      </Typography>
                    </Box>
                  </Box>

                  {/* CTA button */}
                  <Button
                    component={NextLink}
                    href={`/services/${p.id}`}
                    fullWidth
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '0.875rem !important', transition: 'transform 0.3s' }} />}
                    sx={{
                      background: p.gradient,
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      py: { xs: 1, md: 1.25, xl: 1.5 },
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:hover': {
                        boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                        transform: 'translateY(-2px)',
                        background: p.gradient,
                      },
                    }}
                  >
                    Xem Dịch Vụ
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA banner */}
        <Box sx={{
          textAlign: 'center',
          p: { xs: 3, md: 4, xl: 5 },
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(229,231,235,0.5)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center',
            px: 1.5, py: 0.5, mb: 1.5, borderRadius: 99,
            background: gradientBg,
          }}>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: '#fff' }}>Ưu Đãi Đặc Biệt</Typography>
          </Box>

          <Typography sx={{
            fontSize: { xs: '1.125rem', md: '1.25rem', xl: '1.5rem' },
            fontWeight: 600, mb: 1,
            background: 'linear-gradient(135deg, #0891B2, #2563EB, #0EA5E9)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Chỉ từ $0.001 cho 1000!
          </Typography>

          <Typography sx={{ color: '#6B7280', fontSize: { xs: '0.875rem', md: '1rem' }, mb: 3 }}>
            Hơn 10,000+ dịch vụ cho 20+ nền tảng
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={NextLink}
              href="/services"
              variant="contained"
              startIcon={<AutoAwesomeIcon sx={{ fontSize: '0.875rem !important' }} />}
              endIcon={<ArrowForwardIcon sx={{ fontSize: '0.875rem !important' }} />}
              sx={{
                background: 'linear-gradient(135deg, #06B6D4, #3B82F6, #0EA5E9)',
                color: '#fff', fontWeight: 600,
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                px: { xs: 2.5, md: 3 }, py: { xs: 1.25, md: 1.5 },
                borderRadius: 2,
                boxShadow: '0 4px 16px rgba(6,182,212,0.3)',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(6,182,212,0.4)',
                  transform: 'translateY(-2px)',
                  background: 'linear-gradient(135deg, #06B6D4, #3B82F6, #0EA5E9)',
                },
              }}
            >
              Khám Phá Tất Cả Dịch Vụ
            </Button>
            <Button
              component={NextLink}
              href="/services"
              variant="outlined"
              sx={{
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                px: { xs: 2.5, md: 3 }, py: { xs: 1.25, md: 1.5 },
                borderRadius: 2,
                borderColor: 'rgba(6,182,212,0.4)',
                color: '#374151',
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(255,255,255,0.3)',
                '&:hover': {
                  borderColor: 'rgba(6,182,212,0.6)',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                },
              }}
            >
              Xem Bảng Giá
            </Button>
          </Box>
        </Box>
      </Container>

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
      `}</style>
    </Box>
  )
}
