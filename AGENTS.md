# Repository Guidelines

## Project Structure & Responsibilities
- `app/` hosts the App Router entry point: `layout.tsx` wires fonts/theme providers, `page.tsx` renders the Pomodoro UI, and `globals.css` initializes Tailwind v4 + shadcn tokens.
- `components/ui/` contains shadcn-generated primitives; treat them as the single source of truth for controls.
- `lib/` stores shared utilities, and `public/` serves static assets. Root configs (`biome.json`, `components.json`, `next.config.ts`, `tsconfig.json`, etc.) must stay in sync when tooling changes.

## Build, Test, and Runtime Commands
- `npm install` – Install or refresh dependencies (Node 20 LTS recommended).
- `npm run dev` – Launch the Turbopack dev server at `http://localhost:3000`.
- `npm run build` / `npm run start` – Validate and serve a production bundle.
- `npm run lint` – Run Biome checks (includes formatting); fix issues before committing.
- `npm run format` – Apply Biome’s auto-fixes when lint reports formatting diffs.

## UI & Styling Practices
- Prefer shadcn/ui components wherever possible; do not alter their variants, classes, or token values until the deliberate styling pass at project end.
- Compose screens by arranging shadcn pieces and Tailwind utilities in the route files. Any custom styling should live alongside the consuming component, not inside shared primitives.
- The timer currently uses Geist Sans and Geist Mono (via `next/font`); keep new numeric displays on Geist Mono unless functionality demands a change.
- Header icons (rankings and settings) are placeholders—maintain their minimal styling and avoid building the associated modals until requested.

## Animation & Interaction Guidelines
- `motion` and `framer-motion` are installed for later polish but must stay unused until the functionality milestone is complete.
- Favor simple Tailwind transitions if feedback is necessary, and annotate future animation ideas with `TODO` comments.

## Testing Expectations
- No automated test harness ships today. For complex logic, add React Testing Library coverage under `app/__tests__/` and propose an `npm run test` script in the PR.
- Manually verify timer flows (start, pause, skip, restart, long-break sequencing) before opening a review and document findings in the PR body.

## Git & Review Workflow
- Use small, single-purpose commits with imperative subjects (e.g., `Add rankings icon placeholder`).
- Confirm `npm run lint` succeeds before pushing. Visual changes should include screenshots or clips, and PRs must call out any manual QA performed.
