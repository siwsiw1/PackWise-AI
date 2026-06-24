import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Brand } from "./brand-BHMQv63X.mjs";
import { L as Clock, R as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pending-DmcjJHhc.js
var import_jsx_runtime = require_jsx_runtime();
function PendingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-[color:var(--primary-soft)]/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "px-6 py-6 sm:px-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex flex-1 items-center justify-center px-6 py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-lg rounded-2xl border border-border/70 bg-card p-10 text-center shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--primary-soft)] text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "mt-5 bg-[color:var(--warning)]/15 text-[color:var(--warning-foreground)]",
						children: "Pending Approval"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 text-2xl font-semibold tracking-tight",
						children: "Thanks for signing up"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "Your account has been successfully registered and is currently waiting for administrator approval. You'll receive an email confirmation as soon as your access is granted."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-muted-foreground",
						children: [
							"Account details received",
							"Identity verification in progress",
							"Administrator review (typically &lt; 1 business day)"
						].map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: `mt-0.5 h-4 w-4 ${i === 2 ? "text-muted-foreground/50" : "text-[color:var(--success)]"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { dangerouslySetInnerHTML: { __html: step } })]
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full sm:w-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								children: "Return to sign in"
							})
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { PendingPage as component };
