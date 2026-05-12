import { Effect } from "effect";

export const greet = (name: string) => Effect.succeed(`Hello, ${name}!`);

export const greetSync = (name: string) => Effect.runSync(greet(name));
