'use client'
import { Box, Container, Typography, Avatar, Rating } from '@mui/material'
import Grid from '@mui/material/Grid2'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

const testimonials = [
  {
    name: 'Nguyễn Minh Anh',
    role: 'Beauty Blogger · 85K followers',
    initials: 'MA',
    rating: 5,
    gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
    hoverGlow: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
    content: 'Mình dùng dịch vụ tăng follow Instagram được 3 tháng rồi. Follow tăng rất tự nhiên, tỷ lệ tương tác không giảm chút nào. Team support phản hồi siêu nhanh, chỉ trong vài phút.',
    metric: '+12.000 followers',
    platform: 'Instagram',
  },
  {
    name: 'Trần Hoàng Nam',
    role: 'TikTok Creator · 200K followers',
    initials: 'HN',
    rating: 5,
    gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    hoverGlow: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    content: 'Gói tăng view TikTok giúp video mình lên For You Page cực nhanh. Từ khi dùng dịch vụ, kênh tăng trưởng đều đặn hơn nhiều. Giá rất hợp lý so với kết quả nhận được.',
    metric: '+200K views/tuần',
    platform: 'TikTok',
  },
  {
    name: 'Lê Thị Thu Hà',
    role: 'Chủ shop thời trang online',
    initials: 'TH',
    rating: 5,
    gradient: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
    hoverGlow: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
    content: 'Fanpage Facebook của shop tăng từ 500 lên 6.000 like chỉ trong 1 tuần. Đơn hàng online tăng rõ rệt sau đó. Đã giới thiệu cho cả team trong công ty cùng dùng.',
    metric: '+5.500 page likes',
    platform: 'Facebook',
  },
]

export default function TestimonialsSection() {
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
          position: 'absolute', top: 0, left: '25%',
          width: { xs: 200, md: 300, xl: 380 }, height: { xs: 200, md: 300, xl: 380 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(139,92,246,0.15) 100%)',
          filter: 'blur(80px)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: 0, right: '20%',
          width: { xs: 180, md: 260, xl: 320 }, height: { xs: 180, md: 260, xl: 320 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.1) 50%, rgba(6,182,212,0.15) 100%)',
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
              Khách Hàng Nói Gì
            </Typography>
          </Box>

          <Typography variant="h2" sx={{
            mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem', lg: '1.875rem' }, fontWeight: 700,
            background: 'linear-gradient(135deg, #0891B2, #2563EB, #7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Hơn 120.000 Người Tin Tưởng Chúng Tôi
          </Typography>

          <Typography sx={{ color: '#475569', fontSize: { xs: '0.875rem', md: '1rem' }, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
            Phản hồi thực từ những khách hàng đã và đang sử dụng dịch vụ
          </Typography>
        </Box>

        {/* Cards */}
        <Grid container spacing={{ xs: 2, md: 3, xl: 4 }} alignItems="stretch">
          {testimonials.map((t) => (
            <Grid key={t.name} size={{ xs: 12, md: 4 }}>
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
                  display: 'flex', flexDirection: 'column', gap: 2,
                  transition: 'box-shadow 0.3s, border-color 0.3s, transform 0.3s',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(6,182,212,0.1)',
                    borderColor: 'rgba(6,182,212,0.3)',
                    transform: 'translateY(-2px)',
                    '& .t-glow': { opacity: 0.15 },
                    '& .t-corner': { opacity: 0.2 },
                  },
                }}
              >
                {/* Hover glow */}
                <Box className="t-glow" sx={{
                  position: 'absolute', inset: -4,
                  background: t.hoverGlow,
                  borderRadius: 3, filter: 'blur(20px)',
                  opacity: 0, transition: 'opacity 0.5s',
                  pointerEvents: 'none', zIndex: 0,
                }} />
                {/* Corner glow */}
                <Box className="t-corner" sx={{
                  position: 'absolute', bottom: -32, right: -32,
                  width: 96, height: 96,
                  background: t.hoverGlow,
                  borderRadius: '50%', filter: 'blur(20px)',
                  opacity: 0, transition: 'opacity 0.5s',
                  pointerEvents: 'none',
                }} />

                {/* Quote icon */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <FormatQuoteIcon sx={{ fontSize: 36, color: '#CBD5E1' }} />
                </Box>

                {/* Stars */}
                <Rating value={t.rating} readOnly size="small" sx={{ position: 'relative', zIndex: 1 }} />

                {/* Content */}
                <Typography sx={{
                  position: 'relative', zIndex: 1,
                  flexGrow: 1, lineHeight: 1.8,
                  fontSize: { xs: '0.6875rem', md: '0.75rem' },
                  color: '#475569',
                }}>
                  {t.content}
                </Typography>

                {/* Metric badge */}
                <Box sx={{
                  position: 'relative', zIndex: 1,
                  display: 'inline-flex', alignSelf: 'flex-start',
                  px: 1.5, py: 0.5, borderRadius: 99,
                  background: t.gradient,
                }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                    {t.metric}
                  </Typography>
                </Box>

                {/* Author */}
                <Box sx={{
                  position: 'relative', zIndex: 1,
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  pt: 2, borderTop: '1px solid rgba(241,245,249,0.8)',
                }}>
                  <Avatar sx={{
                    background: t.gradient,
                    width: 44, height: 44,
                    fontSize: '0.875rem', fontWeight: 700,
                  }}>
                    {t.initials}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E293B' }}>
                      {t.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {t.role}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto', flexShrink: 0 }}>
                    <Typography sx={{
                      px: 1, py: 0.25, borderRadius: 1,
                      fontSize: '0.6875rem', fontWeight: 500,
                      backgroundColor: 'rgba(248,250,252,0.8)',
                      border: '1px solid rgba(226,232,240,0.5)',
                      color: '#64748B',
                    }}>
                      {t.platform}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
