import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Atoms/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Semantic separator rendered as \`<hr>\` (horizontal) or \`<div role="separator">\` (vertical).
Supports three visual weights and an optional inline label.

\`\`\`tsx
import { Divider } from '@unityui/core';

// Horizontal with label
<Divider label="Or continue with" />

// Accent variant between sections
<Divider variant="accent" spacing="lg" />

// Vertical inside a flex row
<div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
  <span>Home</span>
  <Divider orientation="vertical" spacing="sm" />
  <span>About</span>
</div>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Direction of the divider line.',
      table: { defaultValue: { summary: 'horizontal' } },
    },
    variant: {
      control: 'select',
      options: ['default', 'strong', 'accent'],
      description: '`default` — subtle grey · `strong` — darker grey · `accent` — Electric Blue.',
      table: { defaultValue: { summary: 'default' } },
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
      description: 'Vertical (or horizontal for vertical orientation) margin around the line.',
      table: { defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'Optional text centred on the line. Only applies to horizontal dividers.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Playground: Story = {
  args: { variant: 'default', spacing: 'md' },
  render: (args) => (
    <div style={{ padding: '0 16px' }}>
      <p style={{ fontFamily: 'Inter, sans-serif', marginBottom: '0' }}>Section above</p>
      <Divider {...args} />
      <p style={{ fontFamily: 'Inter, sans-serif', marginTop: '0' }}>Section below</p>
    </div>
  ),
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '0' }}>
      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', margin: '0 0 8px' }}>Default</p>
      <Divider variant="default" spacing="sm" />

      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', margin: '0 0 8px' }}>Strong</p>
      <Divider variant="strong" spacing="sm" />

      <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', margin: '0 0 8px' }}>Accent</p>
      <Divider variant="accent" spacing="sm" />
    </div>
  ),
};

// ─── With label ───────────────────────────────────────────────────────────────

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '0' }}>
      <Divider label="Or continue with" spacing="sm" />
      <Divider label="Section 02" variant="strong" spacing="sm" />
      <Divider label="New" variant="accent" spacing="sm" />
    </div>
  ),
};

// ─── Vertical ─────────────────────────────────────────────────────────────────

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: '40px', padding: '0 16px' }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>Home</span>
      <Divider orientation="vertical" spacing="sm" />
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>About</span>
      <Divider orientation="vertical" spacing="sm" />
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>Work</span>
      <Divider orientation="vertical" variant="accent" spacing="sm" />
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#0047FF' }}>Contact</span>
    </div>
  ),
};

// ─── In context ───────────────────────────────────────────────────────────────

export const InContext: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: '16px', fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{ fontWeight: 800, fontSize: '20px', margin: '0 0 4px' }}>Account settings</h3>
      <p style={{ fontSize: '14px', color: '#636363', margin: 0 }}>Manage your preferences</p>
      <Divider variant="strong" spacing="md" />

      <h4 style={{ fontWeight: 700, fontSize: '16px', margin: '0 0 4px' }}>Profile</h4>
      <p style={{ fontSize: '14px', color: '#636363', margin: 0 }}>Update your personal info</p>
      <Divider spacing="md" />

      <h4 style={{ fontWeight: 700, fontSize: '16px', margin: '0 0 4px' }}>Notifications</h4>
      <p style={{ fontSize: '14px', color: '#636363', margin: 0 }}>Choose what you hear about</p>
      <Divider spacing="md" />

      <Divider label="Danger zone" variant="accent" spacing="none" />
    </div>
  ),
};
