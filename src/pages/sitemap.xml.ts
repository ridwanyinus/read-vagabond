import type { APIRoute } from "astro";
import { getVolumes, getMetadata } from "../lib/db";

export const prerender = true;

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

export const GET: APIRoute = async ({ locals }) => {
  const db = locals.runtime?.env?.vagabond_db;
  if (!db) {
    return new Response("Database not configured", { status: 500 });
  }

  const siteUrl = "https://readbagabondo.com";
  const metadata = await getMetadata(db);
  const volumes = await getVolumes(db);

  const urls: SitemapUrl[] = [];

  // Homepage
  urls.push({
    loc: `${siteUrl}/`,
    lastmod: new Date().toISOString().split("T")[0],
    changefreq: "weekly",
    priority: "1.0",
  });

  // Volume pages
  for (const volume of volumes) {
    urls.push({
      loc: `${siteUrl}/volume-${volume.volume}`,
      lastmod: new Date().toISOString().split("T")[0],
      changefreq: "monthly",
      priority: "0.8",
    });

    // Chapter pages for this volume
    for (let i = volume.first_chapter; i <= volume.last_chapter; i++) {
      urls.push({
        loc: `${siteUrl}/volume-${volume.volume}/chapter-${i}`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: "0.7",
      });
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
