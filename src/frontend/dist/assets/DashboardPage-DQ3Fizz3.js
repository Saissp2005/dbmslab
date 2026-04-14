import { i as useNavigate, q as useInternetIdentity, r as reactExports, w as BookingStatus, j as jsxRuntimeExports, T as Ticket, C as CalendarDays } from "./index-CtJ3C921.js";
import { u as useShowtimes, a as useVenues, M as MapPin, B as Badge } from "./useShowtimes-DAXYNdLs.js";
import { C as Card } from "./card-CDKT_lvH.js";
import { S as Skeleton } from "./skeleton-ChEk-H4W.js";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-RxQFy0P3.js";
import { B as BookingStatusBadge } from "./BookingStatusBadge-BJwzHw0P.js";
import { E as EmptyState } from "./EmptyState-hSSOv_X0.js";
import { E as ErrorMessage } from "./ErrorMessage-DvXrrHvJ.js";
import { P as PageHeader } from "./PageHeader-CKG-Nc0Q.js";
import { b as useMyBookings } from "./useMyBookings-CHuAlfx0.js";
import { C as Clock } from "./clock-XmT9Q-T9.js";
import { C as ChevronRight } from "./chevron-right-Demtx4Fs.js";
function formatShortDate(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleDateString("en-US", {
    day: "numeric",
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
function isUpcoming(startTime) {
  const ms = Number(startTime / 1000000n);
  return ms > Date.now();
}
function BookingCardSkeleton({ index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "p-4 border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-10 h-10 rounded-lg shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-64" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-16 h-6 rounded-full" })
  ] }) }, index);
}
function BookingCard({
  booking,
  showtime,
  venue,
  index,
  onClick
}) {
  const seatLabels = booking.items.map((i) => i.seatLabel);
  const displaySeats = seatLabels.slice(0, 3);
  const extraSeats = seatLabels.length - 3;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Card,
    {
      "data-ocid": `dashboard.booking.${index}`,
      className: "p-5 hover:shadow-card transition-smooth cursor-pointer border-border group",
      onClick,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground text-sm truncate font-display", children: [
                  "Ref #",
                  String(booking.id).padStart(6, "0")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(BookingStatusBadge, { status: booking.status })
              ] }),
              showtime ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3 h-3" }),
                  formatShortDate(showtime.startTime)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
                  formatTime(showtime.startTime)
                ] }),
                venue && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 truncate max-w-[180px]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: venue.name })
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-1", children: [
                "Booked ",
                formatShortDate(booking.createdAt)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-foreground transition-colors" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
              displaySeats.map((label) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "text-xs px-1.5 py-0 font-mono h-5",
                  children: label
                },
                label
              )),
              extraSeats > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs px-1.5 py-0 h-5", children: [
                "+",
                extraSeats
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: formatPrice(booking.totalAmountCents) })
          ] })
        ] })
      ] })
    }
  );
}
const TAB_LABELS = {
  upcoming: "Upcoming",
  past: "Past",
  cancelled: "Cancelled"
};
function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useInternetIdentity();
  const [activeTab, setActiveTab] = reactExports.useState("upcoming");
  const { data: bookings, isLoading, error, refetch } = useMyBookings();
  const { data: allShowtimes } = useShowtimes();
  const { data: allVenues } = useVenues();
  const showtimeMap = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const st of allShowtimes ?? []) m.set(st.id.toString(), st);
    return m;
  }, [allShowtimes]);
  const venueMap = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const v of allVenues ?? []) m.set(v.id.toString(), v);
    return m;
  }, [allVenues]);
  const filteredBookings = reactExports.useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      if (activeTab === "cancelled")
        return b.status === BookingStatus.cancelled;
      const showtime = showtimeMap.get(b.showtimeId.toString());
      const upcoming = showtime ? isUpcoming(showtime.startTime) : false;
      if (activeTab === "upcoming")
        return b.status !== BookingStatus.cancelled && upcoming;
      return b.status !== BookingStatus.cancelled && !upcoming;
    });
  }, [bookings, activeTab, showtimeMap]);
  const counts = reactExports.useMemo(() => {
    if (!bookings) return { upcoming: 0, past: 0, cancelled: 0 };
    let upcoming = 0;
    let past = 0;
    let cancelled = 0;
    for (const b of bookings) {
      if (b.status === BookingStatus.cancelled) {
        cancelled++;
      } else {
        const showtime = showtimeMap.get(b.showtimeId.toString());
        const up = showtime ? isUpcoming(showtime.startTime) : false;
        if (up) upcoming++;
        else past++;
      }
    }
    return { upcoming, past, cancelled };
  }, [bookings, showtimeMap]);
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        "data-ocid": "dashboard.unauthenticated_state",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-8 h-8" }),
        title: "Sign in to view your bookings",
        description: "Your booking history will appear here after you sign in.",
        action: {
          label: "Sign in",
          onClick: login,
          "data-ocid": "dashboard.login_button"
        }
      }
    ) });
  }
  if (error) return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { error, onRetry: () => refetch() });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "My Bookings",
        subtitle: "View and manage your ticket reservations",
        action: {
          label: "Browse Events",
          onClick: () => navigate({ to: "/" }),
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4" }),
          "data-ocid": "dashboard.browse_events_button"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tabs,
      {
        value: activeTab,
        onValueChange: (v) => setActiveTab(v),
        className: "mb-6",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsList,
          {
            "data-ocid": "dashboard.filter.tab",
            className: "bg-muted/60 p-1 h-auto",
            children: ["upcoming", "past", "cancelled"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: tab,
                "data-ocid": `dashboard.filter.${tab}`,
                className: "gap-1.5 text-sm px-4 py-1.5",
                children: [
                  TAB_LABELS[tab],
                  !isLoading && counts[tab] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs bg-primary/15 text-primary rounded-full px-1.5 py-0 leading-5 font-medium", children: counts[tab] })
                ]
              },
              tab
            ))
          }
        )
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(BookingCardSkeleton, { index: i }, i)) }) : filteredBookings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        "data-ocid": "dashboard.empty_state",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-8 h-8" }),
        title: activeTab === "upcoming" ? "No upcoming bookings" : activeTab === "past" ? "No past bookings" : "No cancelled bookings",
        description: activeTab === "upcoming" ? "Your confirmed upcoming events will appear here." : activeTab === "past" ? "Events you've attended will show up here." : "Any cancelled bookings will be listed here.",
        action: activeTab === "upcoming" ? {
          label: "Browse Events",
          onClick: () => navigate({ to: "/" }),
          "data-ocid": "dashboard.browse_events_action"
        } : void 0
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "dashboard.bookings_list", className: "space-y-3", children: filteredBookings.map((booking, idx) => {
      const showtime = showtimeMap.get(booking.showtimeId.toString());
      const venue = showtime ? venueMap.get(showtime.venueId.toString()) : void 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        BookingCard,
        {
          booking,
          showtime,
          venue,
          index: idx + 1,
          onClick: () => navigate({
            to: "/dashboard/bookings/$bookingId",
            params: { bookingId: String(booking.id) }
          })
        },
        String(booking.id)
      );
    }) })
  ] });
}
export {
  DashboardPage as default
};
