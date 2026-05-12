# effect-template

A Bun workspace template for Effect projects.

## Stack

- [Bun](https://bun.sh/) for package management and scripts
- [Effect](https://effect.website/) in `packages/core`
- [@effect/vitest](https://github.com/Effect-TS/effect/tree/main/packages/vitest) with Vitest for tests
- [Biome](https://biomejs.dev/) for linting and formatting
- [TypeScript 7 native preview](https://www.npmjs.com/package/@typescript/native-preview) (`tsgo`) for type checking

## Layout

```text
apps/
packages/
  core/
    src/
```

## Commands

```bash
bun install
bun run typecheck
bun run lint
bun run test
bun run check
bun run examples:sync
```

Add applications under `apps/*` and reusable packages under `packages/*`.

## Dependencies

Shared dependency versions live in the root `workspaces.catalog`.
Workspace packages should reference shared versions with `catalog:`.

## Source examples

This template keeps browsable source checkouts in `.examples/`, which is gitignored.
The tracked `examples.json` manifest controls which repositories are cloned.

```bash
bun run examples:sync
```

By default this clones the Effect source to `.examples/effect`.

## Agent guardrails

Pi auto-loads the project-local extension in `.pi/extensions/enforce-bun.ts`.
It blocks agent bash calls that try to use npm, pnpm, yarn, node, ts-node, tsx, npx, direct `vitest`, or Vite.
Use Bun commands instead.
