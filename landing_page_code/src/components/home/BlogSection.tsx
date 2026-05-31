'use client'
import NextLink from 'next/link'
import { Box, Container, Typography, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const posts = [
  {
    title: 'Cách Tăng Followers Instagram Nhanh Chóng Và Bền Vững Năm 2025',
    excerpt: 'Khám phá những chiến lược tăng followers Instagram hiệu quả nhất, từ tối ưu profile, content strategy đến sử dụng dịch vụ seeding chuyên nghiệp.',
    date: '20 Tháng 5, 2025',
    readTime: '5 phút đọc',
    views: '12.4K',
    tag: 'Instagram',
    gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
    href: '/blog/tang-followers-instagram',
  },
  {
    title: 'TikTok Algorithm 2025: Bí Quyết Để Video Lên For You Page',
    excerpt: 'Tìm hiểu cách thuật toán TikTok hoạt động và những tips thực tế giúp video của bạn viral, tiếp cận hàng triệu người dùng mỗi ngày.',
    date: '15 Tháng 5, 2025',
    readTime: '7 phút đọc',
    views: '8.9K',
    tag: 'TikTok',
    gradient: 'linear-gradient(135deg, #14B8A6, #06B6D4)',
    href: '/blog/tiktok-algorithm-2025',
  },
  {
    title: 'SMM Panel Là Gì? Hướng Dẫn Sử Dụng Hiệu Quả Cho Người Mới',
    excerpt: 'Giải thích chi tiết về SMM Panel, cách hoạt động, lợi ích và hướng dẫn đặt hàng lần đầu dành cho những ai mới bắt đầu với dịch vụ tăng tương tác.',
    date: '10 Tháng 5, 2025',
    readTime: '6 phút đọc',
    views: '15.2K',
    tag: 'Hướng Dẫn',
    gradient: 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
    href: '/blog/smm-panel-la-gi',
  },
]

export default function BlogSection() {
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
          position: 'absolute', top: 0, left: '20%',
          width: { xs: 200, md: 300, xl: 380 }, height: { xs: 200, md: 300, xl: 380 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.1) 50%, transparent 100%)',
          filter: 'blur(80px)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: 0, right: '15%',
          width: { xs: 180, md: 260, xl: 320 }, height: { xs: 180, md: 260, xl: 320 },
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
              Blog & Kiến Thức
            </Typography>
          </Box>

          <Typography variant="h2" sx={{
            mb: 2, fontSize: { xs: '1.25rem', md: '1.5rem', lg: '1.875rem' }, fontWeight: 700,
            background: 'linear-gradient(135deg, #0891B2, #2563EB, #7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Bài Viết Mới Nhất
          </Typography>

          <Typography sx={{ color: '#475569', fontSize: { xs: '0.875rem', md: '1rem' }, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}>
            Cập nhật kiến thức, chiến lược và xu hướng mới nhất về social media marketing
          </Typography>
        </Box>

        {/* Blog cards */}
        <Grid container spacing={{ xs: 2, md: 3, xl: 4 }} sx={{ mb: { xs: 5, md: 6 } }}>
          {posts.map((post) => (
            <Grid key={post.href} size={{ xs: 12, md: 4 }}>
              <Box
                component={NextLink}
                href={post.href}
                sx={{
                  display: 'flex', flexDirection: 'column',
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(226,232,240,0.5)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  transition: 'box-shadow 0.3s, transform 0.3s, border-color 0.3s',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(6,182,212,0.1)',
                    borderColor: 'rgba(6,182,212,0.3)',
                    transform: 'translateY(-2px)',
                    '& .blog-arrow': { transform: 'translateX(4px)' },
                  },
                }}
              >
                {/* Image placeholder */}
                <Box sx={{
                  position: 'relative',
                  height: { xs: 160, md: 180 },
                  background: post.gradient,
                  flexShrink: 0,
                  overflow: 'hidden',
                }}>
                  {/* Decorative pattern */}
                  <Box sx={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  }} />
                  <Box sx={{
                    position: 'absolute', bottom: -20, right: -20,
                    width: 100, height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                  }} />
                  <Box sx={{
                    position: 'absolute', top: -10, left: -10,
                    width: 60, height: 60,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                  }} />

                  {/* Tag */}
                  <Box sx={{
                    position: 'absolute', top: 12, left: 12,
                    px: 1.5, py: 0.5, borderRadius: 99,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}>
                    <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#fff' }}>
                      {post.tag}
                    </Typography>
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ p: { xs: 2.5, md: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {/* Meta */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                      <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{post.date}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                      <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{post.readTime}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                      <VisibilityIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                      <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{post.views}</Typography>
                    </Box>
                  </Box>

                  {/* Title */}
                  <Typography sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.9375rem', md: '1rem' },
                    color: '#1E293B',
                    lineHeight: 1.4,
                    flexGrow: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {post.title}
                  </Typography>

                  {/* Excerpt */}
                  <Typography sx={{
                    fontSize: { xs: '0.75rem', md: '0.8125rem' },
                    color: '#64748B',
                    lineHeight: 1.7,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {post.excerpt}
                  </Typography>

                  {/* Read more */}
                  <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 0.5,
                    pt: 1.5, borderTop: '1px solid rgba(226,232,240,0.6)',
                    mt: 'auto',
                  }}>
                    <Typography sx={{
                      fontSize: '0.8125rem', fontWeight: 600,
                      background: post.gradient,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                      Đọc thêm
                    </Typography>
                    <ArrowForwardIcon
                      className="blog-arrow"
                      sx={{
                        fontSize: 14,
                        background: post.gradient,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        transition: 'transform 0.3s',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            component={NextLink}
            href="/blog"
            variant="outlined"
            endIcon={<ArrowForwardIcon sx={{ fontSize: '0.875rem !important' }} />}
            sx={{
              fontSize: { xs: '0.8125rem', md: '0.9375rem' },
              px: { xs: 3, md: 4 }, py: { xs: 1.25, md: 1.5 },
              borderRadius: 2,
              borderColor: 'rgba(6,182,212,0.4)',
              color: '#374151',
              backgroundColor: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'rgba(6,182,212,0.7)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 20px rgba(6,182,212,0.1)',
              },
              transition: 'all 0.2s',
            }}
          >
            Xem Tất Cả Bài Viết
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
