import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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
  }

  body {
    font-family: ${theme.fontFamily.base};
    font-size: ${theme.fontSize.base};
    font-weight: ${theme.fontWeight.regular};
    line-height: ${theme.lineHeight.relaxed};
    color: ${theme.colors.textPrimary};
    background-color: ${theme.colors.bgPage};
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.fontWeight.bold};
    line-height: ${theme.lineHeight.tight};
    letter-spacing: ${theme.letterSpacing.tight};
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

  /* Focus visible — accesibilidad */
  :focus-visible {
    outline: 2px solid ${theme.colors.borderFocus};
    outline-offset: 2px;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }
`;
