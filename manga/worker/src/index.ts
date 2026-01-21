export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		const canCache = request.method === 'GET';
		if (canCache) {
			let response = await caches.default.match(request);
			if (response) {
				const newHeaders = new Headers(response.headers);
				return new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers: newHeaders,
				});
			}
		}

		// http://localhost:8087/volume-XY/chapter-X/page-XYZ
		const match_page = url.pathname.match(/volume-(\d+)\/chapter-(\d+)\/page-(\d+)$/);
		if (match_page) {
			const volume = String(parseInt(match_page[1])).padStart(2, '0');
			const chapter = String(parseInt(match_page[2])).padStart(3, '0');
			const page = String(parseInt(match_page[3])).padStart(3, '0');

			const object_png = await env.vagabond_manga_vizbig.get(`volume-${volume}/chapter-${chapter}/page-${page}.png`);
			if (object_png) {
				const response = new Response(object_png.body, {
					headers: {
						'Content-Type': 'image/png',
						'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=31536000, immutable',
						'Access-Control-Allow-Origin': '*',
					},
				});
				if (canCache) ctx.waitUntil(caches.default.put(request, response.clone()));

				return response;
			}

			const object_jpg = await env.vagabond_manga_vizbig.get(`volume-${volume}/chapter-${chapter}/page-${page}.jpg`);
			if (object_jpg) {
				const response = new Response(object_jpg.body, {
					headers: {
						'Content-Type': 'image/jpeg',
						'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=31536000, immutable',
						'Access-Control-Allow-Origin': '*',
					},
				});
				if (canCache) ctx.waitUntil(caches.default.put(request, response.clone()));
				return response;
			}

			return new Response('Not Found', { status: 404 });
		}

		// http://localhost:8087/volume-XY/cover
		const match_cover = url.pathname.match(/volume-(\d+)\/cover$/);
		if (match_cover) {
			const volume = String(parseInt(match_cover[1])).padStart(2, '0');

			const object = await env.vagabond_manga_vizbig.get(`covers/volume-${volume}.jpg`);
			if (!object) {
				return new Response('Not Found', { status: 404 });
			}

			const response = new Response(object.body, {
				headers: {
					'Content-Type': 'image/jpeg',
					'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=31536000, immutable',
					'Access-Control-Allow-Origin': '*',
				},
			});
			if (canCache) ctx.waitUntil(caches.default.put(request, response.clone()));
			return response;
		}

		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
