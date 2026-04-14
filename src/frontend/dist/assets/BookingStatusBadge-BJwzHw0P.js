import { j as jsxRuntimeExports, w as BookingStatus } from "./index-CtJ3C921.js";
import { B as Badge } from "./useShowtimes-DAXYNdLs.js";
const statusConfig = {
  [BookingStatus.confirmed]: {
    label: "Confirmed",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
  },
  [BookingStatus.pending]: {
    label: "Pending",
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
  },
  [BookingStatus.cancelled]: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400"
  }
};
function BookingStatusBadge({
  status,
  className
}) {
  const config = statusConfig[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: `text-xs font-medium ${config.className} ${className ?? ""}`,
      children: config.label
    }
  );
}
export {
  BookingStatusBadge as B
};
