import { createGlobalStyle } from 'styled-components';
import { ThemeTokens, themeVars } from './theme';

export const GlobalStyles = createGlobalStyle<{ $theme: ThemeTokens }>`
  :root {
    ${({ $theme }) =>
      Object.entries(themeVars($theme))
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n')};
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: var(--color-text);
    background: radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.12), transparent 28%),
      radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.14), transparent 25%),
      linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-alt) 50%, #050915 100%);
    letter-spacing: 0.01em;
    -webkit-font-smoothing: antialiased;
  }

  #root {
    min-height: 100vh;
  }

  button {
    font: inherit;
  }
`;
