'use client'
import NextLink from 'next/link'
import { Box, Typography, Button } from '@mui/material'
import MapPinIcon from '@mui/icons-material/PinDrop'
import GppGoodIcon from '@mui/icons-material/GppGood'
import BoltIcon from '@mui/icons-material/Bolt'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const stats = [
  { value: '10M+', label: 'Lượt đã seed', gradient: 'linear-gradient(135deg, #0EA5E9, #06B6D4)' },
  { value: '120K+', label: 'Khách hàng', gradient: 'linear-gradient(135deg, #06B6D4, #3B82F6)' },
  { value: '99.8%', label: 'Thành công', gradient: 'linear-gradient(135deg, #3B82F6, #0EA5E9)' },
]

const badges = [
  { Icon: GppGoodIcon, color: '#10B981', text: 'Tài khoản thật' },
  { Icon: BoltIcon, color: '#0EA5E9', text: 'Giao tức thì' },
  { Icon: AutoAwesomeIcon, color: '#06B6D4', text: 'Bảo hành refill' },
]

export default function VietnamMapSection() {
  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        alignItems: 'center',
        minHeight: { xs: 'auto', lg: 520 },
      }}>
        {/* Left: Vietnam map */}
        <Box sx={{
          order: { xs: 2, lg: 1 },
          position: 'relative',
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          py: { xs: 4, lg: 6 }, px: { xs: 3, sm: 5, lg: 6, xl: 8 },
        }}>
          <Box sx={{
            position: 'relative', width: '100%',
            minHeight: { xs: 300, lg: 480 },
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Background glow */}
            <Box sx={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(186,230,255,0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            {/* Map image */}
            <Box
              component="img"
              src="/vietnam-map.svg"
              alt="Bản đồ Việt Nam"
              sx={{
                position: 'relative', zIndex: 1,
                width: 'auto',
                height: { xs: 280, md: 360, lg: 440 },
                objectFit: 'contain',
                filter: 'drop-shadow(0 8px 32px rgba(14,165,233,0.15))',
              }}
            />
          </Box>
        </Box>

        {/* Right: text content */}
        <Box sx={{
          order: { xs: 1, lg: 2 },
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          py: { xs: 5, lg: 6 }, px: { xs: 3, lg: 6 },
          textAlign: { xs: 'center', lg: 'left' },
          gap: { xs: 2.5, lg: 3 },
        }}>
          {/* Badge */}
          <Box sx={{ display: 'flex', justifyContent: { xs: 'center', lg: 'flex-start' } }}>
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              px: 1.5, py: 0.5, borderRadius: 99,
              backgroundColor: '#F0F9FF',
              border: '1px solid rgba(186,230,255,0.8)',
            }}>
              <MapPinIcon sx={{ fontSize: 12, color: '#0EA5E9' }} />
              <Typography sx={{ fontSize: '0.625rem', fontWeight: 700, color: '#0369A1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Phủ sóng Việt Nam
              </Typography>
            </Box>
          </Box>

          {/* Heading */}
          <Box>
            <Typography variant="h2" sx={{
              fontSize: { xs: '1.5rem', md: '1.875rem', lg: '2.25rem' },
              fontWeight: 700, lineHeight: 1.25,
              color: '#0F172A',
            }}>
              Triệu lượt đã chạy.{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #2563EB)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Bao giờ đến lượt bạn?
              </Box>
            </Typography>
            <Typography sx={{
              mt: 1.5,
              fontSize: { xs: '0.875rem', md: '1rem' },
              color: '#475569', lineHeight: 1.75,
              maxWidth: { lg: 480 }, mx: { xs: 'auto', lg: 0 },
            }}>
              Top 1 dịch vụ{' '}
              <Box component="strong" sx={{ color: '#0F172A', fontWeight: 600 }}>seeding mạng xã hội</Box>{' '}
              Việt Nam. Tài khoản thật, đội ngũ thật, kết quả thật — từ Hà Nội đến Phú Quốc.
            </Typography>
          </Box>

          {/* Stats */}
          <Box sx={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
          }}>
            {stats.map((s) => (
              <Box key={s.label} sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
                <Typography sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 700, lineHeight: 1.1,
                  background: s.gradient,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 500, mt: 0.25 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Trust badges */}
          <Box sx={{
            display: 'flex', flexWrap: 'wrap',
            justifyContent: { xs: 'center', lg: 'flex-start' },
            gap: 2,
          }}>
            {badges.map(({ Icon, color, text }) => (
              <Box key={text} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                <Icon sx={{ fontSize: 14, color }} />
                <Typography sx={{ fontSize: '0.75rem', color: '#4B5563' }}>{text}</Typography>
              </Box>
            ))}
          </Box>

          {/* CTA buttons */}
          <Box sx={{
            display: 'flex', flexWrap: 'wrap', gap: 1.5,
            justifyContent: { xs: 'center', lg: 'flex-start' },
          }}>
            <Button
              component={NextLink}
              href="/services"
              variant="contained"
              endIcon={<ArrowForwardIcon sx={{ fontSize: '0.875rem !important', transition: 'transform 0.3s', '.MuiButton-root:hover &': { transform: 'translateX(4px)' } }} />}
              sx={{
                background: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #3B82F6)',
                color: '#fff', fontWeight: 600,
                fontSize: '0.875rem',
                px: 2.5, py: 1.25, borderRadius: 2,
                boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #3B82F6)',
                  boxShadow: '0 8px 20px rgba(14,165,233,0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s',
              }}
            >
              Bắt đầu seeding ngay
            </Button>
            <Button
              component={NextLink}
              href="/auth/login"
              variant="outlined"
              sx={{
                fontSize: '0.875rem', fontWeight: 500,
                px: 2.5, py: 1.25, borderRadius: 2,
                borderColor: 'rgba(186,230,255,0.8)',
                color: '#374151', backgroundColor: '#fff',
                '&:hover': {
                  borderColor: 'rgba(14,165,233,0.5)',
                  color: '#0EA5E9',
                  backgroundColor: '#fff',
                },
                transition: 'all 0.2s',
              }}
            >
              Đăng nhập
            </Button>
          </Box>
        </Box>
      </Box>

    </Box>
  )
}
