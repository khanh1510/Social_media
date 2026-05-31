'use client'
import { useState } from 'react'
import NextLink from 'next/link'
import { Box, Container, Typography, Button } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MessageIcon from '@mui/icons-material/Message'

const faqs = [
  {
    question: 'Dịch vụ có an toàn cho tài khoản của tôi không?',
    answer: 'Hoàn toàn an toàn. Chúng tôi không yêu cầu mật khẩu — chỉ cần URL công khai. Tài khoản của bạn được bảo vệ 100%.',
  },
  {
    question: 'Đơn hàng được giao trong bao lâu?',
    answer: 'Hầu hết đơn hàng bắt đầu trong 0–15 phút. Một số dịch vụ có thể mất vài giờ tùy lưu lượng.',
  },
  {
    question: 'Tôi có được hoàn tiền nếu không hài lòng không?',
    answer: 'Có. Bảo hành hoàn tiền 30 ngày nếu dịch vụ không thực hiện đúng cam kết.',
  },
  {
    question: 'Phương thức thanh toán nào được hỗ trợ?',
    answer: 'Visa, MasterCard, PayPal, Bitcoin, USDT, Ethereum, Momo, Banking, và nhiều hơn nữa.',
  },
  {
    question: 'Tôi có thể đặt nhiều đơn cùng lúc không?',
    answer: 'Có. Có hỗ trợ Mass Order và API để đặt hàng hàng loạt cho khách reseller.',
  },
  {
    question: 'Bảo hành Refill là gì?',
    answer: 'Nếu followers/likes giảm trong thời gian bảo hành, chúng tôi sẽ tự động bù miễn phí.',
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10, xl: 14 },
        background: 'linear-gradient(to bottom, #fff 0%, rgba(240,249,255,0.3) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1,
            px: 2, py: 0.75, mb: 2.5, borderRadius: 99,
            background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(59,130,246,0.1))',
            border: '1px solid rgba(6,182,212,0.2)',
          }}>
            <HelpOutlineIcon sx={{ fontSize: 14, color: '#0891B2' }} />
            <Typography sx={{
              fontSize: { xs: '0.75rem', md: '0.875rem' }, fontWeight: 500,
              background: 'linear-gradient(135deg, #0891B2, #2563EB)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Câu Hỏi Thường Gặp
            </Typography>
          </Box>

          <Typography variant="h2" sx={{
            mb: 1.5,
            fontSize: { xs: '1.5rem', md: '1.875rem' }, fontWeight: 600,
            background: 'linear-gradient(135deg, #0891B2, #2563EB, #7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Bạn Có Thắc Mắc?
          </Typography>

          <Typography sx={{ color: '#4B5563', fontSize: { xs: '0.875rem', md: '1rem' }, maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}>
            Câu trả lời cho những câu hỏi phổ biến nhất từ khách hàng
          </Typography>
        </Box>

        {/* Accordion list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
          {faqs.map((faq, i) => (
            <Box
              key={i}
              sx={{
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(226,232,240,0.6)',
                backdropFilter: 'blur(8px)',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.06)' },
              }}
            >
              <Box
                component="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                sx={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 2, px: { xs: 2.5, md: 3 }, py: { xs: 2, md: 2.5 },
                  textAlign: 'left', cursor: 'pointer',
                  background: 'none', border: 'none',
                  transition: 'background 0.2s',
                  '&:hover': { backgroundColor: 'rgba(6,182,212,0.02)' },
                }}
              >
                <Typography sx={{
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 500, color: '#111827', lineHeight: 1.5,
                }}>
                  {faq.question}
                </Typography>
                <ExpandMoreIcon sx={{
                  fontSize: 20, flexShrink: 0, color: '#0891B2',
                  transition: 'transform 0.2s',
                  transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                }} />
              </Box>

              <Box sx={{
                overflow: 'hidden',
                maxHeight: open === i ? 200 : 0,
                transition: 'max-height 0.25s ease',
              }}>
                <Typography sx={{
                  px: { xs: 2.5, md: 3 }, pb: { xs: 2, md: 2.5 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  color: '#4B5563', lineHeight: 1.75,
                }}>
                  {faq.answer}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bottom CTA */}
        <Box sx={{ mt: { xs: 5, md: 6 }, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.875rem', color: '#6B7280', mb: 1.5 }}>
            Vẫn còn thắc mắc?
          </Typography>
          <Button
            component={NextLink}
            href="/contact"
            variant="contained"
            startIcon={<MessageIcon sx={{ fontSize: '1rem !important' }} />}
            sx={{
              background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
              color: '#fff', fontWeight: 600,
              fontSize: { xs: '0.8125rem', md: '0.875rem' },
              px: { xs: 2.5, md: 3 }, py: { xs: 1.25, md: 1.5 },
              borderRadius: 2,
              boxShadow: '0 4px 16px rgba(6,182,212,0.25)',
              '&:hover': {
                background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                boxShadow: '0 8px 24px rgba(6,182,212,0.35)',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s',
            }}
          >
            Liên hệ chúng tôi
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
