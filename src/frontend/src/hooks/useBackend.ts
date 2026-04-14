import { useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";
import type { backendInterface } from "../backend";

export function useBackend(): {
  actor: backendInterface | null;
  isFetching: boolean;
} {
  return useActor(createActor);
}
