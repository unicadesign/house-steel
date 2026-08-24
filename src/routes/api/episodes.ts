import { createFileRoute } from "@tanstack/react-router";
import { EPISODE_0 } from "@/lib/protocol/store";

export const Route = createFileRoute("/api/episodes")({
  server: {
    handlers: {
      GET: async () => Response.json({ episodes: [EPISODE_0] }),
    },
  },
});
