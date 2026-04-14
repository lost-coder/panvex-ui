# @lost-coder/panvex-ui

Operational UI Kit for **Panvex** — MTProto proxy management panel.  
Dark-first, mobile-first, responsive component library built with React, TypeScript, Tailwind CSS and Radix UI.

## Install

```bash
npm install @lost-coder/panvex-ui
```

Peer dependencies: `react >= 18`, `react-dom >= 18`.

## Setup

### 1. Import styles

In your app entry point:

```ts
import "@lost-coder/panvex-ui/styles.css";
```

### 2. Tailwind preset

In your `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [require("@lost-coder/panvex-ui/tailwind-preset")],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@lost-coder/panvex-ui/dist/**/*.js",
  ],
  // your overrides...
};

export default config;
```

### 3. Fonts

Add to your HTML `<head>` or CSS:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

## Usage

```tsx
import { AppShell, PageHeader, NodeSummaryCard, Badge } from "@lost-coder/panvex-ui";
```

All types are exported:

```ts
import type { NodeDcInfo, DcStatus, UserInfo } from "@lost-coder/panvex-ui";
```

## Theming

Dark theme is active by default. Add `.light` class to `<html>` for light mode:

```ts
document.documentElement.classList.toggle("light", isLight);
```

Or use the built-in toggle:

```tsx
import { ThemeToggle } from "@lost-coder/panvex-ui";
```

## Structure

```
src/
├── tokens/         Design tokens (colors, typography CSS classes)
├── base/           Radix UI primitive wrappers (Button, Input, Tabs, Sheet, etc.)
├── primitives/     Atomic visual elements (StatusDot, Badge, MiniChart, etc.)
├── components/     Domain blocks (NodeSummaryCard, DataTable, AlertItem, etc.)
├── compositions/   Multi-part features (TableView, EnrollmentWizard, FormField, etc.)
├── layout/         App shell (Sidebar, BottomNav, AppShell, PageHeader)
├── pages/          Full page templates + Storybook stories
├── lib/            Utilities (cn, format helpers, status mappings)
└── types/          TypeScript models for pages and API
```

### Layer dependency rules

```
tokens ← base ← primitives ← components ← compositions ← layout ← pages
```

Each layer may only import from layers to its left. No reverse dependencies.

## Tailwind v3 → v4 Integration

This UI kit uses **Tailwind CSS 3** internally. If your consuming app uses **Tailwind CSS 4**, you need a CSS variable bridge.

### How it works

The UI kit exports `styles.css` which defines CSS custom properties for all design tokens:

```css
/* UI kit defines these in :root */
--color-bg: #0b0d12;
--color-bg-card: #141820;
--color-fg: #e2e6ed;
--color-fg-muted: #6e7787;
--color-border: rgba(255, 255, 255, 0.06);
/* ... */
```

Your Tailwind v4 app must map these to `@theme` tokens:

```css
/* your app's styles.css */
@import "@lost-coder/panvex-ui/styles.css";   /* UI kit styles (TW3 output) */
@import "tailwindcss";              /* Tailwind v4 */

@theme {
  --color-bg: var(--color-bg);
  --color-bg-card: var(--color-bg-card);
  --color-fg: var(--color-fg);
  --color-fg-muted: var(--color-fg-muted);
  --color-border: var(--color-border);
  /* map all UI kit CSS variables here */
}
```

### Contract

When the UI kit adds a new CSS variable to `src/index.css`, the consuming app must add a corresponding `@theme` mapping. There is no automation for this — check the UI kit changelog when upgrading.

### CSS variables reference

| Variable | Dark | Light | Usage |
|----------|------|-------|-------|
| `--color-bg` | `#0b0d12` | `#f5f6f8` | Page background |
| `--color-bg-card` | `#141820` | `#ffffff` | Card/surface background |
| `--color-bg-card-hi` | `#1a1f2a` | `#f0f1f4` | Elevated card |
| `--color-bg-hover` | `#1e2430` | `#e9eaef` | Hover state |
| `--color-fg` | `#e2e6ed` | `#1a1d23` | Primary text |
| `--color-fg-muted` | `#6e7787` | `#6b7280` | Secondary text |
| `--color-fg-faint` | `#2a3040` | `#dfe1e6` | Disabled/hint |
| `--color-border` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.08)` | Subtle borders |
| `--color-border-hi` | `rgba(255,255,255,0.1)` | `rgba(0,0,0,0.14)` | Prominent borders |

Status colors (`--status-ok`, `--status-warn`, `--status-error`) and accent (`--accent`) are defined in `tailwind.config.ts` as static values, not CSS variables.

## Development

```bash
npm run storybook     # Component explorer on :6006
npm run build         # Library build → dist/
npm run lint          # Type-check
```

## License

MIT
