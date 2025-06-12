import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("login", "routes/root/login.tsx"),
  index("routes/home.tsx"),
] satisfies RouteConfig;
