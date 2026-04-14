import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateEventInput,
  EventFilter,
  EventPublic,
  UpdateEventInput,
} from "../backend";
import { useBackend } from "./useBackend";

export function useEvents(filter?: EventFilter | null) {
  const { actor, isFetching } = useBackend();

  return useQuery<EventPublic[]>({
    queryKey: ["events", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEvents(filter ?? null);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useEvent(eventId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery<EventPublic | null>({
    queryKey: ["event", eventId?.toString()],
    queryFn: async () => {
      if (!actor || eventId === null) return null;
      return actor.getEvent(eventId);
    },
    enabled: !!actor && !isFetching && eventId !== null,
    staleTime: 1000 * 30,
  });
}

export function useCreateEvent() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEventInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createEvent(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateEventInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateEvent(input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({
        queryKey: ["event", variables.id.toString()],
      });
    },
  });
}

export function useDeleteEvent() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
