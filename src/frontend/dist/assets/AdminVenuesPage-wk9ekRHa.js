import { r as reactExports, j as jsxRuntimeExports, B as Button, n as useBackend, p as useQueryClient, v as ue } from "./index-CtJ3C921.js";
import { a as useVenues, M as MapPin, B as Badge, b as useMutation } from "./useShowtimes-DAXYNdLs.js";
import { P as Plus, T as Trash2, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-erLJMCBM.js";
import { L as Label, I as Input } from "./label-Dizs-W2G.js";
import { S as Skeleton } from "./skeleton-ChEk-H4W.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DpcFhytv.js";
import { E as EmptyState } from "./EmptyState-hSSOv_X0.js";
import { E as ErrorMessage } from "./ErrorMessage-DvXrrHvJ.js";
import { P as PageHeader } from "./PageHeader-CKG-Nc0Q.js";
import { A as AdminSidebar } from "./AdminPage-Cm7POL3g.js";
import { P as Pencil } from "./pencil-CbLj1HbS.js";
import "./card-CDKT_lvH.js";
import "./trending-up-DdNOKKgO.js";
import "./users-C7BcgUK7.js";
function useCreateVenue() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.createVenue(input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] })
  });
}
function useUpdateVenue() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVenue(input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] })
  });
}
function useDeleteVenue() {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (venueId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteVenue(venueId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] })
  });
}
const emptyForm = {
  name: "",
  address: "",
  layoutRows: "10",
  layoutCols: "20"
};
function VenueFormDialog({
  open,
  onClose,
  editVenue
}) {
  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();
  const [form, setForm] = reactExports.useState(
    editVenue ? {
      name: editVenue.name,
      address: editVenue.address,
      layoutRows: String(editVenue.layoutRows),
      layoutCols: String(editVenue.layoutCols)
    } : emptyForm
  );
  const isPending = createVenue.isPending || updateVenue.isPending;
  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const r = Number.parseInt(form.layoutRows);
    const c = Number.parseInt(form.layoutCols);
    if (!form.name || !form.address || Number.isNaN(r) || Number.isNaN(c))
      return;
    const payload = {
      name: form.name.trim(),
      address: form.address.trim(),
      layoutRows: BigInt(r),
      layoutCols: BigInt(c),
      totalSeats: BigInt(r * c)
    };
    try {
      if (editVenue) {
        await updateVenue.mutateAsync({ ...editVenue, ...payload });
        ue.success("Venue updated");
      } else {
        await createVenue.mutateAsync(payload);
        ue.success("Venue created");
      }
      onClose();
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to save venue");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", "data-ocid": "admin_venues.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: editVenue ? "Edit Venue" : "Add Venue" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "v-name", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "v-name",
            placeholder: "Grand Theatre",
            value: form.name,
            onChange: (e) => set("name", e.target.value),
            required: true,
            "data-ocid": "admin_venues.name_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "v-address", children: "Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "v-address",
            placeholder: "123 Main St, City",
            value: form.address,
            onChange: (e) => set("address", e.target.value),
            required: true,
            "data-ocid": "admin_venues.address_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "v-rows", children: "Rows" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "v-rows",
              type: "number",
              min: "1",
              placeholder: "10",
              value: form.layoutRows,
              onChange: (e) => set("layoutRows", e.target.value),
              required: true,
              "data-ocid": "admin_venues.rows_input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "v-cols", children: "Columns" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "v-cols",
              type: "number",
              min: "1",
              placeholder: "20",
              value: form.layoutCols,
              onChange: (e) => set("layoutCols", e.target.value),
              required: true,
              "data-ocid": "admin_venues.cols_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Total seats:",
        " ",
        Number.parseInt(form.layoutRows) * Number.parseInt(form.layoutCols) || 0
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            "data-ocid": "admin_venues.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isPending,
            "data-ocid": "admin_venues.submit_button",
            children: isPending ? "Saving…" : editVenue ? "Update" : "Save"
          }
        )
      ] })
    ] })
  ] }) });
}
function DeleteVenueDialog({
  venue,
  onClose
}) {
  const deleteVenue = useDeleteVenue();
  async function handleConfirm() {
    if (!venue) return;
    try {
      await deleteVenue.mutateAsync(venue.id);
      ue.success("Venue deleted");
      onClose();
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to delete venue"
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!venue, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-sm",
      "data-ocid": "admin_venues.delete_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Delete Venue?" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Permanently delete",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: venue == null ? void 0 : venue.name }),
          "? This action cannot be undone."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "admin_venues.delete_cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              onClick: handleConfirm,
              disabled: deleteVenue.isPending,
              "data-ocid": "admin_venues.delete_confirm_button",
              children: deleteVenue.isPending ? "Deleting…" : "Delete Venue"
            }
          )
        ] })
      ]
    }
  ) });
}
function AdminVenuesPage() {
  const { data: venues = [], isLoading, error, refetch } = useVenues();
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editVenue, setEditVenue] = reactExports.useState();
  const [deleteVenue, setDeleteVenue] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Venues",
          subtitle: `${venues.length} venue${venues.length !== 1 ? "s" : ""} configured`,
          action: {
            label: "Add Venue",
            onClick: () => setAddOpen(true),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "data-ocid": "admin_venues.add_button"
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", "data-ocid": "admin_venues.page", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" })
      ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ErrorMessage,
        {
          error,
          onRetry: () => refetch(),
          "data-ocid": "admin_venues.error_state"
        }
      ) : venues.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-8 h-8" }),
          title: "No venues yet",
          description: "Add your first venue to start scheduling showtimes.",
          action: {
            label: "Add Venue",
            onClick: () => setAddOpen(true),
            "data-ocid": "admin_venues.add_action"
          },
          "data-ocid": "admin_venues.empty_state"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-xl overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "admin_venues.list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Total Seats" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Layout" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: venues.map((venue, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `admin_venues.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-foreground", children: venue.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground max-w-xs truncate", children: venue.address }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm", children: String(venue.totalSeats) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-mono text-sm text-muted-foreground", children: [
                String(venue.layoutRows),
                "R×",
                String(venue.layoutCols),
                "C"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: venue.isActive ? "default" : "secondary",
                  className: "text-xs",
                  children: venue.isActive ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8",
                    onClick: () => setEditVenue(venue),
                    "data-ocid": `admin_venues.edit_button.${idx + 1}`,
                    "aria-label": "Edit venue",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10",
                    onClick: () => setDeleteVenue(venue),
                    "data-ocid": `admin_venues.delete_button.${idx + 1}`,
                    "aria-label": "Delete venue",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] }) })
            ]
          },
          venue.id.toString()
        )) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VenueFormDialog, { open: addOpen, onClose: () => setAddOpen(false) }),
      editVenue && /* @__PURE__ */ jsxRuntimeExports.jsx(
        VenueFormDialog,
        {
          open: !!editVenue,
          onClose: () => setEditVenue(void 0),
          editVenue
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DeleteVenueDialog,
        {
          venue: deleteVenue,
          onClose: () => setDeleteVenue(null)
        }
      )
    ] })
  ] });
}
export {
  AdminVenuesPage as default
};
