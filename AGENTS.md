# Repository Guidelines

## Project Structure & Module Organization
- `app/`: App Router entry point; `layout.tsx` defines global shell, `page.tsx` houses the dashboard UI, and `globals.css` wires Tailwind utilities.
- `public/`: Static assets such as logos and favicons served verbatim; place new images here and reference with `/asset-name.svg`.
- Root configs (`tsconfig.json`, `biome.json`, `postcss.config.mjs`, `next.config.ts`) centralize TypeScript, linting, and build behavior—update them in tandem when tooling changes.

## Build, Test, and Development Commands
- `npm install`: Install dependencies; rerun after modifying `package.json`.
- `npm run dev`: Launch the Next.js dev server with Turbopack at `http://localhost:3000`.
- `npm run build`: Produce an optimized production bundle; fails fast if there are type or lint errors.
- `npm run start`: Serve the production build locally; use for sanity checks before release.
- `npm run lint` / `npm run format`: Run Biome static analysis; keep changes lint-clean and formatted before opening a PR.

## Coding Style & Naming Conventions
- TypeScript + React functional components only; export the primary route component as the default from each route file.
- Two-space indentation, `camelCase` for functions/variables, `PascalCase` for React components, and kebab-case file names inside `app/` when adding new routes.
- Favor Tailwind utility classes in JSX; extract shared styling into `globals.css` sparingly to keep cascade predictable.

## Testing Guidelines
- No automated test harness exists yet; when adding logic beyond UI wiring, include lightweight tests using React Testing Library under `app/__tests__/` and run them via `npm run test` once a script is introduced.
- Smoke-test new routes manually in the dev server and document reproduction steps in the PR description.

## Commit & Pull Request Guidelines
- Write imperative, present-tense commit subjects (`Add timer controls`) followed by concise bodies when context is needed.
- Scope each PR to one feature or fix, include screenshots or GIFs for visible UI changes, link tracking issues, and confirm local lint/build commands in the description.
