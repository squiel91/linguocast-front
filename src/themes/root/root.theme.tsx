import { Outlet, ScrollRestoration } from "react-router-dom";

export const RootTheme = () => (
  <>
    <Outlet />
    <ScrollRestoration />
  </>
)
