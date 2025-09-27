# Pomodoro Timer

Accessible Pomodoro timer built with Next.js 15 (App Router), Tailwind CSS v4, shadcn-style primitives, and lightweight motion for button feedback. The app keeps four-session focus cycles on track by automatically alternating work sessions, short breaks, and long breaks.

## Features
- Four-phase sequence: 25-minute focus blocks, 5-minute short breaks, and a 30-minute long break after every fourth pomodoro.
- `usePomodoroTimer` handles countdown state, automatic transitions, skip/restart actions, and exposes a session counter for the UI.
- Live session indicator (“N of 4 sessions”) and accessible status announcements via aria-live for screen reader support.
- Responsive layout with dark mode support, Geist Sans headings, and Geist Mono numerals for the timer display.
- Sheet triggers for rankings and settings powered by `@silk-hq/components`; content remains a placeholder until the features ship.

## Tech Stack
- Next.js 15 App Router + React 19
- Tailwind CSS v4 with `tw-animate-css`
- shadcn-style UI primitives in `components/ui`
- `@silk-hq/components` bottom sheet
- `framer-motion` micro-interactions inside the shared button component

## How It Works
- Timer constants and helpers live in `lib/pomodoro.ts` (`PHASE_DURATION_SECONDS`, `resolveNextPhase`, `getCyclePosition`, `formatTime`). Adjust durations or sequencing logic here.
- `hooks/use-pomodoro-timer.ts` orchestrates phase state, the countdown interval, and the event handlers consumed by the page component.
- `app/page.tsx` composes the UI from the hook, card/button primitives, and placeholder sheets. `app/layout.tsx` applies fonts and wraps global providers.

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Run the development server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to use the timer.

Use Node.js 20 LTS or higher for parity with the Codex environment. When dependencies change, re-run `npm install` to keep `package-lock.json` current.

## Scripts
- `npm run dev` – Start the Turbopack dev server with hot reload.
- `npm run build` – Produce a production build; fails on type or lint errors.
- `npm run start` – Serve the production build locally.
- `npm run lint` – Run Biome static analysis (includes formatting checks).
- `npm run format` – Apply Biome formatting fixes in place.

## Project Layout
- `app/` – App Router entry point, route components, and global styles.
- `components/ui/` – Shared primitives (`button`, `card`, bottom sheet triggers) with Tailwind + motion wiring.
- `hooks/` – Reusable React hooks; currently houses `usePomodoroTimer`.
- `lib/` – Framework-agnostic utilities and pomodoro logic.
- `public/` – Static assets served at the site root.
- Root configs (`biome.json`, `components.json`, `next.config.ts`, `tsconfig.json`, etc.) coordinate linting, build, Tailwind, and shadcn settings.

## Development Guidelines
Consult `AGENTS.md` for the full contributor playbook. Highlights:
- Build screens from existing primitives before introducing new UI.
- Keep new animations minimal; reuse the shared button’s motion or add TODOs for future polish.
- Run `npm run lint` prior to opening a PR and document manual QA of timer flows.

## Manual QA Checklist
- Start, pause, and resume a work session and verify the countdown resumes correctly.
- Let a work session elapse to confirm automatic transition into the appropriate break.
- Use Skip during breaks to return to the next focus session.
- Trigger Restart and confirm the cycle counter resets to 1 of 4.
- Toggle light/dark mode (system preference) to ensure contrast and layout remain stable.
