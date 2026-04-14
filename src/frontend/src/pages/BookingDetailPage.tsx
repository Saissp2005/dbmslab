import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  CreditCard,
  MapPin,
  QrCode,
  RefreshCw,
  Ticket,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { BookingStatus, PaymentStatus, RefundStatus } from "../backend";
import type {
  BookingPublic,
  PaymentPublic,
  ShowtimePublic,
  VenuePublic,
} from "../backend";
import { BookingStatusBadge } from "../components/BookingStatusBadge";
import { ErrorMessage } from "../components/ErrorMessage";
import { PageLoader } from "../components/LoadingSpinner";
import { TicketCategoryBadge } from "../components/TicketCategoryBadge";
import { useEvent } from "../hooks/useEvents";
import {
  useBooking,
  useCancelBooking,
  useMyPayment,
} from "../hooks/useMyBookings";
import { useShowtime, useVenue } from "../hooks/useShowtimes";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatLongDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
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

function formatShortDate(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

function isEventPassed(startTime: bigint): boolean {
  return Number(startTime / 1_000_000n) < Date.now();
}

// ─── QR Code Visual Component ────────────────────────────────────────────────
// Simple visual QR code using a grid pattern derived from the reference string

function QRCodeDisplay({ value }: { value: string }) {
  // Generate a deterministic 21x21 flat grid from the reference string
  const SIZE = 21;

  type QRCell = { row: number; col: number; filled: boolean };
  const cells: QRCell[] = [];

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const inFinder =
        (row < 7 && col < 7) ||
        (row < 7 && col >= SIZE - 7) ||
        (row >= SIZE - 7 && col < 7);
      let filled: boolean;
      if (inFinder) {
        const r = row % 7;
        const c = col % 7;
        filled =
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4);
      } else {
        const charIdx = ((row * SIZE + col) * 7) % value.length;
        const charCode = value.charCodeAt(charIdx);
        const bitPos = (row + col) % 8;
        filled = ((charCode >> bitPos) & 1) === 1;
      }
      cells.push({ row, col, filled });
    }
  }

  // Group into rows for rendering
  const rows: QRCell[][] = Array.from({ length: SIZE }, (_, r) =>
    cells.filter((c) => c.row === r),
  );

  return (
    <div
      className="inline-flex flex-col bg-card border-4 border-foreground/90 rounded-xl p-3 shadow-elevated"
      aria-label={`QR Code for ${value}`}
    >
      {rows.map((rowCells) => (
        <div key={`row-${rowCells[0].row}`} className="flex">
          {rowCells.map((cell) => (
            <div
              key={`cell-${cell.row}-${cell.col}`}
              className={`w-2 h-2 ${cell.filled ? "bg-foreground/90" : "bg-card"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  [PaymentStatus.completed]: {
    label: "Paid",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: "bg-success/15 text-success border-success/30",
  },
  [PaymentStatus.pending]: {
    label: "Pending",
    icon: <Clock className="w-3.5 h-3.5" />,
    className: "bg-warning/15 text-warning border-warning/30",
  },
  [PaymentStatus.failed]: {
    label: "Failed",
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: "bg-destructive/10 text-destructive border-destructive/25",
  },
  [PaymentStatus.refunded]: {
    label: "Refunded",
    icon: <RefreshCw className="w-3.5 h-3.5" />,
    className: "bg-secondary text-secondary-foreground border-border",
  },
};

const refundStatusConfig: Record<
  RefundStatus,
  { label: string; className: string } | null
> = {
  [RefundStatus.notApplicable]: null,
  [RefundStatus.pending]: {
    label: "Refund Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  [RefundStatus.refunded]: {
    label: "Refunded",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  [RefundStatus.nonRefundable]: {
    label: "Non-Refundable",
    className: "bg-muted text-muted-foreground border-border",
  },
};

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-36 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  );
}

// ─── Event info section ───────────────────────────────────────────────────────

function EventInfoSection({
  booking,
  showtime,
  venue,
}: {
  booking: BookingPublic;
  showtime: ShowtimePublic | null | undefined;
  venue: VenuePublic | null | undefined;
}) {
  const { data: event } = useEvent(showtime?.eventId ?? null);

  return (
    <SectionCard
      icon={<CalendarDays className="w-4 h-4" />}
      title="Event Details"
    >
      <div className="space-y-0.5">
        {event && (
          <>
            <InfoRow
              label="Event"
              value={
                <span className="font-semibold text-foreground">
                  {event.title}
                </span>
              }
            />
            <InfoRow
              label="Type"
              value={
                <Badge variant="outline" className="capitalize text-xs">
                  {event.eventType}
                </Badge>
              }
            />
          </>
        )}
        {showtime ? (
          <>
            <InfoRow
              label="Date"
              value={
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                  {formatLongDate(showtime.startTime)}
                </span>
              }
            />
            <InfoRow
              label="Time"
              value={
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  {formatTime(showtime.startTime)} –{" "}
                  {formatTime(showtime.endTime)}
                </span>
              }
            />
          </>
        ) : null}
        {venue && (
          <InfoRow
            label="Venue"
            value={
              <span className="flex items-center gap-1.5 text-right">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span>
                  <span className="block">{venue.name}</span>
                  <span className="block text-xs text-muted-foreground font-normal">
                    {venue.address}
                  </span>
                </span>
              </span>
            }
          />
        )}
        <InfoRow
          label="Showtime ID"
          value={
            <span className="font-mono text-xs text-muted-foreground">
              #{String(booking.showtimeId)}
            </span>
          }
        />
      </div>
    </SectionCard>
  );
}

// ─── Payment section ──────────────────────────────────────────────────────────

function PaymentSection({ payment }: { payment: PaymentPublic }) {
  const cfg = paymentStatusConfig[payment.status];
  return (
    <SectionCard icon={<CreditCard className="w-4 h-4" />} title="Payment">
      <div className="space-y-0.5">
        <InfoRow
          label="Status"
          value={
            <Badge
              variant="outline"
              className={`gap-1 text-xs ${cfg.className}`}
            >
              {cfg.icon}
              {cfg.label}
            </Badge>
          }
        />
        <InfoRow label="Amount" value={formatPrice(payment.amountCents)} />
        <InfoRow
          label="Method"
          value={<span className="capitalize">{payment.paymentMode}</span>}
        />
        {payment.transactionId && (
          <InfoRow
            label="Transaction"
            value={
              <span className="font-mono text-xs text-muted-foreground truncate max-w-[180px] block">
                {payment.transactionId}
              </span>
            }
          />
        )}
        {payment.completedAt && (
          <InfoRow
            label="Paid at"
            value={formatShortDate(payment.completedAt)}
          />
        )}
      </div>
    </SectionCard>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BookingDetailPage() {
  const { bookingId } = useParams({ from: "/dashboard/bookings/$bookingId" });
  const navigate = useNavigate();
  const bookingIdBig = BigInt(bookingId);

  const { data: booking, isLoading, error } = useBooking(bookingIdBig);
  const { data: payment } = useMyPayment(bookingIdBig);
  const { data: showtime } = useShowtime(booking?.showtimeId ?? null);
  const { data: venue } = useVenue(showtime?.venueId ?? null);
  const cancelBooking = useCancelBooking();

  async function handleCancel() {
    try {
      await cancelBooking.mutateAsync(bookingIdBig);
      toast.success("Booking cancelled", {
        description: "Your seats have been released.",
      });
    } catch (e) {
      toast.error("Cancel failed", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    }
  }

  if (isLoading) return <DetailSkeleton />;
  if (error || !booking) {
    return (
      <ErrorMessage
        title="Booking not found"
        message="This booking could not be loaded."
      />
    );
  }

  // Can cancel: status is confirmed (not cancelled/pending) and event hasn't passed yet
  const canCancel =
    booking.status === BookingStatus.confirmed &&
    (showtime ? !isEventPassed(showtime.startTime) : true);

  const refundCfg = refundStatusConfig[booking.refundStatus];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <Button
        variant="ghost"
        size="sm"
        data-ocid="booking_detail.back_button"
        onClick={() => navigate({ to: "/dashboard" })}
        className="gap-1.5 mb-6 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="w-4 h-4" />
        My Bookings
      </Button>

      <div className="space-y-4">
        {/* ── Header card ── */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Ticket className="w-5 h-5 text-primary" />
                <h1
                  data-ocid="booking_detail.reference"
                  className="text-xl font-display font-bold text-foreground"
                >
                  Booking #{String(booking.id).padStart(6, "0")}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground">
                Booked on {formatShortDate(booking.createdAt)}
              </p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>

          {/* QR code + refund status */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <QRCodeDisplay value={booking.qrReference} />
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <QrCode className="w-3 h-3" />
                Scan at venue
              </span>
            </div>
            <div className="flex-1 space-y-3 w-full">
              <div>
                <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
                  Reference Code
                </p>
                <p
                  data-ocid="booking_detail.qr_reference"
                  className="font-mono text-sm bg-muted/60 rounded-lg px-3 py-2 break-all border border-border"
                >
                  {booking.qrReference}
                </p>
              </div>

              {refundCfg && (
                <div
                  data-ocid="booking_detail.refund_status"
                  className="flex items-center gap-2"
                >
                  <span className="text-xs text-muted-foreground">Refund:</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${refundCfg.className}`}
                  >
                    {refundCfg.label}
                  </Badge>
                </div>
              )}

              {booking.cancelledAt && (
                <p className="text-xs text-muted-foreground">
                  Cancelled on {formatShortDate(booking.cancelledAt)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Event info ── */}
        <EventInfoSection booking={booking} showtime={showtime} venue={venue} />

        {/* ── Seats + total ── */}
        <SectionCard
          icon={<Ticket className="w-4 h-4" />}
          title={`Seat Details (${booking.items.length} ticket${booking.items.length !== 1 ? "s" : ""})`}
        >
          <div data-ocid="booking_detail.tickets_list" className="space-y-0">
            {booking.items.map((item, idx) => (
              <div
                key={String(item.seatId)}
                data-ocid={`booking_detail.ticket.${idx + 1}`}
                className="flex items-center justify-between py-2.5 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-semibold w-10">
                    {item.seatLabel}
                  </span>
                  <TicketCategoryBadge category={item.category} />
                </div>
                <span className="text-sm font-medium tabular-nums">
                  {formatPrice(item.priceInCents)}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Total Paid</span>
            <span className="text-lg font-bold text-primary tabular-nums">
              {formatPrice(booking.totalAmountCents)}
            </span>
          </div>
        </SectionCard>

        {/* ── Payment ── */}
        {payment && <PaymentSection payment={payment} />}

        {/* ── Cancel action ── */}
        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                data-ocid="booking_detail.cancel_button"
                className="w-full gap-2 border-destructive/60 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-smooth"
              >
                <AlertTriangle className="w-4 h-4" />
                Cancel Booking
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent data-ocid="booking_detail.cancel_dialog">
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-3">
                    <p>
                      Your{" "}
                      <span className="font-semibold">
                        {booking.items.length} seat
                        {booking.items.length !== 1 ? "s" : ""}
                      </span>{" "}
                      will be released and your booking marked as cancelled.
                    </p>
                    <div className="rounded-lg bg-muted/60 border border-border px-4 py-3 text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground mb-1">
                        Refund Policy
                      </p>
                      <p>
                        Refunds are processed within 5–10 business days to your
                        original payment method. Eligibility depends on how far
                        in advance you cancel. Non-refundable tickets will not
                        be refunded.
                      </p>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel data-ocid="booking_detail.cancel_button">
                  Keep Booking
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="booking_detail.confirm_button"
                  onClick={handleCancel}
                  disabled={cancelBooking.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {cancelBooking.isPending
                    ? "Cancelling…"
                    : "Yes, Cancel Booking"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
