import { $ } from "bun";

type ExampleRepo = {
  readonly name: string;
  readonly url: string;
  readonly ref?: string;
};

type ExamplesManifest = {
  readonly repos: ReadonlyArray<ExampleRepo>;
};

const examplesDirectory = ".examples";
const manifest = (await Bun.file("examples.json").json()) as ExamplesManifest;
const failures: Array<{ name: string; error: unknown }> = [];

await $`mkdir -p ${examplesDirectory}`;

async function isGitRepository(directory: string) {
  const result = await $`git -C ${directory} rev-parse --is-inside-work-tree`.quiet().nothrow();

  return result.exitCode === 0 && result.stdout.toString().trim() === "true";
}

async function syncExistingRepository(destination: string, ref: string) {
  await $`git -C ${destination} fetch --depth=1 origin ${ref}`;
  await $`git -C ${destination} checkout --detach FETCH_HEAD`;
  await $`git -C ${destination} reset --hard FETCH_HEAD`;
  await $`git -C ${destination} clean -fdx`;
}

for (const repo of manifest.repos) {
  const destination = `${examplesDirectory}/${repo.name}`;
  const ref = repo.ref ?? "main";

  try {
    if (await isGitRepository(destination)) {
      console.log(`Updating ${destination}`);
      await syncExistingRepository(destination, ref);
      continue;
    }

    if (await Bun.file(destination).exists()) {
      throw new Error(`${destination} exists but is not a git repository`);
    }

    console.log(`Cloning ${repo.url} into ${destination}`);
    await $`git clone --depth=1 --branch ${ref} ${repo.url} ${destination}`;
  } catch (error) {
    failures.push({ name: repo.name, error });
    console.error(`Failed to sync ${repo.name}; continuing with remaining repos.`);
  }
}

if (failures.length > 0) {
  console.error("\nSome example repositories failed to sync:");

  for (const failure of failures) {
    const message = failure.error instanceof Error ? failure.error.message : String(failure.error);
    console.error(`- ${failure.name}: ${message}`);
  }

  process.exit(1);
}
