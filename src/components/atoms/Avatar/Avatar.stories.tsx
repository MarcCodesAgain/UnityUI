import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';
import { Typography } from '../Typography';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Square avatar (no border-radius) showing initials or an image, with an optional status dot.
Falls back from image → initials → a generated letter from the \`name\` prop.

\`\`\`tsx
import { Avatar } from '@unityui/core';

<Avatar initials="ML" size="md" status="online" />
<Avatar src="/avatars/jane.jpg" size="lg" />
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: '`xs`=24px · `sm`=32px · `md`=40px · `lg`=48px · `xl`=64px.',
      table: { defaultValue: { summary: 'md' } },
    },
    status: {
      control: 'select',
      options: ['online', 'offline', 'busy', 'away'],
      description: 'Renders a colour-coded dot in the bottom-right corner.',
    },
    src:      { control: 'text', description: 'Image URL. Falls back to initials if the image fails to load.' },
    initials: { control: 'text', description: 'One or two letter initials rendered as a fallback.' },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: { initials: 'ML', size: 'md' },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Avatar initials="ML" size={size} />
          <Typography variant="caption" color="secondary">{size}</Typography>
        </div>
      ))}
    </div>
  ),
};

// ─── With image ───────────────────────────────────────────────────────────────

export const WithImage: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar
          key={size}
          src={`https://i.pravatar.cc/150?img=3`}
          alt="Marc Llopis"
          size={size}
        />
      ))}
    </div>
  ),
};

// ─── Status dots ──────────────────────────────────────────────────────────────

export const StatusDots: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
      {(['online', 'away', 'busy', 'offline'] as const).map((status) => (
        <div key={status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <Avatar initials="ML" size="lg" status={status} />
          <Typography variant="caption" color="secondary">{status}</Typography>
        </div>
      ))}
    </div>
  ),
};

// ─── Fallback (no initials) ───────────────────────────────────────────────────

export const Fallback: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar size="md" />
      <Avatar size="md" initials="JD" />
      <Avatar size="md" src="https://i.pravatar.cc/150?img=12" alt="User" />
    </div>
  ),
};

// ─── Team row ─────────────────────────────────────────────────────────────────

export const TeamRow: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[
        { initials: 'ML', status: 'online'  as const, name: 'Marc Llopis',    role: 'Lead Designer' },
        { initials: 'AR', status: 'busy'    as const, name: 'Anna Roca',      role: 'Frontend Dev' },
        { initials: 'JP', status: 'away'    as const, name: 'Joan Puig',      role: 'Backend Dev' },
        { initials: 'SC', status: 'offline' as const, name: 'Sara Cortés',    role: 'Product Manager' },
      ].map(({ initials, status, name, role }) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar initials={initials} size="md" status={status} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Typography variant="label">{name}</Typography>
            <Typography variant="caption" color="secondary">{role}</Typography>
          </div>
        </div>
      ))}
    </div>
  ),
};
