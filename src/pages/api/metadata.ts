// src/pages/api/metadata.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      tankobon: 37,
      chapters: 327,
    }),
  );
};
