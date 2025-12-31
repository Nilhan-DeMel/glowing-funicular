import { useMemo, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './globalStyles';
import { ThemeMode, themeByMode } from './theme';
import { ParticleField } from './components/ParticleField';

const Page = styled.main`
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 48px 16px;
  overflow: hidden;
`;

const BackdropBlur = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(1200px circle at 20% 20%, rgba(124, 58, 237, 0.18), transparent 40%),
    radial-gradient(900px circle at 80% 0%, rgba(56, 189, 248, 0.24), transparent 34%),
    radial-gradient(700px circle at 50% 85%, rgba(52, 211, 153, 0.22), transparent 42%);
  filter: blur(80px);
  opacity: 0.7;
`;

const Card = styled.section`
  position: relative;
  z-index: 1;
  width: min(720px, 100%);
  background: var(--color-surface);
  backdrop-filter: blur(var(--blur));
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card), var(--glow-ambient);
  border-radius: var(--radius-card);
  padding: 32px;
  color: var(--color-text);
`; 

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--color-border);
  color: var(--color-text);
  box-shadow: var(--shadow-soft);
`;

const Heading = styled.h1`
  margin: 0 0 12px;
  font-size: clamp(32px, 3vw, 42px);
  letter-spacing: -0.01em;
`;

const Subtitle = styled.p`
  margin: 0 0 20px;
  color: var(--color-muted);
  max-width: 64ch;
`;

const TokenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
  margin-top: 22px;
`;

const TokenCard = styled.div`
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.03);
  box-shadow: var(--shadow-soft);
`;

const TokenLabel = styled.div`
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-muted);
  margin-bottom: 8px;
`;

const TokenValue = styled.div`
  font-weight: 600;
`;

const ThemeToggle = styled.button`
  border: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.06);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: var(--glow-accent);
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.28);
    box-shadow: var(--glow-accent), 0 16px 40px rgba(0, 0, 0, 0.22);
  }
`;

const Tagline = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

const AccentDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-glow));
  box-shadow: var(--glow-accent);
`;

const FooterNote = styled.p`
  margin: 20px 0 0;
  color: var(--color-muted);
  font-size: 14px;
`;

export function App() {
  const [mode, setMode] = useState<ThemeMode>('light');

  const theme = useMemo(() => themeByMode[mode], [mode]);

  const swapTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles $theme={theme} />
      <Page>
        <BackdropBlur />
        <ParticleField />
        <Card>
          <Tagline>
            <AccentDot aria-hidden />
            <Pill>Vite · React · TypeScript</Pill>
          </Tagline>
          <Heading>Glassmorphic layout starter</Heading>
          <Subtitle>
            A ready-to-theme canvas with layered gradients, animated particles, and a centered glass card. Theme
            tokens are wired to CSS variables, so you can switch modes or brands without touching component code.
          </Subtitle>

          <ThemeToggle type="button" onClick={swapTheme} aria-label="Toggle theme mode">
            {mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          </ThemeToggle>

          <TokenGrid>
            <TokenCard>
              <TokenLabel>Colors</TokenLabel>
              <TokenValue>bg, surface, accent, text, muted</TokenValue>
            </TokenCard>
            <TokenCard>
              <TokenLabel>Radii</TokenLabel>
              <TokenValue>card {theme.radii.card} · pill {theme.radii.pill}</TokenValue>
            </TokenCard>
            <TokenCard>
              <TokenLabel>Effects</TokenLabel>
              <TokenValue>blur {theme.blur} · glow, shadow</TokenValue>
            </TokenCard>
            <TokenCard>
              <TokenLabel>CSS variables</TokenLabel>
              <TokenValue>prefixed with --color-, --radius-, --shadow-, --glow-</TokenValue>
            </TokenCard>
          </TokenGrid>

          <FooterNote>
            Update <code>theme.ts</code> to add palettes or surface styles. Every token syncs to a CSS variable so
            components stay neutral and theming stays fast.
          </FooterNote>
        </Card>
      </Page>
    </ThemeProvider>
  );
}
