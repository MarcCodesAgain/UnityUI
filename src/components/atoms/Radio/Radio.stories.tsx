import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Radio, RadioGroup } from './Radio';
import { Button } from '../Button';
import { Alert } from '../Alert';

const meta: Meta<typeof Radio> = {
  title: 'Atoms/Radio',
  component: Radio,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Circle radio button with a dot-pop spring animation when selected. Use \`Radio\` standalone
or compose multiple into a \`RadioGroup\` for managed name binding and group-level error state.

\`\`\`tsx
import { RadioGroup } from '@unityui/core';

<RadioGroup
  name="plan"
  label="Billing plan"
  options={[
    { value: 'free',  label: 'Free',  hint: 'Up to 3 projects' },
    { value: 'pro',   label: 'Pro',   hint: '$12 / month' },
    { value: 'team',  label: 'Team',  hint: '$49 / month' },
  ]}
  value={plan}
  onChange={setPlan}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the circle size and label font size.',
      table: { defaultValue: { summary: 'md' } },
    },
    checked:  { control: 'boolean', description: 'Controlled checked state.' },
    disabled: { control: 'boolean', description: 'Disables the radio and greys it out.' },
    label:    { control: 'text',    description: 'Label rendered to the right of the circle.' },
    hint:     { control: 'text',    description: 'Small helper text below the label (indented to align with text).' },
    error:    { control: 'text',    description: 'Error text shown below the circle in red.' },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Radio
        {...args}
        label="Select this option"
        checked={checked}
        onChange={() => setChecked((v) => !v)}
      />
    );
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Radio size="sm" label="Small radio" checked onChange={() => {}} />
      <Radio size="md" label="Medium radio" checked onChange={() => {}} />
      <Radio size="lg" label="Large radio" checked onChange={() => {}} />
    </div>
  ),
};

// ─── All states ───────────────────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '320px' }}>
      <Radio label="Unchecked" checked={false} onChange={() => {}} hint="Default state" />
      <Radio label="Checked" checked onChange={() => {}} />
      <Radio label="Error state" checked={false} onChange={() => {}} error="Please select an option" />
      <Radio label="Disabled unchecked" disabled onChange={() => {}} />
      <Radio label="Disabled checked" disabled checked onChange={() => {}} />
    </div>
  ),
};

// ─── RadioGroup — vertical ────────────────────────────────────────────────────

export const GroupVertical: Story = {
  render: () => {
    const [value, setValue] = useState('mid');
    return (
      <RadioGroup
        name="experience"
        label="Experience level"
        value={value}
        onChange={setValue}
        options={[
          { value: 'junior', label: 'Junior',    hint: '0–2 years' },
          { value: 'mid',    label: 'Mid-level',  hint: '2–5 years' },
          { value: 'senior', label: 'Senior',    hint: '5–10 years' },
          { value: 'staff',  label: 'Staff',     hint: '10+ years' },
        ]}
      />
    );
  },
};

// ─── RadioGroup — horizontal ──────────────────────────────────────────────────

export const GroupHorizontal: Story = {
  render: () => {
    const [value, setValue] = useState('light');
    return (
      <RadioGroup
        name="theme"
        label="Appearance"
        value={value}
        onChange={setValue}
        direction="horizontal"
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark',  label: 'Dark' },
          { value: 'system',label: 'System' },
        ]}
      />
    );
  },
};

// ─── RadioGroup — with error ──────────────────────────────────────────────────

export const GroupWithError: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '320px' }}>
        <RadioGroup
          name="plan"
          label="Pricing plan"
          value={value}
          onChange={(v) => { setValue(v); setSubmitted(false); }}
          error={submitted && !value ? 'Please select a plan to continue' : undefined}
          options={[
            { value: 'free',  label: 'Free',     hint: 'Up to 3 projects' },
            { value: 'pro',   label: 'Pro',      hint: '$12 / month' },
            { value: 'team',  label: 'Team',     hint: '$49 / month' },
          ]}
        />
        {submitted && value && (
          <Alert variant="success" title="Plan selected">
            You chose the <strong>{value}</strong> plan.
          </Alert>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={() => setSubmitted(true)}
        >
          Continue →
        </Button>
      </div>
    );
  },
};
