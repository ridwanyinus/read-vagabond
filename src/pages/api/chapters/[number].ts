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
      headers: { "Content-Type": "application/json" },
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
