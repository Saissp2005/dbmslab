import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { PageLoader } from "./components/LoadingSpinner";

// Lazy-loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const BookingPage = lazy(() => import("./pages/BookingPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const BookingDetailPage = lazy(() => import("./pages/BookingDetailPage"));
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
const AdminVenuesPage = lazy(() => import("./pages/admin/AdminVenuesPage"));
const AdminEventsPage = lazy(() => import("./pages/admin/AdminEventsPage"));
const AdminShowtimesPage = lazy(
  () => import("./pages/admin/AdminShowtimesPage"),
);
const AdminAnalyticsPage = lazy(
  () => import("./pages/admin/AdminAnalyticsPage"),
);

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

// Public routes
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    q?: string;
    type?: string;
    sort?: string;
    dateFrom?: string;
    dateTo?: string;
    minPrice?: number;
    maxPrice?: number;
    venueId?: string;
  } => ({
    q: typeof search.q === "string" ? search.q : undefined,
    type: typeof search.type === "string" ? search.type : undefined,
    sort: typeof search.sort === "string" ? search.sort : undefined,
    dateFrom: typeof search.dateFrom === "string" ? search.dateFrom : undefined,
    dateTo: typeof search.dateTo === "string" ? search.dateTo : undefined,
    minPrice:
      typeof search.minPrice === "number"
        ? search.minPrice
        : typeof search.minPrice === "string"
          ? Number.parseFloat(search.minPrice) || undefined
          : undefined,
    maxPrice:
      typeof search.maxPrice === "number"
        ? search.maxPrice
        : typeof search.maxPrice === "string"
          ? Number.parseFloat(search.maxPrice) || undefined
          : undefined,
    venueId: typeof search.venueId === "string" ? search.venueId : undefined,
  }),
  component: HomePage,
});

const eventDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId",
  component: EventDetailPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$eventId/booking",
  validateSearch: (search: Record<string, unknown>) => ({
    showtimeId:
      typeof search.showtimeId === "string" ? search.showtimeId : undefined,
  }),
  component: BookingPage,
});

// Auth-required routes
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const bookingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard/bookings/$bookingId",
  component: BookingDetailPage,
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const adminVenuesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/venues",
  component: AdminVenuesPage,
});

const adminEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/events",
  component: AdminEventsPage,
});

const adminShowtimesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/showtimes",
  component: AdminShowtimesPage,
});

const adminAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/analytics",
  component: AdminAnalyticsPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  eventDetailRoute,
  bookingRoute,
  dashboardRoute,
  bookingDetailRoute,
  adminRoute,
  adminVenuesRoute,
  adminEventsRoute,
  adminShowtimesRoute,
  adminAnalyticsRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
