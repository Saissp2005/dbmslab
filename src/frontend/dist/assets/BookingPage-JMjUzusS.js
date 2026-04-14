import { c as createLucideIcon, n as useBackend, o as useQuery, p as useQueryClient, m as useParams, l as useSearch, i as useNavigate, q as useInternetIdentity, r as reactExports, j as jsxRuntimeExports, B as Button, s as TicketCategory, S as Separator, t as SeatStatus, v as ue } from "./index-CtJ3C921.js";
import { S as Skeleton } from "./skeleton-ChEk-H4W.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-RxQFy0P3.js";
import { E as ErrorMessage, C as CircleAlert } from "./ErrorMessage-DvXrrHvJ.js";
import { T as TicketCategoryBadge } from "./TicketCategoryBadge-CmA3mGlt.js";
import { a as useEvent } from "./useEvents-DyFdtPM1.js";
import { u as useCreateBooking, a as useCreateCheckoutSession } from "./useMyBookings-CHuAlfx0.js";
import { b as useMutation, c as useShowtime, d as useVenue, M as MapPin } from "./useShowtimes-DAXYNdLs.js";
import { C as ChevronLeft } from "./chevron-left-Dl4AXylI.js";
import { C as Calendar } from "./calendar-BYpiDwNe.js";
import { C as CreditCard } from "./credit-card-DU5JVRaD.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode);
function useSeatMap(showtimeId) {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["seatMap", showtimeId == null ? void 0 : showtimeId.toString()],
    queryFn: async () => {
      if (!actor || showtimeId === null) return null;
      return actor.getSeatMap(showtimeId);
    },
    enabled: !!actor && !isFetching && showtimeId !== null,
    staleTime: 1e3 * 10,
    refetchInterval: 1e3 * 15
  });
}
function useReserveSeats() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.reserveSeats(input);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["seatMap", variables.showtimeId.toString()]
      });
    }
  });
}
const MAX_SEATS = 8;
function formatDate(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatPrice(cents) {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}
const seatAvailableStyle = "bg-secondary border-border hover:bg-primary/20 hover:border-primary hover:text-primary cursor-pointer transition-all duration-200";
const seatSelectedStyle = "bg-accent border-accent text-accent-foreground cursor-pointer transition-all duration-200 shadow-interactive";
const seatReservedStyle = "bg-warning/15 border-warning/30 text-warning cursor-not-allowed opacity-70";
const seatBookedStyle = "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-60";
const seatBlockedStyle = "bg-muted border-transparent text-transparent cursor-not-allowed opacity-30";
const categoryDimStyle = {
  [TicketCategory.vip]: "opacity-30 hover:opacity-30 cursor-not-allowed",
  [TicketCategory.regular]: "opacity-30 hover:opacity-30 cursor-not-allowed",
  [TicketCategory.balcony]: "opacity-30 hover:opacity-30 cursor-not-allowed"
};
const categoryRingStyle = {
  [TicketCategory.vip]: "ring-1 ring-warning",
  [TicketCategory.regular]: "ring-1 ring-primary",
  [TicketCategory.balcony]: "ring-1 ring-accent"
};
function getSeatStyle(seat, isSelected, activeCategory) {
  const baseParts = [];
  if (isSelected) {
    baseParts.push(seatSelectedStyle);
  } else {
    switch (seat.status) {
      case SeatStatus.available:
        baseParts.push(seatAvailableStyle);
        baseParts.push(categoryRingStyle[seat.category]);
        break;
      case SeatStatus.reserved:
        baseParts.push(seatReservedStyle);
        break;
      case SeatStatus.booked:
        baseParts.push(seatBookedStyle);
        break;
      case SeatStatus.blocked:
        baseParts.push(seatBlockedStyle);
        break;
    }
  }
  if (!isSelected && activeCategory !== "all" && seat.category !== activeCategory && seat.status === SeatStatus.available) {
    baseParts.push(categoryDimStyle[seat.category]);
  }
  return baseParts.join(" ");
}
function SeatButton({
  seat,
  isSelected,
  activeCategory,
  onToggle
}) {
  const styleClass = getSeatStyle(seat, isSelected, activeCategory);
  const canInteract = (seat.status === SeatStatus.available || isSelected) && (activeCategory === "all" || seat.category === activeCategory || isSelected);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      title: `${seat.seatLabel} — ${seat.category} — ${seat.status}`,
      onClick: () => canInteract && onToggle(seat),
      disabled: !canInteract && !isSelected,
      "aria-label": `Seat ${seat.seatLabel} (${seat.category})`,
      "aria-pressed": isSelected,
      className: `w-8 h-8 rounded-md text-xs font-mono border flex items-center justify-center select-none ${styleClass}`,
      children: String(seat.col + 1n)
    }
  );
}
const SKELETON_ROWS = ["A", "B", "C", "D", "E", "F"];
const SKELETON_COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
function SeatMapSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-xl border border-border p-5 space-y-3", children: SKELETON_ROWS.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-5 h-8 shrink-0" }),
    SKELETON_COLS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Skeleton,
      {
        className: "w-8 h-8 rounded-md"
      },
      `skeleton-cell-${row}-${col}`
    ))
  ] }, `skeleton-row-${row}`)) });
}
function BookingPage() {
  const { eventId } = useParams({ from: "/events/$eventId/booking" });
  const search = useSearch({ from: "/events/$eventId/booking" });
  const navigate = useNavigate();
  const { isAuthenticated, login } = useInternetIdentity();
  const showtimeId = search.showtimeId ? BigInt(search.showtimeId) : null;
  const [selectedSeatIds, setSelectedSeatIds] = reactExports.useState([]);
  const [activeCategory, setActiveCategory] = reactExports.useState(
    "all"
  );
  const { data: event } = useEvent(BigInt(eventId));
  const { data: showtime } = useShowtime(showtimeId);
  const { data: venue } = useVenue((showtime == null ? void 0 : showtime.venueId) ?? null);
  const { data: seatMap, isLoading, error } = useSeatMap(showtimeId);
  const reserveSeats = useReserveSeats();
  const createBooking = useCreateBooking();
  const createCheckoutSession = useCreateCheckoutSession();
  const selectedSeats = (seatMap == null ? void 0 : seatMap.seats.filter((s) => selectedSeatIds.includes(s.id))) ?? [];
  const totalPrice = selectedSeats.reduce((sum, seat) => {
    const cat = showtime == null ? void 0 : showtime.seatCategories.find(
      (c) => c.category === seat.category
    );
    return sum + ((cat == null ? void 0 : cat.priceInCents) ?? 0n);
  }, 0n);
  const categories = [
    "all",
    ...(showtime == null ? void 0 : showtime.seatCategories.map((c) => c.category)) ?? []
  ];
  function toggleSeat(seat) {
    if (seat.status !== SeatStatus.available && !selectedSeatIds.includes(seat.id))
      return;
    if (!selectedSeatIds.includes(seat.id) && selectedSeatIds.length >= MAX_SEATS) {
      ue.warning(`Maximum ${MAX_SEATS} seats per booking`);
      return;
    }
    setSelectedSeatIds(
      (prev) => prev.includes(seat.id) ? prev.filter((id) => id !== seat.id) : [...prev, seat.id]
    );
  }
  async function handleCheckout() {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (selectedSeatIds.length === 0 || !showtimeId) return;
    try {
      await reserveSeats.mutateAsync({ showtimeId, seatIds: selectedSeatIds });
      const bookingId = await createBooking.mutateAsync({
        showtimeId,
        seatIds: selectedSeatIds
      });
      const successUrl = `${window.location.origin}/dashboard/bookings/${String(bookingId)}?payment=success`;
      const cancelUrl = `${window.location.origin}/events/${eventId}/booking?showtimeId=${String(showtimeId)}&payment=cancelled`;
      const stripeUrl = await createCheckoutSession.mutateAsync({
        bookingId,
        successUrl,
        cancelUrl
      });
      window.location.href = stripeUrl;
    } catch (e) {
      ue.error("Checkout failed", {
        description: e instanceof Error ? e.message : "Please try again."
      });
    }
  }
  if (!showtimeId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ErrorMessage,
      {
        title: "No showtime selected",
        message: "Please select a showtime from the event page.",
        onRetry: () => navigate({ to: "/events/$eventId", params: { eventId } }),
        "data-ocid": "booking.error_state"
      }
    );
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ErrorMessage,
      {
        title: "Seat map unavailable",
        message: "Could not load the seat map for this showtime.",
        onRetry: () => navigate({ to: "/events/$eventId", params: { eventId } }),
        "data-ocid": "booking.error_state"
      }
    );
  }
  const rows = seatMap ? Array.from(
    { length: Number(seatMap.rows) },
    (_, rowIdx) => seatMap.seats.filter((s) => Number(s.row) === rowIdx).sort((a, b) => Number(a.col) - Number(b.col))
  ) : [];
  const isProcessing = reserveSeats.isPending || createBooking.isPending || createCheckoutSession.isPending;
  const checkoutLabel = !isAuthenticated ? "Sign in to Continue" : isProcessing ? "Processing..." : selectedSeats.length > 0 ? `Checkout · ${formatPrice(totalPrice)}` : "Select Seats to Continue";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        "data-ocid": "booking.back_button",
        onClick: () => navigate({ to: "/events/$eventId", params: { eventId } }),
        className: "gap-2 mb-6 -ml-2 transition-smooth",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
          "Back to Event"
        ]
      }
    ),
    (event || showtime || venue) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border px-5 py-4 mb-6 flex flex-wrap items-center gap-x-6 gap-y-2", children: [
      event && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Event" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: event.title })
      ] }),
      showtime && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 shrink-0 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(showtime.startTime) })
      ] }),
      venue && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 shrink-0 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: venue.name })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Select Your Seats" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            selectedSeats.length,
            "/",
            MAX_SEATS,
            " selected"
          ] })
        ] }),
        categories.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tabs,
          {
            value: activeCategory,
            onValueChange: (v) => setActiveCategory(v),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-9", "data-ocid": "booking.category_filter", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "all", "data-ocid": "booking.category_tab.all", children: "All" }),
              showtime == null ? void 0 : showtime.seatCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value: cat.category,
                  "data-ocid": `booking.category_tab.${cat.category}`,
                  className: "capitalize gap-1.5",
                  children: [
                    cat.category,
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
                      "(",
                      Number(cat.availableSeats),
                      ")"
                    ] })
                  ]
                },
                cat.category
              ))
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full max-w-sm mx-auto mb-1.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-widest font-medium", children: "Screen / Stage" })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SeatMapSkeleton, {}) : seatMap ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-card rounded-xl border border-border p-5 overflow-x-auto",
            "data-ocid": "booking.seat_map",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5 min-w-fit mx-auto", children: rows.map((rowSeats, rowIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground w-5 text-right shrink-0 font-mono", children: String.fromCharCode(65 + rowIdx) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: rowSeats.map((seat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SeatButton,
                    {
                      seat,
                      isSelected: selectedSeatIds.includes(seat.id),
                      activeCategory,
                      onToggle: toggleSeat
                    },
                    String(seat.id)
                  )) })
                ]
              },
              `row-${String.fromCharCode(65 + rowIdx)}`
            )) })
          }
        ) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4 text-xs text-muted-foreground", children: [
          { label: "Available", cls: "bg-secondary border border-border" },
          { label: "Selected", cls: "bg-accent border-accent" },
          {
            label: "Reserved",
            cls: "bg-amber-100 border border-amber-200 dark:bg-amber-900/20"
          },
          {
            label: "Booked",
            cls: "bg-muted border border-border opacity-60"
          }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-4 h-4 rounded-sm shrink-0 ${item.cls}` }),
          item.label
        ] }, item.label)) }),
        showtime && showtime.seatCategories.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 text-xs text-muted-foreground pt-1 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Category:" }),
          [
            {
              category: TicketCategory.vip,
              ring: "ring-1 ring-amber-400 bg-secondary"
            },
            {
              category: TicketCategory.regular,
              ring: "ring-1 ring-blue-400 bg-secondary"
            },
            {
              category: TicketCategory.balcony,
              ring: "ring-1 ring-purple-400 bg-secondary"
            }
          ].filter(
            (c) => showtime.seatCategories.some(
              (sc) => sc.category === c.category
            )
          ).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "flex items-center gap-1.5 capitalize",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `w-4 h-4 rounded-sm shrink-0 ${item.ring}`
                  }
                ),
                item.category
              ]
            },
            item.category
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-card rounded-xl border border-border p-5 sticky top-20 space-y-4",
          "data-ocid": "booking.order_summary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-display font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4 text-primary" }),
              "Order Summary"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
            selectedSeats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "text-center py-6",
                "data-ocid": "booking.selected_seats.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Select seats from the map" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "Up to ",
                    MAX_SEATS,
                    " seats per booking"
                  ] })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-2",
                "data-ocid": "booking.selected_seats_list",
                children: selectedSeats.map((seat, idx) => {
                  const cat = showtime == null ? void 0 : showtime.seatCategories.find(
                    (c) => c.category === seat.category
                  );
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `booking.seat.${idx + 1}`,
                      className: "flex items-center justify-between text-sm gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-muted-foreground shrink-0 text-xs bg-secondary rounded px-1.5 py-0.5", children: seat.seatLabel }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TicketCategoryBadge, { category: seat.category })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium shrink-0", children: formatPrice((cat == null ? void 0 : cat.priceInCents) ?? 0n) })
                      ]
                    },
                    String(seat.id)
                  );
                })
              }
            ),
            selectedSeats.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    selectedSeats.length,
                    " ticket",
                    selectedSeats.length > 1 ? "s" : ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatPrice(totalPrice) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between font-semibold text-base", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: formatPrice(totalPrice) })
                ] })
              ] })
            ] }),
            !isAuthenticated && selectedSeats.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-start gap-2 text-xs text-muted-foreground bg-secondary rounded-lg p-3",
                "data-ocid": "booking.auth_notice",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sign in to complete your booking and proceed to payment" })
                ]
              }
            ),
            selectedSeats.length > 0 && selectedSeats.length >= MAX_SEATS && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Maximum ",
                MAX_SEATS,
                " seats reached"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "booking.checkout_button",
                className: "w-full font-semibold gap-2",
                disabled: selectedSeats.length === 0 || isProcessing,
                onClick: handleCheckout,
                children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" }),
                  "Processing..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  !isAuthenticated ? "Sign in to Continue" : checkoutLabel,
                  isAuthenticated && selectedSeats.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
                ] })
              }
            ),
            isAuthenticated && selectedSeats.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "You'll be redirected to secure checkout" })
          ]
        }
      ) })
    ] })
  ] });
}
export {
  BookingPage as default
};
