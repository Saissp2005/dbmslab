import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReserveSeatInput, SeatMapPublic } from "../backend";
import { useBackend } from "./useBackend";

export function useSeatMap(showtimeId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery<SeatMapPublic | null>({
    queryKey: ["seatMap", showtimeId?.toString()],
    queryFn: async () => {
      if (!actor || showtimeId === null) return null;
      return actor.getSeatMap(showtimeId);
    },
    enabled: !!actor && !isFetching && showtimeId !== null,
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 15,
  });
}

export function useReserveSeats() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ReserveSeatInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.reserveSeats(input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["seatMap", variables.showtimeId.toString()],
      });
    },
  });
}

export function useReleaseReservation() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      showtimeId,
      seatIds,
    }: { showtimeId: bigint; seatIds: bigint[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.releaseReservation(showtimeId, seatIds);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["seatMap", variables.showtimeId.toString()],
      });
    },
  });
}

export function useBlockSeats() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      showtimeId,
      seatIds,
    }: { showtimeId: bigint; seatIds: bigint[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.blockSeats(showtimeId, seatIds);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["seatMap", variables.showtimeId.toString()],
      });
    },
  });
}

export function useUnblockSeats() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      showtimeId,
      seatIds,
    }: { showtimeId: bigint; seatIds: bigint[] }) => {
      if (!actor) throw new Error("Not connected");
      return actor.unblockSeats(showtimeId, seatIds);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["seatMap", variables.showtimeId.toString()],
      });
    },
  });
}
