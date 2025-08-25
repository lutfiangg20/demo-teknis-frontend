import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "./routes/Login/page.tsx"),
  route("signup", "./routes/Signup/page.tsx"),

  layout("./components/MainLayout.tsx", [
    ...prefix("admin", [route("users", "./routes/Admin/Users/page.tsx")]),
  ]),
] satisfies RouteConfig;
