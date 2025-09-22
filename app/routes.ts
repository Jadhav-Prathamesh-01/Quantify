import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("profile", "routes/profile.tsx"),
  route("admin", "components/AdminPanel.tsx"),
  route("404", "routes/404.tsx")
] satisfies RouteConfig;
