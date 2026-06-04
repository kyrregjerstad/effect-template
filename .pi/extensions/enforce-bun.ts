import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const blockedCommands = [
  /(^|[;&|()\s])npm(\s|$)/,
  /(^|[;&|()\s])npx(\s|$)/,
  /(^|[;&|()\s])yarn(\s|$)/,
  /(^|[;&|()\s])pnpm(\s|$)/,
  /(^|[;&|()\s])node(\s|$)/,
  /(^|[;&|()\s])ts-node(\s|$)/,
  /(^|[;&|()\s])tsx(\s|$)/,
  /(^|[;&|()\s])vitest(\s|$)/,
  /(^|[;&|()\s])vite(\s|$)/,
];

type BunRuntime = {
  spawn: (
    command: string[],
    options: {
      cwd: string;
      stderr: "pipe";
      stdout: "pipe";
    },
  ) => {
    exited: Promise<number>;
    stderr: ReadableStream<Uint8Array>;
    stdout: ReadableStream<Uint8Array>;
  };
};

const bunRuntime = (globalThis as typeof globalThis & { Bun?: BunRuntime }).Bun;

const readStream = async (stream: ReadableStream<Uint8Array>) =>
  await new Response(stream).text();

async function runProjectCheck(cwd: string) {
  if (bunRuntime) {
    const process = bunRuntime.spawn(["bun", "scripts/project-check.ts"], {
      cwd,
      stderr: "pipe",
      stdout: "pipe",
    });

    const [exitCode, stdout, stderr] = await Promise.all([
      process.exited,
      readStream(process.stdout),
      readStream(process.stderr),
    ]);

    if (exitCode !== 0) {
      throw new Error([stdout, stderr].filter(Boolean).join("\n"));
    }

    return;
  }

  // Pi currently runs extensions under Node, so Bun's runtime globals are not
  // always available here. Keep the project logic in scripts/project-check.ts
  // and use Node only as the compatibility launcher for that Bun script.
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  await promisify(execFile)("bun", ["scripts/project-check.ts"], { cwd });
}

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", async (event) => {
    if (event.toolName !== "bash") return undefined;

    const command = String(event.input.command ?? "");

    if (blockedCommands.some((pattern) => pattern.test(command))) {
      return {
        block: true,
        reason:
          "This repository uses Bun with Vite+ tooling. Use vp <command>, bun install, bun run <script>, bun <file>, bunx, and bun run test/check instead.",
      };
    }

    return undefined;
  });

  pi.on("agent_end", async (_event, ctx) => {
    ctx.ui.setStatus("project-check", "formatting and checking project");

    try {
      await runProjectCheck(ctx.cwd);
      ctx.ui.notify("project format and check passed", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      ctx.ui.notify(`project format/check failed:\n${message}`, "error");
    } finally {
      ctx.ui.setStatus("project-check", undefined);
    }
  });
}
