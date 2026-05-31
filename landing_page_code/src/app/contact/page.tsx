'use client'
import { useState } from 'react'
import {
  Box, Container, Typography, TextField, Button,
  MenuItem, Paper, Divider,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import ChatIcon from '@mui/icons-material/Chat'

const topics = ['Tư vấn dịch vụ', 'Hỗ trợ đơn hàng', 'Thanh toán', 'Báo lỗi', 'Hợp tác', 'Khác']

export default function ContactPage() {
  const [topic, setTopic] = useState('')

  return (
    <Box sx={{ backgroundColor: '#F8F9FA', minHeight: '70vh', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="h1" sx={{ mb: 1.5, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>Liên hệ</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { icon: <EmailIcon />, label: 'Email', value: 'support@socialboost.vn' },
                { icon: <PhoneIcon />, label: 'Hotline', value: '1800 1234 (miễn phí)' },
                { icon: <ChatIcon />, label: 'Zalo', value: '0909 123 456' },
              ].map((c) => (
                <Paper key={c.label} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ color: 'primary.main' }}>{c.icon}</Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{c.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{c.value}</Typography>
                  </Box>
                </Paper>
              ))}
              <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>Giờ hỗ trợ</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>24/7 — Kể cả ngày lễ và cuối tuần</Typography>
              </Paper>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h3" sx={{ mb: 3 }}>Gửi tin nhắn</Typography>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Họ và tên" fullWidth required size="small" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField label="Email" type="email" fullWidth required size="small" />
                  </Grid>
                </Grid>
                <TextField label="Số điện thoại" fullWidth size="small" />
                <TextField
                  select label="Chủ đề" fullWidth required size="small"
                  value={topic} onChange={(e) => setTopic(e.target.value)}
                >
                  {topics.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
                <TextField label="Nội dung" multiline rows={5} fullWidth required size="small" placeholder="Mô tả chi tiết vấn đề bạn cần hỗ trợ..." />
                <Button type="submit" variant="contained" size="large" sx={{ alignSelf: 'flex-start', px: 5 }}>
                  Gửi tin nhắn
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
