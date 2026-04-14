import { c as createLucideIcon, j as jsxRuntimeExports, A as Root, r as reactExports, D as Trigger, b as useComposedRefs, W as WarningProvider, F as Content, a as composeEventHandlers, G as Title, H as Description, J as Close, K as createDialogScope, L as Portal, O as Overlay, M as createSlottable, g as createContextScope, h as cn, N as buttonVariants, m as useParams, i as useNavigate, w as BookingStatus, B as Button, T as Ticket, S as Separator, v as ue, Q as RefundStatus, C as CalendarDays, U as PaymentStatus } from "./index-CtJ3C921.js";
import { c as useShowtime, d as useVenue, B as Badge, M as MapPin } from "./useShowtimes-DAXYNdLs.js";
import { S as Skeleton } from "./skeleton-ChEk-H4W.js";
import { B as BookingStatusBadge } from "./BookingStatusBadge-BJwzHw0P.js";
import { E as ErrorMessage, R as RefreshCw } from "./ErrorMessage-DvXrrHvJ.js";
import { T as TicketCategoryBadge } from "./TicketCategoryBadge-CmA3mGlt.js";
import { a as useEvent } from "./useEvents-DyFdtPM1.js";
import { c as useBooking, d as useMyPayment, e as useCancelBooking } from "./useMyBookings-CHuAlfx0.js";
import { C as ChevronLeft } from "./chevron-left-Dl4AXylI.js";
import { C as Clock } from "./clock-XmT9Q-T9.js";
import { C as CreditCard } from "./credit-card-DU5JVRaD.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
  ["path", { d: "m9 9 6 6", key: "z0biqf" }]
];
const CircleX = createLucideIcon("circle-x", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "5", height: "5", x: "3", y: "3", rx: "1", key: "1tu5fj" }],
  ["rect", { width: "5", height: "5", x: "16", y: "3", rx: "1", key: "1v8r4q" }],
  ["rect", { width: "5", height: "5", x: "3", y: "16", rx: "1", key: "1x03jg" }],
  ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3", key: "177gqh" }],
  ["path", { d: "M21 21v.01", key: "ents32" }],
  ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7", key: "8crl2c" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M12 3h.01", key: "n36tog" }],
  ["path", { d: "M12 16v.01", key: "133mhm" }],
  ["path", { d: "M16 12h1", key: "1slzba" }],
  ["path", { d: "M21 12v.01", key: "1lwtk9" }],
  ["path", { d: "M12 21v-1", key: "1880an" }]
];
const QrCode = createLucideIcon("qr-code", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
var ROOT_NAME = "AlertDialog";
var [createAlertDialogContext] = createContextScope(ROOT_NAME, [
  createDialogScope
]);
var useDialogScope = createDialogScope();
var AlertDialog$1 = (props) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { ...dialogScope, ...alertDialogProps, modal: true });
};
AlertDialog$1.displayName = ROOT_NAME;
var TRIGGER_NAME = "AlertDialogTrigger";
var AlertDialogTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger, { ...dialogScope, ...triggerProps, ref: forwardedRef });
  }
);
AlertDialogTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "AlertDialogPortal";
var AlertDialogPortal$1 = (props) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...dialogScope, ...portalProps });
};
AlertDialogPortal$1.displayName = PORTAL_NAME;
var OVERLAY_NAME = "AlertDialogOverlay";
var AlertDialogOverlay$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { ...dialogScope, ...overlayProps, ref: forwardedRef });
  }
);
AlertDialogOverlay$1.displayName = OVERLAY_NAME;
var CONTENT_NAME = "AlertDialogContent";
var [AlertDialogContentProvider, useAlertDialogContentContext] = createAlertDialogContext(CONTENT_NAME);
var Slottable = createSlottable("AlertDialogContent");
var AlertDialogContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = reactExports.useRef(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      WarningProvider,
      {
        contentName: CONTENT_NAME,
        titleName: TITLE_NAME,
        docsSlug: "alert-dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogContentProvider, { scope: __scopeAlertDialog, cancelRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Content,
          {
            role: "alertdialog",
            ...dialogScope,
            ...contentProps,
            ref: composedRefs,
            onOpenAutoFocus: composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              var _a;
              event.preventDefault();
              (_a = cancelRef.current) == null ? void 0 : _a.focus({ preventScroll: true });
            }),
            onPointerDownOutside: (event) => event.preventDefault(),
            onInteractOutside: (event) => event.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Slottable, { children }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef })
            ]
          }
        ) })
      }
    );
  }
);
AlertDialogContent$1.displayName = CONTENT_NAME;
var TITLE_NAME = "AlertDialogTitle";
var AlertDialogTitle$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { ...dialogScope, ...titleProps, ref: forwardedRef });
  }
);
AlertDialogTitle$1.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "AlertDialogDescription";
var AlertDialogDescription$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { ...dialogScope, ...descriptionProps, ref: forwardedRef });
});
AlertDialogDescription$1.displayName = DESCRIPTION_NAME;
var ACTION_NAME = "AlertDialogAction";
var AlertDialogAction$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...actionProps, ref: forwardedRef });
  }
);
AlertDialogAction$1.displayName = ACTION_NAME;
var CANCEL_NAME = "AlertDialogCancel";
var AlertDialogCancel$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Close, { ...dialogScope, ...cancelProps, ref });
  }
);
AlertDialogCancel$1.displayName = CANCEL_NAME;
var DescriptionWarning = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;
  reactExports.useEffect(() => {
    var _a;
    const hasDescription = document.getElementById(
      (_a = contentRef.current) == null ? void 0 : _a.getAttribute("aria-describedby")
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);
  return null;
};
var Root2 = AlertDialog$1;
var Trigger2 = AlertDialogTrigger$1;
var Portal2 = AlertDialogPortal$1;
var Overlay2 = AlertDialogOverlay$1;
var Content2 = AlertDialogContent$1;
var Action = AlertDialogAction$1;
var Cancel = AlertDialogCancel$1;
var Title2 = AlertDialogTitle$1;
var Description2 = AlertDialogDescription$1;
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Trigger2, { "data-slot": "alert-dialog-trigger", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay2,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Title2,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Description2,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
function formatLongDate(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
function formatTime(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatShortDate(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatPrice(cents) {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}
function isEventPassed(startTime) {
  return Number(startTime / 1000000n) < Date.now();
}
function QRCodeDisplay({ value }) {
  const SIZE = 21;
  const cells = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const inFinder = row < 7 && col < 7 || row < 7 && col >= SIZE - 7 || row >= SIZE - 7 && col < 7;
      let filled;
      if (inFinder) {
        const r = row % 7;
        const c = col % 7;
        filled = r === 0 || r === 6 || c === 0 || c === 6 || r >= 2 && r <= 4 && c >= 2 && c <= 4;
      } else {
        const charIdx = (row * SIZE + col) * 7 % value.length;
        const charCode = value.charCodeAt(charIdx);
        const bitPos = (row + col) % 8;
        filled = (charCode >> bitPos & 1) === 1;
      }
      cells.push({ row, col, filled });
    }
  }
  const rows = Array.from(
    { length: SIZE },
    (_, r) => cells.filter((c) => c.row === r)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "inline-flex flex-col bg-card border-4 border-foreground/90 rounded-xl p-3 shadow-elevated",
      "aria-label": `QR Code for ${value}`,
      children: rows.map((rowCells) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex", children: rowCells.map((cell) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-2 h-2 ${cell.filled ? "bg-foreground/90" : "bg-card"}`
        },
        `cell-${cell.row}-${cell.col}`
      )) }, `row-${rowCells[0].row}`))
    }
  );
}
function SectionCard({
  icon,
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: icon }),
      title
    ] }),
    children
  ] });
}
function InfoRow({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 py-1.5 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-right", children: value })
  ] });
}
const paymentStatusConfig = {
  [PaymentStatus.completed]: {
    label: "Paid",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
    className: "bg-success/15 text-success border-success/30"
  },
  [PaymentStatus.pending]: {
    label: "Pending",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
    className: "bg-warning/15 text-warning border-warning/30"
  },
  [PaymentStatus.failed]: {
    label: "Failed",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
    className: "bg-destructive/10 text-destructive border-destructive/25"
  },
  [PaymentStatus.refunded]: {
    label: "Refunded",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
    className: "bg-secondary text-secondary-foreground border-border"
  }
};
const refundStatusConfig = {
  [RefundStatus.notApplicable]: null,
  [RefundStatus.pending]: {
    label: "Refund Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200"
  },
  [RefundStatus.refunded]: {
    label: "Refunded",
    className: "bg-blue-100 text-blue-800 border-blue-200"
  },
  [RefundStatus.nonRefundable]: {
    label: "Non-Refundable",
    className: "bg-muted text-muted-foreground border-border"
  }
};
function DetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 w-full rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-xl" })
  ] });
}
function EventInfoSection({
  booking,
  showtime,
  venue
}) {
  const { data: event } = useEvent((showtime == null ? void 0 : showtime.eventId) ?? null);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    SectionCard,
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-4 h-4" }),
      title: "Event Details",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
        event && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            InfoRow,
            {
              label: "Event",
              value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: event.title })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            InfoRow,
            {
              label: "Type",
              value: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "capitalize text-xs", children: event.eventType })
            }
          )
        ] }),
        showtime ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            InfoRow,
            {
              label: "Date",
              value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                formatLongDate(showtime.startTime)
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            InfoRow,
            {
              label: "Time",
              value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-muted-foreground" }),
                formatTime(showtime.startTime),
                " –",
                " ",
                formatTime(showtime.endTime)
              ] })
            }
          )
        ] }) : null,
        venue && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            label: "Venue",
            value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block", children: venue.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs text-muted-foreground font-normal", children: venue.address })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            label: "Showtime ID",
            value: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
              "#",
              String(booking.showtimeId)
            ] })
          }
        )
      ] })
    }
  );
}
function PaymentSection({ payment }) {
  const cfg = paymentStatusConfig[payment.status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SectionCard, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-4 h-4" }), title: "Payment", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      InfoRow,
      {
        label: "Status",
        value: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: `gap-1 text-xs ${cfg.className}`,
            children: [
              cfg.icon,
              cfg.label
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InfoRow, { label: "Amount", value: formatPrice(payment.amountCents) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      InfoRow,
      {
        label: "Method",
        value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: payment.paymentMode })
      }
    ),
    payment.transactionId && /* @__PURE__ */ jsxRuntimeExports.jsx(
      InfoRow,
      {
        label: "Transaction",
        value: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-muted-foreground truncate max-w-[180px] block", children: payment.transactionId })
      }
    ),
    payment.completedAt && /* @__PURE__ */ jsxRuntimeExports.jsx(
      InfoRow,
      {
        label: "Paid at",
        value: formatShortDate(payment.completedAt)
      }
    )
  ] }) });
}
function BookingDetailPage() {
  const { bookingId } = useParams({ from: "/dashboard/bookings/$bookingId" });
  const navigate = useNavigate();
  const bookingIdBig = BigInt(bookingId);
  const { data: booking, isLoading, error } = useBooking(bookingIdBig);
  const { data: payment } = useMyPayment(bookingIdBig);
  const { data: showtime } = useShowtime((booking == null ? void 0 : booking.showtimeId) ?? null);
  const { data: venue } = useVenue((showtime == null ? void 0 : showtime.venueId) ?? null);
  const cancelBooking = useCancelBooking();
  async function handleCancel() {
    try {
      await cancelBooking.mutateAsync(bookingIdBig);
      ue.success("Booking cancelled", {
        description: "Your seats have been released."
      });
    } catch (e) {
      ue.error("Cancel failed", {
        description: e instanceof Error ? e.message : "Please try again."
      });
    }
  }
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(DetailSkeleton, {});
  if (error || !booking) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ErrorMessage,
      {
        title: "Booking not found",
        message: "This booking could not be loaded."
      }
    );
  }
  const canCancel = booking.status === BookingStatus.confirmed && (showtime ? !isEventPassed(showtime.startTime) : true);
  const refundCfg = refundStatusConfig[booking.refundStatus];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        "data-ocid": "booking_detail.back_button",
        onClick: () => navigate({ to: "/dashboard" }),
        className: "gap-1.5 mb-6 -ml-2 text-muted-foreground hover:text-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
          "My Bookings"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl border border-border p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-5 h-5 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "h1",
                {
                  "data-ocid": "booking_detail.reference",
                  className: "text-xl font-display font-bold text-foreground",
                  children: [
                    "Booking #",
                    String(booking.id).padStart(6, "0")
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Booked on ",
              formatShortDate(booking.createdAt)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookingStatusBadge, { status: booking.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center sm:items-start gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeDisplay, { value: booking.qrReference }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-3 h-3" }),
              "Scan at venue"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3 w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide", children: "Reference Code" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": "booking_detail.qr_reference",
                  className: "font-mono text-sm bg-muted/60 rounded-lg px-3 py-2 break-all border border-border",
                  children: booking.qrReference
                }
              )
            ] }),
            refundCfg && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "booking_detail.refund_status",
                className: "flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Refund:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-xs ${refundCfg.className}`,
                      children: refundCfg.label
                    }
                  )
                ]
              }
            ),
            booking.cancelledAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Cancelled on ",
              formatShortDate(booking.cancelledAt)
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(EventInfoSection, { booking, showtime, venue }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        SectionCard,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Ticket, { className: "w-4 h-4" }),
          title: `Seat Details (${booking.items.length} ticket${booking.items.length !== 1 ? "s" : ""})`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "booking_detail.tickets_list", className: "space-y-0", children: booking.items.map((item, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `booking_detail.ticket.${idx + 1}`,
                className: "flex items-center justify-between py-2.5 border-b border-border last:border-0",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold w-10", children: item.seatLabel }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TicketCategoryBadge, { category: item.category })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium tabular-nums", children: formatPrice(item.priceInCents) })
                ]
              },
              String(item.seatId)
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "my-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Total Paid" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-primary tabular-nums", children: formatPrice(booking.totalAmountCents) })
            ] })
          ]
        }
      ),
      payment && /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentSection, { payment }),
      canCancel && /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            "data-ocid": "booking_detail.cancel_button",
            className: "w-full gap-2 border-destructive/60 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }),
              "Cancel Booking"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { "data-ocid": "booking_detail.cancel_dialog", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Cancel this booking?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Your",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold", children: [
                  booking.items.length,
                  " seat",
                  booking.items.length !== 1 ? "s" : ""
                ] }),
                " ",
                "will be released and your booking marked as cancelled."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/60 border border-border px-4 py-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "Refund Policy" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Refunds are processed within 5–10 business days to your original payment method. Eligibility depends on how far in advance you cancel. Non-refundable tickets will not be refunded." })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { "data-ocid": "booking_detail.cancel_button", children: "Keep Booking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              AlertDialogAction,
              {
                "data-ocid": "booking_detail.confirm_button",
                onClick: handleCancel,
                disabled: cancelBooking.isPending,
                className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                children: cancelBooking.isPending ? "Cancelling…" : "Yes, Cancel Booking"
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  BookingDetailPage as default
};
