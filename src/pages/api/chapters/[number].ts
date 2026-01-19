// src/pages/api/chapters.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ locals, params }) => {
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

    const { number } = params;

    const chapter = await db
      .prepare("SELECT * FROM chapters WHERE number = ?")
      .bind(number)
      .first();

    return new Response(JSON.stringify(chapter), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800, immutable",
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
