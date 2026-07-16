export const theme = {
  colors: {
    background: '#111012',
    surface: '#181719',
    surfaceRaised: '#211f23',
    primary: '#39d353',
    onPrimary: '#181719',
    secondary: '#8532f2',
    text: '#ffffff',
    textMuted: '#b8b5bd',
    border: '#363239',
    danger: '#ff5d6c',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radii: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    pill: '999px',
  },
  shadows: {
    panel: '0 24px 80px rgb(0 0 0 / 32%)',
  },
} as const

export type AppTheme = typeof theme
