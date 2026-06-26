import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CommandPalette, useCommandPalette } from './CommandPalette';
import type { CommandItem } from './CommandPalette';

const meta: Meta<typeof CommandPalette> = {
  title: 'Organisms/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
⌘K command palette with fuzzy search, keyboard navigation, grouping, and shortcut hints.

The \`useCommandPalette()\` hook registers the \`⌘K\` / \`Ctrl+K\` global shortcut automatically.
Fuzzy scoring: exact match → prefix → contains → keyword → description → character-sequence.

\`\`\`tsx
import { CommandPalette, useCommandPalette, type CommandItem } from '@unityui/core';

const COMMANDS: CommandItem[] = [
  {
    id: 'go-home',
    label: 'Go to Home',
    icon: '🏠',
    group: 'Navigation',
    shortcut: ['⌘', 'H'],
    onSelect: () => router.push('/'),
  },
  {
    id: 'new-doc',
    label: 'New document',
    icon: '✦',
    group: 'Actions',
    keywords: ['create', 'add'],
    onSelect: () => createDocument(),
  },
];

function App() {
  const cmd = useCommandPalette();
  return (
    <CommandPalette
      isOpen={cmd.isOpen}
      onClose={cmd.close}
      items={COMMANDS}
    />
  );
}
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    placeholder:   { control: 'text', description: 'Placeholder text in the search input.', table: { defaultValue: { summary: 'Search commands…' } } },
    emptyMessage:  { control: 'text', description: 'Message shown when no items match the query.', table: { defaultValue: { summary: 'No results' } } },
    isOpen:        { description: 'Controlled open state.' },
    onClose:       { description: 'Called when the palette requests to close (Escape or backdrop click).' },
    items:         { description: 'Array of `CommandItem` objects. See type definition for full shape.' },
  },
};
export default meta;

// ─── Sample items ──────────────────────────────────────────────────────────────

const ITEMS: CommandItem[] = [
  // Navigation
  {
    id: 'nav-home',
    label: 'Go to Home',
    icon: '🏠',
    group: 'Navigation',
    shortcut: ['⌘', 'H'],
    onSelect: () => alert('→ Home'),
  },
  {
    id: 'nav-components',
    label: 'Go to Components',
    description: 'Browse all design system components',
    icon: '⚡',
    group: 'Navigation',
    onSelect: () => alert('→ Components'),
  },
  {
    id: 'nav-tokens',
    label: 'Go to Tokens',
    description: 'Colors, spacing, typography',
    icon: '🎨',
    group: 'Navigation',
    onSelect: () => alert('→ Tokens'),
  },
  {
    id: 'nav-docs',
    label: 'Open Documentation',
    icon: '📚',
    group: 'Navigation',
    shortcut: ['⌘', 'D'],
    keywords: ['docs', 'help', 'guide'],
    onSelect: () => alert('→ Docs'),
  },

  // Actions
  {
    id: 'action-new',
    label: 'Create New Component',
    description: 'Scaffold a new atom, molecule or organism',
    icon: '✦',
    group: 'Actions',
    shortcut: ['⌘', 'N'],
    onSelect: () => alert('Create component'),
  },
  {
    id: 'action-search',
    label: 'Search Files',
    icon: '🔍',
    group: 'Actions',
    shortcut: ['⌘', 'P'],
    keywords: ['find', 'file', 'open'],
    onSelect: () => alert('Search files'),
  },
  {
    id: 'action-export',
    label: 'Export Tokens',
    description: 'Download tokens as JSON or CSS variables',
    icon: '⬇',
    group: 'Actions',
    keywords: ['download', 'json', 'css', 'variables'],
    onSelect: () => alert('Export tokens'),
  },
  {
    id: 'action-build',
    label: 'Build Library',
    description: 'Run npm run build',
    icon: '⚙',
    group: 'Actions',
    shortcut: ['⌘', 'B'],
    onSelect: () => alert('Build'),
  },

  // Theme
  {
    id: 'theme-dark',
    label: 'Switch to Dark Mode',
    icon: '🌑',
    group: 'Theme',
    keywords: ['dark', 'night', 'theme'],
    onSelect: () => alert('Dark mode'),
  },
  {
    id: 'theme-light',
    label: 'Switch to Light Mode',
    icon: '☀',
    group: 'Theme',
    keywords: ['light', 'day', 'theme'],
    onSelect: () => alert('Light mode'),
  },
  {
    id: 'theme-system',
    label: 'Use System Theme',
    icon: '💻',
    group: 'Theme',
    keywords: ['auto', 'system', 'os'],
    onSelect: () => alert('System theme'),
  },

  // Help
  {
    id: 'help-shortcuts',
    label: 'Keyboard Shortcuts',
    icon: '⌨',
    group: 'Help',
    shortcut: ['?'],
    onSelect: () => alert('Shortcuts'),
  },
  {
    id: 'help-github',
    label: 'View on GitHub',
    description: '@unityui/core source code',
    icon: '⬡',
    group: 'Help',
    keywords: ['source', 'code', 'repo'],
    onSelect: () => alert('GitHub'),
  },
  {
    id: 'help-changelog',
    label: 'Changelog',
    description: "What's new in UnityUI",
    icon: '📋',
    group: 'Help',
    keywords: ['release', 'version', 'updates'],
    onSelect: () => alert('Changelog'),
  },
];

// ─── Decorator: shows a button to open + global ⌘K hint ──────────────────────

function PaletteWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F7F7F7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {children}
    </div>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: StoryObj = {
  render: () => {
    const cmd = useCommandPalette();
    return (
      <PaletteWrapper>
        <button
          onClick={cmd.open}
          style={{
            padding: '10px 20px',
            background: '#0047FF',
            color: '#fff',
            border: 'none',
            fontFamily: 'inherit',
            fontSize: '14px',
            cursor: 'pointer',
            letterSpacing: '0.04em',
          }}
        >
          Open Command Palette
        </button>
        <span style={{ fontSize: '12px', color: '#888', fontFamily: 'JetBrains Mono, monospace' }}>
          or press ⌘K
        </span>
        <CommandPalette {...cmd} items={ITEMS} />
      </PaletteWrapper>
    );
  },
};

export const OpenByDefault: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <PaletteWrapper>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '10px 20px',
            background: '#0047FF',
            color: '#fff',
            border: 'none',
            fontFamily: 'inherit',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Reopen
        </button>
        <CommandPalette
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          items={ITEMS}
        />
      </PaletteWrapper>
    );
  },
};

export const EmptyState: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <PaletteWrapper>
        <CommandPalette
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          items={[]}
          emptyMessage="No commands registered"
        />
      </PaletteWrapper>
    );
  },
};

export const FewItems: StoryObj = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const items: CommandItem[] = [
      { id: '1', label: 'New File',    icon: '✦', shortcut: ['⌘', 'N'], onSelect: () => {} },
      { id: '2', label: 'Open File',   icon: '📂', shortcut: ['⌘', 'O'], onSelect: () => {} },
      { id: '3', label: 'Save',        icon: '💾', shortcut: ['⌘', 'S'], onSelect: () => {} },
      { id: '4', label: 'Close Tab',   icon: '✕',  shortcut: ['⌘', 'W'], onSelect: () => {} },
    ];
    return (
      <PaletteWrapper>
        <CommandPalette
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          items={items}
        />
      </PaletteWrapper>
    );
  },
};
