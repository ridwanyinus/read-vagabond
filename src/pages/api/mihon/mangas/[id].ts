// src/pages/api/mihon/mangas.ts
import type { APIRoute } from "astro";
import data from "../data.json";

export const GET: APIRoute = async ({ locals, params }) => {
  const { id } = params;

  const manga = data.find((manga) => manga.id === id);
  if (!manga) {
    return new Response(JSON.stringify({ error: "Manga not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = locals.runtime?.env?.vagabond_db;
  const { results: chapters } = await db
    .prepare("SELECT * FROM chapters ORDER BY number ASC")
    .all();

  return new Response(JSON.stringify({ ...manga, chapters }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
};
