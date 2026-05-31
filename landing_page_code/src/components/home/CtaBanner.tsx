'use client'
import { useState } from 'react'
import NextLink from 'next/link'
import { Box, Container, Typography, Button } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SendIcon from '@mui/icons-material/Send'
import ShieldIcon from '@mui/icons-material/Shield'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'

const checklist = [
  'Giao hàng tức thì & hỗ trợ 24/7',
  'Giá rẻ nhất đảm bảo',
  'Bảo hành refill cho tất cả dịch vụ',
]

const miniStats = [
  { value: '5 min', label: 'Thời Gian Phản Hồi' },
  { value: '24/7', label: 'Hỗ Trợ' },
  { value: '99%', label: 'Hài Lòng' },
  { value: '45K+', label: 'Người Dùng' },
]

export default function CtaBanner() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputBase = {
    width: '100%',
    pl: '2.75rem', pr: '1rem', py: '0.75rem',
    borderRadius: '12px',
    border: '1px solid rgba(226,232,240,0.8)',
    backgroundColor: 'rgba(248,250,252,0.5)',
    fontSize: '0.875rem',
    color: '#0F172A',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  } as const

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      {/* Orbs */}
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <Box sx={{
          position: 'absolute', top: 0, left: '-8rem',
          width: { xs: 300, md: 450 }, height: { xs: 300, md: 450 },
          borderRadius: '50%',
          background: 'rgba(186,230,255,0.4)',
          filter: 'blur(80px)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: 0, right: '-8rem',
          width: { xs: 240, md: 384 }, height: { xs: 240, md: 384 },
          borderRadius: '50%',
          background: 'rgba(165,243,252,0.4)',
          filter: 'blur(80px)',
        }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: '#fff',
          border: '1px solid rgba(186,230,255,0.5)',
          boxShadow: '0 20px 60px rgba(14,165,233,0.1)',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}>
          {/* Left: text content */}
          <Box sx={{
            p: { xs: 4, md: 5, xl: 6 },
            background: 'linear-gradient(135deg, rgba(240,249,255,0.5), rgba(236,254,255,0.3), rgba(239,246,255,0.5))',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
          }}>
            {/* Badge */}
            <Box sx={{
              display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 0.75,
              px: 1.5, py: 0.5, mb: 2.5, borderRadius: 99,
              backgroundColor: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(186,230,255,0.8)',
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 14, color: '#0891B2' }} />
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, color: '#0E7490', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Ưu Đãi Đặc Biệt
              </Typography>
            </Box>

            {/* Heading */}
            <Typography variant="h2" sx={{
              mb: 1.5,
              fontSize: { xs: '1.5rem', md: '2rem', xl: '2.25rem' },
              fontWeight: 700, lineHeight: 1.25,
            }}>
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #2563EB)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Bắt Đầu Tăng Trưởng Ngay!
              </Box>
            </Typography>

            <Typography sx={{ color: '#475569', fontSize: { xs: '0.875rem', md: '1rem' }, lineHeight: 1.7, mb: 3 }}>
              Tham gia cùng hơn 45,000 khách hàng hài lòng trên toàn thế giới
            </Typography>

            {/* Checklist */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              {checklist.map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                  <Box sx={{
                    flexShrink: 0, mt: '2px',
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(14,165,233,0.3)',
                  }}>
                    <CheckCircleIcon sx={{ fontSize: 12, color: '#fff' }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>
                    {item}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Mini stats */}
            <Box sx={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 1.5, pt: 3,
              borderTop: '1px solid rgba(186,230,255,0.5)',
            }}>
              {miniStats.map((s) => (
                <Box key={s.label} sx={{ textAlign: 'center' }}>
                  <Typography sx={{
                    fontSize: { xs: '1rem', md: '1.125rem' }, fontWeight: 700, lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>
                    {s.value}
                  </Typography>
                  <Typography sx={{ fontSize: '0.5625rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mt: 0.5 }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Typography sx={{ mt: 2.5, fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
              SocialBoost VN
            </Typography>
          </Box>

          {/* Right: form */}
          <Box sx={{ p: { xs: 4, md: 5, xl: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff' }}>
            {submitted ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 48, color: '#06B6D4', mb: 2 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1E293B', mb: 1 }}>
                  Đã nhận thông tin!
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: '0.875rem' }}>
                  Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                </Typography>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Name */}
                <Box>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#374151', mb: 1 }}>
                    Họ và Tên *
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <PersonIcon sx={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94A3B8', pointerEvents: 'none' }} />
                    <Box
                      component="input"
                      type="text"
                      placeholder="Nhập tên của bạn"
                      required
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      sx={{
                        ...inputBase,
                        '&:focus': { borderColor: '#06B6D4', boxShadow: '0 0 0 3px rgba(6,182,212,0.15)', backgroundColor: '#fff' },
                      }}
                    />
                  </Box>
                </Box>

                {/* Email */}
                <Box>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#374151', mb: 1 }}>
                    Địa chỉ Email *
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <EmailIcon sx={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94A3B8', pointerEvents: 'none' }} />
                    <Box
                      component="input"
                      type="email"
                      placeholder="email@example.com"
                      required
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      sx={{
                        ...inputBase,
                        '&:focus': { borderColor: '#06B6D4', boxShadow: '0 0 0 3px rgba(6,182,212,0.15)', backgroundColor: '#fff' },
                      }}
                    />
                  </Box>
                </Box>

                {/* Phone */}
                <Box>
                  <Typography sx={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#374151', mb: 1 }}>
                    Số Điện Thoại *
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <PhoneIcon sx={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: '#94A3B8', pointerEvents: 'none' }} />
                    <Box
                      component="input"
                      type="tel"
                      placeholder="+84 123 456 789"
                      required
                      value={phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                      sx={{
                        ...inputBase,
                        '&:focus': { borderColor: '#06B6D4', boxShadow: '0 0 0 3px rgba(6,182,212,0.15)', backgroundColor: '#fff' },
                      }}
                    />
                  </Box>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  endIcon={<SendIcon sx={{ fontSize: '1rem !important', transition: 'transform 0.3s', '.MuiButton-root:hover &': { transform: 'translateX(4px)' } }} />}
                  sx={{
                    mt: 0.5,
                    background: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #3B82F6)',
                    color: '#fff', fontWeight: 700,
                    fontSize: '0.875rem',
                    py: 1.75, borderRadius: 2,
                    boxShadow: '0 4px 16px rgba(14,165,233,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #3B82F6)',
                      boxShadow: '0 8px 24px rgba(14,165,233,0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Nhận Tư Vấn Miễn Phí
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, mt: -0.5 }}>
                  <ShieldIcon sx={{ fontSize: 12, color: '#94A3B8' }} />
                  <Typography sx={{ fontSize: '0.6875rem', color: '#94A3B8' }}>
                    Thông tin của bạn được bảo mật 100%
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
