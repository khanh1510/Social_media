'use client'
import NextLink from 'next/link'
import { Card, CardContent, Avatar, Typography, Chip, Button, Box } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Platform } from '@/types'

interface PlatformCardProps {
  platform: Platform
  name: string
  serviceCount: number
  startingPrice: number
  icon: ReactNode
  color: string
}

import { ReactNode } from 'react'

export default function PlatformCard({ platform, name, serviceCount, startingPrice, icon, color }: PlatformCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Avatar sx={{ bgcolor: color, width: 52, height: 52, mb: 2, fontSize: '1.5rem' }}>
          {icon}
        </Avatar>
        <Typography variant="h4" sx={{ mb: 0.5 }}>{name}</Typography>
        <Chip label={`${serviceCount} dịch vụ`} size="small" color="primary" sx={{ mb: 2 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
          Giá từ{' '}
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
            {startingPrice.toLocaleString('vi-VN')}đ
          </Box>
        </Typography>
        <Button
          component={NextLink}
          href={`/services/${platform}`}
          variant="outlined"
          size="small"
          endIcon={<ArrowForwardIcon />}
          fullWidth
        >
          Xem dịch vụ
        </Button>
      </CardContent>
    </Card>
  )
}
