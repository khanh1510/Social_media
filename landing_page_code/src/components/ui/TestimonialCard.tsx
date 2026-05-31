'use client'
import { Card, CardContent, Avatar, Typography, Box, Rating, Chip } from '@mui/material'
import { Testimonial } from '@/types'

export default function TestimonialCard({ name, role, rating, content, metric }: Testimonial) {
  const initials = name.split(' ').slice(-2).map((w) => w[0]).join('')

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Rating value={rating} readOnly size="small" />
        <Typography variant="body1" sx={{ flexGrow: 1, fontStyle: 'italic', color: 'text.primary', lineHeight: 1.7 }}>
          "{content}"
        </Typography>
        <Chip label={metric} size="small" color="secondary" sx={{ alignSelf: 'flex-start', fontWeight: 600 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40, fontSize: '0.875rem', fontWeight: 700 }}>
            {initials}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>{role}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
