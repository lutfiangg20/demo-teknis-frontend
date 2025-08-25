import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("login", "./routes/Login/page.tsx"),
	route("signup", "./routes/Signup/page.tsx"),
] satisfies RouteConfig;
