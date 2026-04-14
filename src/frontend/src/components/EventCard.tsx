import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import type { EventPublic } from "../backend";
import { EventType } from "../backend";

interface EventCardProps {
  event: EventPublic;
  lowestPrice?: bigint;
  availableSeats?: number;
  nextShowtime?: { startTime: bigint; venueId: bigint; venueName?: string };
  onBook?: () => void;
  "data-ocid"?: string;
}

const eventTypeConfig: Record<EventType, { label: string; color: string }> = {
  [EventType.movie]: {
    label: "Movie",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  [EventType.concert]: {
    label: "Concert",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  [EventType.workshop]: {
    label: "Workshop",
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  [EventType.sports]: {
    label: "Sports",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  [EventType.other]: {
    label: "Event",
    color: "bg-secondary text-muted-foreground border-border",
  },
};

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

const EVENT_PLACEHOLDER_IMAGES: Record<EventType, string> = {
  [EventType.movie]: "/assets/generated/event-movie.dim_800x450.jpg",
  [EventType.concert]: "/assets/generated/event-concert.dim_800x450.jpg",
  [EventType.workshop]: "/assets/generated/event-workshop.dim_800x450.jpg",
  [EventType.sports]: "/assets/generated/event-sports.dim_800x450.jpg",
  [EventType.other]: "/assets/generated/event-other.dim_800x450.jpg",
};

export function EventCard({
  event,
  lowestPrice,
  availableSeats,
  nextShowtime,
  onBook,
  "data-ocid": dataOcid,
}: EventCardProps) {
  const typeConfig = eventTypeConfig[event.eventType];
  const imageUrl =
    event.imageUrls[0] ?? EVENT_PLACEHOLDER_IMAGES[event.eventType];
  const isSelling =
    availableSeats !== undefined && availableSeats < 20 && availableSeats > 0;

  return (
    <div
      data-ocid={dataOcid}
      className="bg-card rounded-xl shadow-card border border-border overflow-hidden hover:shadow-elevated transition-smooth group flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/generated/event-other.dim_800x450.jpg";
          }}
        />
        <div className="absolute top-2 left-2">
          <Badge
            variant="outline"
            className={`${typeConfig.color} text-xs font-semibold backdrop-blur-sm`}
          >
            {typeConfig.label}
          </Badge>
        </div>
        {event.durationMinutes > 0n && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {Number(event.durationMinutes)}m
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-display font-semibold text-foreground text-base line-clamp-2 leading-tight">
            {event.title}
          </h3>
          {event.genre && (
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
              {event.genre}
            </p>
          )}
        </div>

        {nextShowtime && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {formatDate(nextShowtime.startTime)}
              </span>
            </div>
            {nextShowtime.venueName && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{nextShowtime.venueName}</span>
              </div>
            )}
          </div>
        )}

        {/* Price + availability */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col">
            {lowestPrice !== undefined ? (
              <span className="text-sm font-semibold text-foreground">
                Tickets from{" "}
                <span className="text-primary">{formatPrice(lowestPrice)}</span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Price TBA</span>
            )}
            {isSelling ? (
              <span className="text-xs font-medium text-destructive">
                Selling fast
              </span>
            ) : availableSeats !== undefined && availableSeats > 0 ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                Seats available
              </span>
            ) : availableSeats === 0 ? (
              <span className="text-xs text-muted-foreground">Sold out</span>
            ) : null}
          </div>
        </div>

        {/* Accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-primary/60 to-accent/60 rounded-full" />

        <Button
          data-ocid={
            dataOcid ? `${dataOcid}.book_button` : "event_card.book_button"
          }
          onClick={onBook}
          className="w-full font-semibold transition-smooth"
          disabled={availableSeats === 0}
        >
          {availableSeats === 0 ? "Sold Out" : "Book Tickets"}
        </Button>
      </div>
    </div>
  );
}
