import { $ } from "bun";

const gitStatus = await $`git status --porcelain`.quiet();

if (gitStatus.stdout.toString().trim().length === 0) {
  process.exit(0);
}

await $`bun run check`;
