# Pomodoro Timer

Minimalist Pomodoro timer built with Next.js 15 App Router, Tailwind CSS v4, and shadcn/ui. The app tracks four-session focus cycles, automatically alternating between focus, short breaks, and long breaks. It is intentionally austere—styling tweaks, motion, and theming embellishments are deferred until after functionality is complete.

## Features
- Focus sessions default to 25 minutes, short breaks to 5 minutes, and the fourth break to 30 minutes.
- Session indicator surfaces the active step in the 4-session cycle.
- Responsive layout with light/dark theming and Geist Sans + Geist Mono typography.
- Placeholder controls for future rankings and settings overlays.

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

Use Node.js 20 LTS or higher for parity with the Codex environment. When dependencies change, re-run `npm install` to regenerate the `package-lock.json`.

## Scripts
- `npm run dev` – Start the Turbopack dev server with hot reload.
- `npm run build` – Produce a production build; fails on type or lint errors.
- `npm run start` – Serve the production build locally.
- `npm run lint` – Run Biome static analysis (includes formatting checks).
- `npm run format` – Apply Biome formatting fixes in place.

## Project Layout
- `app/` – App Router entry point (`layout.tsx`, `page.tsx`, and global styles).
- `components/ui/` – shadcn/ui primitives generated via the shadcn CLI.
- `lib/` – Reusable utilities.
- `public/` – Static assets served at the site root.
- Root configs (`biome.json`, `tsconfig.json`, `next.config.ts`, `package.json`, etc.) manage linting, build, and shadcn settings.

## Contributing
Follow the contributor workflow documented in `AGENTS.md`. In short:
- Prefer shadcn/ui components and defer styling overrides until the functional scope is complete.
- Avoid importing `framer-motion` or `motion` until the final polish pass.
- Run `npm run lint` before pushing and craft focused commits with imperative subjects.
