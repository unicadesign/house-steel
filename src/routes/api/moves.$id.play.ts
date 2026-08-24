import { createFileRoute } from "@tanstack/react-router";
import { getMove } from "@/lib/protocol/store";

export const Route = createFileRoute("/api/moves/$id/play")({
  server: {
    handlers: {
      POST: async ({ params }) => {
        const move = getMove({ id: params.id }) ?? getMove({ name: params.id });
        if (!move) return new Response("not found", { status: 404 });
        return Response.json({
          play: { id: move.id, name: move.name },
          frames: move.frames,
          durationMs: move.durationMs,
        });
      },
    },
  },
});
