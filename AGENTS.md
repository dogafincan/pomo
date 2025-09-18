# Repository Guidelines

## Project Structure & Module Organization
- `app/`: App Router entry point; `layout.tsx` holds the frame, `page.tsx` the dashboard UI, and `globals.css` wires Tailwind utilities.
- `public/`: Static assets served verbatim; drop new images here and reference them with `/asset.svg`.
- Root configs (`tsconfig.json`, `biome.json`, `postcss.config.mjs`, `next.config.ts`, `components.json`) define TypeScript, linting, build, and shadcn/ui behavior—edit together when tooling shifts.

## Build, Test, and Development Commands
- `npm install`: Install dependencies after `package.json` changes.
- `npm run dev`: Start the Turbopack dev server at `http://localhost:3000`.
- `npm run build`: Create the production bundle; fails on type or lint errors.
- `npm run start`: Serve the build locally for final verification.
- `npm run lint` / `npm run format`: Run Biome checks and formatting before opening a PR.

## Coding Style & Naming Conventions
- TypeScript + React function components; export the primary route component as the default.
- Two-space indentation, `camelCase` variables, `PascalCase` components, and kebab-case route filenames in `app/`.
- Favor shadcn/ui primitives for structure and keep their classes untouched until the styling pass; limit shared CSS overrides in `globals.css`.

## Shadcn Component Practices
- Generate components with `npx shadcn@latest add <component>` so `components.json` stays accurate; outputs live in `components/ui`.
- Compose existing shadcn parts before building bespoke markup; only create custom primitives when no counterpart exists.
- Defer design tweaks to the endgame styling phase—avoid editing shadcn styles, tokens, or variants until then.

## Animation Libraries
- The `motion` and `framer-motion` packages are preinstalled; hold off on importing them until functionality is complete.
- Use lightweight CSS/Tailwind transitions during development and note any desired choreo in TODO comments for the styling phase.

## Testing Guidelines
- No automated test harness exists yet; when adding logic beyond UI wiring, add lightweight React Testing Library tests under `app/__tests__/` and run them via `npm run test` once a script exists.
- Smoke-test new routes in the dev server and capture reproduction steps in the PR description.

## Commit & Pull Request Guidelines
- Write imperative, present-tense commit subjects (`Add timer controls`) with concise bodies when context is needed.
- Scope each PR to one feature or fix, include screenshots or GIFs for visual changes, link issues, and confirm local lint/build runs in the description.
