'use client'
import { useState } from 'react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import {
  AppBar, Toolbar, Box, Button, IconButton, Drawer,
  List, ListItem, ListItemButton, ListItemText,
  Container, Divider, Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import BoltIcon from '@mui/icons-material/Bolt'
import { gradientBg } from '@/lib/theme'

const navLinks = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Dịch vụ', href: '/services' },
  { label: 'Giới thiệu', href: '/about' },
  { label: 'Bài viết', href: '/blog' },
  { label: 'Điều khoản', href: '/terms' },
  { label: 'Liên hệ', href: '/contact' },
]

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()

  return (
    <AppBar position="sticky" component="header">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 64, position: 'relative' }}>

          {/* Logo — sát lề trái */}
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              textDecoration: 'none', flexGrow: { xs: 1, md: 0 },
              ml: { md: -10 },
            }}
          >
            <Box
              sx={{
                width: 32, height: 32, borderRadius: '8px',
                background: gradientBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <BoltIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: '1.0625rem',
                background: gradientBg,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SocialBoost VN
            </Typography>
          </Box>

          {/* Desktop nav — căn giữa tuyệt đối */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5,
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Button
                  key={link.href}
                  component={NextLink}
                  href={link.href}
                  sx={{
                    color: isActive ? '#0F172A' : '#475569',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9375rem',
                    px: 1.5,
                    position: 'relative',
                    backgroundColor: 'transparent',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 6,
                      left: '50%',
                      transform: isActive ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                      transformOrigin: 'center',
                      width: 'calc(100% - 24px)',
                      height: '2px',
                      borderRadius: '2px',
                      background: gradientBg,
                      transition: 'transform 0.25s ease',
                    },
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#0F172A',
                      '&::after': { transform: 'translateX(-50%) scaleX(1)' },
                    },
                  }}
                >
                  {link.label}
                </Button>
              )
            })}
          </Box>

          {/* Auth buttons — desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center', ml: 'auto' }}>
            <Button
              component={NextLink}
              href="/auth/login"
              variant="text"
              size="small"
              sx={{ color: '#475569', fontWeight: 500 }}
            >
              Đăng nhập
            </Button>
            <Button
              component={NextLink}
              href="/auth/register"
              variant="contained"
              size="small"
              sx={{ borderRadius: 99, px: 2.5 }}
            >
              Đăng ký
            </Button>
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' } }}
            onClick={() => setDrawerOpen(true)}
            edge="end"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', background: gradientBg, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              SocialBoost VN
            </Typography>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <Divider />
          <List dense sx={{ py: 1 }}>
            {navLinks.map((link) => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  component={NextLink}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  sx={{ py: 1.25, px: 2.5 }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9375rem' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              component={NextLink}
              href="/auth/login"
              variant="outlined"
              fullWidth
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 99 }}
            >
              Đăng nhập
            </Button>
            <Button
              component={NextLink}
              href="/auth/register"
              variant="contained"
              fullWidth
              onClick={() => setDrawerOpen(false)}
              sx={{ borderRadius: 99 }}
            >
              Đăng ký
            </Button>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  )
}
