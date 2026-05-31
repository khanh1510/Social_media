import type { Metadata } from 'next'
import NextLink from 'next/link'
import { Box, Container, Card, CardContent, Typography, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'

export const metadata: Metadata = {
  title: 'Blog | SocialBoost VN',
  description: 'Kiến thức và mẹo tăng tương tác mạng xã hội hiệu quả',
}

const posts = [
  { slug: 'cach-tang-follow-instagram', title: 'Cách tăng follow Instagram tự nhiên và an toàn năm 2024', excerpt: 'Hướng dẫn chi tiết các chiến lược tăng follow Instagram hiệu quả mà không vi phạm chính sách.', date: '15/11/2024', category: 'Instagram' },
  { slug: 'tiktok-for-you-page', title: 'Bí kíp lên For You Page TikTok nhanh nhất', excerpt: 'Khám phá các yếu tố quyết định video có lên FYP hay không và cách tối ưu nội dung.', date: '10/11/2024', category: 'TikTok' },
  { slug: 'youtube-4000-gio-xem', title: 'Cách đạt 4000 giờ xem YouTube để mở kiếm tiền', excerpt: 'Chiến lược thực tế giúp kênh YouTube của bạn đạt mốc 4.000 giờ xem trong thời gian ngắn nhất.', date: '05/11/2024', category: 'YouTube' },
  { slug: 'facebook-fanpage-organic', title: 'Tăng tương tác Facebook Fanpage mà không tốn tiền quảng cáo', excerpt: 'Các kỹ thuật content marketing giúp tăng reach organic cho fanpage Facebook.', date: '01/11/2024', category: 'Facebook' },
  { slug: 'seeding-la-gi', title: 'Seeding là gì? Tại sao doanh nghiệp cần seeding?', excerpt: 'Giải thích khái niệm seeding mạng xã hội và lợi ích thực tế cho doanh nghiệp vừa và nhỏ.', date: '25/10/2024', category: 'Kiến thức' },
  { slug: 'chon-goi-dich-vu-seeding', title: 'Hướng dẫn chọn gói dịch vụ seeding phù hợp', excerpt: 'So sánh các loại gói dịch vụ và cách chọn gói phù hợp với mục tiêu và ngân sách của bạn.', date: '20/10/2024', category: 'Hướng dẫn' },
]

export default function BlogPage() {
  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '70vh', py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="h1" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>Blog</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Kiến thức và mẹo tăng tương tác mạng xã hội hiệu quả
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid key={post.slug} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: 160, bgcolor: '#E8F0FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>{post.category}</Typography>
                </Box>
                <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip label={post.category} size="small" color="primary" sx={{ alignSelf: 'flex-start' }} />
                  <NextLink href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <Typography variant="h4" sx={{ lineHeight: 1.5, '&:hover': { color: 'primary.main' } }}>
                      {post.title}
                    </Typography>
                  </NextLink>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>{post.excerpt}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>{post.date}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
