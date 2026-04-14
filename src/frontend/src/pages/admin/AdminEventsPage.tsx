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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CreateEventInput, EventPublic } from "../../backend";
import { EventType } from "../../backend";
import { EmptyState } from "../../components/EmptyState";
import { ErrorMessage } from "../../components/ErrorMessage";
import { PageHeader } from "../../components/PageHeader";
import {
  useCreateEvent,
  useDeleteEvent,
  useEvents,
  useUpdateEvent,
} from "../../hooks/useEvents";
import { AdminSidebar } from "./AdminPage";

const EVENT_TYPES = Object.values(EventType);
const eventTypeLabels: Record<EventType, string> = {
  [EventType.movie]: "Movie",
  [EventType.concert]: "Concert",
  [EventType.workshop]: "Workshop",
  [EventType.sports]: "Sports",
  [EventType.other]: "Other",
};

interface EventFormState {
  title: string;
  description: string;
  eventType: EventType;
  genre: string;
  duration: string;
  imageUrls: string;
}

function EventFormDialog({
  open,
  onClose,
  editEvent,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  editEvent?: EventPublic;
  onSubmit: (data: CreateEventInput) => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState<EventFormState>({
    title: editEvent?.title ?? "",
    description: editEvent?.description ?? "",
    eventType: editEvent?.eventType ?? EventType.movie,
    genre: editEvent?.genre ?? "",
    duration: String(editEvent?.durationMinutes ?? "120"),
    imageUrls: editEvent?.imageUrls.join("\n") ?? "",
  });

  function set(key: keyof EventFormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dur = Number.parseInt(form.duration);
    if (!form.title || Number.isNaN(dur)) return;
    const imageUrls = form.imageUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      eventType: form.eventType,
      genre: form.genre.trim(),
      durationMinutes: BigInt(dur),
      imageUrls,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg" data-ocid="admin_events.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editEvent ? "Edit Event" : "Add Event"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="e-title">Title</Label>
            <Input
              id="e-title"
              placeholder="Dune: Part Two"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              data-ocid="admin_events.title_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.eventType}
                onValueChange={(v) => set("eventType", v)}
              >
                <SelectTrigger data-ocid="admin_events.type_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {eventTypeLabels[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-genre">Genre</Label>
              <Input
                id="e-genre"
                placeholder="Sci-Fi"
                value={form.genre}
                onChange={(e) => set("genre", e.target.value)}
                data-ocid="admin_events.genre_input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-duration">Duration (minutes)</Label>
            <Input
              id="e-duration"
              type="number"
              min="1"
              placeholder="120"
              value={form.duration}
              onChange={(e) => set("duration", e.target.value)}
              required
              data-ocid="admin_events.duration_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-desc">Description</Label>
            <Textarea
              id="e-desc"
              placeholder="Brief description of the event…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              data-ocid="admin_events.description_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="e-images">
              Image URLs{" "}
              <span className="text-xs text-muted-foreground">
                (one per line)
              </span>
            </Label>
            <Textarea
              id="e-images"
              placeholder="https://example.com/poster.jpg"
              value={form.imageUrls}
              onChange={(e) => set("imageUrls", e.target.value)}
              rows={2}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="admin_events.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="admin_events.submit_button"
            >
              {isPending ? "Saving…" : editEvent ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteEventDialog({
  event,
  onClose,
}: {
  event: EventPublic | null;
  onClose: () => void;
}) {
  const deleteEvent = useDeleteEvent();

  async function handleConfirm() {
    if (!event) return;
    try {
      await deleteEvent.mutateAsync(event.id);
      toast.success("Event deleted");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete event",
      );
    }
  }

  return (
    <Dialog open={!!event} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-sm"
        data-ocid="admin_events.delete_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">Delete Event?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Permanently delete{" "}
          <span className="font-semibold text-foreground">{event?.title}</span>?
          This cannot be undone.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin_events.delete_cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteEvent.isPending}
            data-ocid="admin_events.delete_confirm_button"
          >
            {deleteEvent.isPending ? "Deleting…" : "Delete Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminEventsPage() {
  const { data: events = [], isLoading, error, refetch } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const [showCreate, setShowCreate] = useState(false);
  const [editEvent, setEditEvent] = useState<EventPublic | null>(null);
  const [deleteEvent, setDeleteEvent] = useState<EventPublic | null>(null);

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-background">
        <div className="border-b border-border bg-card px-6 py-5">
          <PageHeader
            title="Events"
            subtitle={`${events.length} event${events.length !== 1 ? "s" : ""}`}
            action={{
              label: "Add Event",
              onClick: () => setShowCreate(true),
              icon: <Plus className="w-4 h-4" />,
              "data-ocid": "admin_events.add_button",
            }}
          />
        </div>
        <div className="p-6" data-ocid="admin_events.page">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : error ? (
            <ErrorMessage
              error={error}
              onRetry={() => refetch()}
              data-ocid="admin_events.error_state"
            />
          ) : events.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="w-8 h-8" />}
              title="No events yet"
              description="Add your first event to start selling tickets."
              action={{
                label: "Add Event",
                onClick: () => setShowCreate(true),
                "data-ocid": "admin_events.add_action",
              }}
              data-ocid="admin_events.empty_state"
            />
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table data-ocid="admin_events.list">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead className="text-right">Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event, idx) => (
                    <TableRow
                      key={event.id.toString()}
                      data-ocid={`admin_events.item.${idx + 1}`}
                    >
                      <TableCell className="font-medium text-foreground max-w-xs truncate">
                        {event.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {eventTypeLabels[event.eventType]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {event.genre}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">
                        {String(event.durationMinutes)}m
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={event.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {event.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditEvent(event)}
                            data-ocid={`admin_events.edit_button.${idx + 1}`}
                            aria-label="Edit event"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteEvent(event)}
                            data-ocid={`admin_events.delete_button.${idx + 1}`}
                            aria-label="Delete event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <EventFormDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
          isPending={createEvent.isPending}
          onSubmit={(data) =>
            createEvent.mutate(data, {
              onSuccess: () => {
                setShowCreate(false);
                toast.success("Event created");
              },
              onError: (e) => toast.error(e.message),
            })
          }
        />
        {editEvent && (
          <EventFormDialog
            open={!!editEvent}
            onClose={() => setEditEvent(null)}
            editEvent={editEvent}
            isPending={updateEvent.isPending}
            onSubmit={(data) =>
              updateEvent.mutate(
                { ...data, id: editEvent.id },
                {
                  onSuccess: () => {
                    setEditEvent(null);
                    toast.success("Event updated");
                  },
                  onError: (e) => toast.error(e.message),
                },
              )
            }
          />
        )}
        <DeleteEventDialog
          event={deleteEvent}
          onClose={() => setDeleteEvent(null)}
        />
      </main>
    </div>
  );
}
