import { Config, Effect } from "effect";

export type AppEnvironment = "development" | "test" | "production";

export class AppConfig extends Effect.Service<AppConfig>()("AppConfig", {
  effect: Effect.gen(function* () {
    const appName = yield* Config.string("APP_NAME").pipe(
      Config.withDefault("effect-template"),
    );
    const environment = yield* Config.literal(
      "development",
      "test",
      "production",
    )("APP_ENV").pipe(Config.withDefault("development"));

    return {
      appName,
      environment,
      isProduction: environment === "production",
    } as const;
  }),
}) {}
