export const designSystem = {
  colors: {
    background: '#F8F7F4',
    primary: '#2F5D50',
    accent: '#E8AFA6',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  radius: {
    card: 16,
  },
  typography: {
    title: '20px',
    subtitle: '16px',
    body: '14px',
    caption: '12px',
  },
} as const

export type AppSpacingKey = keyof typeof designSystem.spacing
