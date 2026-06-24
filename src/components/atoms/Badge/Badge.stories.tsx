import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    dot: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: { label: 'Badge', variant: 'default', size: 'md' },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge label="Default"  variant="default"  />
      <Badge label="Primary"  variant="primary"  />
      <Badge label="Outline"  variant="outline"  />
      <Badge label="Ghost"    variant="ghost"    />
    </div>
  ),
};

// ─── With dot ─────────────────────────────────────────────────────────────────

export const WithDot: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge label="Live"     variant="primary" dot />
      <Badge label="Online"   variant="default" dot />
      <Badge label="Draft"    variant="outline" dot />
      <Badge label="Inactive" variant="ghost"   dot />
    </div>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Badge label="Small"  size="sm" variant="primary" />
      <Badge label="Medium" size="md" variant="primary" />
    </div>
  ),
};

// ─── In context ───────────────────────────────────────────────────────────────

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>

      {/* Status tags */}
      <div>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '12px' }}>
          Status
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge label="Published" variant="primary" dot />
          <Badge label="Draft"     variant="outline" dot />
          <Badge label="Archived"  variant="ghost"   dot />
        </div>
      </div>

      {/* Version tags */}
      <div>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '12px' }}>
          Release
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Badge label="v0.1.0"  variant="default" />
          <Badge label="Beta"    variant="outline" />
          <Badge label="New"     variant="primary" />
        </div>
      </div>

    </div>
  ),
};
