import { type Effect, type Layer, ManagedRuntime } from "effect";
import { AppLayer, type AppLayerContext, type AppLayerError } from "./Layers";

export type AppRuntime = ManagedRuntime.ManagedRuntime<
  AppLayerContext,
  AppLayerError
>;
export type AppRuntimeContext =
  ManagedRuntime.ManagedRuntime.Context<AppRuntime>;

export const makeRuntime = (
  layer: Layer.Layer<AppLayerContext, AppLayerError> = AppLayer,
) => ManagedRuntime.make(layer);

export const Runtime = makeRuntime();

export const runPromise = <A, E>(
  effect: Effect.Effect<A, E, AppRuntimeContext>,
  options?: Parameters<AppRuntime["runPromise"]>[1],
) => Runtime.runPromise(effect, options);

export const runSync = <A, E>(effect: Effect.Effect<A, E, AppRuntimeContext>) =>
  Runtime.runSync(effect);
