'use client'
import NextLink from 'next/link'
import { Box, Container, Typography, Link, Divider } from '@mui/material'
import Grid from '@mui/material/Grid2'

const serviceLinks = [
  { label: 'Instagram', href: '/services/instagram' },
  { label: 'TikTok', href: '/services/tiktok' },
  { label: 'YouTube', href: '/services/youtube' },
  { label: 'Facebook', href: '/services/facebook' },
]

const supportLinks = [
  { label: 'FAQ', href: '/faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Điều khoản sử dụng', href: '/terms' },
  { label: 'Chính sách bảo mật', href: '/privacy' },
]

const contactLinks = [
  { label: 'support@socialboost.vn', href: 'mailto:support@socialboost.vn' },
  { label: '1800 1234 (miễn phí)', href: 'tel:18001234' },
  { label: 'Zalo: 0909 123 456', href: '#' },
]

const footerLinkSx = {
  color: '#BDC1C6',
  textDecoration: 'none',
  fontSize: '0.875rem',
  lineHeight: 2,
  display: 'block',
  '&:hover': { color: '#8AB4F8' },
}

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: '#202124', color: '#BDC1C6', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" sx={{ color: '#E8EAED', fontWeight: 700, mb: 1.5 }}>
              SocialBoost VN
            </Typography>
            <Typography variant="body2" sx={{ color: '#BDC1C6', lineHeight: 1.7, maxWidth: 220 }}>
              Nền tảng tăng tương tác mạng xã hội uy tín hàng đầu Việt Nam. Giao hàng nhanh, bảo hành 30 ngày.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" sx={{ color: '#E8EAED', fontWeight: 600, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
              Dịch vụ
            </Typography>
            {serviceLinks.map((l) => (
              <Link key={l.href} component={NextLink} href={l.href} sx={footerLinkSx}>{l.label}</Link>
            ))}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" sx={{ color: '#E8EAED', fontWeight: 600, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
              Hỗ trợ
            </Typography>
            {supportLinks.map((l) => (
              <Link key={l.href} component={NextLink} href={l.href} sx={footerLinkSx}>{l.label}</Link>
            ))}
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="body2" sx={{ color: '#E8EAED', fontWeight: 600, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem' }}>
              Liên hệ
            </Typography>
            {contactLinks.map((l) => (
              <Link key={l.label} href={l.href} sx={footerLinkSx}>{l.label}</Link>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#3C4043', my: 4 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#9AA0A6', fontSize: '0.8125rem' }}>
            © 2024 SocialBoost VN. Bảo lưu mọi quyền.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {['Visa', 'MasterCard', 'Momo', 'ZaloPay', 'VNPay'].map((p) => (
              <Box
                key={p}
                sx={{ px: 1.5, py: 0.5, border: '1px solid #3C4043', borderRadius: 1, fontSize: '0.75rem', color: '#9AA0A6' }}
              >
                {p}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
