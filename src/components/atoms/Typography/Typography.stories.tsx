import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './Typography';
import { colors } from '../../../tokens';

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'bodyLg', 'body', 'bodySm', 'label', 'caption', 'overline',
      ],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'disabled', 'inverse', 'accent'],
    },
    truncate: { control: 'boolean' },
    lines: { control: { type: 'number', min: 1, max: 6 } },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: 'body',
    color: 'primary',
    children: 'The quick brown fox jumps over the lazy dog.',
  },
};

// ─── Type scale ───────────────────────────────────────────────────────────────

export const TypeScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '8px' }}>
      <Typography variant="display">Display — 72px / 800</Typography>
      <Typography variant="h1">Heading 1 — 48px / 800</Typography>
      <Typography variant="h2">Heading 2 — 36px / 800</Typography>
      <Typography variant="h3">Heading 3 — 30px / 700</Typography>
      <Typography variant="h4">Heading 4 — 24px / 700</Typography>
      <Typography variant="h5">Heading 5 — 20px / 600</Typography>
      <Typography variant="h6">Heading 6 — 18px / 600</Typography>
    </div>
  ),
};

// ─── Body styles ──────────────────────────────────────────────────────────────

export const BodyStyles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '560px' }}>
      <Typography variant="bodyLg">
        Body Large — Inter 300 · 18px · line-height 1.7.{' '}
        Light weight on large body text creates editorial breathing room.
      </Typography>
      <Typography variant="body">
        Body — Inter 400 · 16px · line-height 1.7.{' '}
        The default reading size for UI copy and descriptions.
      </Typography>
      <Typography variant="bodySm">
        Body Small — Inter 400 · 14px · line-height 1.5.{' '}
        Used for secondary copy, helper text, and compact layouts.
      </Typography>
    </div>
  ),
};

// ─── Technical voice (mono) ───────────────────────────────────────────────────

export const TechnicalVoice: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <Typography variant="overline" color="accent">Overline — mono / uppercase / widest tracking</Typography>
      </div>
      <div>
        <Typography variant="label">Label — JetBrains Mono · 500 · wide tracking</Typography>
      </div>
      <div>
        <Typography variant="caption" color="secondary">
          Caption — JetBrains Mono · 400 · 12px · used for metadata and timestamps
        </Typography>
      </div>
    </div>
  ),
};

// ─── Typographic tension ──────────────────────────────────────────────────────

export const TypographicTension: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '640px' }}>
      <Typography variant="overline" color="accent">Design System</Typography>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <Typography variant="display">Unity</Typography>
        <Typography variant="display" color="accent">UI</Typography>
      </div>
      <div style={{ marginTop: '8px' }}>
        <Typography variant="bodyLg" color="secondary">
          Swiss minimalism meets digital precision.
          Two typefaces. One grid. Zero compromise.
        </Typography>
      </div>
    </div>
  ),
};

// ─── Colors ───────────────────────────────────────────────────────────────────

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Typography color="primary">Primary — #0A0A0A</Typography>
      <Typography color="secondary">Secondary — #636363</Typography>
      <Typography color="disabled">Disabled — #ABABAB</Typography>
      <Typography color="accent">Accent — #0047FF</Typography>
      <div style={{ background: colors.black, padding: '12px' }}>
        <Typography color="inverse">Inverse — #FFFFFF on dark</Typography>
      </div>
    </div>
  ),
};

// ─── Truncation ───────────────────────────────────────────────────────────────

export const Truncation: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '300px' }}>
      <div>
        <Typography variant="overline" color="accent" style={{ marginBottom: '8px' }}>
          Single line
        </Typography>
        <Typography truncate>
          This is a very long text that will be truncated with an ellipsis at the end.
        </Typography>
      </div>
      <div>
        <Typography variant="overline" color="accent" style={{ marginBottom: '8px' }}>
          3 lines clamp
        </Typography>
        <Typography truncate lines={3}>
          This is a longer paragraph that will be clamped after three lines.
          It demonstrates the multi-line truncation feature using CSS line-clamp,
          which is useful for card descriptions and preview text in compact layouts.
        </Typography>
      </div>
    </div>
  ),
};
