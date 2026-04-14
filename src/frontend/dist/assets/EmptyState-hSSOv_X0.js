import { c as createLucideIcon, j as jsxRuntimeExports, B as Button } from "./index-CtJ3C921.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ]
];
const Inbox = createLucideIcon("inbox", __iconNode);
function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  "data-ocid": dataOcid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": dataOcid,
      className: `flex flex-col items-center justify-center text-center py-16 px-4 ${className ?? ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground", children: icon ?? /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "w-8 h-8" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-semibold text-foreground mb-1", children: title }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-6", children: description }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: action.onClick,
            "data-ocid": action["data-ocid"],
            variant: "default",
            children: action.label
          }
        )
      ]
    }
  );
}
export {
  EmptyState as E
};
