export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);

		// http://localhost:8087/chapter-X/page-XYZ.png
		const match = url.pathname.match(/chapter-(\d+)\/page-(\d+)\.png$/);
		if (!match) {
			return new Response('Not Found', { status: 404 });
		}

		const chapter = match[1];
		const page = match[2];

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
	},
} satisfies ExportedHandler<Env>;
