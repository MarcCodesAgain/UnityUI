import type { Meta, StoryObj } from '@storybook/react-vite';
import { SpotlightCard } from './SpotlightCard';
import { colors } from '../../../tokens';

const meta: Meta<typeof SpotlightCard> = {
  title: 'Molecules/SpotlightCard',
  component: SpotlightCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Card with an interactive cursor-glow effect. As you move your cursor across the card, a radial
gradient follows it — creating a spotlight illusion.

**Performance:** the glow position is written directly to CSS custom properties via
\`element.style.setProperty()\` on every \`mousemove\`. React is never involved in that path —
zero re-renders per mouse event.

\`\`\`tsx
import { SpotlightCard } from '@unityui/core';

<SpotlightCard glowColor="#0047FF" glowIntensity={0.12} onClick={() => navigate('/features')}>
  <SpotlightCard.Body>
    <SpotlightCard.Icon>⚡</SpotlightCard.Icon>
    <SpotlightCard.Title>Fast by default</SpotlightCard.Title>
    <SpotlightCard.Description>Zero-overhead. Tree-shakeable. Fully typed.</SpotlightCard.Description>
  </SpotlightCard.Body>
</SpotlightCard>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    glowColor: {
      control: 'color',
      description: 'Hex colour for the glow. Must be a 6-digit hex string (e.g. `#0047FF`).',
      table: { defaultValue: { summary: '#0047FF' } },
    },
    glowSize: {
      control: { type: 'number', min: 100, max: 800, step: 50 },
      description: 'Radius of the spotlight in pixels.',
      table: { defaultValue: { summary: '400' } },
    },
    glowIntensity: {
      control: { type: 'range', min: 0, max: 0.5, step: 0.01 },
      description: 'Peak opacity of the glow (0–1).',
      table: { defaultValue: { summary: '0.12' } },
    },
    onClick: {
      description: 'When provided, the card becomes interactive: pointer cursor, keyboard focusable, `role="button"`.',
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Move your cursor across the card */
export const Default: StoryObj = {
  render: () => (
    <Page>
      <SpotlightCard style={{ width: 360, padding: 0 }}>
        <SpotlightCard.Body>
          <SpotlightCard.Icon>⚡</SpotlightCard.Icon>
          <SpotlightCard.Title style={{ marginTop: '16px' }}>
            Fast by default
          </SpotlightCard.Title>
          <SpotlightCard.Description>
            UnityUI components are built with performance in mind — zero runtime
            overhead, tree-shakeable, and fully typed.
          </SpotlightCard.Description>
        </SpotlightCard.Body>
        <SpotlightCard.Footer>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#888', letterSpacing: '0.08em' }}>
            HOVER TO SEE EFFECT
          </span>
        </SpotlightCard.Footer>
      </SpotlightCard>
    </Page>
  ),
};

/** The classic showcase: a grid where each card reacts independently */
export const Grid: StoryObj = {
  render: () => {
    const CARDS = [
      { icon: '⚡', title: 'Lightning fast',       desc: 'Zero-overhead components. Ships only what you use.' },
      { icon: '🎨', title: 'Design tokens',         desc: 'Every value is a token — color, space, type, all consistent.' },
      { icon: '♿', title: 'Accessible',             desc: 'ARIA patterns, focus management, and keyboard nav built in.' },
      { icon: '✦',  title: 'Swiss Minimalism',      desc: 'No decoration for its own sake. Every element has a purpose.' },
      { icon: '📦', title: 'Fully typed',            desc: 'First-class TypeScript. Autocomplete everywhere.' },
      { icon: '🌙', title: 'Dark mode ready',        desc: 'Semantic tokens adapt to any color scheme automatically.' },
    ];

    return (
      <Page>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 300px)',
            gap: '1px',
            background: '#D0D0D0',
          }}
        >
          {CARDS.map((c) => (
            <SpotlightCard key={c.title} style={{ padding: 0, background: '#F7F7F7' }}>
              <SpotlightCard.Body>
                <SpotlightCard.Icon>{c.icon}</SpotlightCard.Icon>
                <SpotlightCard.Title style={{ marginTop: '14px' }}>{c.title}</SpotlightCard.Title>
                <SpotlightCard.Description>{c.desc}</SpotlightCard.Description>
              </SpotlightCard.Body>
            </SpotlightCard>
          ))}
        </div>
      </Page>
    );
  },
};

/** Dark background — glow is more dramatic */
export const DarkSurface: StoryObj = {
  render: () => {
    const CARDS = [
      { icon: '⌘', title: 'Command palette', desc: 'Fuzzy search across all commands with ⌘K.' },
      { icon: '◻', title: 'Modal system',     desc: 'Focus-trapped, animated, accessible dialogs.' },
      { icon: '⊞', title: 'Data table',       desc: 'Sort, select, skeleton — all in one component.' },
    ];

    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0A0A0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {CARDS.map((c) => (
            <SpotlightCard
              key={c.title}
              glowSize={500}
              glowIntensity={0.18}
              style={{
                width: 260,
                padding: 0,
                background: '#111',
                borderColor: '#2a2a2a',
              }}
            >
              <SpotlightCard.Body>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{c.icon}</div>
                <SpotlightCard.Title style={{ color: '#fff' }}>{c.title}</SpotlightCard.Title>
                <SpotlightCard.Description style={{ color: '#666' }}>{c.desc}</SpotlightCard.Description>
              </SpotlightCard.Body>
            </SpotlightCard>
          ))}
        </div>
      </div>
    );
  },
};

/** Custom glow colour */
export const CustomGlow: StoryObj = {
  render: () => (
    <Page>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <SpotlightCard glowColor={colors.primary} glowIntensity={0.15} style={{ width: 220, padding: 0 }}>
          <SpotlightCard.Body>
            <SpotlightCard.Title>Electric Blue</SpotlightCard.Title>
            <SpotlightCard.Description>Default brand colour</SpotlightCard.Description>
          </SpotlightCard.Body>
        </SpotlightCard>

        <SpotlightCard glowColor="#22C55E" glowIntensity={0.15} style={{ width: 220, padding: 0 }}>
          <SpotlightCard.Body>
            <SpotlightCard.Title>Success Green</SpotlightCard.Title>
            <SpotlightCard.Description>Positive states</SpotlightCard.Description>
          </SpotlightCard.Body>
        </SpotlightCard>

        <SpotlightCard glowColor="#F59E0B" glowIntensity={0.15} style={{ width: 220, padding: 0 }}>
          <SpotlightCard.Body>
            <SpotlightCard.Title>Warning Amber</SpotlightCard.Title>
            <SpotlightCard.Description>Caution states</SpotlightCard.Description>
          </SpotlightCard.Body>
        </SpotlightCard>

        <SpotlightCard glowColor="#EF4444" glowIntensity={0.15} style={{ width: 220, padding: 0 }}>
          <SpotlightCard.Body>
            <SpotlightCard.Title>Error Red</SpotlightCard.Title>
            <SpotlightCard.Description>Destructive states</SpotlightCard.Description>
          </SpotlightCard.Body>
        </SpotlightCard>
      </div>
    </Page>
  ),
};
