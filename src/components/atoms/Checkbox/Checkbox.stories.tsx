import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { Button } from '../Button';
import { Divider } from '../Divider';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Square checkbox with an animated SVG check-draw on check, and a dash for the indeterminate state.
The check path is drawn via a CSS stroke-dashoffset animation — no JS involved.

\`\`\`tsx
import { Checkbox } from '@unityui/core';

const [checked, setChecked] = useState(false);

<Checkbox
  label="Accept terms and conditions"
  checked={checked}
  onChange={() => setChecked(v => !v)}
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
      description: 'Controls the box size and label font size.',
      table: { defaultValue: { summary: 'md' } },
    },
    checked:       { control: 'boolean', description: 'Controlled checked state.' },
    indeterminate: { control: 'boolean', description: 'Renders a dash (–) instead of a check. Used for "select all" rows in tables.' },
    disabled:      { control: 'boolean', description: 'Disables interaction and greys out the control.' },
    label:         { control: 'text',    description: 'Label rendered to the right of the box.' },
    hint:          { control: 'text',    description: 'Helper text rendered below the label.' },
    error:         { control: 'text',    description: 'Error text rendered below the label in red.' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        {...args}
        label="Accept terms and conditions"
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
      <Checkbox size="sm" label="Small checkbox" checked onChange={() => {}} />
      <Checkbox size="md" label="Medium checkbox" checked onChange={() => {}} />
      <Checkbox size="lg" label="Large checkbox" checked onChange={() => {}} />
    </div>
  ),
};

// ─── All states ───────────────────────────────────────────────────────────────

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '320px' }}>
      <Checkbox label="Unchecked" checked={false} onChange={() => {}} hint="Default state" />
      <Checkbox label="Checked" checked onChange={() => {}} />
      <Checkbox label="Indeterminate" indeterminate onChange={() => {}} hint="Some items selected" />
      <Checkbox label="Error state" checked={false} onChange={() => {}} error="You must accept to continue" />
      <Checkbox label="Disabled unchecked" disabled onChange={() => {}} />
      <Checkbox label="Disabled checked" disabled checked onChange={() => {}} />
    </div>
  ),
};

// ─── Interactive toggle ───────────────────────────────────────────────────────

export const Interactive: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: 1, label: 'Design tokens',   checked: true  },
      { id: 2, label: 'Button atom',     checked: true  },
      { id: 3, label: 'Typography atom', checked: true  },
      { id: 4, label: 'Card molecule',   checked: false },
      { id: 5, label: 'Modal organism',  checked: false },
    ]);

    const allChecked  = items.every((i) => i.checked);
    const someChecked = items.some((i) => i.checked) && !allChecked;

    const toggleAll = () =>
      setItems((prev) => prev.map((i) => ({ ...i, checked: !allChecked })));

    const toggle = (id: number) =>
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
      );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '280px' }}>
        <Checkbox
          label="All components"
          checked={allChecked}
          indeterminate={someChecked}
          onChange={toggleAll}
        />
        <Divider spacing="sm" />
        {items.map(({ id, label, checked }) => (
          <Checkbox
            key={id}
            label={label}
            checked={checked}
            onChange={() => toggle(id)}
            size="sm"
          />
        ))}
      </div>
    );
  },
};

// ─── In context — consent form ────────────────────────────────────────────────

export const ConsentForm: Story = {
  render: () => {
    const [agreed, setAgreed] = useState(false);
    const [newsletter, setNewsletter] = useState(false);

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxWidth: '400px',
        padding: 'clamp(16px, 4vw, 40px)',
        border: '1px solid #DEDEDE',
      }}>
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '22px', margin: 0, letterSpacing: '-0.02em' }}>
          Almost there
        </h2>
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={agreed}
          onChange={() => setAgreed((v) => !v)}
          error={!agreed ? undefined : undefined}
          hint="Required to continue"
        />
        <Checkbox
          label="Send me product updates and design system news"
          checked={newsletter}
          onChange={() => setNewsletter((v) => !v)}
          hint="Optional — unsubscribe anytime"
        />
        <Button variant="primary" fullWidth disabled={!agreed}>
          Create account
        </Button>
      </div>
    );
  },
};
