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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CreateVenueInput, VenuePublic } from "../../backend";
import { EmptyState } from "../../components/EmptyState";
import { ErrorMessage } from "../../components/ErrorMessage";
import { PageHeader } from "../../components/PageHeader";
import { useBackend } from "../../hooks/useBackend";
import { useVenues } from "../../hooks/useShowtimes";
import { AdminSidebar } from "./AdminPage";

function useCreateVenue() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateVenueInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createVenue(input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
  });
}

function useUpdateVenue() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: VenuePublic) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVenue(input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
  });
}

function useDeleteVenue() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (venueId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteVenue(venueId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
  });
}

interface VenueFormState {
  name: string;
  address: string;
  layoutRows: string;
  layoutCols: string;
}

const emptyForm: VenueFormState = {
  name: "",
  address: "",
  layoutRows: "10",
  layoutCols: "20",
};

function VenueFormDialog({
  open,
  onClose,
  editVenue,
}: {
  open: boolean;
  onClose: () => void;
  editVenue?: VenuePublic;
}) {
  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();
  const [form, setForm] = useState<VenueFormState>(
    editVenue
      ? {
          name: editVenue.name,
          address: editVenue.address,
          layoutRows: String(editVenue.layoutRows),
          layoutCols: String(editVenue.layoutCols),
        }
      : emptyForm,
  );

  const isPending = createVenue.isPending || updateVenue.isPending;

  function set(key: keyof VenueFormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = Number.parseInt(form.layoutRows);
    const c = Number.parseInt(form.layoutCols);
    if (!form.name || !form.address || Number.isNaN(r) || Number.isNaN(c))
      return;
    const payload: CreateVenueInput = {
      name: form.name.trim(),
      address: form.address.trim(),
      layoutRows: BigInt(r),
      layoutCols: BigInt(c),
      totalSeats: BigInt(r * c),
    };
    try {
      if (editVenue) {
        await updateVenue.mutateAsync({ ...editVenue, ...payload });
        toast.success("Venue updated");
      } else {
        await createVenue.mutateAsync(payload);
        toast.success("Venue created");
      }
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save venue");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="admin_venues.dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {editVenue ? "Edit Venue" : "Add Venue"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="v-name">Name</Label>
            <Input
              id="v-name"
              placeholder="Grand Theatre"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              data-ocid="admin_venues.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="v-address">Address</Label>
            <Input
              id="v-address"
              placeholder="123 Main St, City"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              required
              data-ocid="admin_venues.address_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="v-rows">Rows</Label>
              <Input
                id="v-rows"
                type="number"
                min="1"
                placeholder="10"
                value={form.layoutRows}
                onChange={(e) => set("layoutRows", e.target.value)}
                required
                data-ocid="admin_venues.rows_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-cols">Columns</Label>
              <Input
                id="v-cols"
                type="number"
                min="1"
                placeholder="20"
                value={form.layoutCols}
                onChange={(e) => set("layoutCols", e.target.value)}
                required
                data-ocid="admin_venues.cols_input"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Total seats:{" "}
            {Number.parseInt(form.layoutRows) *
              Number.parseInt(form.layoutCols) || 0}
          </p>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="admin_venues.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              data-ocid="admin_venues.submit_button"
            >
              {isPending ? "Saving…" : editVenue ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteVenueDialog({
  venue,
  onClose,
}: {
  venue: VenuePublic | null;
  onClose: () => void;
}) {
  const deleteVenue = useDeleteVenue();

  async function handleConfirm() {
    if (!venue) return;
    try {
      await deleteVenue.mutateAsync(venue.id);
      toast.success("Venue deleted");
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete venue",
      );
    }
  }

  return (
    <Dialog open={!!venue} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-sm"
        data-ocid="admin_venues.delete_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">Delete Venue?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Permanently delete{" "}
          <span className="font-semibold text-foreground">{venue?.name}</span>?
          This action cannot be undone.
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="admin_venues.delete_cancel_button"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteVenue.isPending}
            data-ocid="admin_venues.delete_confirm_button"
          >
            {deleteVenue.isPending ? "Deleting…" : "Delete Venue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminVenuesPage() {
  const { data: venues = [], isLoading, error, refetch } = useVenues();
  const [addOpen, setAddOpen] = useState(false);
  const [editVenue, setEditVenue] = useState<VenuePublic | undefined>();
  const [deleteVenue, setDeleteVenue] = useState<VenuePublic | null>(null);

  return (
    <div className="flex flex-1 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-background">
        <div className="border-b border-border bg-card px-6 py-5">
          <PageHeader
            title="Venues"
            subtitle={`${venues.length} venue${venues.length !== 1 ? "s" : ""} configured`}
            action={{
              label: "Add Venue",
              onClick: () => setAddOpen(true),
              icon: <Plus className="w-4 h-4" />,
              "data-ocid": "admin_venues.add_button",
            }}
          />
        </div>
        <div className="p-6" data-ocid="admin_venues.page">
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
              data-ocid="admin_venues.error_state"
            />
          ) : venues.length === 0 ? (
            <EmptyState
              icon={<MapPin className="w-8 h-8" />}
              title="No venues yet"
              description="Add your first venue to start scheduling showtimes."
              action={{
                label: "Add Venue",
                onClick: () => setAddOpen(true),
                "data-ocid": "admin_venues.add_action",
              }}
              data-ocid="admin_venues.empty_state"
            />
          ) : (
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <Table data-ocid="admin_venues.list">
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead className="text-right">Total Seats</TableHead>
                    <TableHead className="text-right">Layout</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {venues.map((venue, idx) => (
                    <TableRow
                      key={venue.id.toString()}
                      data-ocid={`admin_venues.item.${idx + 1}`}
                    >
                      <TableCell className="font-medium text-foreground">
                        {venue.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {venue.address}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {String(venue.totalSeats)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-muted-foreground">
                        {String(venue.layoutRows)}R×{String(venue.layoutCols)}C
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={venue.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {venue.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditVenue(venue)}
                            data-ocid={`admin_venues.edit_button.${idx + 1}`}
                            aria-label="Edit venue"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteVenue(venue)}
                            data-ocid={`admin_venues.delete_button.${idx + 1}`}
                            aria-label="Delete venue"
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

        <VenueFormDialog open={addOpen} onClose={() => setAddOpen(false)} />
        {editVenue && (
          <VenueFormDialog
            open={!!editVenue}
            onClose={() => setEditVenue(undefined)}
            editVenue={editVenue}
          />
        )}
        <DeleteVenueDialog
          venue={deleteVenue}
          onClose={() => setDeleteVenue(null)}
        />
      </main>
    </div>
  );
}
