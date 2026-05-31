import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import { theme } from '@/lib/theme'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'SocialBoost VN — Tăng Tương Tác Mạng Xã Hội Giá Rẻ',
  description:
    'Dịch vụ tăng follow, like, view cho Instagram, TikTok, YouTube, Facebook. Giao hàng nhanh, giá tốt nhất Việt Nam, bảo hành 30 ngày.',
  keywords: 'tăng follow, mua follow, tăng like, seeding, social media boost, instagram, tiktok, youtube, facebook',
  openGraph: {
    title: 'SocialBoost VN — Tăng Tương Tác Mạng Xã Hội',
    description: 'Dịch vụ tăng follow, like, view cho các mạng xã hội phổ biến tại Việt Nam',
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Box component="main" sx={{ minHeight: '100vh' }}>
              {children}
            </Box>
            <Footer />
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
