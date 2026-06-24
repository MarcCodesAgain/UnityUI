import type { Preview, Decorator } from '@storybook/react-vite';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from '../src/styles';

const withTheme: Decorator = (Story) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <Story />
  </ThemeProvider>
);

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white', value: '#FFFFFF' },
        { name: 'surface', value: '#F7F7F7' },
        { name: 'black', value: '#0A0A0A' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
