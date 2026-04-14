import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { EventType } from "../backend";
import type { ShowtimePublic } from "../backend";
import { EmptyState } from "../components/EmptyState";
import { ErrorMessage } from "../components/ErrorMessage";
import { TicketCategoryBadge } from "../components/TicketCategoryBadge";
import { useEvent } from "../hooks/useEvents";
import { useShowtimes, useVenues } from "../hooks/useShowtimes";

const EVENT_PLACEHOLDER_IMAGES: Record<string, string> = {
  [EventType.movie]: "/assets/generated/event-movie.dim_800x450.jpg",
  [EventType.concert]: "/assets/generated/event-concert.dim_800x450.jpg",
  [EventType.workshop]: "/assets/generated/event-workshop.dim_800x450.jpg",
  [EventType.sports]: "/assets/generated/event-sports.dim_800x450.jpg",
  [EventType.other]: "/assets/generated/event-other.dim_800x450.jpg",
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  [EventType.movie]: "Movie",
  [EventType.concert]: "Concert",
  [EventType.workshop]: "Workshop",
  [EventType.sports]: "Sports",
  [EventType.other]: "Event",
};

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
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

function ShowtimeCard({
  showtime,
  venueName,
  isSelected,
  onSelect,
  onBook,
  idx,
}: {
  showtime: ShowtimePublic;
  venueName: string;
  isSelected: boolean;
  onSelect: () => void;
  onBook: () => void;
  idx: number;
}) {
  const totalAvailable = showtime.seatCategories.reduce(
    (sum, c) => sum + Number(c.availableSeats),
    0,
  );
  const totalSeats = showtime.seatCategories.reduce(
    (sum, c) => sum + Number(c.totalSeats),
    0,
  );
  const lowestPrice = showtime.seatCategories.reduce(
    (min, c) => (c.priceInCents < min ? c.priceInCents : min),
    showtime.seatCategories[0]?.priceInCents ?? 0n,
  );
  const isSoldOut = totalAvailable === 0;
  const occupancyPct =
    totalSeats > 0 ? ((totalSeats - totalAvailable) / totalSeats) * 100 : 0;
  const isFast = occupancyPct > 70;

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!isSelected && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onSelect();
    }
  }

  return (
    <div
      data-ocid={`event_detail.showtime.${idx}`}
      role={!isSelected ? "button" : undefined}
      tabIndex={!isSelected ? 0 : undefined}
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? "border-primary shadow-elevated bg-card ring-1 ring-primary/20"
          : "border-border bg-card hover:shadow-card hover:border-primary/30 cursor-pointer"
      }`}
      onClick={!isSelected ? onSelect : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <span>{formatDate(showtime.startTime)}</span>
              <span className="text-muted-foreground font-normal">·</span>
              <span className="text-primary">
                {formatTime(showtime.startTime)}
              </span>
            </div>
            {venueName && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{venueName}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5 shrink-0" />
              {isSoldOut ? (
                <span className="text-destructive font-medium">Sold out</span>
              ) : (
                <span className={isFast ? "text-amber-600 font-medium" : ""}>
                  {totalAvailable} seats left{isFast ? " · Selling fast!" : ""}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">From</p>
            <p className="text-lg font-bold text-primary leading-tight">
              {formatPrice(lowestPrice)}
            </p>
          </div>
        </div>

        {/* Category availability */}
        <div className="flex flex-wrap gap-2 mt-3">
          {showtime.seatCategories.map((cat) => (
            <div
              key={cat.category}
              className="flex items-center gap-1.5 bg-secondary rounded-lg px-2.5 py-1"
            >
              <TicketCategoryBadge category={cat.category} />
              <span className="text-xs text-muted-foreground">
                {Number(cat.availableSeats)}/{Number(cat.totalSeats)}
              </span>
              <span className="text-xs font-medium text-foreground">
                {formatPrice(cat.priceInCents)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected: show Book Seats CTA */}
      {isSelected && (
        <div className="bg-primary/5 border-t border-primary/20 px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Showtime selected</p>
          <Button
            size="sm"
            data-ocid={`event_detail.book_button.${idx}`}
            disabled={isSoldOut}
            onClick={onBook}
            className="gap-1.5 font-semibold"
          >
            <Ticket className="w-3.5 h-3.5" />
            {isSoldOut ? "Sold Out" : "Select Seats"}
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

const SKELETON_SHOWTIMES = [1, 2, 3];

function EventDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="w-full aspect-[3/4] rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-px w-full" />
          <div className="space-y-3">
            {SKELETON_SHOWTIMES.map((i) => (
              <Skeleton
                key={`skeleton-showtime-${i}`}
                className="h-32 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventDetailPage() {
  const { eventId } = useParams({ from: "/events/$eventId" });
  const navigate = useNavigate();
  const eventIdBig = BigInt(eventId);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<bigint | null>(
    null,
  );

  const { data: event, isLoading, error } = useEvent(eventIdBig);
  const { data: showtimes = [], isLoading: showtimesLoading } =
    useShowtimes(eventIdBig);
  const { data: venues = [] } = useVenues();

  if (isLoading || showtimesLoading) return <EventDetailSkeleton />;
  if (error || !event) {
    return (
      <ErrorMessage
        title="Event not found"
        message="This event could not be loaded or does not exist."
        data-ocid="event_detail.error_state"
      />
    );
  }

  const imageUrl =
    event.imageUrls[0] ??
    EVENT_PLACEHOLDER_IMAGES[event.eventType] ??
    EVENT_PLACEHOLDER_IMAGES[EventType.other];
  const activeShowtimes = showtimes.filter((s) => s.isActive);

  function handleBook(showtimeId: bigint) {
    navigate({
      to: "/events/$eventId/booking",
      params: { eventId },
      search: { showtimeId: String(showtimeId) },
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Button
        variant="ghost"
        size="sm"
        data-ocid="event_detail.back_button"
        onClick={() => navigate({ to: "/" })}
        className="gap-2 mb-6 -ml-2 transition-smooth"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Events
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Image + Metadata */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl overflow-hidden aspect-[3/4] bg-muted shadow-elevated">
            <img
              src={imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  EVENT_PLACEHOLDER_IMAGES[EventType.other];
              }}
            />
          </div>

          <div className="bg-card rounded-xl border border-border p-4 space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Event Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2.5 text-foreground">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {Number(event.durationMinutes)} minutes
                  </p>
                </div>
              </div>

              {event.genre && (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Ticket className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Genre</p>
                    <p className="font-medium capitalize">{event.genre}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">
                    {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Title + Description + Showtimes */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="outline"
                className="capitalize text-xs font-semibold"
              >
                {EVENT_TYPE_LABELS[event.eventType] ?? event.eventType}
              </Badge>
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground leading-tight">
              {event.title}
            </h1>
            {event.description && (
              <p className="text-muted-foreground mt-3 leading-relaxed text-sm">
                {event.description}
              </p>
            )}
          </div>

          <Separator />

          <div data-ocid="event_detail.showtimes_section">
            <h2 className="text-base font-display font-semibold mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Choose a Showtime
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Click a showtime to select it, then proceed to seat selection
            </p>

            {activeShowtimes.length === 0 ? (
              <EmptyState
                data-ocid="event_detail.showtimes.empty_state"
                icon={<Calendar className="w-7 h-7" />}
                title="No showtimes scheduled"
                description="Check back soon for upcoming dates and times."
              />
            ) : (
              <div
                className="space-y-3"
                data-ocid="event_detail.showtimes_list"
              >
                {activeShowtimes.map((showtime, i) => {
                  const venue = venues.find((v) => v.id === showtime.venueId);
                  return (
                    <ShowtimeCard
                      key={String(showtime.id)}
                      showtime={showtime}
                      venueName={venue?.name ?? ""}
                      isSelected={selectedShowtimeId === showtime.id}
                      onSelect={() => setSelectedShowtimeId(showtime.id)}
                      onBook={() => handleBook(showtime.id)}
                      idx={i + 1}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
