// src/pages/api/chapters.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals }) => {
  try {
    const db = locals.runtime?.env?.vagabond_db;

    if (!db) {
      return new Response(
        JSON.stringify({ error: "Database not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const chapters = await db
      .prepare("SELECT * FROM chapters ORDER BY number ASC")
      .all();

    return new Response(JSON.stringify(chapters.results), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch chapters",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
