import { c as createLucideIcon, q as useInternetIdentity, ab as useCurrentUser, j as jsxRuntimeExports, T as Ticket, S as Separator, C as CalendarDays, ac as Link, i as useNavigate, B as Button, n as useBackend, o as useQuery } from "./index-CtJ3C921.js";
import { a as useVenues, M as MapPin, B as Badge } from "./useShowtimes-DAXYNdLs.js";
import { C as Card } from "./card-CDKT_lvH.js";
import { S as Skeleton } from "./skeleton-ChEk-H4W.js";
import { E as EmptyState } from "./EmptyState-hSSOv_X0.js";
import { T as TrendingUp } from "./trending-up-DdNOKKgO.js";
import { U as Users } from "./users-C7BcgUK7.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = createLucideIcon("layout-dashboard", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
];
const ShieldAlert = createLucideIcon("shield-alert", __iconNode);
const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Venues", href: "/admin/venues", icon: MapPin },
  { label: "Showtimes", href: "/admin/showtimes", icon: Ticket },
  { label: "Analytics", href: "/admin/analytics", icon: ChartColumn }
];
function AdminSidebar() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-60 shrink-0 bg-card border-r border-border min-h-screen hidden md:flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest", children: "Admin Panel" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "p-2 flex flex-col gap-0.5 flex-1", children: adminNavItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: item.href,
        activeOptions: { exact: item.exact },
        className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:font-semibold",
        activeProps: { className: "active" },
        "data-ocid": `admin.sidebar.${item.label.toLowerCase()}_link`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-4 h-4 shrink-0" }),
          item.label
        ]
      },
      item.href
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
        onClick: () => navigate({ to: "/" }),
        "data-ocid": "admin.sidebar.back_to_site_button",
        children: "← Back to site"
      }
    ) })
  ] });
}
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
function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  loading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "p-5 flex items-start gap-4 border-border shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1", children: label }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20 mb-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold text-foreground", children: value }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
    ] })
  ] });
}
function AdminPage() {
  const { isAuthenticated } = useInternetIdentity();
  const { isAdmin, profile } = useCurrentUser();
  const { data: analytics, isLoading } = useAdminAnalytics();
  const { data: venues = [] } = useVenues();
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        "data-ocid": "admin.unauthenticated_state",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-8 h-8" }),
        title: "Authentication required",
        description: "Please sign in to access the admin panel."
      }
    ) });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        "data-ocid": "admin.unauthorized_state",
        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-8 h-8" }),
        title: "Access denied",
        description: "You don't have admin privileges to access this area."
      }
    ) });
  }
  const totalRevenue = analytics ? Number(analytics.totalRevenueCents) / 100 : 0;
  const popularEvents = (analytics == null ? void 0 : analytics.popularEvents.slice(0, 5)) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border bg-card px-6 py-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Admin Overview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          "Welcome back",
          (profile == null ? void 0 : profile.name) ? `, ${profile.name}` : "",
          ". Here's what's happening today."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-6xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8",
            "data-ocid": "admin.overview.stats_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total Bookings",
                  value: analytics ? String(analytics.totalBookings) : "—",
                  icon: Ticket,
                  loading: isLoading
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total Revenue",
                  value: analytics ? `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—",
                  icon: TrendingUp,
                  loading: isLoading
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Total Users",
                  value: analytics ? String(analytics.totalUsers) : "—",
                  icon: Users,
                  loading: isLoading
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Venues",
                  value: String(venues.length),
                  icon: MapPin,
                  sub: "Active venues",
                  loading: isLoading
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mb-8",
            "data-ocid": "admin.overview.popular_events_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-semibold text-foreground mb-4", children: "Top 5 Popular Events" }),
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-xl" })
              ] }) : popularEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No event data yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: popularEvents.map((event, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-4 p-4 bg-card rounded-xl border border-border",
                  "data-ocid": `admin.overview.popular_event.item.${idx + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0", children: idx + 1 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground text-sm truncate", children: event.eventTitle }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        String(event.totalBookings),
                        " bookings"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "secondary",
                        className: "shrink-0 font-mono text-xs",
                        children: [
                          "$",
                          (Number(event.totalRevenueCents) / 100).toFixed(2)
                        ]
                      }
                    )
                  ]
                },
                event.eventId.toString()
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "admin.overview.quick_links_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-semibold text-foreground mb-4", children: "Quick Access" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: adminNavItems.slice(1).map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: item.href,
              className: "bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 group",
              "data-ocid": `admin.overview.${item.label.toLowerCase()}_link`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-150", children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "w-5 h-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: item.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Manage →" })
                ] })
              ]
            },
            item.href
          )) })
        ] })
      ] })
    ] })
  ] });
}
const AdminPage$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AdminSidebar,
  default: AdminPage
}, Symbol.toStringTag, { value: "Module" }));
export {
  AdminSidebar as A,
  ChartColumn as C,
  AdminPage$1 as a
};
