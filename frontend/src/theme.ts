export type ThemeMode = 'light' | 'dark';

export type ThemeTokens = {
  name: ThemeMode;
  colors: {
    background: string;
    backgroundAlt: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    accentGlow: string;
    border: string;
  };
  radii: {
    card: string;
    pill: string;
  };
  shadows: {
    card: string;
    soft: string;
  };
  glows: {
    accent: string;
    ambient: string;
  };
  blur: string;
};

export const lightTheme: ThemeTokens = {
  name: 'light',
  colors: {
    background: '#0f1729',
    backgroundAlt: '#0b1222',
    surface: 'rgba(255, 255, 255, 0.08)',
    text: '#eef2ff',
    muted: '#cbd5f5',
    accent: '#7c3aed',
    accentGlow: '#c084fc',
    border: 'rgba(255, 255, 255, 0.14)',
  },
  radii: {
    card: '24px',
    pill: '999px',
  },
  shadows: {
    card: '0 30px 80px rgba(15, 23, 42, 0.45)',
    soft: '0 10px 30px rgba(15, 23, 42, 0.25)',
  },
  glows: {
    accent: '0 0 32px 6px rgba(124, 58, 237, 0.55)',
    ambient: '0 0 120px 18px rgba(14, 165, 233, 0.25)',
  },
  blur: '14px',
};

export const darkTheme: ThemeTokens = {
  name: 'dark',
  colors: {
    background: '#05060d',
    backgroundAlt: '#0a0c16',
    surface: 'rgba(8, 10, 20, 0.65)',
    text: '#e0e7ff',
    muted: '#a3b2e1',
    accent: '#38bdf8',
    accentGlow: '#06b6d4',
    border: 'rgba(56, 189, 248, 0.25)',
  },
  radii: {
    card: '24px',
    pill: '999px',
  },
  shadows: {
    card: '0 30px 90px rgba(0, 0, 0, 0.65)',
    soft: '0 14px 36px rgba(0, 0, 0, 0.45)',
  },
  glows: {
    accent: '0 0 36px 10px rgba(56, 189, 248, 0.6)',
    ambient: '0 0 120px 24px rgba(52, 211, 153, 0.28)',
  },
  blur: '16px',
};

export const themeByMode: Record<ThemeMode, ThemeTokens> = {
  light: lightTheme,
  dark: darkTheme,
};

export const themeVars = (tokens: ThemeTokens) => ({
  '--color-bg': tokens.colors.background,
  '--color-bg-alt': tokens.colors.backgroundAlt,
  '--color-surface': tokens.colors.surface,
  '--color-text': tokens.colors.text,
  '--color-muted': tokens.colors.muted,
  '--color-accent': tokens.colors.accent,
  '--color-accent-glow': tokens.colors.accentGlow,
  '--color-border': tokens.colors.border,
  '--radius-card': tokens.radii.card,
  '--radius-pill': tokens.radii.pill,
  '--shadow-card': tokens.shadows.card,
  '--shadow-soft': tokens.shadows.soft,
  '--glow-accent': tokens.glows.accent,
  '--glow-ambient': tokens.glows.ambient,
  '--blur': tokens.blur,
});
