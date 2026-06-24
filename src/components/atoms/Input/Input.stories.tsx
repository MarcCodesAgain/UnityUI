import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size:      { control: 'select', options: ['sm', 'md', 'lg'] },
    label:     { control: 'text' },
    hint:      { control: 'text' },
    error:     { control: 'text' },
    success:   { control: 'text' },
    disabled:  { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    hint: "We'll never share your email.",
    size: 'md',
  },
};

// ─── All states ───────────────────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '340px' }}>
      <Input
        label="Default"
        placeholder="Type something..."
        hint="This is a helper text"
      />
      <Input
        label="Focused"
        placeholder="Click me to focus"
        hint="Accent line sweeps left → right on focus"
        autoFocus
      />
      <Input
        label="Error"
        placeholder="invalid@"
        error="Enter a valid email address"
        defaultValue="invalid@"
      />
      <Input
        label="Success"
        placeholder="you@example.com"
        success="Email is available"
        defaultValue="marc@unityui.dev"
      />
      <Input
        label="Disabled"
        placeholder="Not editable"
        hint="This field is disabled"
        disabled
        defaultValue="locked value"
      />
    </div>
  ),
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '340px' }}>
      <Input label="Small"  size="sm" placeholder="sm — 32px height" />
      <Input label="Medium" size="md" placeholder="md — 40px height" />
      <Input label="Large"  size="lg" placeholder="lg — 48px height" />
    </div>
  ),
};

// ─── Full width ───────────────────────────────────────────────────────────────

export const FullWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Input label="Full name" placeholder="Marc Llopis" fullWidth />
      <Input label="Email"     placeholder="marc@example.com" fullWidth />
    </div>
  ),
};

// ─── In context — login form ──────────────────────────────────────────────────

export const LoginForm: Story = {
  render: () => (
    <div style={{
      maxWidth: '360px',
      padding: '48px 40px',
      border: '1px solid #DEDEDE',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      <div>
        <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', margin: '0 0 8px' }}>
          UnityUI · Sign in
        </p>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '28px', margin: 0, letterSpacing: '-0.02em' }}>
          Welcome back
        </h2>
      </div>
      <Input label="Email"    placeholder="you@example.com" fullWidth type="email" />
      <Input label="Password" placeholder="••••••••"        fullWidth type="password" />
      <Input
        label="Email"
        placeholder="taken@example.com"
        fullWidth
        error="This email is already registered"
        defaultValue="taken@example.com"
      />
    </div>
  ),
};
