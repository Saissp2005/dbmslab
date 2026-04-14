import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  MapPin,
  ShieldAlert,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";
import type { AdminAnalytics } from "../../backend";
import { EmptyState } from "../../components/EmptyState";
import { useBackend } from "../../hooks/useBackend";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useVenues } from "../../hooks/useShowtimes";

const adminNavItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Venues", href: "/admin/venues", icon: MapPin },
  { label: "Showtimes", href: "/admin/showtimes", icon: Ticket },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const navigate = useNavigate();
  return (
    <aside className="w-60 shrink-0 bg-card border-r border-border min-h-screen hidden md:flex flex-col">
      <div className="p-4 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Admin Panel
        </p>
      </div>
      <nav className="p-2 flex flex-col gap-0.5 flex-1">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            activeOptions={{ exact: item.exact }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-150 [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:font-semibold"
            activeProps={{ className: "active" }}
            data-ocid={`admin.sidebar.${item.label.toLowerCase()}_link`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate({ to: "/" })}
          data-ocid="admin.sidebar.back_to_site_button"
        >
          ← Back to site
        </Button>
      </div>
    </aside>
  );
}

function useAdminAnalytics() {
  const { actor, isFetching } = useBackend();
  return useQuery<AdminAnalytics>({
    queryKey: ["adminAnalytics"],
    queryFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.getAdminAnalytics();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  sub?: string;
  loading?: boolean;
}) {
  return (
    <Card className="p-5 flex items-start gap-4 border-border shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-7 w-20 mb-1" />
        ) : (
          <p className="text-2xl font-display font-bold text-foreground">
            {value}
          </p>
        )}
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

export default function AdminPage() {
  const { isAuthenticated } = useInternetIdentity();
  const { isAdmin, profile } = useCurrentUser();
  const { data: analytics, isLoading } = useAdminAnalytics();
  const { data: venues = [] } = useVenues();

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          data-ocid="admin.unauthenticated_state"
          icon={<ShieldAlert className="w-8 h-8" />}
          title="Authentication required"
          description="Please sign in to access the admin panel."
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          data-ocid="admin.unauthorized_state"
          icon={<ShieldAlert className="w-8 h-8" />}
          title="Access denied"
          description="You don't have admin privileges to access this area."
        />
      </div>
    );
  }

  const totalRevenue = analytics
    ? Number(analytics.totalRevenueCents) / 100
    : 0;
  const popularEvents = analytics?.popularEvents.slice(0, 5) ?? [];

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-background">
        <div className="border-b border-border bg-card px-6 py-5">
          <h1 className="text-xl font-display font-bold text-foreground">
            Admin Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back{profile?.name ? `, ${profile.name}` : ""}. Here's
            what's happening today.
          </p>
        </div>
        <div className="p-6 max-w-6xl">
          {/* Stats */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            data-ocid="admin.overview.stats_section"
          >
            <StatCard
              label="Total Bookings"
              value={analytics ? String(analytics.totalBookings) : "—"}
              icon={Ticket}
              loading={isLoading}
            />
            <StatCard
              label="Total Revenue"
              value={
                analytics
                  ? `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "—"
              }
              icon={TrendingUp}
              loading={isLoading}
            />
            <StatCard
              label="Total Users"
              value={analytics ? String(analytics.totalUsers) : "—"}
              icon={Users}
              loading={isLoading}
            />
            <StatCard
              label="Venues"
              value={String(venues.length)}
              icon={MapPin}
              sub="Active venues"
              loading={isLoading}
            />
          </div>

          <Separator className="mb-8" />

          {/* Top Events */}
          <div
            className="mb-8"
            data-ocid="admin.overview.popular_events_section"
          >
            <h2 className="text-base font-display font-semibold text-foreground mb-4">
              Top 5 Popular Events
            </h2>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            ) : popularEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No event data yet.
              </p>
            ) : (
              <div className="space-y-2">
                {popularEvents.map((event, idx) => (
                  <div
                    key={event.eventId.toString()}
                    className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
                    data-ocid={`admin.overview.popular_event.item.${idx + 1}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {event.eventTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(event.totalBookings)} bookings
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="shrink-0 font-mono text-xs"
                    >
                      ${(Number(event.totalRevenueCents) / 100).toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator className="mb-8" />

          {/* Quick Links */}
          <div data-ocid="admin.overview.quick_links_section">
            <h2 className="text-base font-display font-semibold text-foreground mb-4">
              Quick Access
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {adminNavItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 group"
                  data-ocid={`admin.overview.${item.label.toLowerCase()}_link`}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-150">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">Manage →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
