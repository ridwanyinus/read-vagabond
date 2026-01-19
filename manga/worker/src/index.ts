export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		// http://localhost:8087/volume-XY/chapter-X/page-XYZ
		const match_page = url.pathname.match(/volume-(\d+)\/chapter-(\d+)\/page-(\d+)$/);
		if (match_page) {
			const volume = match_page[1];
			const chapter = match_page[2];
			const page = match_page[3];

			const object_png = await env.vagabond_manga_vizbig.get(`volume-${volume}/chapter-${chapter}/page-${page}.png`);
			if (object_png) {
				return new Response(object_png.body, {
					headers: {
						'Content-Type': 'image/png',
						'Cache-Control': 'public, max-age=31536000, immutable',
						'Access-Control-Allow-Origin': '*',
					},
				});
			}

			const object_jpg = await env.vagabond_manga_vizbig.get(`volume-${volume}/chapter-${chapter}/page-${page}.jpg`);
			if (object_jpg) {
				return new Response(object_jpg.body, {
					headers: {
						'Content-Type': 'image/jpg',
						'Cache-Control': 'public, max-age=31536000, immutable',
						'Access-Control-Allow-Origin': '*',
					},
				});
			}

			return new Response('Not Found', { status: 404 });
		}

		// http://localhost:8087/volume-XY/cover
		const match_cover = url.pathname.match(/volume-(\d+)\/cover$/);
		if (match_cover) {
			const volume = match_cover[1];

			const object = await env.vagabond_manga_hq.get(`volume-${volume}/cover.jpg`);
			if (!object) {
				return new Response('Not Found', { status: 404 });
			}

			return new Response(object.body, {
				headers: {
					'Content-Type': 'image/jpg',
					'Cache-Control': 'public, max-age=31536000, immutable',
					'Access-Control-Allow-Origin': '*',
				},
			});
		}

		return new Response('Not Found', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
