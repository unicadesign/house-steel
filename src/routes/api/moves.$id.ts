import { createFileRoute } from "@tanstack/react-router";
import { getMove } from "@/lib/protocol/store";

export const Route = createFileRoute("/api/moves/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const move = getMove({ id: params.id }) ?? getMove({ name: params.id });
        if (!move) return new Response("not found", { status: 404 });
        return Response.json(move);
      },
    },
  },
});
