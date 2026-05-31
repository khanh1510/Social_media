'use client'
import NextLink from 'next/link'
import { Box, Container, Typography, Card, CardContent, Button, Chip } from '@mui/material'
import Grid from '@mui/material/Grid2'
import InstagramIcon from '@mui/icons-material/Instagram'
import YouTubeIcon from '@mui/icons-material/YouTube'
import FacebookIcon from '@mui/icons-material/Facebook'

const platforms = [
  {
    slug: 'instagram',
    name: 'Instagram',
    icon: <InstagramIcon sx={{ fontSize: 40 }} />,
    color: '#E1306C',
    bg: '#FFF0F5',
    services: ['Tăng followers', 'Tăng likes', 'Tăng views Story', 'Tăng comments'],
    startPrice: '15.000đ',
  },
  {
    slug: 'tiktok',
    name: 'TikTok',
    icon: <Box component="span" sx={{ fontSize: 36, fontWeight: 900, fontFamily: 'monospace', lineHeight: 1 }}>TK</Box>,
    color: '#010101',
    bg: '#F5F5F5',
    services: ['Tăng followers', 'Tăng likes', 'Tăng views', 'Tăng shares'],
    startPrice: '10.000đ',
  },
  {
    slug: 'youtube',
    name: 'YouTube',
    icon: <YouTubeIcon sx={{ fontSize: 40 }} />,
    color: '#FF0000',
    bg: '#FFF5F5',
    services: ['Tăng subscribers', 'Tăng views', 'Tăng watch time', 'Tăng likes'],
    startPrice: '20.000đ',
  },
  {
    slug: 'facebook',
    name: 'Facebook',
    icon: <FacebookIcon sx={{ fontSize: 40 }} />,
    color: '#1877F2',
    bg: '#F0F6FF',
    services: ['Tăng likes Fanpage', 'Tăng followers', 'Tăng tương tác bài viết', 'Seeding'],
    startPrice: '12.000đ',
  },
]

export default function ServicesPage() {
  return (
    <>
      <Box sx={{ backgroundColor: '#E8F0FE', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Dịch vụ của chúng tôi
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto' }}>
            Giải pháp tăng tương tác toàn diện cho 4 nền tảng mạng xã hội lớn nhất,
            giá rẻ nhất thị trường, bảo hành rõ ràng.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {platforms.map((p) => (
              <Grid key={p.slug} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ backgroundColor: p.bg, py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ color: p.color }}>{p.icon}</Box>
                    <Typography variant="h3" sx={{ color: p.color }}>{p.name}</Typography>
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                      {p.services.map((s) => (
                        <Chip key={s} label={s} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>Giá từ</Typography>
                      <Typography variant="h4" sx={{ color: 'primary.main' }}>{p.startPrice}</Typography>
                    </Box>
                    <Button
                      component={NextLink}
                      href={`/services/${p.slug}`}
                      variant="contained"
                      fullWidth
                    >
                      Xem gói dịch vụ
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  )
}
