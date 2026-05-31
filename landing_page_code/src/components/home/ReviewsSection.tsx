'use client'
import { Box, Container, Typography, Avatar, Rating } from '@mui/material'
import Grid from '@mui/material/Grid2'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import StarIcon from '@mui/icons-material/Star'
import PeopleIcon from '@mui/icons-material/People'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

const reviews = [
  {
    name: 'Phạm Quỳnh Anh',
    role: 'Fashion Influencer · 150K followers',
    initials: 'QA',
    rating: 5,
    gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
    hoverGlow: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
    content: 'SocialBoost VN thực sự thay đổi cách tôi phát triển trang cá nhân. Chỉ trong 2 tuần, Instagram của tôi tăng hơn 20K followers hoàn toàn tự nhiên. Dịch vụ rất chuyên nghiệp và support phản hồi cực nhanh.',
    metric: '+20K followers',
    platform: 'Instagram',
  },
  {
    name: 'Nguyễn Đức Minh',
    role: 'YouTube Creator · 500K subscribers',
    initials: 'DM',
    rating: 5,
    gradient: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    hoverGlow: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    content: 'Kênh YouTube của mình bùng nổ sau khi dùng dịch vụ tăng views. Video đạt 1 triệu views trong 3 ngày, thuật toán YouTube đẩy mạnh hơn rất nhiều. Đã dùng nhiều dịch vụ khác nhưng đây là tốt nhất.',
    metric: '+1M views',
    platform: 'YouTube',
  },
  {
    name: 'Trần Thị Bích Ngọc',
    role: 'Chủ thương hiệu mỹ phẩm',
    initials: 'BN',
    rating: 5,
    gradient: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
    hoverGlow: 'linear-gradient(135deg, #06B6D4, #8B5CF6)',
    content: 'Fanpage của shop tôi từ 2.000 lên 30.000 likes trong 1 tháng. Doanh số tăng 300% sau đó. Đội ngũ tư vấn rất nhiệt tình, giúp tôi chọn gói phù hợp với ngân sách và mục tiêu.',
    metric: '+28K page likes',
    platform: 'Facebook',
  },
]

const stats = [
  { Icon: StarIcon, value: '4.9/5', label: 'Đánh Giá Trung Bình' },
  { Icon: PeopleIcon, value: '45K+', label: 'Khách Hàng Hài Lòng' },
  { Icon: TrendingUpIcon, value: '1.2M+', label: 'Đơn Hoàn Thành' },
  { Icon: EmojiEventsIcon, value: '99%', label: 'Tỷ Lệ Thành Công' },
]

export default function ReviewsSection() {
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
          position: 'absolute', top: '10%', right: '10%',
          width: { xs: 200, md: 280, xl: 360 }, height: { xs: 200, md: 280, xl: 360 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 50%, transparent 100%)',
          filter: 'blur(80px)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: '10%', left: '10%',
          width: { xs: 180, md: 240, xl: 320 }, height: { xs: 180, md: 240, xl: 320 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.1) 50%, transparent 100%)',
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
              Đánh Giá Thực
            </Typography>
          </Box>

          <Typography variant="h2" sx={{
            mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem', lg: '1.875rem' }, fontWeight: 700,
            background: 'linear-gradient(135deg, #0891B2, #2563EB, #7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Khách Hàng Chia Sẻ Trải Nghiệm
          </Typography>

          <Typography sx={{ color: '#475569', fontSize: { xs: '0.875rem', md: '1rem' }, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
            Hàng nghìn khách hàng đã tin tưởng và đạt kết quả thực sự với SocialBoost VN
          </Typography>
        </Box>

        {/* Review cards */}
        <Grid container spacing={{ xs: 2, md: 3, xl: 4 }} alignItems="stretch" sx={{ mb: { xs: 5, md: 6 } }}>
          {reviews.map((r) => (
            <Grid key={r.name} size={{ xs: 12, md: 4 }}>
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
                    '& .r-glow': { opacity: 0.15 },
                    '& .r-corner': { opacity: 0.2 },
                  },
                }}
              >
                {/* Hover glow */}
                <Box className="r-glow" sx={{
                  position: 'absolute', inset: -4,
                  background: r.hoverGlow,
                  borderRadius: 3, filter: 'blur(20px)',
                  opacity: 0, transition: 'opacity 0.5s',
                  pointerEvents: 'none', zIndex: 0,
                }} />
                {/* Corner glow */}
                <Box className="r-corner" sx={{
                  position: 'absolute', bottom: -32, right: -32,
                  width: 96, height: 96,
                  background: r.hoverGlow,
                  borderRadius: '50%', filter: 'blur(20px)',
                  opacity: 0, transition: 'opacity 0.5s',
                  pointerEvents: 'none',
                }} />

                {/* Quote icon */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <FormatQuoteIcon sx={{ fontSize: 36, color: '#CBD5E1' }} />
                </Box>

                {/* Stars */}
                <Rating value={r.rating} readOnly size="small" sx={{ position: 'relative', zIndex: 1 }} />

                {/* Content */}
                <Typography sx={{
                  position: 'relative', zIndex: 1,
                  flexGrow: 1, lineHeight: 1.8,
                  fontSize: { xs: '0.6875rem', md: '0.75rem' },
                  color: '#475569',
                }}>
                  {r.content}
                </Typography>

                {/* Metric badge */}
                <Box sx={{
                  position: 'relative', zIndex: 1,
                  display: 'inline-flex', alignSelf: 'flex-start',
                  px: 1.5, py: 0.5, borderRadius: 99,
                  background: r.gradient,
                }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                    {r.metric}
                  </Typography>
                </Box>

                {/* Author */}
                <Box sx={{
                  position: 'relative', zIndex: 1,
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  pt: 2, borderTop: '1px solid rgba(241,245,249,0.8)',
                }}>
                  <Avatar sx={{
                    background: r.gradient,
                    width: 44, height: 44,
                    fontSize: '0.875rem', fontWeight: 700,
                  }}>
                    {r.initials}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E293B' }}>
                      {r.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {r.role}
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
                      {r.platform}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Stats row */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: { xs: 2, md: 3 },
          maxWidth: 768, mx: 'auto',
        }}>
          {stats.map((s) => (
            <Box key={s.label} sx={{ position: 'relative' }}>
              {/* Hover glow overlay */}
              <Box sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                borderRadius: 2, filter: 'blur(16px)',
                opacity: 0, transition: 'opacity 0.3s',
                pointerEvents: 'none',
                '.stat-card:hover ~ &, &': { opacity: 0 },
              }} />
              <Box
                className="stat-card"
                sx={{
                  position: 'relative',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  p: { xs: 2, md: 2.5, xl: 3 },
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(226,232,240,0.5)',
                  gap: { xs: 1, md: 1.5 },
                  transition: 'border-color 0.3s, transform 0.3s',
                  '&:hover': {
                    borderColor: 'rgba(6,182,212,0.3)',
                    transform: 'translateY(-2px)',
                    '& + .stat-glow': { opacity: 1 },
                  },
                }}
              >
                {/* Icon box */}
                <Box sx={{
                  width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 },
                  borderRadius: { xs: '8px', md: '12px' },
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.Icon sx={{ fontSize: { xs: 20, md: 24 }, color: '#0891B2' }} />
                </Box>

                {/* Value */}
                <Typography sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem', xl: '1.5rem' },
                  fontWeight: 800, lineHeight: 1.1,
                  background: 'linear-gradient(135deg, #0891B2, #2563EB, #7C3AED)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {s.value}
                </Typography>

                {/* Label */}
                <Typography sx={{ fontSize: { xs: '0.6875rem', md: '0.8125rem' }, color: '#64748B' }}>
                  {s.label}
                </Typography>
              </Box>
              <Box className="stat-glow" sx={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
                borderRadius: 2, filter: 'blur(16px)',
                opacity: 0, transition: 'opacity 0.3s',
                pointerEvents: 'none', zIndex: -1,
              }} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
