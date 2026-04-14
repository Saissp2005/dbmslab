import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";
import { useMemo, useState } from "react";
import { BookingStatus } from "../backend";
import type { BookingPublic, ShowtimePublic, VenuePublic } from "../backend";
import { BookingStatusBadge } from "../components/BookingStatusBadge";
import { EmptyState } from "../components/EmptyState";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageHeader } from "../components/PageHeader";
import { useMyBookings } from "../hooks/useMyBookings";
import { useShowtimes, useVenues } from "../hooks/useShowtimes";

type TabFilter = "upcoming" | "past" | "cancelled";

function formatShortDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

function isUpcoming(startTime: bigint): boolean {
  const ms = Number(startTime / 1_000_000n);
  return ms > Date.now();
}

interface BookingCardSkeletonProps {
  index: number;
}

function BookingCardSkeleton({ index }: BookingCardSkeletonProps) {
  return (
    <Card key={index} className="p-4 border-border">
      <div className="flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
    </Card>
  );
}

interface BookingCardProps {
  booking: BookingPublic;
  showtime: ShowtimePublic | undefined;
  venue: VenuePublic | undefined;
  index: number;
  onClick: () => void;
}

function BookingCard({
  booking,
  showtime,
  venue,
  index,
  onClick,
}: BookingCardProps) {
  const seatLabels = booking.items.map((i) => i.seatLabel);
  const displaySeats = seatLabels.slice(0, 3);
  const extraSeats = seatLabels.length - 3;

  return (
    <Card
      data-ocid={`dashboard.booking.${index}`}
      className="p-5 hover:shadow-card transition-smooth cursor-pointer border-border group"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Icon column */}
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Ticket className="w-5 h-5 text-primary" />
        </div>

        {/* Info column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-foreground text-sm truncate font-display">
                  Ref #{String(booking.id).padStart(6, "0")}
                </span>
                <BookingStatusBadge status={booking.status} />
              </div>

              {showtime ? (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {formatShortDate(showtime.startTime)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(showtime.startTime)}
                  </span>
                  {venue && (
                    <span className="flex items-center gap-1 truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{venue.name}</span>
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground mt-1">
                  Booked {formatShortDate(booking.createdAt)}
                </div>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 group-hover:text-foreground transition-colors" />
          </div>

          {/* Seats + total row */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-wrap gap-1">
              {displaySeats.map((label) => (
                <Badge
                  key={label}
                  variant="secondary"
                  className="text-xs px-1.5 py-0 font-mono h-5"
                >
                  {label}
                </Badge>
              ))}
              {extraSeats > 0 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                  +{extraSeats}
                </Badge>
              )}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {formatPrice(booking.totalAmountCents)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

const TAB_LABELS: Record<TabFilter, string> = {
  upcoming: "Upcoming",
  past: "Past",
  cancelled: "Cancelled",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<TabFilter>("upcoming");

  const { data: bookings, isLoading, error, refetch } = useMyBookings();
  const { data: allShowtimes } = useShowtimes();
  const { data: allVenues } = useVenues();

  // Build lookup maps
  const showtimeMap = useMemo<Map<string, ShowtimePublic>>(() => {
    const m = new Map<string, ShowtimePublic>();
    for (const st of allShowtimes ?? []) m.set(st.id.toString(), st);
    return m;
  }, [allShowtimes]);

  const venueMap = useMemo<Map<string, VenuePublic>>(() => {
    const m = new Map<string, VenuePublic>();
    for (const v of allVenues ?? []) m.set(v.id.toString(), v);
    return m;
  }, [allVenues]);

  const filteredBookings = useMemo(() => {
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

  const counts = useMemo(() => {
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
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <EmptyState
          data-ocid="dashboard.unauthenticated_state"
          icon={<Ticket className="w-8 h-8" />}
          title="Sign in to view your bookings"
          description="Your booking history will appear here after you sign in."
          action={{
            label: "Sign in",
            onClick: login,
            "data-ocid": "dashboard.login_button",
          }}
        />
      </div>
    );
  }

  if (error) return <ErrorMessage error={error} onRetry={() => refetch()} />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <PageHeader
        title="My Bookings"
        subtitle="View and manage your ticket reservations"
        action={{
          label: "Browse Events",
          onClick: () => navigate({ to: "/" }),
          icon: <CalendarDays className="w-4 h-4" />,
          "data-ocid": "dashboard.browse_events_button",
        }}
      />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabFilter)}
        className="mb-6"
      >
        <TabsList
          data-ocid="dashboard.filter.tab"
          className="bg-muted/60 p-1 h-auto"
        >
          {(["upcoming", "past", "cancelled"] as TabFilter[]).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              data-ocid={`dashboard.filter.${tab}`}
              className="gap-1.5 text-sm px-4 py-1.5"
            >
              {TAB_LABELS[tab]}
              {!isLoading && counts[tab] > 0 && (
                <span className="ml-1 text-xs bg-primary/15 text-primary rounded-full px-1.5 py-0 leading-5 font-medium">
                  {counts[tab]}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <BookingCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <EmptyState
          data-ocid="dashboard.empty_state"
          icon={<Ticket className="w-8 h-8" />}
          title={
            activeTab === "upcoming"
              ? "No upcoming bookings"
              : activeTab === "past"
                ? "No past bookings"
                : "No cancelled bookings"
          }
          description={
            activeTab === "upcoming"
              ? "Your confirmed upcoming events will appear here."
              : activeTab === "past"
                ? "Events you've attended will show up here."
                : "Any cancelled bookings will be listed here."
          }
          action={
            activeTab === "upcoming"
              ? {
                  label: "Browse Events",
                  onClick: () => navigate({ to: "/" }),
                  "data-ocid": "dashboard.browse_events_action",
                }
              : undefined
          }
        />
      ) : (
        <div data-ocid="dashboard.bookings_list" className="space-y-3">
          {filteredBookings.map((booking, idx) => {
            const showtime = showtimeMap.get(booking.showtimeId.toString());
            const venue = showtime
              ? venueMap.get(showtime.venueId.toString())
              : undefined;
            return (
              <BookingCard
                key={String(booking.id)}
                booking={booking}
                showtime={showtime}
                venue={venue}
                index={idx + 1}
                onClick={() =>
                  navigate({
                    to: "/dashboard/bookings/$bookingId",
                    params: { bookingId: String(booking.id) },
                  })
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
