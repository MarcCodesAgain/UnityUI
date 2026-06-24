import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './styles';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div style={{ padding: '64px', fontFamily: theme.fontFamily.base }}>
        <h1 style={{ fontSize: theme.fontSize['5xl'], fontWeight: theme.fontWeight.bold, letterSpacing: theme.letterSpacing.tight }}>
          Unity<span style={{ color: theme.colors.primary }}>UI</span>
        </h1>
        <p style={{ marginTop: '16px', color: theme.colors.textSecondary }}>
          Swiss Minimalism Design System
        </p>
      </div>
    </ThemeProvider>
  </StrictMode>
);
