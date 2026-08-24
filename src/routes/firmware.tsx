import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/firmware")({
  beforeLoad: () => {
    throw redirect({ to: "/spec" });
  },
});
