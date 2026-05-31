'use client'
import NextLink from 'next/link'
import { Box, Container, Paper, Typography, TextField, Button, Link, Divider, Checkbox, FormControlLabel } from '@mui/material'

export default function RegisterPage() {
  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 0.5 }}>SocialBoost VN</Typography>
            <Typography variant="h3">Tạo tài khoản</Typography>
          </Box>

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Họ và tên" fullWidth required size="small" autoComplete="name" />
            <TextField label="Email" type="email" fullWidth required size="small" autoComplete="email" />
            <TextField label="Số điện thoại" fullWidth size="small" autoComplete="tel" />
            <TextField label="Mật khẩu" type="password" fullWidth required size="small" autoComplete="new-password" />
            <TextField label="Xác nhận mật khẩu" type="password" fullWidth required size="small" autoComplete="new-password" />

            <FormControlLabel
              control={<Checkbox size="small" required />}
              label={
                <Typography variant="body2">
                  Tôi đồng ý với{' '}
                  <Link component={NextLink} href="/terms" underline="hover">Điều khoản sử dụng</Link>
                  {' '}và{' '}
                  <Link component={NextLink} href="/privacy" underline="hover">Chính sách bảo mật</Link>
                </Typography>
              }
            />

            <Button type="submit" variant="contained" size="large" fullWidth>
              Tạo tài khoản
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>hoặc</Typography>
          </Divider>

          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Đã có tài khoản?{' '}
            <Link component={NextLink} href="/auth/login" underline="hover" fontWeight={500}>
              Đăng nhập
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
