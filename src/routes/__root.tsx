import { createRootRoute, Outlet } from "@tanstack/react-router"
import { Toaster } from "../shared/ui/toaster"

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
})