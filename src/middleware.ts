import { defineMiddleware } from "astro:middleware";

// Cache everything. readbagabondo.com is a static site, so we can cache everything without worrying about dynamic content.
// This will significantly improve the performance of the site, especially for repeat visitors.
// We can also set different cache durations for different types of content (e.g., longer for chapter pages, shorter for the homepage).

export const onRequest = defineMiddleware(async (context, next) => {
  const cache = context.locals.runtime.caches.default;

  const cachedResponse = await cache.match(context.url.href);
  if (cachedResponse) {
    return new Response(cachedResponse.body as any, {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers: new Headers(cachedResponse.headers as any),
    });
  }

  const response = await next();

  if (response.status !== 200) {
    return response;
  }

  const newResponse = new Response(response.body, response);

  if (context.url.pathname === "/") {
    // 1 week
    newResponse.headers.set(
      "Cache-Control",
      "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    );
  } else if (context.url.pathname.includes("/chapter-")) {
    // 1 month
    newResponse.headers.set(
      "Cache-Control",
      "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=31536000, immutable",
    );
  } else if (context.url.pathname.includes("/volume-")) {
    // 1 week
    newResponse.headers.set(
      "Cache-Control",
      "public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000, immutable",
    );
  } else {
    // 1 week
    newResponse.headers.set(
      "Cache-Control",
      "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    );
  }

  await cache.put(context.url.href, newResponse.clone() as any);
  return newResponse;
});
