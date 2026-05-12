# Agent instructions

## Runtime and package manager

- Use Bun for all scripts and dependency management.
- Use `bun install`, `bun run <script>`, `bun <file>`, and `bunx`.
- Do not use npm, pnpm, yarn, node, ts-node, npx, or Vite unless explicitly requested.
- Do not write `latest` in `package.json`; resolve and pin the current version.

## Project checks

Before handing off changes, run:

```bash
bun run check
```

Use targeted commands while iterating:

```bash
bun run typecheck
bun run lint
bun run test
```

## TypeScript

- Type checking uses TypeScript native preview via `tsgo`.
- Keep `tsconfig.json` modern and Bun/bundler-oriented.
- Prefer strict, explicit types for package APIs.

## Effect

- Put reusable Effect code in `packages/core` or other workspace packages.
- Use `@effect/vitest` for Effect tests.
- Prefer `it.effect` for tests of Effect programs.

## Formatting and linting

- Biome owns formatting, linting, and import organization.
- Use `bun run format` or `bun run lint:fix` for automatic fixes.

## Source examples

- `.examples/` is gitignored and contains cloned source repositories for agent reference.
- Update `examples.json` to add more source repositories.
- Run `bun run examples:sync` to clone or update them.
