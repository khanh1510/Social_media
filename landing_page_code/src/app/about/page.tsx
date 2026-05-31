import type { Metadata } from 'next'
import { Box, Container, Typography, Paper } from '@mui/material'
import Grid from '@mui/material/Grid2'
import StatsBar from '@/components/home/StatsBar'
import CtaBanner from '@/components/home/CtaBanner'

export const metadata: Metadata = {
  title: 'Giới thiệu | SocialBoost VN',
  description: 'Tìm hiểu về SocialBoost VN — nền tảng tăng tương tác mạng xã hội uy tín hàng đầu Việt Nam',
}

const values = [
  { title: 'Uy tín', description: 'Hoạt động minh bạch, cam kết bảo hành và hoàn tiền rõ ràng, không điều khoản ẩn' },
  { title: 'Chất lượng', description: 'Chỉ cung cấp tương tác từ tài khoản thực, không bot, không ảnh hưởng đến tài khoản' },
  { title: 'Tốc độ', description: 'Xử lý đơn hàng nhanh nhất thị trường, nhiều gói hoàn thành trong vòng 1 giờ' },
  { title: 'Hỗ trợ', description: 'Đội ngũ chăm sóc khách hàng 24/7 qua Zalo, Live Chat và Email' },
]

export default function AboutPage() {
  return (
    <>
      <Box sx={{ backgroundColor: '#E8F0FE', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h1" sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Về SocialBoost VN
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560, mx: 'auto' }}>
            Thành lập năm 2020, SocialBoost VN là nền tảng cung cấp dịch vụ tăng tương tác mạng xã hội
            uy tín hàng đầu Việt Nam, phục vụ hơn 120.000 khách hàng cá nhân và doanh nghiệp trên cả nước.
          </Typography>
        </Container>
      </Box>

      <StatsBar />

      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ mb: 1.5 }}>Giá trị cốt lõi</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Những cam kết chúng tôi giữ với từng khách hàng
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {values.map((v) => (
              <Grid key={v.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                  <Typography variant="h3" sx={{ color: 'primary.main', mb: 1 }}>{v.title}</Typography>
                  <Typography variant="body2">{v.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <CtaBanner />
    </>
  )
}
