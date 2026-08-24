import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { frameSchema } from "@/lib/protocol/schema";
import { stopRecord } from "@/lib/protocol/store";

const bodySchema = z.object({
  name: z.string().min(1).max(24).optional(),
  frames: z.array(frameSchema).min(1),
});

export const Route = createFileRoute("/api/record/stop")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = bodySchema.parse(await request.json());
        const clip = stopRecord(body.frames, body.name);
        return Response.json(clip);
      },
    },
  },
});
