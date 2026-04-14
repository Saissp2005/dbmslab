import { m as useParams, i as useNavigate, r as reactExports, j as jsxRuntimeExports, E as EventType, B as Button, T as Ticket, S as Separator } from "./index-CtJ3C921.js";
import { u as useShowtimes, a as useVenues, B as Badge, M as MapPin } from "./useShowtimes-DAXYNdLs.js";
import { S as Skeleton } from "./skeleton-ChEk-H4W.js";
import { E as EmptyState } from "./EmptyState-hSSOv_X0.js";
import { E as ErrorMessage } from "./ErrorMessage-DvXrrHvJ.js";
import { T as TicketCategoryBadge } from "./TicketCategoryBadge-CmA3mGlt.js";
import { a as useEvent } from "./useEvents-DyFdtPM1.js";
import { C as ChevronLeft } from "./chevron-left-Dl4AXylI.js";
import { C as Clock } from "./clock-XmT9Q-T9.js";
import { C as Calendar } from "./calendar-BYpiDwNe.js";
import { U as Users } from "./users-C7BcgUK7.js";
import { C as ChevronRight } from "./chevron-right-Demtx4Fs.js";
const EVENT_PLACEHOLDER_IMAGES = {
  [EventType.movie]: "/assets/generated/event-movie.dim_800x450.jpg",
  [EventType.concert]: "/assets/generated/event-concert.dim_800x450.jpg",
  [EventType.workshop]: "/assets/generated/event-workshop.dim_800x450.jpg",
  [EventType.sports]: "/assets/generated/event-sports.dim_800x450.jpg",
  [EventType.other]: "/assets/generated/event-other.dim_800x450.jpg"
};
const EVENT_TYPE_LABELS = {
  [EventType.movie]: "Movie",
  [EventType.concert]: "Concert",
  [EventType.workshop]: "Workshop",
  [EventType.sports]: "Sports",
  [EventType.other]: "Event"
};
function formatDate(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
function formatTime(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatPrice(cents) {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}
function ShowtimeCard({
  showtime,
  venueName,
  isSelected,
  onSelect,
  onBook,
  idx
}) {
  var _a;
  const totalAvailable = showtime.seatCategories.reduce(
    (sum, c) => sum + Number(c.availableSeats),
    0
  );
  const totalSeats = showtime.seatCategories.reduce(
    (sum, c) => sum + Number(c.totalSeats),
    0
  );
  const lowestPrice = showtime.seatCategories.reduce(
    (min, c) => c.priceInCents < min ? c.priceInCents : min,
    ((_a = showtime.seatCategories[0]) == null ? void 0 : _a.priceInCents) ?? 0n
  );
  const isSoldOut = totalAvailable === 0;
  const occupancyPct = totalSeats > 0 ? (totalSeats - totalAvailable) / totalSeats * 100 : 0;
  const isFast = occupancyPct > 70;
  function handleKeyDown(e) {
    if (!isSelected && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect();
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `event_detail.showtime.${idx}`,
      role: !isSelected ? "button" : void 0,
      tabIndex: !isSelected ? 0 : void 0,
      className: `rounded-xl border transition-all duration-200 overflow-hidden ${isSelected ? "border-primary shadow-elevated bg-card ring-1 ring-primary/20" : "border-border bg-card hover:shadow-card hover:border-primary/30 cursor-pointer"}`,
      onClick: !isSelected ? onSelect : void 0,
      onKeyDown: handleKeyDown,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-primary shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatDate(showtime.startTime) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "·" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: formatTime(showtime.startTime) })
              ] }),
              venueName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: venueName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5 shrink-0" }),
                isSoldOut ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-medium", children: "Sold out" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: isFast ? "text-amber-600 font-medium" : "", children: [
                  totalAvailable,
                  " seats left",
                  isFast ? " · Selling fast!" : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-primary leading-tight", children: formatPrice(lowestPrice) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: showtime.seatCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-1.5 bg-secondary rounded-lg px-2.5 py-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TicketCategoryBadge, { category: cat.category }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  Number(cat.availableSeats),
                  "/",
                  Number(cat.totalSeats)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: formatPrice(cat.priceInCents) })
              ]
            },
            cat.category
          )) })
        ] }),
        isSelected && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 border-t border-primary/20 px-4 py-3 flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Showtime selected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              "data-ocid": `event_detail.book_button.${idx}`,
              disabled: isSoldOut,
              onClick: onBook,
              className: "gap-1.5 font-semibold",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-3.5 h-3.5" }),
                isSoldOut ? "Sold Out" : "Select Seats",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const SKELETON_SHOWTIMES = [1, 2, 3];
function EventDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32 mb-6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full aspect-[3/4] rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-3/4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-px w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: SKELETON_SHOWTIMES.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "h-32 rounded-xl"
          },
          `skeleton-showtime-${i}`
        )) })
      ] })
    ] })
  ] });
}
function EventDetailPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const navigate = useNavigate();
  const eventIdBig = BigInt(eventId);
  const [selectedShowtimeId, setSelectedShowtimeId] = reactExports.useState(
    null
  );
  const { data: event, isLoading, error } = useEvent(eventIdBig);
  const { data: showtimes = [], isLoading: showtimesLoading } = useShowtimes(eventIdBig);
  const { data: venues = [] } = useVenues();
  if (isLoading || showtimesLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(EventDetailSkeleton, {});
  if (error || !event) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ErrorMessage,
      {
        title: "Event not found",
        message: "This event could not be loaded or does not exist.",
        "data-ocid": "event_detail.error_state"
      }
    );
  }
  const imageUrl = event.imageUrls[0] ?? EVENT_PLACEHOLDER_IMAGES[event.eventType] ?? EVENT_PLACEHOLDER_IMAGES[EventType.other];
  const activeShowtimes = showtimes.filter((s) => s.isActive);
  function handleBook(showtimeId) {
    navigate({
      to: "/events/$eventId/booking",
      params: { eventId },
      search: { showtimeId: String(showtimeId) }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        "data-ocid": "event_detail.back_button",
        onClick: () => navigate({ to: "/" }),
        className: "gap-2 mb-6 -ml-2 transition-smooth",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
          "Back to Events"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden aspect-[3/4] bg-muted shadow-elevated", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: imageUrl,
            alt: event.title,
            className: "w-full h-full object-cover",
            onError: (e) => {
              e.target.src = EVENT_PLACEHOLDER_IMAGES[EventType.other];
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-4 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Event Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Duration" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", children: [
                  Number(event.durationMinutes),
                  " minutes"
                ] })
              ] })
            ] }),
            event.genre && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-3.5 h-3.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Genre" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium capitalize", children: event.genre })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Type" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium capitalize", children: EVENT_TYPE_LABELS[event.eventType] ?? event.eventType })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "capitalize text-xs font-semibold",
              children: EVENT_TYPE_LABELS[event.eventType] ?? event.eventType
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-display font-bold text-foreground leading-tight", children: event.title }),
          event.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 leading-relaxed text-sm", children: event.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "event_detail.showtimes_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-base font-display font-semibold mb-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 text-primary" }),
            "Choose a Showtime"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-4", children: "Click a showtime to select it, then proceed to seat selection" }),
          activeShowtimes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              "data-ocid": "event_detail.showtimes.empty_state",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-7 h-7" }),
              title: "No showtimes scheduled",
              description: "Check back soon for upcoming dates and times."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "space-y-3",
              "data-ocid": "event_detail.showtimes_list",
              children: activeShowtimes.map((showtime, i) => {
                const venue = venues.find((v) => v.id === showtime.venueId);
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ShowtimeCard,
                  {
                    showtime,
                    venueName: (venue == null ? void 0 : venue.name) ?? "",
                    isSelected: selectedShowtimeId === showtime.id,
                    onSelect: () => setSelectedShowtimeId(showtime.id),
                    onBook: () => handleBook(showtime.id),
                    idx: i + 1
                  },
                  String(showtime.id)
                );
              })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  EventDetailPage as default
};
