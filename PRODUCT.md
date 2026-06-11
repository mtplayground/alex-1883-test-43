# Soroban Product Snapshot

Soroban is a static Vite + React + TypeScript web app for interacting with a
Japanese abacus. It renders a complete soroban board in the browser and computes
the decimal value represented by the bead positions.

## Current Capabilities

- Interactive soroban frame with configurable rods.
- Each rod has one heavenly bead worth 5 and four earth beads worth 1 each.
- Beads support click and pointer-drag interaction for mouse and touch.
- Rod movement preserves valid soroban bead groupings by pulling adjacent earth
  beads toward or away from the reckoning bar.
- Live decimal value readout updates as beads move.
- Rod count can be adjusted from 1 to 9 while preserving existing rod state by
  index where possible.
- Reset control clears every rod to zero while preserving the current rod count.
- Responsive layout and polished bead/frame styling for desktop and narrow
  mobile screens.
- The repository root includes simple single-line reference markdown files:
  `abc.md` contains `abc`, and `bcd.md` contains `bcd`.

## Architecture

- Frontend-only app: no backend server or runtime database is required.
- Pure board state and bead movement logic live in `src/model/soroban.ts`.
- Pure value computation lives in `src/model/value.ts`.
- Shared state types and constants live in `src/types/soroban.ts`.
- UI composition is split across `Bead`, `Rod`, `SorobanFrame`, and small control
  components under `src/components/`.
- Styling uses Tailwind CSS v4 through the Vite plugin and global base CSS in
  `src/index.css`.

## Build And Hosting

- Development and preview servers listen on `0.0.0.0:8080`.
- `npm run build` produces a static site in `dist/`.
- The generated `dist/` directory can be served by any static file server with
  `dist` as the web root.
- The app does not require runtime environment variables after the production
  build is created.

## Verification

- Unit tests use Vitest and cover model rules plus value computation.
- Browser interaction tests use Playwright and verify bead dragging updates the
  readout.
- Main validation commands are:
  - `npm run format:check`
  - `npm run lint`
  - `npm test`
  - `npm run test:e2e`
  - `npm run build`
