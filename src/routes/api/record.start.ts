import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { startRecord } from "@/lib/protocol/store";

const bodySchema = z.object({
  name: z.string().min(1).max(24).optional(),
  durationSec: z.number().min(1).max(3).optional(),
});

export const Route = createFileRoute("/api/record/start")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = await request.json().catch(() => ({}));
        const body = bodySchema.parse(json);
        const rec = startRecord(body.name);
        return Response.json({
          record: { action: "start", name: rec.name, durationSec: body.durationSec ?? 3 },
        });
      },
    },
  },
});
