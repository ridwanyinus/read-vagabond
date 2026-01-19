// src/pages/api/metadata.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      tankobon: 37,
      chapters: 327,
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
};
