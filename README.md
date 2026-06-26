<div align="center">

# UnityUI

**A Swiss Minimalism design system for React**

[![npm version](https://img.shields.io/npm/v/@unityui/core?style=flat-square&color=0047FF)](https://www.npmjs.com/package/@unityui/core)
[![npm downloads](https://img.shields.io/npm/dm/@unityui/core?style=flat-square&color=0047FF)](https://www.npmjs.com/package/@unityui/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-0047FF?style=flat-square)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-black?style=flat-square)](./LICENSE)
[![Tests](https://img.shields.io/badge/tests-232%20passing-22C55E?style=flat-square)](#)

Built with React 18, TypeScript, and styled-components. Inspired by the International Typographic Style — sharp edges, precise spacing, no decoration for its own sake.

[**Storybook →**](https://6a3ecef7019c1a5d67a81d71-irgzwxjhri.chromatic.com/) &nbsp;·&nbsp; [Components](#components) &nbsp;·&nbsp; [Tokens](#design-tokens) &nbsp;·&nbsp; [Contributing](#contributing)

</div>

---

## Philosophy

UnityUI follows the principles of **Swiss International Style**:

- **Typography is the hero** — Inter for editorial voice, JetBrains Mono for technical labels
- **4px grid** — every spacing value is a multiple of 4
- **Two colours** — black, white, greys, and Electric Blue `#0047FF` as the single accent
- **No decoration** — zero gradients, no heavy shadows, no rounded corners by default
- **Accessible by default** — ARIA patterns, focus management, and keyboard navigation built in

---

## Installation

```bash
npm install @unityui/core styled-components
```

UnityUI requires **React ≥ 18** and **styled-components ≥ 6** as peer dependencies.

```bash
# yarn
yarn add @unityui/core styled-components

# pnpm
pnpm add @unityui/core styled-components
```

---

## Quick start

**1. Wrap your app** with `ThemeProvider` and add `GlobalStyles` once at the root:

```tsx
// main.tsx · _app.tsx · layout.tsx
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from '@unityui/core';

export default function App({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}
```

**2. Import and use any component:**

```tsx
import { Button, Input, Typography } from '@unityui/core';

export default function Page() {
  return (
    <div>
      <Typography variant="h1">Hello, UnityUI</Typography>
      <Input label="Email" placeholder="you@example.com" fullWidth />
      <Button variant="primary">Get started</Button>
    </div>
  );
}
```

That's it — no additional CSS imports, no font setup required (fonts load via `GlobalStyles`).

---

## Components

### Atoms

| Component | Description | Key props |
|-----------|-------------|-----------|
| **Button** | Primary interaction element | `variant` · `size` · `loading` · `fullWidth` |
| **Typography** | Full type scale from Display to Caption | `variant` · `color` · `truncate` · `lines` |
| **Input** | Text field with label, hint, and state | `size` · `error` · `success` · `fullWidth` |
| **Select** | Dropdown with animated chevron | `options` · `placeholder` · `error` · `fullWidth` |
| **Checkbox** | Square checkbox with animated check | `checked` · `indeterminate` · `size` · `error` |
| **Radio / RadioGroup** | Circle radio with dot-pop animation | `options` · `direction` · `size` |
| **Badge** | Small label for status or metadata | `variant` · `size` · `dot` |
| **Alert** | Feedback banner with optional dismiss | `variant` · `title` · `onDismiss` |
| **Avatar** | Initials or image with status indicator | `initials` · `src` · `size` · `status` |
| **Divider** | Horizontal or vertical separator | `variant` · `label` · `vertical` |
| **Spinner** | Loading indicator | `size` · `variant` |
| **CountUp** | Animated number with IntersectionObserver | `to` · `from` · `prefix` · `suffix` · `easing` |

### Molecules

| Component | Description | Key props |
|-----------|-------------|-----------|
| **Card** | Content container with compound API | `Card.Header` · `Card.Body` · `Card.Footer` |
| **Table / DataTable** | Full-featured data table | `columns` · `rowKey` · `selectable` · `sortable` |
| **DataTableSkeleton** | Shimmer loading placeholder | `columns` · `rows` |
| **SpotlightCard** | Interactive card with cursor-glow effect | `glowColor` · `glowSize` · `glowIntensity` |

### Organisms

| Component | Description | Key props |
|-----------|-------------|-----------|
| **Form** | Config-driven form with validation | `fields` · `onSubmit` · `initialValues` |
| **Modal** | Accessible dialog with focus trap | `isOpen` · `onClose` · `size` · `closeOnBackdrop` |
| **CommandPalette** | ⌘K fuzzy-search command palette | `items` · `placeholder` · `isOpen` · `onClose` |

---

## Usage examples

### Button

```tsx
import { Button } from '@unityui/core';

// Variants
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Learn more</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>   // default
<Button size="lg">Large</Button>

// States
<Button loading>Saving…</Button>
<Button disabled>Unavailable</Button>
<Button fullWidth>Full width</Button>
```

### Input & Select

```tsx
import { Input, Select } from '@unityui/core';

<Input
  label="Email address"
  placeholder="you@example.com"
  hint="We'll never share your email."
  type="email"
  fullWidth
/>

<Input
  label="Password"
  error="Password must be at least 8 characters"
  type="password"
  fullWidth
/>

<Select
  label="Country"
  placeholder="Select a country…"
  options={[
    { value: 'es', label: 'Spain' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ]}
  fullWidth
/>
```

### Form

The `<Form>` component accepts a declarative field config and handles validation, loading states, and success messages automatically:

```tsx
import { Form, type FormValues } from '@unityui/core';

<Form
  title="Create account"
  description="Join UnityUI and start building."
  submitLabel="Create account →"
  successMessage="You're in! Welcome to UnityUI."
  onSubmit={async (values: FormValues) => {
    await api.createUser(values);
  }}
  fields={[
    {
      name: 'name',
      type: 'input',
      label: 'Full name',
      placeholder: 'Marc Llopis',
      required: true,
    },
    {
      name: 'email',
      type: 'input',
      label: 'Email',
      inputType: 'email',
      placeholder: 'you@example.com',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      options: [
        { value: 'designer', label: 'Designer' },
        { value: 'dev',      label: 'Developer' },
        { value: 'pm',       label: 'Product Manager' },
      ],
    },
    {
      name: 'terms',
      type: 'checkbox',
      checkboxLabel: 'I agree to the Terms of Service',
      required: true,
    },
  ]}
/>
```

**Field types:** `input` · `select` · `checkbox` · `radio` · `textarea`

Need a custom layout? Use the exported primitives directly:

```tsx
import { FieldWrapper, FieldLabel, FieldHint, FieldRow } from '@unityui/core';

// Two-column layout
<FieldRow>
  <FieldWrapper>
    <FieldLabel htmlFor="first">First name</FieldLabel>
    <Input id="first" fullWidth />
  </FieldWrapper>
  <FieldWrapper>
    <FieldLabel htmlFor="last">Last name</FieldLabel>
    <Input id="last" fullWidth />
  </FieldWrapper>
</FieldRow>
```

### Modal

```tsx
import { Modal, useModal, Button } from '@unityui/core';

function DeleteDialog() {
  const modal = useModal();

  return (
    <>
      <Button variant="primary" onClick={modal.open}>Delete</Button>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.close}
        title="Confirm deletion"
        size="sm"
      >
        <Modal.Body>
          This action is permanent and cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={modal.close}>Cancel</Button>
          <Button onClick={modal.close}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

Modal sizes: `sm` · `md` (default) · `lg` · `xl`

### CommandPalette

```tsx
import { CommandPalette, useCommandPalette } from '@unityui/core';
import type { CommandItem } from '@unityui/core';

const COMMANDS: CommandItem[] = [
  {
    id: 'new-doc',
    label: 'New document',
    icon: '✦',
    group: 'Actions',
    shortcut: ['⌘', 'N'],
    keywords: ['create', 'add', 'file'],
    onSelect: () => createDocument(),
  },
  {
    id: 'settings',
    label: 'Open settings',
    icon: '⚙',
    group: 'Navigation',
    shortcut: ['⌘', ','],
    onSelect: () => router.push('/settings'),
  },
];

function App() {
  const cmd = useCommandPalette();

  return (
    <>
      {/* Triggered by ⌘K / Ctrl+K automatically */}
      <CommandPalette
        isOpen={cmd.isOpen}
        onClose={cmd.close}
        items={COMMANDS}
        placeholder="Search commands…"
      />
    </>
  );
}
```

### DataTable

```tsx
import { DataTable, type ColumnDef } from '@unityui/core';

interface User {
  id:     string;
  name:   string;
  email:  string;
  role:   string;
}

const columns: ColumnDef<User>[] = [
  { key: 'name',  header: 'Name',  accessor: 'name',  sortable: true },
  { key: 'email', header: 'Email', accessor: 'email' },
  { key: 'role',  header: 'Role',  accessor: 'role',  sortable: true },
  {
    key: 'actions',
    header: '',
    accessor: (row) => <Button size="sm" variant="ghost">Edit</Button>,
    width: '80px',
  },
];

<DataTable
  columns={columns}
  data={users}
  rowKey="id"
  selectable
  onSelectionChange={(selected) => console.log(selected)}
  striped
  stickyHeader
/>
```

### CountUp

```tsx
import { CountUp, StatCard, StatValue, StatLabel, StatDelta } from '@unityui/core';

// Animates when it enters the viewport
<StatCard>
  <StatValue>
    <CountUp to={128_540} separator="," prefix="$" />
  </StatValue>
  <StatLabel>Monthly revenue</StatLabel>
  <StatDelta $positive>↑ 12.4% vs last month</StatDelta>
</StatCard>

// Formats
<CountUp to={99.6}    decimals={1} suffix="%" />   // 99.6%
<CountUp to={24_890}  prefix="$"  separator="," />  // $24,890
<CountUp to={3.7}     decimals={1} suffix="×" />    // 3.7×

// Easing options: 'easeOut' (default) | 'easeInOut' | 'linear'
<CountUp to={1000} easing="easeInOut" duration={2400} />
```

---

## Design Tokens

All tokens are exported as typed constants. Import and use them directly in `styled-components`, inline styles, or anywhere in your app.

### Colors

```tsx
import { colors } from '@unityui/core';

// Brand
colors.primary    // #0047FF  Electric Blue — the single accent
colors.black      // #0A0A0A
colors.white      // #FFFFFF

// Greys (50 → 900)
colors.grey50     // #FAFAFA
colors.grey100    // #EFEFEF
colors.grey200    // #DEDEDE
colors.grey400    // #ABABAB
colors.grey600    // #636363
colors.grey900    // #0A0A0A

// Semantic
colors.textPrimary    // #0A0A0A
colors.textSecondary  // #636363
colors.textDisabled   // #ABABAB
colors.borderDefault  // #DEDEDE
colors.borderFocus    // #0A0A0A
colors.bgPage         // #FFFFFF
colors.bgSurface      // #F7F7F7

// State
colors.errorDefault   // #E63329
colors.successDefault // #16A34A
colors.warningDefault // #D97706

// Blue scale (for selection states)
colors.blue50         // #EFF4FF
colors.blue100        // #DBEAFE
colors.primary        // #0047FF  (= blue500)
```

### Spacing (4px grid)

```tsx
import { spacing } from '@unityui/core';

spacing[1]   // 4px
spacing[2]   // 8px
spacing[3]   // 12px
spacing[4]   // 16px
spacing[5]   // 20px
spacing[6]   // 24px
spacing[8]   // 32px
spacing[10]  // 40px
spacing[12]  // 48px
spacing[16]  // 64px
```

### Typography

```tsx
import { fontSize, fontWeight, fontFamily, letterSpacing, lineHeight } from '@unityui/core';

// Font families
fontFamily.base   // 'Inter, system-ui, sans-serif'
fontFamily.mono   // 'JetBrains Mono, monospace'

// Font sizes
fontSize.xs       // 12px    — labels, captions, overlines
fontSize.sm       // 14px
fontSize.base     // 16px    — body text default
fontSize.lg       // 18px
fontSize.xl       // 20px
fontSize['2xl']   // 24px
fontSize['3xl']   // 30px
fontSize['4xl']   // 36px
fontSize['5xl']   // 48px
fontSize['6xl']   // 60px
fontSize['7xl']   // 72px    — display

// Font weights
fontWeight.light      // 300
fontWeight.regular    // 400
fontWeight.medium     // 500
fontWeight.semibold   // 600
fontWeight.bold       // 700
fontWeight.black      // 800
```

### Borders

```tsx
import { borderWidth } from '@unityui/core';

borderWidth[1]   // 1px   — default for inputs, cards, dividers
borderWidth[2]   // 2px   — focus indicators, active states
```

### Using tokens with styled-components

```tsx
import styled from 'styled-components';
import { colors, spacing, fontSize, fontFamily } from '@unityui/core';

const Card = styled.div`
  background: ${colors.bgSurface};
  border: 1px solid ${colors.borderDefault};
  padding: ${spacing[6]};
  font-size: ${fontSize.sm};
  font-family: ${fontFamily.base};
`;
```

### Using the theme object

The same tokens are available through the styled-components `ThemeProvider`:

```tsx
import styled from 'styled-components';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgSurface};
  padding: ${({ theme }) => theme.spacing[6]};
`;
```

---

## Storybook

Explore all components interactively:

```bash
npm run storybook
# Opens at http://localhost:6006
```

---

## Contributing & development

```bash
git clone https://github.com/marcllopis/unityui
cd unityui
npm install

npm run dev            # Vite dev server
npm run storybook      # Component explorer at :6006
npm run test           # Vitest + React Testing Library
npm run test:coverage  # Coverage report
npm run build          # Library build → dist/
npm run lint           # oxlint
```

### Project structure

```
src/
├── tokens/                  # Design tokens (colors, spacing, typography…)
├── styles/                  # GlobalStyles, theme, FontLoader
├── components/
│   ├── shared/              # Shared styled primitives (fieldStyles.ts)
│   ├── atoms/               # Button, Input, Select, Checkbox, Radio…
│   ├── molecules/           # Card, Table, SpotlightCard
│   └── organisms/           # Form, Modal, CommandPalette
└── index.ts                 # Public API
```

### Adding a new component

1. Create `src/components/atoms/MyComponent/`
2. Add `MyComponent.tsx`, `index.ts`, `MyComponent.stories.tsx`, `MyComponent.test.tsx`
3. Export from `src/index.ts`

---

## Publishing

```bash
npm run build          # Runs automatically via prepublishOnly
npm publish --access public
```

| Output file | Format | For |
|-------------|--------|-----|
| `dist/unityui.mjs` | ESM | Vite, modern bundlers |
| `dist/unityui.cjs` | CJS | Next.js, Jest, CommonJS |
| `dist/index.d.ts`  | Types | TypeScript |

React and styled-components are **not bundled** — they are `peerDependencies`. This avoids duplicate React instances and keeps the bundle lean (84 kB ESM, 73 kB CJS before gzip → **20 kB / 18 kB gzipped**).

---

## FAQ

**Do I need styled-components?**
Yes — UnityUI is built on styled-components and requires it as a peer dependency. If your project uses a different CSS-in-JS solution, UnityUI isn't the right fit today.

**Does it work with Next.js?**
Yes. Use the CJS build in the `require` field and configure styled-components SSR via their [official Next.js guide](https://styled-components.com/docs/advanced#nextjs). The `exports` field in `package.json` handles the ESM/CJS split automatically.

**Can I use only some components (tree shaking)?**
Yes. The package has `"sideEffects": false` which tells bundlers to tree-shake anything you don't import. Only the components you use end up in your bundle.

**Is TypeScript required?**
No, but recommended. All components are strictly typed and ship full type declarations. You get autocomplete and prop validation out of the box.

**Does it support dark mode?**
Not yet out of the box, but the semantic tokens (`bgPage`, `textPrimary`, etc.) are designed to be overridden via a second `ThemeProvider` or CSS custom properties. This is on the roadmap.

---

## Architecture notes

<details>
<summary><strong>Why Electric Blue (#0047FF) as the sole accent?</strong></summary>

Swiss design uses restraint. One accent colour forces every decision to matter — you can't hide poor hierarchy behind multiple competing colours. Electric Blue references precision instruments and digital screens without the coldness of corporate blues.

</details>

<details>
<summary><strong>Why styled-components over Tailwind or CSS Modules?</strong></summary>

styled-components allows co-locating styles with component logic, supports the `ThemeProvider` pattern for clean token distribution, and generates scoped class names automatically. For a design system where tokens need to flow through every component, this is the cleanest model at the current scale.

</details>

<details>
<summary><strong>Why a separate tsconfig.build.json?</strong></summary>

The dev tsconfig uses `allowImportingTsExtensions: true` which requires `noEmit: true` — TypeScript won't emit files in this mode. The build tsconfig disables that flag so `vite-plugin-dts` can emit `.d.ts` declarations cleanly without affecting the dev experience.

</details>

<details>
<summary><strong>Why Vitest over Jest?</strong></summary>

Vitest shares Vite's transform pipeline, meaning tests run against the exact same code that gets built. No separate Babel config, no transform mismatch, native ESM support, faster cold start.

</details>

---

## License

MIT © [Marc Llopis](https://github.com/marcllopis)
