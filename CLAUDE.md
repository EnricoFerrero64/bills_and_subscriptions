# Subscription Stack — CLAUDE.md

## Project Overview

A Wealthfolio addon that tracks monthly/yearly subscription spend. Built with TypeScript + React + Vite, integrated via `@wealthfolio/addon-sdk` v3.3.0.

## Tech Stack

- **Runtime**: React 19, TypeScript 5, Tailwind CSS v4
- **Build**: Vite 7
- **Persistence**: `localStorage` (key prefix `ss:`)
- **SDK**: `@wealthfolio/addon-sdk` ^3.3.0

## Project Structure

```
src/
  addon.tsx           # Entry point — registers sidebar item + routes
  context.ts          # Singleton AddonContext holder
  lib/
    storage.ts        # Data model, CRUD, currency/cycle helpers
    sync.ts           # Wealthfolio Sync — pushes charges as withdrawal activities
  pages/
    SubscriptionsPage.tsx  # Main CRUD list with add/edit modal
    SummaryPage.tsx        # Stat cards, category breakdown, top-5
  components/
    PageLayout.tsx    # Tabbed nav wrapper (Subscriptions / Summary)
scripts/
  deploy.mjs          # One-shot deploy to Wealthfolio
  watch-deploy.mjs    # Watch + deploy on change
dist/                 # Compiled output — do NOT edit manually
```

## Build & Deploy

```bash
npm run build          # Compile to dist/
npm run ship           # Build + deploy to Wealthfolio
npm run dev:deploy     # Watch mode with auto-deploy
npm run type-check     # tsc --noEmit only
```

## Key Decisions

- **Addon over fork** — stays maintainable as Wealthfolio evolves upstream
- **localStorage** — offline-first, no server required, prefixed `ss:` to avoid collisions
- **Scope** — subscription tracking only, not general expense tracking
- **No FX conversion** — multi-currency subscriptions are shown separately, not rolled up

## Data Model (`Subscription`)

| Field | Type | Notes |
|-------|------|-------|
| id | string | `${Date.now()}-${random}` |
| name | string | Required |
| amount | number | In the chosen currency |
| currency | Currency | 20 supported currencies |
| billingCycle | BillingCycle | monthly / yearly / quarterly / weekly |
| category | SubscriptionCategory | 10 categories |
| startDate | string? | ISO date, optional |
| notes | string? | Optional |
| active | boolean | false = paused |
