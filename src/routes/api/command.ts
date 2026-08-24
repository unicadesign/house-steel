import { createFileRoute } from "@tanstack/react-router";
import { commandSchema } from "@/lib/protocol/schema";
import { getMove } from "@/lib/protocol/store";

export const Route = createFileRoute("/api/command")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cmd = commandSchema.parse(await request.json());
        if (cmd.kill) {
          return Response.json({
            ok: true,
            applied: { ...cmd, drive: { left: 0, right: 0 }, arm: { extend: 0 } },
          });
        }
        if (cmd.play) {
          const move = getMove(cmd.play);
          if (!move) return new Response("move not found", { status: 404 });
          return Response.json({ ok: true, play: { id: move.id, name: move.name, frames: move.frames } });
        }
        return Response.json({ ok: true, applied: cmd });
      },
    },
  },
});
