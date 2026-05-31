'use client'
import { Box, Typography } from '@mui/material'
import { ReactNode } from 'react'

interface StatCardProps {
  value: string
  label: string
  icon?: ReactNode
}

export default function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      {icon && (
        <Box sx={{ color: 'primary.main', mb: 1, '& svg': { fontSize: 28 } }}>{icon}</Box>
      )}
      <Typography variant="h3" sx={{ color: 'primary.main', fontWeight: 700, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
    </Box>
  )
}
