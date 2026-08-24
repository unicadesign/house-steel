import { createFileRoute } from "@tanstack/react-router";
import { ROBOT_SPEC } from "@/lib/protocol/spec";
import { PROTOCOL_VERSION, SAMPLE_HZ } from "@/lib/protocol/types";

export const Route = createFileRoute("/api/spec")({
  server: {
    handlers: {
      GET: async () =>
        Response.json({
          spec: ROBOT_SPEC,
          protocol: {
            v: PROTOCOL_VERSION,
            sampleHz: SAMPLE_HZ,
            keys: ["drive", "arm", "record", "play", "kill"],
          },
        }),
    },
  },
});
