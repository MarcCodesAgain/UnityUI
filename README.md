# UnityUI

> Swiss Minimalism Design System built with React + TypeScript + Styled Components.

![npm](https://img.shields.io/npm/v/@unityui/core)
![license](https://img.shields.io/badge/license-MIT-black)
![typescript](https://img.shields.io/badge/TypeScript-strict-blue)

---

## Philosophy

UnityUI follows the principles of **Swiss International Style** (International Typographic Style):

- Typography is the hero — not decoration
- Strict grid based on a **4px scale**
- Palette of black, white, greys + Electric Blue accent (`#0047FF`)
- No gradients, no heavy shadows, no large border-radius
- Every component is functional first, beautiful by constraint

---

## Installation

```bash
npm install @unityui/core styled-components
```

UnityUI requires **React ≥ 18** and **styled-components ≥ 6** as peer dependencies — install them if you don't have them already.

---

## Setup

Wrap your app with `ThemeProvider` and add `GlobalStyles` once at the root:

```tsx
// main.tsx / _app.tsx / layout.tsx
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

`GlobalStyles` applies a CSS reset, sets Inter as the base font, and wires up `focus-visible` accessibility outlines.

---

## Usage

```tsx
import { Button, Typography, Badge } from '@unityui/core';

export default function Page() {
  return (
    <>
      <Typography variant="h1">Hello, UnityUI</Typography>
      <Button variant="primary" size="md">Get started</Button>
      <Badge label="New" />
    </>
  );
}
```

### Tokens

All design tokens are exported and fully typed:

```tsx
import { colors, spacing, fontSize } from '@unityui/core';

const RedText = styled.p`
  color: ${colors.primary};        // #E63329
  font-size: ${fontSize.lg};       // 18px
  margin-top: ${spacing[4]};       // 16px
`;
```

---

## Components

| Component  | Status | Variants |
|------------|--------|----------|
| Button     | ✅     | `primary` · `secondary` · `ghost` — sizes `sm` · `md` · `lg` |
| Typography | ✅     | `display` · `h1`–`h6` · `bodyLg` · `body` · `bodySm` · `label` · `caption` · `overline` |
| Input      | ✅     | default · error · success · disabled — sizes `sm` · `md` · `lg` — label · hint |
| Badge      | ✅     | `default` · `primary` · `outline` · `ghost` — dot indicator — sizes `sm` · `md` |
| Divider    | ✅     | `default` · `strong` · `accent` — horizontal/vertical — optional label |
| Card       | ✅     | `default` · `outlined` · `ghost` — compound (Card.Header/Body/Footer) — interactive hover |
| Spinner    | ✅     | sizes `sm` · `md` · `lg` · `xl` — variants `default` · `inverse` |
| Modal      | 🔜     | — |
| Navigation | 🔜     | — |

---

## Design Tokens

### Colors

```ts
import { colors } from '@unityui/core';

colors.black          // #0A0A0A
colors.white          // #FFFFFF
colors.grey100        // #EFEFEF  ...up to grey900
colors.primary        // #0047FF  (Electric Blue accent)
colors.textPrimary    // #0A0A0A
colors.textSecondary  // #636363
colors.textDisabled   // #ABABAB
colors.borderDefault  // #DEDEDE
colors.borderFocus    // #0A0A0A
colors.bgPage         // #FFFFFF
colors.bgSurface      // #F7F7F7
```

### Spacing (4px grid)

```ts
import { spacing } from '@unityui/core';

spacing[1]   // 4px
spacing[2]   // 8px
spacing[4]   // 16px
spacing[6]   // 24px
spacing[8]   // 32px
spacing[12]  // 48px
spacing[16]  // 64px
```

### Typography

```ts
import { fontSize, fontWeight, textStyles } from '@unityui/core';

fontSize.sm      // 14px
fontSize.base    // 16px
fontSize.xl      // 20px
fontSize['4xl']  // 36px

fontWeight.regular   // 400
fontWeight.medium    // 500
fontWeight.semibold  // 600
fontWeight.bold      // 700

// Pre-composed text styles (font + size + weight + line-height + tracking)
textStyles.h1
textStyles.body
textStyles.label
textStyles.overline
```

### Borders

```ts
import { borderRadius } from '@unityui/core';

borderRadius.none  // 0px  — default for most components
borderRadius.sm    // 2px
borderRadius.md    // 4px
// No 'lg' or 'full' — Swiss style stays sharp
```

---

## Storybook

Explore all components and their variants interactively:

```bash
npm run storybook
```

Opens at [http://localhost:6006](http://localhost:6006).

---

## Development

```bash
git clone https://github.com/marcllopis/unityui
cd unityui
npm install

npm run dev            # Vite dev server
npm run storybook      # Component explorer
npm run test           # Vitest + React Testing Library
npm run test:coverage  # Coverage report
npm run build          # Library build → dist/
```

---

## Publishing to npm

```bash
npm run build        # Runs automatically via prepublishOnly
npm publish --access public
```

The build outputs:

| File | Format | Use case |
|------|--------|----------|
| `dist/unityui.mjs` | ESM | Vite, modern bundlers |
| `dist/unityui.cjs` | CJS | Next.js, Jest, legacy |
| `dist/index.d.ts`  | Types | TypeScript consumers |

React and styled-components are **not bundled** — they are `peerDependencies`. This avoids duplicate React instances in consumer projects.

---

## Architecture Decisions

### Why Electric Blue (#0047FF) instead of a neutral accent?
UnityUI uses two voices: **Inter** (the editorial voice, weights 300–800) and **JetBrains Mono** (the technical voice for labels, badges, overlines). The Electric Blue connects both — precise enough for technical contexts, bold enough for editorial impact. It references the energy of digital precision instruments without the coldness of corporate blues.

The typographic tension system deliberately pairs extremes: Inter 800 (black weight) for headings and impact, Inter 300 (light) for large body text and breathing room. Button labels use JetBrains Mono with wide letter-spacing — a small but distinctive detail that signals the system has a point of view.

### Why Styled Components over Tailwind or CSS Modules?
Styled Components allows co-locating styles with component logic, supports the `ThemeProvider` pattern for token distribution, and generates scoped class names automatically. For a design system where tokens need to flow through every component via a shared theme object, this is the cleanest model.

### Why Atomic Design?
The `atoms → molecules → organisms` hierarchy maps directly to how a design system grows: start with the smallest primitives (Button, Typography), compose them into patterns (Card, FormField), then into full sections (Navigation, Modal). It also makes onboarding easy for new contributors.

### Why a separate `tsconfig.build.json`?
The development tsconfig (`tsconfig.app.json`) uses `allowImportingTsExtensions: true`, which requires `noEmit: true` — TypeScript won't emit files in this mode. The build tsconfig disables that flag so `vite-plugin-dts` can emit `.d.ts` declarations cleanly without affecting the dev experience.

### Why `sideEffects: false`?
Tells bundlers (webpack, Rollup) that no file in the package has side effects when imported. Enables aggressive tree-shaking: if a consumer only imports `Button`, nothing else ends up in their bundle.

### Why `peerDependencies` for React and styled-components?
If UnityUI bundled its own copy of React, consumer projects would end up with two React instances — breaking hooks. Peer dependencies ensure the consumer's installed version is used instead. Declared ranges: `react >= 18`, `styled-components >= 6`.

### Why Vitest over Jest?
Vitest shares the same Vite transform pipeline used in development, meaning tests run against the exact same code that gets built. No separate Babel config, no transform mismatch. Faster cold start and native ESM support out of the box.

---

## License

MIT © Marc Llopis
