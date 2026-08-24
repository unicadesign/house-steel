import { createFileRoute } from "@tanstack/react-router";
import { moveClipSchema } from "@/lib/protocol/schema";
import { addMove, listMoves } from "@/lib/protocol/store";

export const Route = createFileRoute("/api/moves")({
  server: {
    handlers: {
      GET: async () => Response.json({ moves: listMoves().map(meta) }),
      POST: async ({ request }) => {
        const body = await request.json();
        const parsed = moveClipSchema.parse(body);
        const saved = addMove({ ...parsed, origin: "api" });
        return Response.json(saved, { status: 201 });
      },
    },
  },
});

function meta(m: { id: string; name: string; durationMs: number; origin: string; createdAt: string }) {
  return {
    id: m.id,
    name: m.name,
    durationMs: m.durationMs,
    origin: m.origin,
    createdAt: m.createdAt,
  };
}
