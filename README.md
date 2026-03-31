# @panvex/ui

Operational UI Kit for **Panvex** — MTProto proxy management panel.  
Dark-first, mobile-first, responsive component library built with React, TypeScript, Tailwind CSS and Radix UI.

## Install

```bash
npm install @panvex/ui
```

Peer dependencies: `react >= 18`, `react-dom >= 18`.

## Setup

### 1. Import styles

In your app entry point:

```ts
import "@panvex/ui/styles.css";
```

### 2. Tailwind preset

In your `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [require("@panvex/ui/tailwind-preset")],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@panvex/ui/dist/**/*.js",
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
import { AppShell, PageHeader, NodeSummaryCard, Badge } from "@panvex/ui";
```

All types are exported:

```ts
import type { NodeDcInfo, DcStatus, UserInfo } from "@panvex/ui";
```

## Theming

Dark theme is active by default. Add `.light` class to `<html>` for light mode:

```ts
document.documentElement.classList.toggle("light", isLight);
```

Or use the built-in toggle:

```tsx
import { ThemeToggle } from "@panvex/ui";
```

## Structure

```
src/
├── primitives/     Atomic visual elements (StatusDot, Badge, MiniChart, etc.)
├── components/     Self-contained blocks (NodeSummaryCard, DataTable, AlertItem, etc.)
│   └── ui/         Themed form/interaction components (Button, Input, Tabs, Sheet, etc.)
├── compositions/   Assembled groups (GaugeStrip, DCScrollStrip, Timeline, etc.)
├── layout/         App shell (Sidebar, BottomNav, AppShell, PageHeader)
├── types/          TypeScript models for Telemt API
├── tokens/         Color constants
└── pages/          Storybook-only assembled page stories
```

## Development

```bash
npm run storybook     # Component explorer on :6006
npm run build         # Library build → dist/
npm run lint          # Type-check
```

## License

MIT
