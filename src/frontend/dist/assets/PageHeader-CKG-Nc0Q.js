import { j as jsxRuntimeExports, B as Button } from "./index-CtJ3C921.js";
function PageHeader({
  title,
  subtitle,
  action,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-start justify-between gap-4 mb-6 ${className ?? ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: title }),
          subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: subtitle })
        ] }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: action.onClick,
            "data-ocid": action["data-ocid"],
            className: "shrink-0 gap-2",
            children: [
              action.icon,
              action.label
            ]
          }
        )
      ]
    }
  );
}
export {
  PageHeader as P
};
