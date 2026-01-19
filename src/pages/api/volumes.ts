// src/pages/api/volumes.ts
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

    // Query to get volume data with chapter count and release date
    const volumes = await db
      .prepare(
        `
        SELECT
          volume,
          MIN(release_date) as release_date,
          COUNT(*) as chapter_count,
          MIN(number) as first_chapter,
          MAX(number) as last_chapter
        FROM chapters
        WHERE volume IS NOT NULL
        GROUP BY volume
        ORDER BY volume ASC
      `,
      )
      .all();

    return new Response(JSON.stringify(volumes.results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch volumes",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
