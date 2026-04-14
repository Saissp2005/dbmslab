import { c as createLucideIcon, j as jsxRuntimeExports, T as Ticket, n as useBackend, o as useQuery } from "./index-CtJ3C921.js";
import { B as Badge } from "./useShowtimes-DAXYNdLs.js";
import { C as Card } from "./card-CDKT_lvH.js";
import { S as Skeleton } from "./skeleton-ChEk-H4W.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DpcFhytv.js";
import { E as ErrorMessage } from "./ErrorMessage-DvXrrHvJ.js";
import { P as PageHeader } from "./PageHeader-CKG-Nc0Q.js";
import { A as AdminSidebar, C as ChartColumn } from "./AdminPage-Cm7POL3g.js";
import { U as Users } from "./users-C7BcgUK7.js";
import { T as TrendingUp } from "./trending-up-DdNOKKgO.js";
import "./EmptyState-hSSOv_X0.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = createLucideIcon("dollar-sign", __iconNode);
function useAdminAnalytics() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.getAdminAnalytics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 60
  });
}
function useShowtimeOccupancy() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["showtimeOccupancy"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getShowtimeOccupancy();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 60
  });
}
function usePaymentReconciliation() {
  const { actor, isFetching } = useBackend();
  return useQuery({
    queryKey: ["paymentReconciliation"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPaymentReconciliation();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1e3 * 60
  });
}
function formatPrice(cents) {
  return `$${(Number(cents) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}
function formatDate(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function formatDateTime(ts) {
  return new Date(Number(ts / 1000000n)).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
function OccupancyBar({ percent }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const color = clamped >= 80 ? "bg-success" : clamped >= 50 ? "bg-warning" : "bg-muted-foreground/40";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-full rounded-full ${color}`,
        style: { width: `${clamped}%` }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground w-9 text-right", children: [
      clamped.toFixed(0),
      "%"
    ] })
  ] });
}
const paymentStatusColors = {
  completed: "bg-success/10 text-success border-success/25",
  pending: "bg-warning/10 text-warning border-warning/25",
  failed: "bg-destructive/10 text-destructive border-destructive/25",
  refunded: "bg-secondary text-secondary-foreground border-border"
};
function StatCard({
  label,
  value,
  icon: Icon,
  loading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Card,
    {
      className: "p-5 flex items-start gap-4 border-border shadow-sm",
      "data-ocid": `admin_analytics.stat.${label.toLowerCase().replace(/\s/g, "_")}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1", children: label }),
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: value })
        ] })
      ]
    }
  );
}
function AdminAnalyticsPage() {
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics
  } = useAdminAnalytics();
  const { data: occupancy = [], isLoading: occLoading } = useShowtimeOccupancy();
  const { data: payments = [], isLoading: paymentsLoading } = usePaymentReconciliation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Analytics",
          subtitle: "Platform-wide performance metrics, occupancy, and payment data."
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "p-6 max-w-7xl space-y-8",
          "data-ocid": "admin_analytics.page",
          children: [
            analyticsError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              ErrorMessage,
              {
                error: analyticsError,
                onRetry: () => refetchAnalytics(),
                "data-ocid": "admin_analytics.error_state"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total Bookings",
                  value: analytics ? String(analytics.totalBookings) : "—",
                  icon: Ticket,
                  loading: analyticsLoading
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total Revenue",
                  value: analytics ? formatPrice(analytics.totalRevenueCents) : "—",
                  icon: DollarSign,
                  loading: analyticsLoading
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total Users",
                  value: analytics ? String(analytics.totalUsers) : "—",
                  icon: Users,
                  loading: analyticsLoading
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Popular Events",
                  value: analytics ? String(analytics.popularEvents.length) : "—",
                  icon: TrendingUp,
                  loading: analyticsLoading
                }
              )
            ] }),
            analytics && analytics.popularEvents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-semibold text-foreground", children: "Top Events by Revenue" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "bg-card border border-border rounded-xl p-5 space-y-3",
                  "data-ocid": "admin_analytics.popular_events_list",
                  children: analytics.popularEvents.map((event, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `admin_analytics.popular_event.${idx + 1}`,
                      className: "flex items-center justify-between py-2 border-b border-border last:border-0",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-mono text-muted-foreground w-5", children: [
                            idx + 1,
                            "."
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm truncate", children: event.eventTitle })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                            String(event.totalBookings),
                            " bookings"
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-primary", children: formatPrice(event.totalRevenueCents) })
                        ] })
                      ]
                    },
                    event.eventId.toString()
                  ))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "admin_analytics.occupancy_section", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-semibold text-foreground", children: "Showtime Occupancy" })
              ] }),
              occLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" })
              ] }) : occupancy.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No showtime data yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-xl overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "admin_analytics.occupancy_list", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Event" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Showtime" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Total" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Booked" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "min-w-[160px]", children: "Occupancy" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: occupancy.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TableRow,
                  {
                    "data-ocid": `admin_analytics.occupancy.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-foreground max-w-xs truncate", children: row.eventTitle }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground whitespace-nowrap", children: formatDateTime(row.startTime) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm", children: String(row.totalSeats) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm", children: String(row.bookedSeats) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        OccupancyBar,
                        {
                          percent: Number(row.occupancyPercent)
                        }
                      ) })
                    ]
                  },
                  row.showtimeId.toString()
                )) })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "admin_analytics.reconciliation_section", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-4 h-4 text-primary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-semibold text-foreground", children: "Payment Reconciliation" })
              ] }),
              paymentsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" })
              ] }) : payments.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground py-4 text-center", children: "No payment records yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-xl overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "admin_analytics.payments_list", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Payment ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Booking ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Amount" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Transaction ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: payments.map((pay, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TableRow,
                  {
                    "data-ocid": `admin_analytics.payment.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-mono text-sm text-muted-foreground", children: [
                        "#",
                        String(pay.paymentId)
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-mono text-sm text-muted-foreground", children: [
                        "#",
                        String(pay.bookingId)
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm font-semibold text-foreground", children: formatPrice(pay.amountCents) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "outline",
                          className: `text-xs capitalize ${paymentStatusColors[pay.status] ?? "bg-muted text-muted-foreground"}`,
                          children: pay.status
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-xs text-muted-foreground max-w-xs truncate", children: pay.transactionId ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "—" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm text-muted-foreground whitespace-nowrap", children: formatDate(pay.createdAt) })
                    ]
                  },
                  pay.paymentId.toString()
                )) })
              ] }) })
            ] })
          ]
        }
      )
    ] })
  ] });
}
export {
  AdminAnalyticsPage as default
};
