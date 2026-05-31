'use client'
import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0891B2',      // cyan-600
      light: '#22D3EE',     // cyan-400
      dark: '#0E7490',      // cyan-700
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2563EB',      // blue-600
      light: '#60A5FA',     // blue-400
      dark: '#1D4ED8',      // blue-700
      contrastText: '#FFFFFF',
    },
    error:   { main: '#DC2626' },
    warning: { main: '#D97706' },
    success: { main: '#16A34A' },
    background: {
      default: '#F8FAFC',   // slate-50
      paper:   '#FFFFFF',
    },
    text: {
      primary:   '#0F172A', // slate-900
      secondary: '#475569', // slate-600
      disabled:  '#94A3B8', // slate-400
    },
    divider: '#E2E8F0',     // slate-200
  },
  typography: {
    fontFamily: '"Be Vietnam Pro", "Inter", "Roboto", sans-serif',
    h1: { fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.2, color: '#0F172A' },
    h2: { fontSize: '2rem',    fontWeight: 700, lineHeight: 1.3, color: '#0F172A' },
    h3: { fontSize: '1.5rem',  fontWeight: 600, lineHeight: 1.4, color: '#0F172A' },
    h4: { fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.5, color: '#0F172A' },
    body1: { fontSize: '1rem',    lineHeight: 1.7, color: '#0F172A' },
    body2: { fontSize: '0.875rem', lineHeight: 1.6, color: '#475569' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0891B2 0%, #2563EB 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #0E7490 0%, #1D4ED8 100%)' },
        },
        outlinedPrimary: {
          borderColor: '#0891B2',
          color: '#0891B2',
          '&:hover': { backgroundColor: '#ECFEFF', borderColor: '#0E7490' },
        },
        textPrimary: {
          color: '#0891B2',
          '&:hover': { backgroundColor: '#ECFEFF' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(8,145,178,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          boxShadow: 'none',
          borderBottom: '1px solid #E2E8F0',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 600 },
        colorPrimary: { backgroundColor: '#ECFEFF', color: '#0E7490' },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: '1px solid #E2E8F0',
          borderRadius: '12px !important',
          '&:before': { display: 'none' },
          '&.Mui-expanded': { margin: 0 },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': { borderColor: '#E2E8F0' },
            '&:hover fieldset': { borderColor: '#0891B2' },
            '&.Mui-focused fieldset': { borderColor: '#0891B2' },
          },
        },
      },
    },
  },
})

// Gradient helpers dùng trong sx props
export const gradientText = {
  background: 'linear-gradient(135deg, #0891B2 0%, #2563EB 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

export const gradientBg = 'linear-gradient(135deg, #0891B2 0%, #2563EB 100%)'
