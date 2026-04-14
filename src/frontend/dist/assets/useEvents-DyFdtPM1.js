import { n as useBackend, o as useQuery, p as useQueryClient } from "./index-CtJ3C921.js";
import { b as useMutation } from "./useShowtimes-DAXYNdLs.js";
function useEvents(filter) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["events", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEvents(null);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 30
  });
}
function useEvent(eventId) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["event", eventId == null ? void 0 : eventId.toString()],
    queryFn: async () => {
      if (!actor || eventId === null) return null;
      return actor.getEvent(eventId);
    },
    enabled: !!actor && !isFetching && eventId !== null,
    staleTime: 1e3 * 30
  });
}
function useCreateEvent() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.createEvent(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
}
function useUpdateEvent() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateEvent(input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({
        queryKey: ["event", variables.id.toString()]
      });
    }
  });
}
function useDeleteEvent() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteEvent(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
}
export {
  useEvent as a,
  useCreateEvent as b,
  useUpdateEvent as c,
  useDeleteEvent as d,
  useEvents as u
};
