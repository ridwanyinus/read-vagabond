// src/pages/api/mihon/mangas.ts
import type { APIRoute } from "astro";
import data from "../data.json";

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id || Number(id) > data.length) {
    return new Response(JSON.stringify({ error: "Manga not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data.find((manga) => manga.id === id)), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
};
