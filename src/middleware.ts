import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  if (
    response.headers.get("content-type")?.includes("text/html") &&
    !context.url.pathname.startsWith("/api/")
  ) {
    const newResponse = new Response(response.body, response);

    if (context.url.pathname === "/") {
      // 1 hour cache, 1 day stale-while-revalidate
      newResponse.headers.set(
        "Cache-Control",
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      );
    } else if (context.url.pathname.includes("/chapter-")) {
      // 30 days cache
      newResponse.headers.set(
        "Cache-Control",
        "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=31536000, immutable",
      );
    } else if (context.url.pathname.includes("/volume-")) {
      // 7 days cache, 30 days stale-while-revalidate
      newResponse.headers.set(
        "Cache-Control",
        "public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000, immutable",
      );
    } else {
      // 1 day cache, 7 days stale-while-revalidate
      newResponse.headers.set(
        "Cache-Control",
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      );
    }

    return newResponse;
  }

  return response;
});
