import type { BuildConfig, CompressConfig } from "@bundlejs/core/src/index.ts";
import { deepAssign } from "@bundlejs/core/src/utils/deep-equal.ts";

import { parseShareURLQuery, parseConfig } from "./_parse-query.ts";

const inputModelResetValue = [
	'export * from "@okikio/animate";'
].join("\n");

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		try {
			const reqUrl = new URL(request.url);
			const url = new URL(reqUrl.pathname, "https://deno.bundlejs.com");

			const initialValue = parseShareURLQuery(url) || inputModelResetValue;
			const { init: _, entryPoints: _2, ascii: _3, ...initialConfig } = parseConfig(url) || {};
			
			const configObj: BuildConfig & CompressConfig = deepAssign({}, initialConfig, {
				entryPoints: ["/index.tsx"],
				esbuild: {
					treeShaking: true,
					metafile: url.searchParams.has("analysis") ||
						url.searchParams.has("metafile") ||
						Boolean(initialConfig?.analysis)
				},
				init: {
					platform: "browser",
					worker: false
				},
			} as BuildConfig);

			const _key = JSON.stringify({ ...(configObj as object), initialValue: initialValue.trim() });
			const result = await env.KV.get<{ type: string, value: string }>(_key, { type: "json" });
			if (result) {
				if (url.pathname === "/no-cache") {
					await env.KV.delete(_key);
					return new Response("Cleared cache!");
				}

				return new Response(result.value, {
					status: 200,
					headers: [
						['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
						['Content-Type', result.type]
					],
				})
			}

			const response = await fetch(url, {
				mode: 'no-cors'
			});
			const contentType = response.headers.get("Content-Type");
			const value = await response.text(); 

			await env.KV.put(_key, JSON.stringify({ type: contentType, value }), {
				expirationTtl: 86400
			})

			return new Response(value, {
				status: 200,
				headers: [
					['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
					['Content-Type', contentType!]
				],
			})
		} catch (e) {
			console.error(e)

			return new Response(
				JSON.stringify({ error: (e as Error).toString() }),
				{ status: 400, }
			)
		}
	},
};


/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	KV: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

