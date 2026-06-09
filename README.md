# Simple 504 Vocabulary Practice

Lightweight Next.js app to practice the 504 essential vocabulary words. It provides selectable lesson ranges, multiple-choice and practice cards, and summary results to help track progress.

## Features

- Select lesson range and word count
- Single-word practice cards for definition to word and multiple-choice practice for word to definition
- Simple, data-driven word list (JSON)
- Starring words for a personalized list

## Quick Start

Requirements: Node.js (LTS) and a package manager (`pnpm`, `npm`, or `yarn`).

Install dependencies:

```bash
pnpm install
# or
npm install
# or
yarn
```

Run development server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser.

Build for production:

```bash
pnpm build
pnpm start
```

Lint the project:

```bash
pnpm lint
```

## Project structure (high level)

- `app/` — Next.js app routes and global styles. Entry page: `app/page.tsx`.
- `components/` — UI components used across the app (e.g. `PracticeCard`, `ResultsCard`).
- `data/words.json` — word list source used by the app.
- `lib/` — utilities (e.g. `lib/vocab.ts`).

## Data

The vocabulary comes from `data/words.json`. Update or replace that file to change the available words.

## Development notes

- Edit UI components in `components/` to change behavior or visuals.
- The app uses Tailwind CSS and Radix UI primitives (see `package.json` dependencies).
