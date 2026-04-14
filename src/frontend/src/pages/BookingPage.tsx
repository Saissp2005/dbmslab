import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  ChevronLeft,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SeatStatus, TicketCategory } from "../backend";
import type { SeatPublic } from "../backend";
import { ErrorMessage } from "../components/ErrorMessage";
import { TicketCategoryBadge } from "../components/TicketCategoryBadge";
import { useEvent } from "../hooks/useEvents";
import {
  useCreateBooking,
  useCreateCheckoutSession,
} from "../hooks/useMyBookings";
import { useReserveSeats, useSeatMap } from "../hooks/useSeatMap";
import { useShowtime, useVenue } from "../hooks/useShowtimes";

const MAX_SEATS = 8;

function formatDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

const seatAvailableStyle =
  "bg-secondary border-border hover:bg-primary/20 hover:border-primary hover:text-primary cursor-pointer transition-all duration-200";
const seatSelectedStyle =
  "bg-accent border-accent text-accent-foreground cursor-pointer transition-all duration-200 shadow-interactive";
const seatReservedStyle =
  "bg-warning/15 border-warning/30 text-warning cursor-not-allowed opacity-70";
const seatBookedStyle =
  "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-60";
const seatBlockedStyle =
  "bg-muted border-transparent text-transparent cursor-not-allowed opacity-30";

const categoryDimStyle: Record<TicketCategory, string> = {
  [TicketCategory.vip]: "opacity-30 hover:opacity-30 cursor-not-allowed",
  [TicketCategory.regular]: "opacity-30 hover:opacity-30 cursor-not-allowed",
  [TicketCategory.balcony]: "opacity-30 hover:opacity-30 cursor-not-allowed",
};

const categoryRingStyle: Record<TicketCategory, string> = {
  [TicketCategory.vip]: "ring-1 ring-warning",
  [TicketCategory.regular]: "ring-1 ring-primary",
  [TicketCategory.balcony]: "ring-1 ring-accent",
};

function getSeatStyle(
  seat: SeatPublic,
  isSelected: boolean,
  activeCategory: TicketCategory | "all",
): string {
  const baseParts: string[] = [];

  if (isSelected) {
    baseParts.push(seatSelectedStyle);
  } else {
    switch (seat.status) {
      case SeatStatus.available:
        baseParts.push(seatAvailableStyle);
        baseParts.push(categoryRingStyle[seat.category]);
        break;
      case SeatStatus.reserved:
        baseParts.push(seatReservedStyle);
        break;
      case SeatStatus.booked:
        baseParts.push(seatBookedStyle);
        break;
      case SeatStatus.blocked:
        baseParts.push(seatBlockedStyle);
        break;
    }
  }

  if (
    !isSelected &&
    activeCategory !== "all" &&
    seat.category !== activeCategory &&
    seat.status === SeatStatus.available
  ) {
    baseParts.push(categoryDimStyle[seat.category]);
  }

  return baseParts.join(" ");
}

interface SeatButtonProps {
  seat: SeatPublic;
  isSelected: boolean;
  activeCategory: TicketCategory | "all";
  onToggle: (seat: SeatPublic) => void;
}

function SeatButton({
  seat,
  isSelected,
  activeCategory,
  onToggle,
}: SeatButtonProps) {
  const styleClass = getSeatStyle(seat, isSelected, activeCategory);
  const canInteract =
    (seat.status === SeatStatus.available || isSelected) &&
    (activeCategory === "all" ||
      seat.category === activeCategory ||
      isSelected);

  return (
    <button
      type="button"
      title={`${seat.seatLabel} — ${seat.category} — ${seat.status}`}
      onClick={() => canInteract && onToggle(seat)}
      disabled={!canInteract && !isSelected}
      aria-label={`Seat ${seat.seatLabel} (${seat.category})`}
      aria-pressed={isSelected}
      className={`w-8 h-8 rounded-md text-xs font-mono border flex items-center justify-center select-none ${styleClass}`}
    >
      {String(seat.col + 1n)}
    </button>
  );
}

const SKELETON_ROWS = ["A", "B", "C", "D", "E", "F"];
const SKELETON_COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function SeatMapSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-3">
      {SKELETON_ROWS.map((row) => (
        <div key={`skeleton-row-${row}`} className="flex gap-1.5">
          <Skeleton className="w-5 h-8 shrink-0" />
          {SKELETON_COLS.map((col) => (
            <Skeleton
              key={`skeleton-cell-${row}-${col}`}
              className="w-8 h-8 rounded-md"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function BookingPage() {
  const { eventId } = useParams({ from: "/events/$eventId/booking" });
  const search = useSearch({ from: "/events/$eventId/booking" });
  const navigate = useNavigate();
  const { isAuthenticated, login } = useInternetIdentity();

  const showtimeId = search.showtimeId ? BigInt(search.showtimeId) : null;
  const [selectedSeatIds, setSelectedSeatIds] = useState<bigint[]>([]);
  const [activeCategory, setActiveCategory] = useState<TicketCategory | "all">(
    "all",
  );

  const { data: event } = useEvent(BigInt(eventId));
  const { data: showtime } = useShowtime(showtimeId);
  const { data: venue } = useVenue(showtime?.venueId ?? null);
  const { data: seatMap, isLoading, error } = useSeatMap(showtimeId);
  const reserveSeats = useReserveSeats();
  const createBooking = useCreateBooking();
  const createCheckoutSession = useCreateCheckoutSession();

  const selectedSeats =
    seatMap?.seats.filter((s) => selectedSeatIds.includes(s.id)) ?? [];

  const totalPrice = selectedSeats.reduce((sum, seat) => {
    const cat = showtime?.seatCategories.find(
      (c) => c.category === seat.category,
    );
    return sum + (cat?.priceInCents ?? 0n);
  }, 0n);

  const categories: (TicketCategory | "all")[] = [
    "all",
    ...(showtime?.seatCategories.map((c) => c.category) ?? []),
  ];

  function toggleSeat(seat: SeatPublic) {
    if (
      seat.status !== SeatStatus.available &&
      !selectedSeatIds.includes(seat.id)
    )
      return;
    if (
      !selectedSeatIds.includes(seat.id) &&
      selectedSeatIds.length >= MAX_SEATS
    ) {
      toast.warning(`Maximum ${MAX_SEATS} seats per booking`);
      return;
    }
    setSelectedSeatIds((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id],
    );
  }

  async function handleCheckout() {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (selectedSeatIds.length === 0 || !showtimeId) return;

    try {
      // Reserve seats
      await reserveSeats.mutateAsync({ showtimeId, seatIds: selectedSeatIds });

      // Create booking
      const bookingId = await createBooking.mutateAsync({
        showtimeId,
        seatIds: selectedSeatIds,
      });

      // Create Stripe checkout session and redirect
      const successUrl = `${window.location.origin}/dashboard/bookings/${String(bookingId)}?payment=success`;
      const cancelUrl = `${window.location.origin}/events/${eventId}/booking?showtimeId=${String(showtimeId)}&payment=cancelled`;

      const stripeUrl = await createCheckoutSession.mutateAsync({
        bookingId,
        successUrl,
        cancelUrl,
      });

      // Redirect to Stripe
      window.location.href = stripeUrl;
    } catch (e) {
      toast.error("Checkout failed", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    }
  }

  if (!showtimeId) {
    return (
      <ErrorMessage
        title="No showtime selected"
        message="Please select a showtime from the event page."
        onRetry={() =>
          navigate({ to: "/events/$eventId", params: { eventId } })
        }
        data-ocid="booking.error_state"
      />
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Seat map unavailable"
        message="Could not load the seat map for this showtime."
        onRetry={() =>
          navigate({ to: "/events/$eventId", params: { eventId } })
        }
        data-ocid="booking.error_state"
      />
    );
  }

  const rows = seatMap
    ? Array.from({ length: Number(seatMap.rows) }, (_, rowIdx) =>
        seatMap.seats
          .filter((s) => Number(s.row) === rowIdx)
          .sort((a, b) => Number(a.col) - Number(b.col)),
      )
    : [];

  const isProcessing =
    reserveSeats.isPending ||
    createBooking.isPending ||
    createCheckoutSession.isPending;

  const checkoutLabel = !isAuthenticated
    ? "Sign in to Continue"
    : isProcessing
      ? "Processing..."
      : selectedSeats.length > 0
        ? `Checkout · ${formatPrice(totalPrice)}`
        : "Select Seats to Continue";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Back nav */}
      <Button
        variant="ghost"
        size="sm"
        data-ocid="booking.back_button"
        onClick={() =>
          navigate({ to: "/events/$eventId", params: { eventId } })
        }
        className="gap-2 mb-6 -ml-2 transition-smooth"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Event
      </Button>

      {/* Showtime summary banner */}
      {(event || showtime || venue) && (
        <div className="bg-card rounded-xl border border-border px-5 py-4 mb-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          {event && (
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Event</p>
              <p className="text-sm font-semibold text-foreground truncate">
                {event.title}
              </p>
            </div>
          )}
          {showtime && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0 text-primary" />
              <span>{formatDate(showtime.startTime)}</span>
            </div>
          )}
          {venue && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0 text-primary" />
              <span>{venue.name}</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Seat map column */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-xl font-display font-bold text-foreground">
              Select Your Seats
            </h1>
            <span className="text-sm text-muted-foreground">
              {selectedSeats.length}/{MAX_SEATS} selected
            </span>
          </div>

          {/* Category filter tabs */}
          {categories.length > 1 && (
            <Tabs
              value={activeCategory}
              onValueChange={(v) =>
                setActiveCategory(v as TicketCategory | "all")
              }
            >
              <TabsList className="h-9" data-ocid="booking.category_filter">
                <TabsTrigger value="all" data-ocid="booking.category_tab.all">
                  All
                </TabsTrigger>
                {showtime?.seatCategories.map((cat) => (
                  <TabsTrigger
                    key={cat.category}
                    value={cat.category}
                    data-ocid={`booking.category_tab.${cat.category}`}
                    className="capitalize gap-1.5"
                  >
                    {cat.category}
                    <span className="text-muted-foreground text-xs">
                      ({Number(cat.availableSeats)})
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {/* Stage indicator */}
          <div className="text-center">
            <div className="h-1.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full max-w-sm mx-auto mb-1.5" />
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Screen / Stage
            </p>
          </div>

          {/* Seat grid */}
          {isLoading ? (
            <SeatMapSkeleton />
          ) : seatMap ? (
            <div
              className="bg-card rounded-xl border border-border p-5 overflow-x-auto"
              data-ocid="booking.seat_map"
            >
              <div className="flex flex-col gap-1.5 min-w-fit mx-auto">
                {rows.map((rowSeats, rowIdx) => (
                  <div
                    key={`row-${String.fromCharCode(65 + rowIdx)}`}
                    className="flex items-center gap-1"
                  >
                    <span className="text-xs text-muted-foreground w-5 text-right shrink-0 font-mono">
                      {String.fromCharCode(65 + rowIdx)}
                    </span>
                    <div className="flex gap-1">
                      {rowSeats.map((seat) => (
                        <SeatButton
                          key={String(seat.id)}
                          seat={seat}
                          isSelected={selectedSeatIds.includes(seat.id)}
                          activeCategory={activeCategory}
                          onToggle={toggleSeat}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {[
              { label: "Available", cls: "bg-secondary border border-border" },
              { label: "Selected", cls: "bg-accent border-accent" },
              {
                label: "Reserved",
                cls: "bg-amber-100 border border-amber-200 dark:bg-amber-900/20",
              },
              {
                label: "Booked",
                cls: "bg-muted border border-border opacity-60",
              },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-1.5">
                <span className={`w-4 h-4 rounded-sm shrink-0 ${item.cls}`} />
                {item.label}
              </span>
            ))}
          </div>

          {/* Category color legend */}
          {showtime && showtime.seatCategories.length > 1 && (
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground pt-1 border-t border-border">
              <span className="font-medium text-foreground">Category:</span>
              {[
                {
                  category: TicketCategory.vip,
                  ring: "ring-1 ring-amber-400 bg-secondary",
                },
                {
                  category: TicketCategory.regular,
                  ring: "ring-1 ring-blue-400 bg-secondary",
                },
                {
                  category: TicketCategory.balcony,
                  ring: "ring-1 ring-purple-400 bg-secondary",
                },
              ]
                .filter((c) =>
                  showtime.seatCategories.some(
                    (sc) => sc.category === c.category,
                  ),
                )
                .map((item) => (
                  <span
                    key={item.category}
                    className="flex items-center gap-1.5 capitalize"
                  >
                    <span
                      className={`w-4 h-4 rounded-sm shrink-0 ${item.ring}`}
                    />
                    {item.category}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Order summary panel */}
        <div className="lg:col-span-1">
          <div
            className="bg-card rounded-xl border border-border p-5 sticky top-20 space-y-4"
            data-ocid="booking.order_summary"
          >
            <h2 className="text-base font-display font-semibold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Order Summary
            </h2>
            <Separator />

            {selectedSeats.length === 0 ? (
              <div
                className="text-center py-6"
                data-ocid="booking.selected_seats.empty_state"
              >
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Select seats from the map
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Up to {MAX_SEATS} seats per booking
                </p>
              </div>
            ) : (
              <div
                className="space-y-2"
                data-ocid="booking.selected_seats_list"
              >
                {selectedSeats.map((seat, idx) => {
                  const cat = showtime?.seatCategories.find(
                    (c) => c.category === seat.category,
                  );
                  return (
                    <div
                      key={String(seat.id)}
                      data-ocid={`booking.seat.${idx + 1}`}
                      className="flex items-center justify-between text-sm gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-muted-foreground shrink-0 text-xs bg-secondary rounded px-1.5 py-0.5">
                          {seat.seatLabel}
                        </span>
                        <TicketCategoryBadge category={seat.category} />
                      </div>
                      <span className="font-medium shrink-0">
                        {formatPrice(cat?.priceInCents ?? 0n)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedSeats.length > 0 && (
              <>
                <Separator />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {selectedSeats.length} ticket
                      {selectedSeats.length > 1 ? "s" : ""}
                    </span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </>
            )}

            {!isAuthenticated && selectedSeats.length > 0 && (
              <div
                className="flex items-start gap-2 text-xs text-muted-foreground bg-secondary rounded-lg p-3"
                data-ocid="booking.auth_notice"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Sign in to complete your booking and proceed to payment
                </span>
              </div>
            )}

            {selectedSeats.length > 0 && selectedSeats.length >= MAX_SEATS && (
              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Maximum {MAX_SEATS} seats reached</span>
              </div>
            )}

            <Button
              data-ocid="booking.checkout_button"
              className="w-full font-semibold gap-2"
              disabled={selectedSeats.length === 0 || isProcessing}
              onClick={handleCheckout}
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {!isAuthenticated ? "Sign in to Continue" : checkoutLabel}
                  {isAuthenticated && selectedSeats.length > 0 && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </>
              )}
            </Button>

            {isAuthenticated && selectedSeats.length > 0 && (
              <p className="text-center text-xs text-muted-foreground">
                You'll be redirected to secure checkout
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
