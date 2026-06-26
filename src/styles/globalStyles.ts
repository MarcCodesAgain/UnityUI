import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
  }

  body {
    font-family: ${theme.fontFamily.base};
    font-size: ${theme.fontSize.base};
    font-weight: ${theme.fontWeight.regular};
    line-height: ${theme.lineHeight.relaxed};
    color: ${theme.colors.textPrimary};
    background-color: ${theme.colors.bgPage};
  }

  /* Headings — black weight by default, Inter tension system */
  h1, h2 {
    font-weight: ${theme.fontWeight.black};
    line-height: ${theme.lineHeight.tight};
    letter-spacing: ${theme.letterSpacing.tighter};
  }

  h3, h4 {
    font-weight: ${theme.fontWeight.bold};
    line-height: ${theme.lineHeight.snug};
    letter-spacing: ${theme.letterSpacing.tight};
  }

  h5, h6 {
    font-weight: ${theme.fontWeight.semibold};
    line-height: ${theme.lineHeight.snug};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img, svg {
    display: block;
    max-width: 100%;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  /* Mono elements inherit the technical voice */
  code, kbd, samp, pre {
    font-family: ${theme.fontFamily.mono};
  }

  /* Focus visible — a11y, uses Electric Blue */
  :focus-visible {
    outline: 2px solid ${theme.colors.borderFocus};
    outline-offset: 2px;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }

  /* Respect user motion preferences — WCAG 2.3.3 Animation from Interactions.
     Users who set "Reduce Motion" in their OS get instant transitions instead
     of animated ones. JS animations (rAF-based CountUp etc.) should check
     this independently via window.matchMedia('(prefers-reduced-motion: reduce)'). */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;
