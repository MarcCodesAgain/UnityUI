import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CountUp, StatCard, StatValue, StatLabel, StatDelta } from './CountUp';
import { colors } from '../../../tokens';

const meta: Meta<typeof CountUp> = {
  title: 'Atoms/CountUp',
  component: CountUp,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Animated number counter that starts when the element enters the viewport (via \`IntersectionObserver\`).
Designed to be used with the \`StatCard\`, \`StatValue\`, \`StatLabel\`, and \`StatDelta\` helper components
also exported from this module.

Respects \`prefers-reduced-motion\` — jumps directly to the final value when the user has requested
reduced motion in their OS settings.

\`\`\`tsx
import { CountUp, StatCard, StatValue, StatLabel, StatDelta } from '@unityui/core';

<StatCard>
  <StatValue>
    <CountUp to={128_540} separator="," prefix="$" />
  </StatValue>
  <StatLabel>Monthly revenue</StatLabel>
  <StatDelta $positive>↑ 12.4%</StatDelta>
</StatCard>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    to:       { control: { type: 'number' }, description: 'Target value to count up to.' },
    from:     { control: { type: 'number' }, description: 'Starting value (default `0`).', table: { defaultValue: { summary: '0' } } },
    duration: { control: { type: 'number' }, description: 'Animation duration in milliseconds.', table: { defaultValue: { summary: '1800' } } },
    decimals: { control: { type: 'number', min: 0, max: 4 }, description: 'Number of decimal places to display.', table: { defaultValue: { summary: '0' } } },
    prefix:   { control: 'text', description: 'String prepended to the number (e.g. `$`, `€`).' },
    suffix:   { control: 'text', description: 'String appended to the number (e.g. `%`, `K`, `×`).' },
    separator:{ control: 'text', description: 'Thousands separator character.', table: { defaultValue: { summary: ',' } } },
    easing: {
      control: 'select',
      options: ['easeOut', 'easeInOut', 'linear'],
      description: 'Animation easing function.',
      table: { defaultValue: { summary: 'easeOut' } },
    },
    triggerOnView: {
      control: 'boolean',
      description: 'Start animation when the element enters the viewport (uses `IntersectionObserver`).',
      table: { defaultValue: { summary: 'true' } },
    },
    repeat: {
      control: 'boolean',
      description: 'Re-trigger the animation every time the element enters the viewport.',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};
export default meta;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F0F0F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '48px',
        padding: '48px 24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Scroll into view to trigger — or reload the story */
export const Default: StoryObj = {
  render: () => (
    <Page>
      <StatCard>
        <StatValue>
          <CountUp to={128_540} separator="," />
        </StatValue>
        <StatLabel>Total users</StatLabel>
        <StatDelta $positive>↑ 12.4% this month</StatDelta>
      </StatCard>
    </Page>
  ),
};

/** Dashboard grid — four stats side by side */
export const Dashboard: StoryObj = {
  render: () => {
    const STATS = [
      { label: 'Components',   value: 34,        suffix: '',   delta: '+6 this sprint', positive: true },
      { label: 'Test coverage',value: 98.7,      suffix: '%',  decimals: 1, delta: '↑ 1.2%', positive: true },
      { label: 'Bundle size',  value: 14.2,      suffix: 'KB', decimals: 1, delta: '↓ 0.8KB', positive: true },
      { label: 'Lint errors',  value: 0,         suffix: '',   delta: 'All clear', positive: undefined },
    ];

    return (
      <Page>
        <div style={{ display: 'flex', gap: '1px', background: '#D0D0D0' }}>
          {STATS.map((s) => (
            <StatCard key={s.label} style={{ minWidth: 200 }}>
              <StatValue>
                <CountUp
                  to={s.value}
                  decimals={s.decimals ?? 0}
                  suffix={s.suffix}
                  duration={2000}
                />
              </StatValue>
              <StatLabel>{s.label}</StatLabel>
              <StatDelta $positive={s.positive}>{s.delta}</StatDelta>
            </StatCard>
          ))}
        </div>
      </Page>
    );
  },
};

/** Live controls — change the target value and watch it animate */
export const Interactive: StoryObj = {
  render: () => {
    const [target, setTarget] = useState(1000);
    const PRESETS = [0, 500, 1_000, 10_000, 99_999, 1_000_000];

    return (
      <Page>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setTarget(p)}
              style={{
                padding: '6px 14px',
                background: target === p ? '#0047FF' : '#fff',
                color: target === p ? '#fff' : '#111',
                border: '1px solid #D0D0D0',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {p.toLocaleString()}
            </button>
          ))}
        </div>
        <StatCard style={{ alignItems: 'center', minWidth: 280 }}>
          <StatValue style={{ fontSize: '56px' }}>
            <CountUp
              to={target}
              separator=","
              triggerOnView={false}
              duration={1200}
              easing="easeOut"
            />
          </StatValue>
          <StatLabel>Current value</StatLabel>
        </StatCard>
      </Page>
    );
  },
};

/** Currency, percentage, custom formats */
export const Formats: StoryObj = {
  render: () => (
    <Page>
      <div style={{ display: 'flex', gap: '1px', background: '#D0D0D0', flexWrap: 'wrap' }}>
        <StatCard>
          <StatValue>
            <CountUp to={24_890} prefix="$" separator="," duration={2000} />
          </StatValue>
          <StatLabel>Revenue</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>
            <CountUp to={99.6} decimals={1} suffix="%" duration={2000} />
          </StatValue>
          <StatLabel>Uptime</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>
            <CountUp to={3.7} decimals={1} suffix="×" duration={2000} />
          </StatValue>
          <StatLabel>Perf gain</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>
            <CountUp to={42} suffix=" ms" duration={1600} />
          </StatValue>
          <StatLabel>Avg response</StatLabel>
        </StatCard>
      </div>
    </Page>
  ),
};

/** Easing comparison — all three curves at once */
export const Easings: StoryObj = {
  render: () => {
    const [key, setKey] = useState(0);

    return (
      <Page>
        <button
          onClick={() => setKey((k) => k + 1)}
          style={{
            padding: '8px 20px',
            background: '#0047FF',
            color: '#fff',
            border: 'none',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '12px',
            cursor: 'pointer',
            letterSpacing: '0.08em',
          }}
        >
          REPLAY
        </button>

        <div style={{ display: 'flex', gap: '1px', background: '#D0D0D0' }}>
          {(['easeOut', 'easeInOut', 'linear'] as const).map((e) => (
            <StatCard key={`${e}-${key}`} style={{ minWidth: 180 }}>
              <StatValue>
                <CountUp
                  to={10_000}
                  separator=","
                  easing={e}
                  duration={2400}
                  triggerOnView={false}
                />
              </StatValue>
              <StatLabel style={{ color: colors.primary }}>{e}</StatLabel>
            </StatCard>
          ))}
        </div>
      </Page>
    );
  },
};
