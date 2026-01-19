import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  if (
    response.headers.get("content-type")?.includes("text/html") &&
    !context.url.pathname.startsWith("/api/")
  ) {
    const newResponse = new Response(response.body, response);

    if (context.url.pathname === "/") {
      newResponse.headers.set(
        "Cache-Control",
        "public, max-age=300, s-maxage=300, stale-while-revalidate=3600",
      );
    } else if (context.url.pathname.includes("/chapter-")) {
      newResponse.headers.set(
        "Cache-Control",
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800, immutable",
      );
    } else if (context.url.pathname.includes("/volume-")) {
      newResponse.headers.set(
        "Cache-Control",
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      );
    } else {
      newResponse.headers.set(
        "Cache-Control",
        "public, max-age=600, s-maxage=600, stale-while-revalidate=3600",
      );
    }

    return newResponse;
  }

  return response;
});
