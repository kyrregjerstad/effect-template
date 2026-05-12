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

await $`mkdir -p ${examplesDirectory}`;

for (const repo of manifest.repos) {
  const destination = `${examplesDirectory}/${repo.name}`;
  const ref = repo.ref ?? "main";

  if (await Bun.file(`${destination}/.git`).exists()) {
    console.log(`Updating ${destination}`);
    await $`git -C ${destination} fetch --depth=1 origin ${ref}`;
    await $`git -C ${destination} checkout ${ref}`;
    await $`git -C ${destination} pull --ff-only origin ${ref}`;
  } else {
    console.log(`Cloning ${repo.url} into ${destination}`);
    await $`git clone --depth=1 --branch ${ref} ${repo.url} ${destination}`;
  }
}
