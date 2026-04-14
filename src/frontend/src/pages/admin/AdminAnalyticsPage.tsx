import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, DollarSign, Ticket, TrendingUp, Users } from "lucide-react";
import type {
  AdminAnalytics,
  PaymentReconciliationRow,
  ShowtimeOccupancy,
} from "../../backend";
import { ErrorMessage } from "../../components/ErrorMessage";
import { PageHeader } from "../../components/PageHeader";
import { useBackend } from "../../hooks/useBackend";
import { AdminSidebar } from "./AdminPage";

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

function useShowtimeOccupancy() {
  const { actor, isFetching } = useBackend();
  return useQuery<ShowtimeOccupancy[]>({
    queryKey: ["showtimeOccupancy"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getShowtimeOccupancy();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}

function usePaymentReconciliation() {
  const { actor, isFetching } = useBackend();
  return useQuery<PaymentReconciliationRow[]>({
    queryKey: ["paymentReconciliation"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPaymentReconciliation();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}

function formatPrice(cents: bigint): string {
  return `$${(Number(cents) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function OccupancyBar({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const color =
    clamped >= 80
      ? "bg-success"
      : clamped >= 50
        ? "bg-warning"
        : "bg-muted-foreground/40";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-9 text-right">
        {clamped.toFixed(0)}%
      </span>
    </div>
  );
}

const paymentStatusColors: Record<string, string> = {
  completed: "bg-success/10 text-success border-success/25",
  pending: "bg-warning/10 text-warning border-warning/25",
  failed: "bg-destructive/10 text-destructive border-destructive/25",
  refunded: "bg-secondary text-secondary-foreground border-border",
};

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  loading?: boolean;
}) {
  return (
    <Card
      className="p-5 flex items-start gap-4 border-border shadow-sm"
      data-ocid={`admin_analytics.stat.${label.toLowerCase().replace(/\s/g, "_")}`}
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-1">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <p className="text-2xl font-display font-bold text-foreground">
            {value}
          </p>
        )}
      </div>
    </Card>
  );
}

export default function AdminAnalyticsPage() {
  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useAdminAnalytics();
  const { data: occupancy = [], isLoading: occLoading } =
    useShowtimeOccupancy();
  const { data: payments = [], isLoading: paymentsLoading } =
    usePaymentReconciliation();

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-background">
        <div className="border-b border-border bg-card px-6 py-5">
          <PageHeader
            title="Analytics"
            subtitle="Platform-wide performance metrics, occupancy, and payment data."
          />
        </div>
        <div
          className="p-6 max-w-7xl space-y-8"
          data-ocid="admin_analytics.page"
        >
          {/* Summary cards */}
          {analyticsError ? (
            <ErrorMessage
              error={analyticsError}
              onRetry={() => refetchAnalytics()}
              data-ocid="admin_analytics.error_state"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Total Bookings"
                value={analytics ? String(analytics.totalBookings) : "—"}
                icon={Ticket}
                loading={analyticsLoading}
              />
              <StatCard
                label="Total Revenue"
                value={
                  analytics ? formatPrice(analytics.totalRevenueCents) : "—"
                }
                icon={DollarSign}
                loading={analyticsLoading}
              />
              <StatCard
                label="Total Users"
                value={analytics ? String(analytics.totalUsers) : "—"}
                icon={Users}
                loading={analyticsLoading}
              />
              <StatCard
                label="Popular Events"
                value={analytics ? String(analytics.popularEvents.length) : "—"}
                icon={TrendingUp}
                loading={analyticsLoading}
              />
            </div>
          )}

          {/* Popular events */}
          {analytics && analytics.popularEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h2 className="text-base font-display font-semibold text-foreground">
                  Top Events by Revenue
                </h2>
              </div>
              <div
                className="bg-card border border-border rounded-xl p-5 space-y-3"
                data-ocid="admin_analytics.popular_events_list"
              >
                {analytics.popularEvents.map((event, idx) => (
                  <div
                    key={event.eventId.toString()}
                    data-ocid={`admin_analytics.popular_event.${idx + 1}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-mono text-muted-foreground w-5">
                        {idx + 1}.
                      </span>
                      <span className="font-medium text-sm truncate">
                        {event.eventTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant="secondary" className="text-xs">
                        {String(event.totalBookings)} bookings
                      </Badge>
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(event.totalRevenueCents)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Occupancy table */}
          <div data-ocid="admin_analytics.occupancy_section">
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="w-4 h-4 text-primary" />
              <h2 className="text-base font-display font-semibold text-foreground">
                Showtime Occupancy
              </h2>
            </div>
            {occLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : occupancy.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No showtime data yet.
              </p>
            ) : (
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <Table data-ocid="admin_analytics.occupancy_list">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>Event</TableHead>
                      <TableHead>Showtime</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Booked</TableHead>
                      <TableHead className="min-w-[160px]">Occupancy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {occupancy.map((row, idx) => (
                      <TableRow
                        key={row.showtimeId.toString()}
                        data-ocid={`admin_analytics.occupancy.${idx + 1}`}
                      >
                        <TableCell className="font-medium text-foreground max-w-xs truncate">
                          {row.eventTitle}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDateTime(row.startTime)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {String(row.totalSeats)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          {String(row.bookedSeats)}
                        </TableCell>
                        <TableCell>
                          <OccupancyBar
                            percent={Number(row.occupancyPercent)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Payment reconciliation */}
          <div data-ocid="admin_analytics.reconciliation_section">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-4 h-4 text-primary" />
              <h2 className="text-base font-display font-semibold text-foreground">
                Payment Reconciliation
              </h2>
            </div>
            {paymentsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : payments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No payment records yet.
              </p>
            ) : (
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <Table data-ocid="admin_analytics.payments_list">
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-right">Payment ID</TableHead>
                      <TableHead className="text-right">Booking ID</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((pay, idx) => (
                      <TableRow
                        key={pay.paymentId.toString()}
                        data-ocid={`admin_analytics.payment.${idx + 1}`}
                      >
                        <TableCell className="text-right font-mono text-sm text-muted-foreground">
                          #{String(pay.paymentId)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm text-muted-foreground">
                          #{String(pay.bookingId)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm font-semibold text-foreground">
                          {formatPrice(pay.amountCents)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs capitalize ${paymentStatusColors[pay.status] ?? "bg-muted text-muted-foreground"}`}
                          >
                            {pay.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground max-w-xs truncate">
                          {pay.transactionId ?? (
                            <span className="opacity-40">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(pay.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
