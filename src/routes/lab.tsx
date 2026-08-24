import { createFileRoute } from "@tanstack/react-router";
import { Arena } from "@/components/twin/arena";

export const Route = createFileRoute("/lab")({
  component: Lab,
  head: () => ({
    meta: [{ title: "LAB · HOUSE STEEL" }],
  }),
});

function Lab() {
  return (
    <main>
      <Arena />
    </main>
  );
}
