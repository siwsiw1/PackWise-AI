import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as getUser } from "./auth-ZX2vfegG.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BeudWK5s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DH7Y59b0.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$18 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "PackWise AI"
			},
			{
				property: "og:title",
				content: "PackWise AI"
			},
			{
				property: "og:description",
				content: "AI-powered packaging optimization for toy and collectible manufacturers."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$18.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$17 = () => import("./register-RCPLcxk0.mjs");
var Route$17 = createFileRoute("/register")({
	head: () => ({ meta: [{ title: "Create account — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./pending-DmcjJHhc.mjs");
var Route$16 = createFileRoute("/pending")({
	head: () => ({ meta: [{ title: "Pending approval — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./login-AL10mPY8.mjs");
var Route$15 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign in — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./app-FfZH5t5o.mjs");
var Route$14 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./routes-DTEZEvkE.mjs");
var Route$13 = createFileRoute("/")({
	beforeLoad: () => {
		if (getUser()) throw redirect({ to: "/app/dashboard" });
		throw redirect({ to: "/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./app.index-DGoxz01L.mjs");
var Route$12 = createFileRoute("/app/")({
	beforeLoad: () => {
		throw redirect({ to: "/app/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./app.users-DSt-G-qs.mjs");
var Route$11 = createFileRoute("/app/users")({
	head: () => ({ meta: [{ title: "User Management — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./app.system-settings-CvB_i4bt.mjs");
var Route$10 = createFileRoute("/app/system-settings")({
	head: () => ({ meta: [{ title: "System Settings — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./app.sustainability-BcKp8mZx.mjs");
var Route$9 = createFileRoute("/app/sustainability")({
	head: () => ({ meta: [{ title: "Sustainability — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./app.settings-BPN5TwRq.mjs");
var Route$8 = createFileRoute("/app/settings")({
	head: () => ({ meta: [{ title: "Settings — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./app.roles-i9DvL-RK.mjs");
var Route$7 = createFileRoute("/app/roles")({
	head: () => ({ meta: [{ title: "Role Assignment — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./app.risk-assessment-BH3_I7fE.mjs");
var Route$6 = createFileRoute("/app/risk-assessment")({
	head: () => ({ meta: [{ title: "Risk Assessment — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./app.reports-Arkc8rxq.mjs");
var Route$5 = createFileRoute("/app/reports")({
	head: () => ({ meta: [{ title: "Reports — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./app.product-analysis-YYcST0Y-.mjs");
var Route$4 = createFileRoute("/app/product-analysis")({
	head: () => ({ meta: [{ title: "Pose & Doll Analysis — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./app.packaging-preview-ow4L7OmH.mjs");
var Route$3 = createFileRoute("/app/packaging-preview")({
	head: () => ({ meta: [{ title: "Attachment Visualizer — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./app.packaging-planner-DgRAEBD5.mjs");
var Route$2 = createFileRoute("/app/packaging-planner")({
	head: () => ({ meta: [{ title: "Attachment Planner — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./app.dashboard-BCwYfy3j.mjs");
var Route$1 = createFileRoute("/app/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./app.cost-analysis-CzPSlbLt.mjs");
var Route = createFileRoute("/app/cost-analysis")({
	head: () => ({ meta: [{ title: "Cost & Sustainability — PackWise AI" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var RegisterRoute = Route$17.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$18
});
var PendingRoute = Route$16.update({
	id: "/pending",
	path: "/pending",
	getParentRoute: () => Route$18
});
var LoginRoute = Route$15.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$18
});
var AppRoute = Route$14.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$18
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$18
});
var AppIndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppUsersRoute = Route$11.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AppRoute
});
var AppSystemSettingsRoute = Route$10.update({
	id: "/system-settings",
	path: "/system-settings",
	getParentRoute: () => AppRoute
});
var AppSustainabilityRoute = Route$9.update({
	id: "/sustainability",
	path: "/sustainability",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$8.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppRolesRoute = Route$7.update({
	id: "/roles",
	path: "/roles",
	getParentRoute: () => AppRoute
});
var AppRiskAssessmentRoute = Route$6.update({
	id: "/risk-assessment",
	path: "/risk-assessment",
	getParentRoute: () => AppRoute
});
var AppReportsRoute = Route$5.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AppRoute
});
var AppProductAnalysisRoute = Route$4.update({
	id: "/product-analysis",
	path: "/product-analysis",
	getParentRoute: () => AppRoute
});
var AppPackagingPreviewRoute = Route$3.update({
	id: "/packaging-preview",
	path: "/packaging-preview",
	getParentRoute: () => AppRoute
});
var AppPackagingPlannerRoute = Route$2.update({
	id: "/packaging-planner",
	path: "/packaging-planner",
	getParentRoute: () => AppRoute
});
var AppDashboardRoute = Route$1.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppCostAnalysisRoute: Route.update({
		id: "/cost-analysis",
		path: "/cost-analysis",
		getParentRoute: () => AppRoute
	}),
	AppDashboardRoute,
	AppPackagingPlannerRoute,
	AppPackagingPreviewRoute,
	AppProductAnalysisRoute,
	AppReportsRoute,
	AppRiskAssessmentRoute,
	AppRolesRoute,
	AppSettingsRoute,
	AppSustainabilityRoute,
	AppSystemSettingsRoute,
	AppUsersRoute,
	AppIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	LoginRoute,
	PendingRoute,
	RegisterRoute
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
