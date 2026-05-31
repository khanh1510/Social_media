'use client'
import NextLink from 'next/link'
import { Box, Container, Paper, Typography, TextField, Button, Link, Divider } from '@mui/material'

export default function LoginPage() {
  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700, mb: 0.5 }}>SocialBoost VN</Typography>
            <Typography variant="h3">Đăng nhập</Typography>
          </Box>

          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Email" type="email" fullWidth required size="small" autoComplete="email" />
            <TextField label="Mật khẩu" type="password" fullWidth required size="small" autoComplete="current-password" />

            <Box sx={{ textAlign: 'right', mt: -1 }}>
              <Link component={NextLink} href="/auth/forgot-password" variant="body2" underline="hover">
                Quên mật khẩu?
              </Link>
            </Box>

            <Button type="submit" variant="contained" size="large" fullWidth>
              Đăng nhập
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>hoặc</Typography>
          </Divider>

          <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
            Chưa có tài khoản?{' '}
            <Link component={NextLink} href="/auth/register" underline="hover" fontWeight={500}>
              Đăng ký ngay
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
