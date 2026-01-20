// src/pages/api/mihon/manga.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      title: "Vagabond",
      author: "Takehiko Inoue",
      artist: "Takehiko Inoue",
      description:
        "Striving for enlightenment by way of the sword, Miyamoto Musashi is prepared to cut down anyone who stands in his way. Vagabond is an action-packed portrayal of the life and times of the quintessential warrior-philosopher—the most celebrated samurai of all time!",
      status: "hiatus",
      cover: "https://manga.readbagabondo.com/volume-37/cover",
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
