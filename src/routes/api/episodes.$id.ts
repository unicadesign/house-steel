import { createFileRoute } from "@tanstack/react-router";
import { EPISODE_0 } from "@/lib/protocol/store";

export const Route = createFileRoute("/api/episodes/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (params.id !== EPISODE_0.id && params.id !== "0" && params.id !== "ep-0") {
          return new Response("not found", { status: 404 });
        }
        return Response.json(EPISODE_0);
      },
    },
  },
});
