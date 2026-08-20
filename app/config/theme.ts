export type ThemeTokens = {
  bg: string
  bgElevated: string
  surface: string
  surfaceStrong: string
  primary: string
  primaryStrong: string
  primarySoft: string
  text: string
  textMuted: string
  line: string
  lamp: string
  lampGlow: string
  shadow: string
  fontDisplay: string
  fontBody: string
  fontMono: string
}

export const themePresets: Record<string, ThemeTokens> = {
  'emerald-night': {
    bg: '#050807', bgElevated: '#08100c', surface: '#0c1712', surfaceStrong: '#122319',
    primary: '#35f28a', primaryStrong: '#16c968', primarySoft: '#bdfccf', text: '#e8fff1', textMuted: '#9eb5a6',
    line: 'rgba(189, 252, 207, 0.18)', lamp: '#ffd27a', lampGlow: 'rgba(255, 210, 122, 0.32)', shadow: 'rgba(0, 0, 0, 0.42)',
    fontDisplay: 'Sora, sans-serif', fontBody: 'Manrope, sans-serif', fontMono: 'JetBrains Mono, monospace',
  },
  'forest-luxe': {
    bg: '#0a0f0d', bgElevated: '#101a14', surface: '#17231c', surfaceStrong: '#203329',
    primary: '#42d392', primaryStrong: '#28a96d', primarySoft: '#c6f5d4', text: '#e7f6eb', textMuted: '#a9bbae',
    line: 'rgba(231, 246, 235, 0.18)', lamp: '#d6a85d', lampGlow: 'rgba(214, 168, 93, 0.28)', shadow: 'rgba(0, 0, 0, 0.38)',
    fontDisplay: 'Sora, sans-serif', fontBody: 'Manrope, sans-serif', fontMono: 'JetBrains Mono, monospace',
  },
  'neon-forest': {
    bg: '#06100b', bgElevated: '#0a1a11', surface: '#0e2117', surfaceStrong: '#123d29',
    primary: '#00e676', primaryStrong: '#00b85c', primarySoft: '#b6ffd6', text: '#f0fff7', textMuted: '#96c4ab',
    line: 'rgba(182, 255, 214, 0.2)', lamp: '#ffe29a', lampGlow: 'rgba(255, 226, 154, 0.32)', shadow: 'rgba(0, 0, 0, 0.48)',
    fontDisplay: 'Space Grotesk, sans-serif', fontBody: 'Inter, sans-serif', fontMono: 'JetBrains Mono, monospace',
  },
  'carbon-green': {
    bg: '#07080a', bgElevated: '#0e1115', surface: '#12151a', surfaceStrong: '#1b2229',
    primary: '#00ff87', primaryStrong: '#00cf6e', primarySoft: '#c4ffe4', text: '#f3fff9', textMuted: '#a8b9b1',
    line: 'rgba(196, 255, 228, 0.18)', lamp: '#7cffcb', lampGlow: 'rgba(124, 255, 203, 0.3)', shadow: 'rgba(0, 0, 0, 0.54)',
    fontDisplay: 'Space Grotesk, sans-serif', fontBody: 'Inter, sans-serif', fontMono: 'JetBrains Mono, monospace',
  },
}

export const getThemeTokens = (preset = 'emerald-night') => themePresets[preset] ?? themePresets['emerald-night']
