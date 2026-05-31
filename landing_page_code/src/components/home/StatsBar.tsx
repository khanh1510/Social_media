import { Box, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import LockIcon from '@mui/icons-material/Lock'
import VerifiedIcon from '@mui/icons-material/Verified'
import ShieldIcon from '@mui/icons-material/Shield'
import HeadphonesIcon from '@mui/icons-material/Headphones'

const items = [
  {
    icon: <LockIcon sx={{ fontSize: { xs: 20, md: 24 }, color: '#fff' }} />,
    iconBg: 'linear-gradient(135deg, #10B981, #14B8A6)',
    title: 'SSL 256-bit',
    sub: 'Mã hoá đầu cuối',
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: { xs: 20, md: 24 }, color: '#fff' }} />,
    iconBg: 'linear-gradient(135deg, #0EA5E9, #3B82F6)',
    title: 'Hoàn tiền 30 ngày',
    sub: 'Cam kết chất lượng',
  },
  {
    icon: <ShieldIcon sx={{ fontSize: { xs: 20, md: 24 }, color: '#fff' }} />,
    iconBg: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
    title: 'Thanh toán an toàn',
    sub: 'Đạt chuẩn PCI-DSS',
  },
  {
    icon: <HeadphonesIcon sx={{ fontSize: { xs: 20, md: 24 }, color: '#fff' }} />,
    iconBg: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
    title: 'Hỗ trợ 24/7',
    sub: 'Phản hồi tức thì',
  },
]

export default function StatsBar() {
  return (
    <Box
      component="section"
      aria-label="Cam kết dịch vụ"
      sx={{
        py: { xs: 4, md: 5 },
        backgroundColor: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(229,231,235,0.6)',
        borderBottom: '1px solid rgba(229,231,235,0.6)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {items.map((item) => (
            <Grid key={item.title} size={{ xs: 6, lg: 3 }}>
              <Box
                sx={{
                  display: 'flex', alignItems: 'center',
                  gap: { xs: 1.5, md: 2 },
                  p: { xs: 1.5, md: 2 },
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  border: '1px solid rgba(229,231,235,0.6)',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    flexShrink: 0,
                    width: { xs: 40, md: 48 }, height: { xs: 40, md: 48 },
                    borderRadius: 3,
                    background: item.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                >
                  {item.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.75rem', md: '0.875rem' },
                      fontWeight: 600, color: '#111827',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.6875rem', md: '0.75rem' },
                      color: '#6B7280',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}
                  >
                    {item.sub}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
