import { j as jsxRuntimeExports, s as TicketCategory } from "./index-CtJ3C921.js";
import { B as Badge } from "./useShowtimes-DAXYNdLs.js";
const categoryConfig = {
  [TicketCategory.vip]: {
    label: "VIP",
    className: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300"
  },
  [TicketCategory.regular]: {
    label: "Regular",
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300"
  },
  [TicketCategory.balcony]: {
    label: "Balcony",
    className: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300"
  }
};
function TicketCategoryBadge({
  category,
  className
}) {
  const config = categoryConfig[category];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: `text-xs font-semibold ${config.className} ${className ?? ""}`,
      children: config.label
    }
  );
}
export {
  TicketCategoryBadge as T
};
