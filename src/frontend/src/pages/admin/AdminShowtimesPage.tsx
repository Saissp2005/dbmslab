import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayCircle, Plus, Ticket, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TicketCategory } from "../../backend";
import type { ShowtimePublic } from "../../backend";
import { EmptyState } from "../../components/EmptyState";
import { ErrorMessage } from "../../components/ErrorMessage";
import { PageHeader } from "../../components/PageHeader";
import { TicketCategoryBadge } from "../../components/TicketCategoryBadge";
import { useEvents } from "../../hooks/useEvents";
import {
  useCreateShowtime,
  useDeleteShowtime,
  useInitializeShowtimeSeats,
  useShowtimes,
  useVenues,
} from "../../hooks/useShowtimes";
import { AdminSidebar } from "./AdminPage";

const CATEGORIES = Object.values(TicketCategory);
const categoryLabels: Record<TicketCategory, string> = {
  [TicketCategory.vip]: "VIP",
  [TicketCategory.regular]: "Regular",
  [TicketCategory.balcony]: "Balcony",
};

function formatDateTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface SeatCatRow {
  category: TicketCategory;
  priceUsd: string;
  totalSeats: string;
}

function AddShowtimeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: events = [] } = useEvents();
  const { data: venues = [] } = useVenues();
  const createShowtime = useCreateShowtime();

  const [eventId, setEventId] = useState("");
  const [venueId, setVenueId] = useState("");
  const [datetime, setDatetime] = useState("");
  const [cats, setCats] = useState<SeatCatRow[]>([
    { category: TicketCategory.regular, priceUsd: "25", totalSeats: "100" },
    { category: TicketCategory.vip, priceUsd: "45", totalSeats: "20" },
  ]);

  const usedCats = new Set(cats.map((c) => c.category));

  function addCat() {
    const next = CATEGORIES.find((c) => !usedCats.has(c));
    if (!next) return;
    setCats((prev) => [
      ...prev,
      { category: next, priceUsd: "", totalSeats: "" },
    ]);
  }

  function removeCat(idx: number) {
    setCats((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateCat(idx: number, key: keyof SeatCatRow, value: string) {
    setCats((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [key]: value } : c)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!eventId || !venueId || !datetime) {
      toast.error("Fill all required fields");
      return;
    }
    const startMs = new Date(datetime).getTime();
    if (Number.isNaN(startMs)) {
      toast.error("Invalid date/time");
      return;
    }
    try {
      await createShowtime.mutateAsync({
        eventId: BigInt(eventId),
        venueId: BigInt(venueId),
        startTime: BigInt(startMs) * 1_000_000n,
        seatCategories: cats.map((c) => ({
          category: c.category,
          priceInCents: BigInt(Math.round(Number.parseFloat(c.priceUsd) * 100)),
          totalSeats: BigInt(c.totalSeats || 0),
        })),
      });
      toast.success("Showtime created");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg" data-ocid="admin_showtimes.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Add Showtime</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label>Event</Label>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger data-ocid="admin_showtimes.event_select">
                <SelectValue placeholder="Select event…" />
              </SelectTrigger>
              <SelectContent>
                {events.map((ev) => (
                  <SelectItem key={ev.id.toString()} value={ev.id.toString()}>
                    {ev.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Venue</Label>
            <Select value={venueId} onValueChange={setVenueId}>
              <SelectTrigger data-ocid="admin_showtimes.venue_select">
                <SelectValue placeholder="Select venue…" />
              </SelectTrigger>
              <SelectContent>
                {venues.map((v) => (
                  <SelectItem key={v.id.toString()} value={v.id.toString()}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="st-dt">Date &amp; Time</Label>
            <Input
              id="st-dt"
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              required
              data-ocid="admin_showtimes.start_input"
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Seat Categories</Label>
              {usedCats.size < CATEGORIES.length && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addCat}
                  className="gap-1 h-7 text-xs"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </Button>
              )}
            </div>
            {cats.map((cat, idx) => (
              <div key={cat.category} className="flex items-end gap-2">
                <div className="space-y-1 flex-1">
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={cat.category}
                    onValueChange={(v) => updateCat(idx, "category", v)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((tc) => (
                        <SelectItem
                          key={tc}
                          value={tc}
                          disabled={usedCats.has(tc) && tc !== cat.category}
                        >
                          {categoryLabels[tc]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs">Price ($)</Label>
                  <Input
                    className="h-8"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="25.00"
                    value={cat.priceUsd}
                    onChange={(e) => updateCat(idx, "priceUsd", e.target.value)}
                    data-ocid="admin_showtimes.vip_price_input"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-xs">Seats</Label>
                  <Input
                    className="h-8"
                    type="number"
                    min="1"
                    placeholder="100"
                    value={cat.totalSeats}
                    onChange={(e) =>
                      updateCat(idx, "totalSeats", e.target.value)
                    }
                    data-ocid="admin_showtimes.regular_price_input"
                  />
                </div>
                {cats.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-destructive hover:bg-destructive/10"
                    onClick={() => removeCat(idx)}
                    aria-label="Remove category"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="admin_showtimes.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createShowtime.isPending}
              data-ocid="admin_showtimes.submit_button"
            >
              {createShowtime.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteShowtimeDialog({
  showtime,
  eventTitle,
  onClose,
}: {
  showtime: ShowtimePublic | null;
  eventTitle: string;
  onClose: () => void;
}) {
  const deleteShowtime = useDeleteShowtime();

  async function handleConfirm() {
    if (!showtime) return;
    try {
      await deleteShowtime.mutateAsync(showtime.id);
      toast.success("Showtime deleted");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <Dialog open={!!showtime} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-sm"
        data-ocid="admin_showtimes.delete_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">Delete Showtime?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Delete the showtime for{" "}
          <span className="font-semibold text-foreground">{eventTitle}</span>?
          This cannot be undone.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin_showtimes.cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteShowtime.isPending}
            data-ocid="admin_showtimes.delete_button"
          >
            {deleteShowtime.isPending ? "Deleting…" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminShowtimesPage() {
  const { data: showtimes = [], isLoading, error, refetch } = useShowtimes();
  const { data: events = [] } = useEvents();
  const { data: venues = [] } = useVenues();
  const initSeats = useInitializeShowtimeSeats();

  const [showCreate, setShowCreate] = useState(false);
  const [deleteShowtime, setDeleteShowtime] = useState<ShowtimePublic | null>(
    null,
  );
  const [initializingId, setInitializingId] = useState<bigint | null>(null);

  const eventMap = new Map(events.map((e) => [e.id.toString(), e.title]));
  const venueMap = new Map(venues.map((v) => [v.id.toString(), v.name]));

  async function handleInitSeats(showtimeId: bigint) {
    setInitializingId(showtimeId);
    try {
      await initSeats.mutateAsync(showtimeId);
      toast.success("Seats initialized");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to init seats");
    } finally {
      setInitializingId(null);
    }
  }

  const deletingEventTitle = deleteShowtime
    ? (eventMap.get(deleteShowtime.eventId.toString()) ?? "Unknown")
    : "";

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-background">
        <div className="border-b border-border bg-card px-6 py-5">
          <PageHeader
            title="Showtimes"
            subtitle={`${showtimes.length} showtime${showtimes.length !== 1 ? "s" : ""} scheduled`}
            action={{
              label: "Add Showtime",
              onClick: () => setShowCreate(true),
              icon: <Plus className="w-4 h-4" />,
              "data-ocid": "admin_showtimes.add_button",
            }}
          />
        </div>
        <div className="p-6" data-ocid="admin_showtimes.page">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          ) : error ? (
            <ErrorMessage
              error={error}
              onRetry={() => refetch()}
              data-ocid="admin_showtimes.error_state"
            />
          ) : showtimes.length === 0 ? (
            <EmptyState
              icon={<Ticket className="w-8 h-8" />}
              title="No showtimes yet"
              description="Schedule a showtime for any event at any venue."
              action={{
                label: "Add Showtime",
                onClick: () => setShowCreate(true),
                "data-ocid": "admin_showtimes.add_action",
              }}
              data-ocid="admin_showtimes.empty_state"
            />
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table data-ocid="admin_showtimes.list">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Event</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Date &amp; Time</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-28" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {showtimes.map((st, idx) => {
                    const eventTitle =
                      eventMap.get(st.eventId.toString()) ?? "Unknown";
                    const venueName =
                      venueMap.get(st.venueId.toString()) ?? "Unknown";
                    const isInitializing = initializingId === st.id;
                    const total = st.seatCategories.reduce(
                      (s, c) => s + c.totalSeats,
                      0n,
                    );
                    const available = st.seatCategories.reduce(
                      (s, c) => s + c.availableSeats,
                      0n,
                    );

                    return (
                      <TableRow
                        key={st.id.toString()}
                        data-ocid={`admin_showtimes.item.${idx + 1}`}
                      >
                        <TableCell className="font-medium text-foreground max-w-[160px] truncate">
                          {eventTitle}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {venueName}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {formatDateTime(st.startTime)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {st.seatCategories.map((cat) => (
                              <TicketCategoryBadge
                                key={cat.category}
                                category={cat.category}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-mono">
                          <span className="text-foreground font-medium">
                            {String(available)}
                          </span>
                          <span className="text-muted-foreground">
                            /{String(total)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={st.isActive ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {st.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 gap-1 text-xs text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => handleInitSeats(st.id)}
                              disabled={isInitializing}
                              data-ocid={`admin_showtimes.init_button.${idx + 1}`}
                              aria-label="Initialize seats"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              {isInitializing ? "…" : "Init"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteShowtime(st)}
                              data-ocid={`admin_showtimes.delete_button.${idx + 1}`}
                              aria-label="Delete showtime"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <AddShowtimeDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
        />
        <DeleteShowtimeDialog
          showtime={deleteShowtime}
          eventTitle={deletingEventTitle}
          onClose={() => setDeleteShowtime(null)}
        />
      </main>
    </div>
  );
}
