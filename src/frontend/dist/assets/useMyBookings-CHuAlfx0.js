import { n as useBackend, p as useQueryClient, o as useQuery } from "./index-CtJ3C921.js";
import { b as useMutation } from "./useShowtimes-DAXYNdLs.js";
function useMyBookings(filter) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["myBookings", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyBookings(null);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 30
  });
}
function useBooking(bookingId) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["booking", bookingId == null ? void 0 : bookingId.toString()],
    queryFn: async () => {
      if (!actor || bookingId === null) return null;
      return actor.getBooking(bookingId);
    },
    enabled: !!actor && !isFetching && bookingId !== null,
    staleTime: 1e3 * 30
  });
}
function useMyPayment(bookingId) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["myPayment", bookingId == null ? void 0 : bookingId.toString()],
    queryFn: async () => {
      if (!actor || bookingId === null) return null;
      return actor.getMyPayment(bookingId);
    },
    enabled: !!actor && !isFetching && bookingId !== null,
    staleTime: 1e3 * 30
  });
}
function useCreateBooking() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["seatMap"] });
    }
  });
}
function useCancelBooking() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    }
  });
}
function useCreateCheckoutSession() {
  const { actor } = useBackend();
  return useMutation({
    mutationFn: async ({
      bookingId,
      successUrl,
      cancelUrl
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCheckoutSession(bookingId, successUrl, cancelUrl);
    }
  });
}
export {
  useCreateCheckoutSession as a,
  useMyBookings as b,
  useBooking as c,
  useMyPayment as d,
  useCancelBooking as e,
  useCreateBooking as u
};
