import { expect, it } from "@effect/vitest";
import { Effect } from "effect";
import { greet, greetSync } from "./index";

it.effect("greets from an Effect", () =>
  Effect.gen(function* () {
    const message = yield* greet("Effect");

    expect(message).toBe("Hello, Effect!");
  }),
);

it("greets synchronously", () => {
  expect(greetSync("Bun")).toBe("Hello, Bun!");
});
