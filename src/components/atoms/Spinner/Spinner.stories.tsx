import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';
import { colors } from '../../../tokens';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size:    { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['default', 'inverse'] },
    label:   { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Playground: Story = {
  args: { size: 'md', variant: 'default', label: 'Loading' },
};

// ─── All sizes ────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

// ─── Inverse (on dark bg) ─────────────────────────────────────────────────────

export const Inverse: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
      padding: '32px',
      backgroundColor: colors.black,
    }}>
      <Spinner size="sm" variant="inverse" />
      <Spinner size="md" variant="inverse" />
      <Spinner size="lg" variant="inverse" />
      <Spinner size="xl" variant="inverse" />
    </div>
  ),
};

// ─── In context ───────────────────────────────────────────────────────────────

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '320px' }}>

      {/* Inline with text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Spinner size="sm" />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: colors.textSecondary }}>
          Saving changes...
        </span>
      </div>

      {/* Centered loading state */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '48px',
        border: `1px solid ${colors.borderDefault}`,
      }}>
        <Spinner size="lg" />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.textSecondary }}>
          Loading
        </span>
      </div>

      {/* On primary button */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 24px',
        backgroundColor: colors.black,
        cursor: 'wait',
      }}>
        <Spinner size="sm" variant="inverse" />
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: colors.white, letterSpacing: '0.08em' }}>
          Processing
        </span>
      </div>

    </div>
  ),
};
