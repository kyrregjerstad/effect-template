import { Effect } from "effect";

export * from "./AppConfig";
export * from "./Layers";
export * from "./Runtime";

export const greet = (name: string) => Effect.succeed(`Hello, ${name}!`);

export const greetSync = (name: string) => Effect.runSync(greet(name));
