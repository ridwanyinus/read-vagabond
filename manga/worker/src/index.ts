export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		// http://localhost:8087/volume-XY/cover.jpg
		const match_volume = url.pathname.match(/volume-(\d+)\/cover\.jpg$/);

		// http://localhost:8087/chapter-X/page-XYZ.png
		const match_page = url.pathname.match(/chapter-(\d+)\/page-(\d+)\.png$/);

		if (match_volume) {
			const volume = match_volume[1];

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
		} else if (match_page) {
			const chapter = match_page[1];
			const page = match_page[2];

			const object = await env.manga.get(`chapter-${chapter}/page-${page}.png`);
			if (!object) {
				return new Response('Not Found', { status: 404 });
			}

			return new Response(object.body, {
				headers: {
					'Content-Type': 'image/png',
					'Cache-Control': 'public, max-age=31536000, immutable',
					'Access-Control-Allow-Origin': '*',
				},
			});
		} else {
			return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
