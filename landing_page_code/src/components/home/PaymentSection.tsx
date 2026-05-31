'use client'
import { Box, Container, Typography } from '@mui/material'
import CreditCardIcon from '@mui/icons-material/CreditCard'

const payments = [
  {
    name: 'Visa',
    svg: (
      <svg viewBox="0 0 48 32" style={{ width: 56, height: 36 }}>
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <path d="M19.5 21H17L18.7 11H21.2L19.5 21ZM15.4 11L13 17.9L12.7 16.4L11.8 12C11.8 12 11.7 11 10.4 11H6.1L6 11.2C6 11.2 7.5 11.5 9.2 12.5L11.4 21H14L18.1 11H15.4ZM35.4 21H37.7L35.7 11H33.7C32.6 11 32.3 11.8 32.3 11.8L28.6 21H31.2L31.7 19.5H34.9L35.4 21ZM32.4 17.5L33.8 13.7L34.6 17.5H32.4ZM28.3 13.5L28.6 11.8C28.6 11.8 27.3 11.3 25.9 11.3C24.4 11.3 21 11.9 21 14.8C21 17.5 24.7 17.5 24.7 18.9C24.7 20.3 21.4 20 20.2 19.1L19.9 20.9C19.9 20.9 21.2 21.5 23.1 21.5C25 21.5 27.5 20.5 27.5 17.9C27.5 15.2 23.8 15 23.8 13.8C23.8 12.6 26.3 12.8 27.4 13.5L28.3 13.5Z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'MasterCard',
    svg: (
      <svg viewBox="0 0 48 32" style={{ width: 56, height: 36 }}>
        <rect width="48" height="32" rx="4" fill="#252525" />
        <circle cx="19" cy="16" r="8" fill="#EB001B" />
        <circle cx="29" cy="16" r="8" fill="#F79E1B" />
        <path d="M24 10.3C25.7 11.7 26.8 13.7 26.8 16C26.8 18.3 25.7 20.3 24 21.7C22.3 20.3 21.2 18.3 21.2 16C21.2 13.7 22.3 11.7 24 10.3Z" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    name: 'PayPal',
    svg: (
      <svg viewBox="0 0 48 32" style={{ width: 56, height: 36 }}>
        <rect width="48" height="32" rx="4" fill="#003087" />
        <path d="M20.5 8H15.5C15.2 8 14.9 8.2 14.8 8.5L12.8 21.5C12.8 21.7 12.9 21.9 13.1 21.9H15.5C15.8 21.9 16.1 21.7 16.2 21.4L16.7 18.1C16.8 17.8 17.1 17.6 17.4 17.6H18.8C21.7 17.6 23.4 16.1 23.8 13.3C24 12.1 23.8 11.1 23.3 10.4C22.7 9 21.8 8 20.5 8ZM21 13.5C20.8 15.1 19.6 15.1 18.4 15.1H17.7L18.2 12.2C18.2 12 18.4 11.9 18.6 11.9H18.9C19.7 11.9 20.5 11.9 20.9 12.4C21.1 12.6 21.2 13 21 13.5Z" fill="white" />
        <path d="M30 8H25C24.7 8 24.4 8.2 24.3 8.5L22.3 21.5C22.3 21.7 22.4 21.9 22.6 21.9H25.2C25.4 21.9 25.6 21.7 25.6 21.5L26.2 18.1C26.3 17.8 26.6 17.6 26.9 17.6H28.3C31.2 17.6 32.9 16.1 33.3 13.3C33.5 12.1 33.3 11.1 32.8 10.4C32.1 9 31.2 8 30 8ZM30.5 13.5C30.3 15.1 29.1 15.1 27.9 15.1H27.2L27.7 12.2C27.7 12 27.9 11.9 28.1 11.9H28.4C29.2 11.9 30 11.9 30.4 12.4C30.6 12.6 30.6 13 30.5 13.5Z" fill="#A7C4E1" />
      </svg>
    ),
  },
  {
    name: 'Bitcoin',
    svg: (
      <svg viewBox="0 0 48 32" style={{ width: 56, height: 36 }}>
        <rect width="48" height="32" rx="4" fill="#F7931A" />
        <path d="M30.2 14.3C30.5 12.2 28.9 11.1 26.8 10.3L27.5 7.7L25.9 7.3L25.2 9.8C24.8 9.7 24.3 9.6 23.9 9.5L24.6 7L23 6.6L22.3 9.2C22 9.1 21.6 9 21.3 9L19.1 8.4L18.7 10.1C18.7 10.1 19.9 10.4 19.9 10.4C20.6 10.6 20.7 11 20.7 11.4L19.9 14.3C20.1 14.4 19.9 14.3 19.9 14.3L18.8 18.5C18.7 18.8 18.4 19.2 17.9 19.1L16.7 18.8L15.9 20.6L18 21.1C18.4 21.2 18.7 21.3 19.1 21.4L18.4 24L20 24.4L20.7 21.8C21.1 21.9 21.5 22 21.9 22.1L21.2 24.7L22.8 25.1L23.5 22.5C26.2 23 28.2 22.8 29.1 20.4C29.8 18.4 29.1 17.3 27.6 16.5C28.7 16.3 29.5 15.5 30.2 14.3ZM26 19.5C25.5 21.5 22.2 20.4 21.2 20.2L22.1 16.8C23.1 17 26.6 17.4 26 19.5ZM26.6 14.2C26.1 16 23.4 15.1 22.5 14.9L23.3 11.8C24.2 12 27.1 12.3 26.6 14.2Z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'USDT',
    svg: (
      <svg viewBox="0 0 48 32" style={{ width: 56, height: 36 }}>
        <rect width="48" height="32" rx="4" fill="#26A17B" />
        <path d="M26.5 17.2C26.4 17.2 25.6 17.3 24 17.3C22.8 17.3 21.8 17.2 21.6 17.2C17.4 17 14.2 16.2 14.2 15.2C14.2 14.2 17.4 13.4 21.6 13.2V16.4C21.8 16.4 22.8 16.5 24.1 16.5C25.6 16.5 26.4 16.4 26.5 16.4V13.2C30.7 13.4 33.8 14.2 33.8 15.2C33.8 16.2 30.7 17 26.5 17.2ZM26.5 13V10.1H31.7V6.5H16.4V10.1H21.6V13C16.8 13.3 13.2 14.3 13.2 15.5C13.2 16.7 16.8 17.7 21.6 18V25.5H26.5V18C31.3 17.7 34.8 16.7 34.8 15.5C34.8 14.3 31.3 13.3 26.5 13Z" fill="white" />
      </svg>
    ),
  },
  {
    name: 'Ethereum',
    svg: (
      <svg viewBox="0 0 48 32" style={{ width: 56, height: 36 }}>
        <rect width="48" height="32" rx="4" fill="#627EEA" />
        <path d="M24 5L23.8 5.6V19.8L24 20L30.5 16.2L24 5Z" fill="white" fillOpacity="0.6" />
        <path d="M24 5L17.5 16.2L24 20V13V5Z" fill="white" />
        <path d="M24 21.5L23.9 21.6V26.6L24 26.9L30.5 17.7L24 21.5Z" fill="white" fillOpacity="0.6" />
        <path d="M24 26.9V21.5L17.5 17.7L24 26.9Z" fill="white" />
        <path d="M24 20L30.5 16.2L24 13V20Z" fill="white" fillOpacity="0.2" />
        <path d="M17.5 16.2L24 20V13L17.5 16.2Z" fill="white" fillOpacity="0.5" />
      </svg>
    ),
  },
  {
    name: 'Momo',
    svg: (
      <svg viewBox="0 0 48 32" style={{ width: 56, height: 36 }}>
        <rect width="48" height="32" rx="4" fill="#A50064" />
        <circle cx="16" cy="16" r="7" fill="white" fillOpacity="0.15" />
        <circle cx="32" cy="16" r="7" fill="white" fillOpacity="0.15" />
        <text x="24" y="21" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="sans-serif">MoMo</text>
      </svg>
    ),
  },
  {
    name: 'Banking',
    svg: (
      <svg viewBox="0 0 48 32" style={{ width: 56, height: 36 }}>
        <rect width="48" height="32" rx="4" fill="#1a56db" />
        <path d="M10 22h28v2H10zM10 14h28v6H10zM24 8l14 6H10l14-6z" fill="white" fillOpacity="0.9" />
      </svg>
    ),
  },
]

export default function PaymentSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8, xl: 10 },
        background: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid */}
      <Box aria-hidden sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.015) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
      }} />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            px: 2, py: 0.75, mb: 0, borderRadius: 99,
            background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1))',
            border: '1px solid rgba(6,182,212,0.2)',
          }}>
            <CreditCardIcon sx={{ fontSize: 14, color: '#0891B2' }} />
            <Typography sx={{
              fontSize: { xs: '0.75rem', md: '0.875rem' }, fontWeight: 500,
              background: 'linear-gradient(135deg, #0891B2, #2563EB)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Phương Thức Thanh Toán Được Chấp Nhận
            </Typography>
          </Box>
        </Box>

        {/* Payment logos */}
        <Box sx={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',
          gap: { xs: 2.5, md: 4, xl: 5 },
        }}>
          {payments.map((p) => (
            <Box
              key={p.name}
              sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <Box sx={{
                p: { xs: 1.5, md: 2 },
                borderRadius: 2,
                backgroundColor: '#fff',
                border: '1px solid rgba(226,232,240,0.6)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.3s, border-color 0.3s',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  borderColor: 'rgba(6,182,212,0.3)',
                },
              }}>
                {p.svg}
              </Box>
              <Typography sx={{ fontSize: { xs: '0.6875rem', md: '0.75rem' }, color: '#64748B', fontWeight: 500 }}>
                {p.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
