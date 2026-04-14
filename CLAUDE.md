# panvex-ui

React/TypeScript UI kit for Panvex — the MTProto proxy management panel.
Dark-first, mobile-first component library. Published as @lost-coder/panvex-ui
to GitHub Packages. Consumed by panvex/web via npm link in local development.

## Purpose and constraints

This package provides visual components only. It has no knowledge of:
- Panvex API, backend, or data fetching
- Panvex routing or application state
- Telemt or MTProto internals

Components receive data via props. All domain types live in src/types/ and
model the Telemt API surface (nodes, clients, DC info, metrics).

## Component architecture

Four layers, strictly bottom-up. Upper layers may import from lower, never
the reverse:

```
src/
  primitives/    Atomic visual elements — StatusDot, Badge, MiniChart, Sparkline
  components/    Self-contained blocks — NodeSummaryCard, DataTable, AlertItem
    ui/          Themed form/interaction wrappers — Button, Input, Tabs, Sheet
  compositions/  Multi-component assemblies — GaugeStrip, DCScrollStrip, Timeline
  layout/        App shell — Sidebar, BottomNav, AppShell, PageHeader
  types/         TypeScript models for Telemt API entities
  tokens/        Color constants and design tokens
  pages/         Storybook-only page stories, never exported from the package
```

## Tech stack

- React 18/19, TypeScript 5.7
- Tailwind CSS 3 with custom preset (tailwind.preset.js)
- Radix UI primitives (@radix-ui/react-*)
- Framer Motion / Motion for animation
- Recharts for data visualization
- class-variance-authority + clsx + tailwind-merge for variant management
- Vite 6 for build, vite-plugin-dts for type generation
- Storybook 10 for component development
- Vitest + Testing Library for tests

## Key conventions

- Dark theme is default. Light mode via `.light` class on <html>.
- Component variants use class-variance-authority (cva). Do not use inline
  conditional classNames for variants — define them in cva() instead.
- Use tailwind-merge (twMerge / cn helper) for all className composition.
- Lucide React for icons. Do not import other icon libraries.
- All exported components must have TypeScript props interfaces, exported from
  src/index.ts alongside the component.
- Size budget: dist/index.js must stay under 210 kB, dist/styles.css under 10 kB.
  Run `npm run size` after adding new dependencies.

## Commands

```bash
npm run storybook       # component explorer on :6006 — primary dev environment
npm run build           # tsc + vite build -> dist/
npm run typecheck       # type-check without emitting
npm run test            # vitest run
npm run test:watch      # vitest watch mode
npm run lint            # eslint
npm run size            # bundle size check against limits
```

## Adding a new component

1. Create component file in the appropriate layer directory.
2. Export props interface and component from the file.
3. Re-export from src/index.ts.
4. Add a Storybook story in the same directory or src/pages/.
5. Run `npm run typecheck` and `npm run size` before committing.
