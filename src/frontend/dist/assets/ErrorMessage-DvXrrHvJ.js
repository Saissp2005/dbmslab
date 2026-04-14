import { c as createLucideIcon, j as jsxRuntimeExports, B as Button } from "./index-CtJ3C921.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode);
function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
}
function ErrorMessage({
  title = "Something went wrong",
  message,
  error,
  onRetry,
  className,
  "data-ocid": dataOcid
}) {
  const displayMessage = message ?? (error ? getErrorMessage(error) : "Please try again later.");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": dataOcid,
      className: `flex flex-col items-center justify-center text-center py-12 px-4 ${className ?? ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-6 h-6 text-destructive" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-display font-semibold text-foreground mb-1", children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-4", children: displayMessage }),
        onRetry && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: onRetry,
            className: "gap-2",
            "data-ocid": dataOcid ? `${dataOcid}.retry` : void 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
              "Try again"
            ]
          }
        )
      ]
    }
  );
}
export {
  CircleAlert as C,
  ErrorMessage as E,
  RefreshCw as R
};
