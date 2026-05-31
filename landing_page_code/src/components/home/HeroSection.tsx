'use client'
import NextLink from 'next/link'
import { Box, Container, Typography, Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import StarIcon from '@mui/icons-material/Star'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import BoltIcon from '@mui/icons-material/Bolt'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { gradientBg } from '@/lib/theme'

const statCards = [
  {
    icon: <TrendingUpIcon sx={{ fontSize: 20 }} />,
    iconBg: 'linear-gradient(135deg,#3B82F6,#1D4ED8)',
    value: '4,877,795+',
    label: 'Đơn Thành Công',
    top: '10%', left: '-8%',
    delay: '0.2s',
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 20 }} />,
    iconBg: 'linear-gradient(135deg,#0891B2,#0E7490)',
    value: '120,000+',
    label: 'Người Dùng',
    top: '42%', right: '-10%',
    delay: '0.4s',
  },
  {
    icon: <BoltIcon sx={{ fontSize: 20 }} />,
    iconBg: 'linear-gradient(135deg,#0EA5E9,#0284C7)',
    value: '99%',
    label: 'Tỷ Lệ Thành Công',
    bottom: '22%', left: '-6%',
    delay: '0.6s',
  },
]

const marqueeItems = [
  { label: 'Instagram', color: '#E1306C' },
  { label: 'TikTok', color: '#010101' },
  { label: 'YouTube', color: '#FF0000' },
  { label: 'Facebook', color: '#1877F2' },
  { label: 'Twitter / X', color: '#000000' },
  { label: 'Telegram', color: '#229ED9' },
  { label: 'Spotify', color: '#1ED760' },
  { label: 'Threads', color: '#000000' },
  { label: 'Discord', color: '#5865F2' },
  { label: 'LinkedIn', color: '#0A66C2' },
  { label: 'Twitch', color: '#5A3E85' },
  { label: 'SoundCloud', color: '#F04923' },
]

export default function HeroSection() {
  return (
    <Box component="section" sx={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, #F0F4FF 70%, #FFFFFF)', pb: { xs: 4, md: 6 } }}>

      {/* Background */}
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* dot grid */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.5,
        }} />
        {/* orb 1 */}
        <Box sx={{
          position: 'absolute', top: '-120px', left: '-120px',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8,145,178,0.18) 0%, transparent 70%)',
        }} />
        {/* orb 2 */}
        <Box sx={{
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: 420, height: 420, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, transparent 70%)',
        }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', pt: { xs: 8, md: 14 }, pb: { xs: 4, md: 8 } }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 6, md: 8 },
          alignItems: 'center',
        }}>

          {/* ── LEFT: content ── */}
          <Box>
            {/* Badge */}
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              px: 1.5, py: 0.5, mb: 3, borderRadius: 99,
              backgroundColor: '#DBEAFE', border: '1px solid #BFDBFE',
              animation: 'fadeInDown 0.5s ease both',
            }}>
              <Box sx={{
                width: 8, height: 8, borderRadius: '50%',
                background: gradientBg,
                boxShadow: '0 0 6px rgba(8,145,178,0.6)',
              }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E40AF', letterSpacing: '0.04em' }}>
                TOP 1 SEEDING VN
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 16, color: '#1E40AF' }} />
            </Box>

            {/* Headline */}
            <Typography
              variant="h1"
              sx={{
                mb: 1, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em',
                animation: 'fadeIn 0.6s ease both',
              }}
            >
              <Box component="span" sx={{ display: 'block', fontSize: '0.5em', fontWeight: 700, color: '#0891B2', mb: 0.5 }}>
                SocialBoost VN
              </Box>
              Tăng Tương Tác{' '}
              <Box component="span" sx={{ position: 'relative', display: 'inline-block' }}>
                <Box component="span" sx={{
                  background: gradientBg,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Mạng Xã Hội
                </Box>
                <Box
                  component="svg"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  sx={{
                    position: 'absolute', bottom: -4, left: 0,
                    width: '100%', height: 10,
                    color: '#0891B2', overflow: 'visible',
                  }}
                >
                  <path d="M2,8 Q60,2 100,6 T198,5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </Box>
              </Box>
              {' '}Nhanh &amp; Giá Tốt Nhất
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary', mb: 4, mt: 2,
                fontSize: '1rem', lineHeight: 1.75, maxWidth: 480,
                animation: 'fadeInUp 0.6s ease 0.1s both',
              }}
            >
              Dịch vụ Seeding Mạng Xã Hội hàng đầu Việt Nam với hơn 10,000+ dịch vụ.
              Tăng like, comment, share, follow giá rẻ nhất, giao tức thì,
              bảo hành refill trọn đời.
            </Typography>

            {/* CTA */}
            <Box sx={{
              display: 'flex', gap: 1.5, flexWrap: 'wrap',
              animation: 'fadeInUp 0.6s ease 0.2s both',
            }}>
              <Button
                component={NextLink}
                href="/auth/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 3.5, py: 1.5, borderRadius: 99, fontSize: '0.9375rem' }}
              >
                Dùng Thử Ngay
              </Button>
              <Button
                component={NextLink}
                href="/auth/login"
                variant="outlined"
                size="large"
                startIcon={<PlayArrowIcon sx={{ fontSize: '0.875rem !important' }} />}
                sx={{ px: 3.5, py: 1.5, borderRadius: 99, fontSize: '0.9375rem' }}
              >
                Xem Hướng Dẫn
              </Button>
            </Box>

            {/* Trust bar */}
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'nowrap',
              mt: 4, animation: 'fadeInUp 0.6s ease 0.3s both',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: '#16A34A' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                  <strong>2,018+</strong> Khách Hàng Tin Dùng
                </Typography>
              </Box>
              <Box sx={{ width: 1, height: 16, bgcolor: '#CBD5E1' }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <StarIcon sx={{ fontSize: 16, color: '#D97706' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                  <strong>4.9/5</strong> Đánh Giá
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* ── RIGHT: visual card ── */}
          <Box sx={{
            position: 'relative',
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 420,
          }}>
            {/* Halo glow */}
            <Box sx={{
              position: 'absolute',
              width: 360, height: 360, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(8,145,178,0.15) 0%, transparent 70%)',
              zIndex: 0,
            }} />

            {/* Main card placeholder */}
            <Box sx={{
              position: 'relative', zIndex: 1,
              width: 300, height: 300, borderRadius: 4,
              background: 'linear-gradient(135deg, #DBEAFE 0%, #EDE9FE 100%)',
              border: '1px solid #E2E8F0',
              boxShadow: '0 24px 64px rgba(8,145,178,0.15)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 2,
            }}>
              <Box sx={{
                width: 64, height: 64, borderRadius: 3,
                background: gradientBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BoltIcon sx={{ fontSize: 36, color: '#fff' }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#0F172A' }}>
                SocialBoost VN
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', px: 3 }}>
                Nền tảng tăng tương tác<br />mạng xã hội #1 Việt Nam
              </Typography>
            </Box>

            {/* Floating stat cards */}
            {statCards.map((card) => (
              <Box
                key={card.label}
                sx={{
                  position: 'absolute',
                  ...( card.top    ? { top:    card.top    } : {}),
                  ...( card.bottom ? { bottom: card.bottom } : {}),
                  ...( card.left   ? { left:   card.left   } : {}),
                  ...( card.right  ? { right:  card.right  } : {}),
                  display: 'flex', alignItems: 'center', gap: 1.25,
                  px: 2, py: 1.25, borderRadius: 2,
                  backgroundColor: '#fff',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  zIndex: 2,
                  animation: `floatUp 0.6s ease ${card.delay} both`,
                }}
              >
                <Box sx={{
                  width: 36, height: 36, borderRadius: 1.5, flexShrink: 0,
                  background: card.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff',
                }}>
                  {card.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.9375rem', lineHeight: 1.2, color: '#0F172A' }}>
                    {card.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', lineHeight: 1.3 }}>
                    {card.label}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* Rating badge */}
            <Box sx={{
              position: 'absolute', bottom: '6%', right: '-4%',
              px: 2, py: 1, borderRadius: 2,
              backgroundColor: '#fff',
              border: '1px solid #E2E8F0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              zIndex: 2,
              animation: 'floatUp 0.6s ease 0.8s both',
            }}>
              <Box sx={{ display: 'flex', gap: 0.25, mb: 0.25 }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} sx={{ fontSize: 14, color: '#F59E0B' }} />
                ))}
              </Box>
              <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                50,000+ khách hàng tin tưởng
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Platform marquee */}
      <Container maxWidth="lg">
      <Box sx={{
        position: 'relative', mt: { xs: 4, md: 2 }, py: 2.5,
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}>
        <Box sx={{
          display: 'flex', gap: 4,
          width: 'max-content',
          animation: 'marquee 30s linear infinite',
          '&:hover': { animationPlayState: 'paused' },
        }}>
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <Box
              key={i}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#94A3B8' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      </Container>

      {/* Keyframes */}
      <style>{`
        @keyframes fadeIn        { from { opacity:0 }                         to { opacity:1 } }
        @keyframes fadeInDown    { from { opacity:0; transform:translateY(-16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeInUp      { from { opacity:0; transform:translateY(16px)  } to { opacity:1; transform:translateY(0) } }
        @keyframes floatUp       { from { opacity:0; transform:translateY(20px)  } to { opacity:1; transform:translateY(0) } }
        @keyframes marquee       { from { transform:translateX(0) } to { transform:translateX(-50%) } }
      `}</style>
    </Box>
  )
}
