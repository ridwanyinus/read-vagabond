// src/pages/api/mihon/mangas.ts
import type { APIRoute } from "astro";
import data from "./data.json";

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
};
