# Repository Guidelines

## Architecture Snapshot
- `app/layout.tsx` wires the Geist Sans and Geist Mono font variables, injects global styles from `app/globals.css`, and is the single place to introduce providers.
- `app/page.tsx` composes the timer screen from shadcn-style primitives, the `usePomodoroTimer` hook, and placeholder bottom sheets for future rankings/settings work.
- `hooks/use-pomodoro-timer.ts` holds state management: it drives the countdown loop, phase transitions, and exposes event handlers consumed by the page.
- `lib/pomodoro.ts` centralizes the pomodoro constants (`PHASE_DURATION_SECONDS`, `PHASE_LABELS`) and helpers (`formatTime`, `resolveNextPhase`, `getCyclePosition`). Adjust timer behavior here so the hook and UI stay in sync.
- `components/ui/` contains primitives shared across the app: `button.tsx` wraps Radix `Slot` with `framer-motion` micro-interactions, `card.tsx` mirrors the shadcn card API, and the bottom sheet triggers pull in `@silk-hq/components` (with CSS helpers in sibling `.css` files). Keep design tokens and interaction logic inside these primitives.

## Styling & Interaction Guidelines
- Global styles import Tailwind v4, `tw-animate-css`, and Silk layered styles; scope new theme tokens in `app/globals.css` so primitives inherit them automatically.
- Compose screens with the primitives in `components/ui` plus Tailwind utility classes. Prefer colocated styles (CSS modules or inline Tailwind) next to the consuming component.
- Numeric displays and timers should continue using Geist Mono. Reserve Geist Sans for headings and supporting copy to match the existing hierarchy.
- The `Button` component already provides subtle hover/tap motion via `framer-motion`. Avoid introducing additional animation libraries or bespoke motion code outside these primitives; if richer motion is required, add a `TODO` and defer until the polish phase.
- Ranking and settings sheets intentionally show “Coming soon…”. Leave licensing props and trigger styling untouched until those features ship.

## Build, Test, and Runtime Commands
- `npm install` – Install or refresh dependencies (Node 20 LTS recommended).
- `npm run dev` – Launch the Turbopack dev server at `http://localhost:3000`.
- `npm run build` / `npm run start` – Validate and serve a production bundle.
- `npm run lint` – Run Biome checks (includes formatting); fix issues before committing.
- `npm run format` – Apply Biome’s auto-fixes when lint reports formatting diffs.

## Testing Expectations
- No automated test harness ships today. When tweaking `lib/pomodoro.ts` or `usePomodoroTimer`, add targeted React Testing Library coverage under `app/__tests__/` and include an `npm run test` script in the PR description.
- Manually verify all timer flows (start, pause, skip, restart, long-break sequencing) before requesting review and document findings in the PR body.

## Git & Review Workflow
- Keep commits small and purposeful with imperative subjects (e.g., `Add long break status label`).
- Run `npm run lint` before pushing. Surface visual changes with screenshots or clips, and note any manual QA performed in the PR template.
