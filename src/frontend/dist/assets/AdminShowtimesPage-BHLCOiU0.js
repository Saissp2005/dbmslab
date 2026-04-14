import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, T as Ticket, B as Button, v as ue, s as TicketCategory, S as Separator, X } from "./index-CtJ3C921.js";
import { u as useShowtimes, a as useVenues, e as useInitializeShowtimeSeats, B as Badge, f as useCreateShowtime, g as useDeleteShowtime } from "./useShowtimes-DAXYNdLs.js";
import { P as Plus, T as Trash2, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-erLJMCBM.js";
import { L as Label, I as Input } from "./label-Dizs-W2G.js";
import { S as Select, a as SelectTrigger, b as SelectValue, d as SelectContent, e as SelectItem } from "./select-D6-ZPUf5.js";
import { S as Skeleton } from "./skeleton-ChEk-H4W.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DpcFhytv.js";
import { E as EmptyState } from "./EmptyState-hSSOv_X0.js";
import { E as ErrorMessage } from "./ErrorMessage-DvXrrHvJ.js";
import { P as PageHeader } from "./PageHeader-CKG-Nc0Q.js";
import { T as TicketCategoryBadge } from "./TicketCategoryBadge-CmA3mGlt.js";
import { u as useEvents } from "./useEvents-DyFdtPM1.js";
import { A as AdminSidebar } from "./AdminPage-Cm7POL3g.js";
import "./card-CDKT_lvH.js";
import "./trending-up-DdNOKKgO.js";
import "./users-C7BcgUK7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polygon", { points: "10 8 16 12 10 16 10 8", key: "1cimsy" }]
];
const CirclePlay = createLucideIcon("circle-play", __iconNode);
const CATEGORIES = Object.values(TicketCategory);
const categoryLabels = {
  [TicketCategory.vip]: "VIP",
  [TicketCategory.regular]: "Regular",
  [TicketCategory.balcony]: "Balcony"
};
function formatDateTime(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
function AddShowtimeDialog({
  open,
  onClose
}) {
  const { data: events = [] } = useEvents();
  const { data: venues = [] } = useVenues();
  const createShowtime = useCreateShowtime();
  const [eventId, setEventId] = reactExports.useState("");
  const [venueId, setVenueId] = reactExports.useState("");
  const [datetime, setDatetime] = reactExports.useState("");
  const [cats, setCats] = reactExports.useState([
    { category: TicketCategory.regular, priceUsd: "25", totalSeats: "100" },
    { category: TicketCategory.vip, priceUsd: "45", totalSeats: "20" }
  ]);
  const usedCats = new Set(cats.map((c) => c.category));
  function addCat() {
    const next = CATEGORIES.find((c) => !usedCats.has(c));
    if (!next) return;
    setCats((prev) => [
      ...prev,
      { category: next, priceUsd: "", totalSeats: "" }
    ]);
  }
  function removeCat(idx) {
    setCats((prev) => prev.filter((_, i) => i !== idx));
  }
  function updateCat(idx, key, value) {
    setCats(
      (prev) => prev.map((c, i) => i === idx ? { ...c, [key]: value } : c)
    );
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!eventId || !venueId || !datetime) {
      ue.error("Fill all required fields");
      return;
    }
    const startMs = new Date(datetime).getTime();
    if (Number.isNaN(startMs)) {
      ue.error("Invalid date/time");
      return;
    }
    try {
      await createShowtime.mutateAsync({
        eventId: BigInt(eventId),
        venueId: BigInt(venueId),
        startTime: BigInt(startMs) * 1000000n,
        seatCategories: cats.map((c) => ({
          category: c.category,
          priceInCents: BigInt(Math.round(Number.parseFloat(c.priceUsd) * 100)),
          totalSeats: BigInt(c.totalSeats || 0)
        }))
      });
      ue.success("Showtime created");
      onClose();
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", "data-ocid": "admin_showtimes.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Add Showtime" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Event" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: eventId, onValueChange: setEventId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin_showtimes.event_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select event…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: events.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ev.id.toString(), children: ev.title }, ev.id.toString())) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Venue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: venueId, onValueChange: setVenueId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin_showtimes.venue_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select venue…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: venues.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v.id.toString(), children: v.name }, v.id.toString())) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "st-dt", children: "Date & Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "st-dt",
            type: "datetime-local",
            value: datetime,
            onChange: (e) => setDatetime(e.target.value),
            required: true,
            "data-ocid": "admin_showtimes.start_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Seat Categories" }),
          usedCats.size < CATEGORIES.length && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: addCat,
              className: "gap-1 h-7 text-xs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                "Add"
              ]
            }
          )
        ] }),
        cats.map((cat, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: cat.category,
                onValueChange: (v) => updateCat(idx, "category", v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((tc) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectItem,
                    {
                      value: tc,
                      disabled: usedCats.has(tc) && tc !== cat.category,
                      children: categoryLabels[tc]
                    },
                    tc
                  )) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Price ($)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: "h-8",
                type: "number",
                min: "0",
                step: "0.01",
                placeholder: "25.00",
                value: cat.priceUsd,
                onChange: (e) => updateCat(idx, "priceUsd", e.target.value),
                "data-ocid": "admin_showtimes.vip_price_input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Seats" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: "h-8",
                type: "number",
                min: "1",
                placeholder: "100",
                value: cat.totalSeats,
                onChange: (e) => updateCat(idx, "totalSeats", e.target.value),
                "data-ocid": "admin_showtimes.regular_price_input"
              }
            )
          ] }),
          cats.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10",
              onClick: () => removeCat(idx),
              "aria-label": "Remove category",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }, cat.category))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            "data-ocid": "admin_showtimes.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: createShowtime.isPending,
            "data-ocid": "admin_showtimes.submit_button",
            children: createShowtime.isPending ? "Creating…" : "Create"
          }
        )
      ] })
    ] })
  ] }) });
}
function DeleteShowtimeDialog({
  showtime,
  eventTitle,
  onClose
}) {
  const deleteShowtime = useDeleteShowtime();
  async function handleConfirm() {
    if (!showtime) return;
    try {
      await deleteShowtime.mutateAsync(showtime.id);
      ue.success("Showtime deleted");
      onClose();
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!showtime, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-sm",
      "data-ocid": "admin_showtimes.delete_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Delete Showtime?" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Delete the showtime for",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: eventTitle }),
          "? This cannot be undone."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "admin_showtimes.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              onClick: handleConfirm,
              disabled: deleteShowtime.isPending,
              "data-ocid": "admin_showtimes.delete_button",
              children: deleteShowtime.isPending ? "Deleting…" : "Delete"
            }
          )
        ] })
      ]
    }
  ) });
}
function AdminShowtimesPage() {
  const { data: showtimes = [], isLoading, error, refetch } = useShowtimes();
  const { data: events = [] } = useEvents();
  const { data: venues = [] } = useVenues();
  const initSeats = useInitializeShowtimeSeats();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [deleteShowtime, setDeleteShowtime] = reactExports.useState(
    null
  );
  const [initializingId, setInitializingId] = reactExports.useState(null);
  const eventMap = new Map(events.map((e) => [e.id.toString(), e.title]));
  const venueMap = new Map(venues.map((v) => [v.id.toString(), v.name]));
  async function handleInitSeats(showtimeId) {
    setInitializingId(showtimeId);
    try {
      await initSeats.mutateAsync(showtimeId);
      ue.success("Seats initialized");
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to init seats");
    } finally {
      setInitializingId(null);
    }
  }
  const deletingEventTitle = deleteShowtime ? eventMap.get(deleteShowtime.eventId.toString()) ?? "Unknown" : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Showtimes",
          subtitle: `${showtimes.length} showtime${showtimes.length !== 1 ? "s" : ""} scheduled`,
          action: {
            label: "Add Showtime",
            onClick: () => setShowCreate(true),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "data-ocid": "admin_showtimes.add_button"
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", "data-ocid": "admin_showtimes.page", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" })
      ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ErrorMessage,
        {
          error,
          onRetry: () => refetch(),
          "data-ocid": "admin_showtimes.error_state"
        }
      ) : showtimes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-8 h-8" }),
          title: "No showtimes yet",
          description: "Schedule a showtime for any event at any venue.",
          action: {
            label: "Add Showtime",
            onClick: () => setShowCreate(true),
            "data-ocid": "admin_showtimes.add_action"
          },
          "data-ocid": "admin_showtimes.empty_state"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-xl overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "admin_showtimes.list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Event" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Venue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date & Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Categories" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Seats" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-28" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: showtimes.map((st, idx) => {
          const eventTitle = eventMap.get(st.eventId.toString()) ?? "Unknown";
          const venueName = venueMap.get(st.venueId.toString()) ?? "Unknown";
          const isInitializing = initializingId === st.id;
          const total = st.seatCategories.reduce(
            (s, c) => s + c.totalSeats,
            0n
          );
          const available = st.seatCategories.reduce(
            (s, c) => s + c.availableSeats,
            0n
          );
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              "data-ocid": `admin_showtimes.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-foreground max-w-[160px] truncate", children: eventTitle }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: venueName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm whitespace-nowrap", children: formatDateTime(st.startTime) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: st.seatCategories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TicketCategoryBadge,
                  {
                    category: cat.category
                  },
                  cat.category
                )) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-sm font-mono", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: String(available) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                    "/",
                    String(total)
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: st.isActive ? "default" : "secondary",
                    className: "text-xs",
                    children: st.isActive ? "Active" : "Inactive"
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "h-8 gap-1 text-xs text-primary hover:text-primary hover:bg-primary/10",
                      onClick: () => handleInitSeats(st.id),
                      disabled: isInitializing,
                      "data-ocid": `admin_showtimes.init_button.${idx + 1}`,
                      "aria-label": "Initialize seats",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "w-3.5 h-3.5" }),
                        isInitializing ? "…" : "Init"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10",
                      onClick: () => setDeleteShowtime(st),
                      "data-ocid": `admin_showtimes.delete_button.${idx + 1}`,
                      "aria-label": "Delete showtime",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] }) })
              ]
            },
            st.id.toString()
          );
        }) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AddShowtimeDialog,
        {
          open: showCreate,
          onClose: () => setShowCreate(false)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DeleteShowtimeDialog,
        {
          showtime: deleteShowtime,
          eventTitle: deletingEventTitle,
          onClose: () => setDeleteShowtime(null)
        }
      )
    ] })
  ] });
}
export {
  AdminShowtimesPage as default
};
