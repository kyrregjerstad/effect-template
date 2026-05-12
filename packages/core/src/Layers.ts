import { Layer, Logger, LogLevel } from "effect";
import { AppConfig } from "./AppConfig";

export const BaseLoggerLive = Logger.minimumLogLevel(LogLevel.Info).pipe(
  Layer.provide(Logger.pretty),
);

export const AppLayer = Layer.mergeAll(AppConfig.Default, BaseLoggerLive);

export type AppLayerContext = Layer.Layer.Success<typeof AppLayer>;
export type AppLayerError = Layer.Layer.Error<typeof AppLayer>;
