import { j as jsxRuntimeExports, h as cn, r as reactExports, C as CalendarDays, B as Button, v as ue, E as EventType } from "./index-CtJ3C921.js";
import { B as Badge } from "./useShowtimes-DAXYNdLs.js";
import { P as Plus, T as Trash2, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-erLJMCBM.js";
import { L as Label, I as Input } from "./label-Dizs-W2G.js";
import { S as Select, a as SelectTrigger, b as SelectValue, d as SelectContent, e as SelectItem } from "./select-D6-ZPUf5.js";
import { S as Skeleton } from "./skeleton-ChEk-H4W.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DpcFhytv.js";
import { E as EmptyState } from "./EmptyState-hSSOv_X0.js";
import { E as ErrorMessage } from "./ErrorMessage-DvXrrHvJ.js";
import { P as PageHeader } from "./PageHeader-CKG-Nc0Q.js";
import { u as useEvents, b as useCreateEvent, c as useUpdateEvent, d as useDeleteEvent } from "./useEvents-DyFdtPM1.js";
import { A as AdminSidebar } from "./AdminPage-Cm7POL3g.js";
import { P as Pencil } from "./pencil-CbLj1HbS.js";
import "./card-CDKT_lvH.js";
import "./trending-up-DdNOKKgO.js";
import "./users-C7BcgUK7.js";
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
const EVENT_TYPES = Object.values(EventType);
const eventTypeLabels = {
  [EventType.movie]: "Movie",
  [EventType.concert]: "Concert",
  [EventType.workshop]: "Workshop",
  [EventType.sports]: "Sports",
  [EventType.other]: "Other"
};
function EventFormDialog({
  open,
  onClose,
  editEvent,
  onSubmit,
  isPending
}) {
  const [form, setForm] = reactExports.useState({
    title: (editEvent == null ? void 0 : editEvent.title) ?? "",
    description: (editEvent == null ? void 0 : editEvent.description) ?? "",
    eventType: (editEvent == null ? void 0 : editEvent.eventType) ?? EventType.movie,
    genre: (editEvent == null ? void 0 : editEvent.genre) ?? "",
    duration: String((editEvent == null ? void 0 : editEvent.durationMinutes) ?? "120"),
    imageUrls: (editEvent == null ? void 0 : editEvent.imageUrls.join("\n")) ?? ""
  });
  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    const dur = Number.parseInt(form.duration);
    if (!form.title || Number.isNaN(dur)) return;
    const imageUrls = form.imageUrls.split("\n").map((u) => u.trim()).filter(Boolean);
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      eventType: form.eventType,
      genre: form.genre.trim(),
      durationMinutes: BigInt(dur),
      imageUrls
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-lg", "data-ocid": "admin_events.dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: editEvent ? "Edit Event" : "Add Event" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "e-title", children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "e-title",
            placeholder: "Dune: Part Two",
            value: form.title,
            onChange: (e) => set("title", e.target.value),
            required: true,
            "data-ocid": "admin_events.title_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.eventType,
              onValueChange: (v) => set("eventType", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "admin_events.type_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: EVENT_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: eventTypeLabels[t] }, t)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "e-genre", children: "Genre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "e-genre",
              placeholder: "Sci-Fi",
              value: form.genre,
              onChange: (e) => set("genre", e.target.value),
              "data-ocid": "admin_events.genre_input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "e-duration", children: "Duration (minutes)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "e-duration",
            type: "number",
            min: "1",
            placeholder: "120",
            value: form.duration,
            onChange: (e) => set("duration", e.target.value),
            required: true,
            "data-ocid": "admin_events.duration_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "e-desc", children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "e-desc",
            placeholder: "Brief description of the event…",
            value: form.description,
            onChange: (e) => set("description", e.target.value),
            rows: 3,
            "data-ocid": "admin_events.description_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "e-images", children: [
          "Image URLs",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "(one per line)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "e-images",
            placeholder: "https://example.com/poster.jpg",
            value: form.imageUrls,
            onChange: (e) => set("imageUrls", e.target.value),
            rows: 2
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            "data-ocid": "admin_events.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isPending,
            "data-ocid": "admin_events.submit_button",
            children: isPending ? "Saving…" : editEvent ? "Update" : "Save"
          }
        )
      ] })
    ] })
  ] }) });
}
function DeleteEventDialog({
  event,
  onClose
}) {
  const deleteEvent = useDeleteEvent();
  async function handleConfirm() {
    if (!event) return;
    try {
      await deleteEvent.mutateAsync(event.id);
      ue.success("Event deleted");
      onClose();
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to delete event"
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!event, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-sm",
      "data-ocid": "admin_events.delete_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Delete Event?" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Permanently delete",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: event == null ? void 0 : event.title }),
          "? This cannot be undone."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "admin_events.delete_cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              onClick: handleConfirm,
              disabled: deleteEvent.isPending,
              "data-ocid": "admin_events.delete_confirm_button",
              children: deleteEvent.isPending ? "Deleting…" : "Delete Event"
            }
          )
        ] })
      ]
    }
  ) });
}
function AdminEventsPage() {
  const { data: events = [], isLoading, error, refetch } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [editEvent, setEditEvent] = reactExports.useState(null);
  const [deleteEvent, setDeleteEvent] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AdminSidebar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Events",
          subtitle: `${events.length} event${events.length !== 1 ? "s" : ""}`,
          action: {
            label: "Add Event",
            onClick: () => setShowCreate(true),
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "data-ocid": "admin_events.add_button"
          }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", "data-ocid": "admin_events.page", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-xl" })
      ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ErrorMessage,
        {
          error,
          onRetry: () => refetch(),
          "data-ocid": "admin_events.error_state"
        }
      ) : events.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-8 h-8" }),
          title: "No events yet",
          description: "Add your first event to start selling tickets.",
          action: {
            label: "Add Event",
            onClick: () => setShowCreate(true),
            "data-ocid": "admin_events.add_action"
          },
          "data-ocid": "admin_events.empty_state"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-xl overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "admin_events.list", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Genre" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Duration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-24" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: events.map((event, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableRow,
          {
            "data-ocid": `admin_events.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-foreground max-w-xs truncate", children: event.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs capitalize", children: eventTypeLabels[event.eventType] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: event.genre }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-right font-mono text-sm text-muted-foreground", children: [
                String(event.durationMinutes),
                "m"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: event.isActive ? "default" : "secondary",
                  className: "text-xs",
                  children: event.isActive ? "Active" : "Inactive"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8",
                    onClick: () => setEditEvent(event),
                    "data-ocid": `admin_events.edit_button.${idx + 1}`,
                    "aria-label": "Edit event",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10",
                    onClick: () => setDeleteEvent(event),
                    "data-ocid": `admin_events.delete_button.${idx + 1}`,
                    "aria-label": "Delete event",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] }) })
            ]
          },
          event.id.toString()
        )) })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        EventFormDialog,
        {
          open: showCreate,
          onClose: () => setShowCreate(false),
          isPending: createEvent.isPending,
          onSubmit: (data) => createEvent.mutate(data, {
            onSuccess: () => {
              setShowCreate(false);
              ue.success("Event created");
            },
            onError: (e) => ue.error(e.message)
          })
        }
      ),
      editEvent && /* @__PURE__ */ jsxRuntimeExports.jsx(
        EventFormDialog,
        {
          open: !!editEvent,
          onClose: () => setEditEvent(null),
          editEvent,
          isPending: updateEvent.isPending,
          onSubmit: (data) => updateEvent.mutate(
            { ...data, id: editEvent.id },
            {
              onSuccess: () => {
                setEditEvent(null);
                ue.success("Event updated");
              },
              onError: (e) => ue.error(e.message)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DeleteEventDialog,
        {
          event: deleteEvent,
          onClose: () => setDeleteEvent(null)
        }
      )
    ] })
  ] });
}
export {
  AdminEventsPage as default
};
