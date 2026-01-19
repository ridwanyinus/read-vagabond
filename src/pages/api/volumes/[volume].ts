// src/pages/api/volumes/[volume].ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, locals }) => {
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

    const volumeNumber = params.volume;

    // Get volume metadata
    const volumeData = await db
      .prepare(
        `SELECT 
          volume,
          MIN(number) as first_chapter,
          MAX(number) as last_chapter,
          COUNT(*) as chapter_count,
          MIN(release_date) as release_date
        FROM chapters 
        WHERE volume = ?
        GROUP BY volume`,
      )
      .bind(volumeNumber)
      .first();

    if (!volumeData) {
      return new Response(JSON.stringify({ error: "Volume not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get chapters for this volume
    const chapters = await db
      .prepare(
        "SELECT number, title, description, release_date FROM chapters WHERE volume = ? ORDER BY number ASC",
      )
      .bind(volumeNumber)
      .all();

    return new Response(
      JSON.stringify({
        volume: volumeData,
        chapters: chapters.results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch volume data",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
