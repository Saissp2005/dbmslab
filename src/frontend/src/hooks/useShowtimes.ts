import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateShowtimeInput,
  ShowtimePublic,
  VenuePublic,
} from "../backend";
import { useBackend } from "./useBackend";

export function useShowtimes(eventId?: bigint | null, venueId?: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery<ShowtimePublic[]>({
    queryKey: ["showtimes", eventId?.toString(), venueId?.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listShowtimes(eventId ?? null, venueId ?? null);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useShowtime(showtimeId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery<ShowtimePublic | null>({
    queryKey: ["showtime", showtimeId?.toString()],
    queryFn: async () => {
      if (!actor || showtimeId === null) return null;
      return actor.getShowtime(showtimeId);
    },
    enabled: !!actor && !isFetching && showtimeId !== null,
    staleTime: 1000 * 30,
  });
}

export function useVenues() {
  const { actor, isFetching } = useBackend();

  return useQuery<VenuePublic[]>({
    queryKey: ["venues"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVenues();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}

export function useVenue(venueId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery<VenuePublic | null>({
    queryKey: ["venue", venueId?.toString()],
    queryFn: async () => {
      if (!actor || venueId === null) return null;
      return actor.getVenue(venueId);
    },
    enabled: !!actor && !isFetching && venueId !== null,
    staleTime: 1000 * 60,
  });
}

export function useCreateShowtime() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateShowtimeInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createShowtime(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
  });
}

export function useDeleteShowtime() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (showtimeId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteShowtime(showtimeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
  });
}

export function useInitializeShowtimeSeats() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (showtimeId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.initializeShowtimeSeats(showtimeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seatMap"] });
    },
  });
}
