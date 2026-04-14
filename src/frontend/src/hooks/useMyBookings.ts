import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BookingFilter,
  BookingPublic,
  CreateBookingInput,
  PaymentPublic,
} from "../backend";
import { useBackend } from "./useBackend";

export function useMyBookings(filter?: BookingFilter | null) {
  const { actor, isFetching } = useBackend();

  return useQuery<BookingPublic[]>({
    queryKey: ["myBookings", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyBookings(filter ?? null);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useBooking(bookingId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery<BookingPublic | null>({
    queryKey: ["booking", bookingId?.toString()],
    queryFn: async () => {
      if (!actor || bookingId === null) return null;
      return actor.getBooking(bookingId);
    },
    enabled: !!actor && !isFetching && bookingId !== null,
    staleTime: 1000 * 30,
  });
}

export function useMyPayment(bookingId: bigint | null) {
  const { actor, isFetching } = useBackend();

  return useQuery<PaymentPublic | null>({
    queryKey: ["myPayment", bookingId?.toString()],
    queryFn: async () => {
      if (!actor || bookingId === null) return null;
      return actor.getMyPayment(bookingId);
    },
    enabled: !!actor && !isFetching && bookingId !== null,
    staleTime: 1000 * 30,
  });
}

export function useCreateBooking() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["seatMap"] });
    },
  });
}

export function useCancelBooking() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },
  });
}

export function useAllBookings() {
  const { actor, isFetching } = useBackend();

  return useQuery<BookingPublic[]>({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllBookings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 30,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useBackend();

  return useMutation({
    mutationFn: async ({
      bookingId,
      successUrl,
      cancelUrl,
    }: {
      bookingId: bigint;
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCheckoutSession(bookingId, successUrl, cancelUrl);
    },
  });
}
