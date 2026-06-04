# effect-template

A Bun workspace template for Effect projects using Vite+ as the unified toolchain.

## Stack

- [Vite+](https://viteplus.dev/) for dev/build/test/check tooling
- [Bun](https://bun.sh/) as the workspace package manager
- [Effect](https://effect.website/) in `packages/core`
- [@effect/vitest](https://github.com/Effect-TS/effect/tree/main/packages/vitest) for `it.effect` tests, with `vitest` aliased to Vite+'s test package for compatibility
- [Lefthook](https://lefthook.dev/) for the existing pre-commit hook facade

## Layout

```text
apps/
packages/
  core/
    src/
```

## Commands

```bash
vp install
vp check
vp test
bun run check
bun run examples:sync
```

Compatibility facades are kept for existing automation:

```bash
bun run format
bun run lint
bun run lint:fix
bun run typecheck
bun run test
```

Add applications under `apps/*` and reusable packages under `packages/*`.

## Dependencies

Shared dependency versions live in the root `workspaces.catalog`.
Workspace packages should reference shared versions with `catalog:`.

The `vite` and `vitest` catalog entries are Vite+ package aliases. Keep the `vitest` alias while `@effect/vitest` imports the `vitest` package name.

## Source examples

This template keeps browsable source checkouts in `.examples/`, which is gitignored.
The tracked `examples.json` manifest controls which repositories are cloned.

```bash
bun run examples:sync
```

By default this clones the Effect source to `.examples/effect`.

## Agent guardrails

Pi auto-loads the project-local extension in `.pi/extensions/enforce-bun.ts`.
It blocks agent bash calls that try to use package managers outside Vite+/Bun, direct `node`, or direct standalone Vite/Vitest CLIs.
Use `vp ...` commands or the `bun run ...` compatibility facades instead.
