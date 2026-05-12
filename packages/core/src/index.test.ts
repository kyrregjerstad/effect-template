import { expect, it } from "@effect/vitest";
import { Effect } from "effect";
import { AppConfig, greet, greetSync, runPromise } from "./index";

it.effect("greets from an Effect", () =>
  Effect.gen(function* () {
    const message = yield* greet("Effect");

    expect(message).toBe("Hello, Effect!");
  }),
);

it("greets synchronously", () => {
  expect(greetSync("Bun")).toBe("Hello, Bun!");
});

it("runs effects with the application runtime", async () => {
  await expect(
    runPromise(
      Effect.gen(function* () {
        const config = yield* AppConfig;

        return config.appName;
      }),
    ),
  ).resolves.toBe("effect-template");
});
