import type { BuildConfig, CompressConfig, CompressionOptions } from "@bundlejs/core/src/index.ts";
import { deepAssign } from "@bundlejs/core/src/utils/deep-equal.ts";
import { compressToBase64, decompressFromBase64 } from "@bundlejs/core/src/utils/lz-string.ts";

import { parseShareURLQuery, parseConfig } from "./_parse-query.ts";

const timeFormatter = new Intl.RelativeTimeFormat("en", {
	style: "narrow",
	numeric: "auto",
});

const inputModelResetValue = [
	'export * from "@okikio/animate";'
].join("\n");

/**
 * Default compress config
 */
export const COMPRESS_CONFIG: CompressionOptions = {
	type: "gzip",
	quality: 9
}; 

export function createConfig<T extends "compress", O extends CompressConfig>(type: T, opts?: O) {
	if (type == "compress") {
		return deepAssign({}, COMPRESS_CONFIG, typeof opts == "string" ? { type: opts } : opts) as CompressionOptions;
	}
}

const docs = {
	examples: [
		"(new) /?badge or /?badge=detailed",
		"(new) /?badge-style=for-the-badge",
		"(new) /?file",
		"(new) /?metafile",
		"(new) /?polyfill",
		`/?q=(import)@okikio/emitter,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,@okikio/animate,typescript@beta,vue,react`,
		`/?treeshake=[T],[{ animate }],[{ animate as B }],[* as TR],[{ type animate }],[*],[*],[*],[*]`,
		`/?text="export * as PR18 from \"@okikio/animate\";\nexport { animate as animate2 } from \"@okikio/animate\";"`,
		`/?share=MYewdgziA2CmB00QHMAUAiAwiG6CUQA`,
		`/?config={"cdn":"skypack","compression":"brotli","esbuild":{"format":"cjs","minify":false,"treeShaking":false}}`,
	],
	docs: [
		`(new) /?badge - Generates a badge (if you want more details, set \`?badge=detailed\` you will get the uncompressed size and the mobules being bundled listed)`,
		`(new) /?badge-style - Various badge styles supported by http://shields.io (https://shields.io/#:~:text=PREFIX%3E%26suffix%3D%3CSUFFIX%3E-,Styles,-The%20following%20styles)`,
		`(new) /?file - Resulting bundled code(you can actually import this into your javascript file and start using it https://stackblitz.com/edit/vitejs-vite-iquaht?file=src%2Fmain.ts&terminal=dev)`,
		`(new) /?metafile - Esbuild bundle metafile which can be used w / https://esbuild.github.io/analyze/ (hoping to have this built-in in the future)`,
		`(new) /?polyfill - Polyfill Node built-ins`,
		`/?q or /?query - Represents the module, e.g. react, vue, etc... You can add (import) in-front of a specific module to make it an import instead of an export`,
		`/?treeshake - Represents the export/imports to treeshake. The treeshake syntax allows for specifying multiple exports per package (check the example above). The square brackets represent seperate packages, and everything inside the square brackets, are the exported methods, types, etc...`,
		`/?text - Represents the input code as a string (it's meant for short strings, we recommend using \`/?share\` for longer strings)`,
		`/?share - Represents \`compressed\` string version of the input code (it's used for large input code)`,
		`/?config - Represents the configurations to use when building the bundle (the docs cover the config in detail https://blog.okikio.dev/documenting-an-online-bundler-bundlejs#heading-configuration)`,
	],
}

const headers = Object.entries({
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET"
})

async function generateResult(_jsonKey: string, _badgeKey: string, value: Record<string, any>, url: URL, env: Env, cached: boolean, duration: number) { 
	const metafileQuery = url.searchParams.has("metafile");
	const fileQuery = url.searchParams.has("file");
	const badgeQuery = url.searchParams.has("badge");
	const badgeResult = url.searchParams.get("badge");
	
	if (metafileQuery && value.metafile) {
		return new Response(JSON.stringify(value.metafile), {
			status: 200,
			headers: [
				...headers,
				['Cache-Control', 'max-age=30, s-maxage=30, public'],
				['Content-Type', 'application/json']
			],
		})
	}

	if (fileQuery) {
		const fileBundle = decompressFromBase64(value.file);
		return new Response(fileBundle, {
			status: 200,
			headers: [
				['Cache-Control', 'max-age=30, s-maxage=30, public'],
				['Content-Type', 'text/javascript']
			],
		})
	}

	if (badgeQuery) {
		const { size } = value as {
			size: {
				"type": string,
				"rawUncompressedSize": number,
				"uncompressedSize": string,
				"rawCompressedSize": number,
				"compressedSize": string,
				"size": string
			}
		}; 
		const detailedBadge = badgeResult?.includes("detail");
		const urlQuery = encodeURIComponent(`https://bundlejs.com/${url.search}`);
		const query = url.searchParams.get("q") ?? "@okikio/animate";
		const detailBadgeText = detailedBadge ?
			`${encodeURIComponent(`${size.uncompressedSize} `)}-->${encodeURIComponent(` `)}` :
			"";
		const detailBadgeName = `bundlejs${detailedBadge ? encodeURIComponent(` (${query})`) : ""}`;
		const imgUrl = new URL(
		`https://img.shields.io/badge/${detailBadgeName}-${detailBadgeText}${
				encodeURIComponent(`${size.compressedSize} (gzip)`)
			}-blue?link=${urlQuery}`
		);
		const badgeStyle = url.searchParams.get("badge-style");
		if (badgeStyle) {
			imgUrl.searchParams.append("style", badgeStyle);
		}
		const imgShield = await fetch(imgUrl).then(res => res.text());
		await env.BADGEKV.put(_badgeKey, imgShield, {
			expirationTtl: 7200
		})

		return new Response(imgShield, {
			status: 200,
			headers: [
				...headers,
				['Cache-Control', 'max-age=30, s-maxage=30, public'],
				['Content-Type', 'image/svg+xml']
			],
		})
	}

	const { file: _file, metafile: _metafile, ...usefulInfo } = value; 
	return new Response(JSON.stringify({
		...usefulInfo,
		...docs,
		...(
			cached ? {
			time: timeFormatter.format(duration / 1000, "seconds"),
			rawTime: duration
			} : {}
		)
	}), {
		status: 200,
		headers: [
			...headers,
			['Cache-Control', 'max-age=30, s-maxage=30, public'],
			['Content-Type', 'application/json']
		],
	})
}

export default {
	async fetch(
		request: Request,
		env: Env
	): Promise<Response> {
		try {
			const url = new URL(request.url);			
			url.hostname = "bundlejs.deno.dev";
			console.log(url.href)

			if (url.pathname === "/clear-all-cache-123") {
				const { keys: jsonKeys } = await env.JSONKV.list();
				await Promise.allSettled(jsonKeys.map(({ name }) => {
					return env.JSONKV.delete(name)
				}))

				const { keys: badgeKeys } = await env.BADGEKV.list();
				await Promise.allSettled(badgeKeys.map(({ name }) => {
					return env.BADGEKV.delete(name)
				}))

				return new Response("Cleared entire cache...careful now.")
			}

			if (url.pathname === "/favicon.ico") 
				return Response.redirect("https://bundlejs.com/favicon/favicon.ico");

			const initialValue = parseShareURLQuery(url) || inputModelResetValue;
			const { init: _, entryPoints: _2, ascii: _3, ...initialConfig } = parseConfig(url) || {};

			const metafileQuery = url.searchParams.has("metafile");
			const analysisQuery = url.searchParams.has("analysis");

			const polyfill = url.searchParams.has("polyfill");
			const enableMetafile = analysisQuery ||
				metafileQuery ||
				Boolean(initialConfig?.analysis);
			
			const configObj: BuildConfig & CompressConfig = deepAssign({ 
				polyfill,
				compression: createConfig("compress", initialConfig.compression)
			}, initialConfig, {
				entryPoints: ["/index.tsx"],
				esbuild: enableMetafile ? {
					metafile: enableMetafile
				} : {},
				init: {
					platform: "deno-wasm",
					worker: false
				},
			} as BuildConfig);
			console.log(configObj)

			const _jsonKey = compressToBase64(
				JSON.stringify({ 
					...(configObj as object), 
					initialValue: initialValue.trim(), 
				}).trim()
			).slice(0, 512 - 1);

			const badgeResult = url.searchParams.get("badge");
			const _badgeKey = compressToBase64(
				JSON.stringify({ 
					_jsonKey,
					badgeResult
				}).trim()
			).slice(0, 512 - 1);

			if (url.pathname === "/delete-cache") {
				try {
					await Promise.all([
						env.JSONKV.delete(_jsonKey),
						env.BADGEKV.delete(_badgeKey)
					])
					return new Response("Deleted from cache!");
				} catch (e) {
					console.warn(e);
					return new Response("Error, deleting from cache");
				}
			}

			if (url.pathname !== "/no-cache") {
				const BADGEResult = await env.BADGEKV.get(_badgeKey, "text");
				if (BADGEResult) {
					return new Response(BADGEResult, {
						status: 200,
						headers: [
							...headers,
							['Cache-Control', 'max-age=3600, s-maxage=30, public'],
							['Content-Type', 'application/json']
						],
					})
				}

				const start = Date.now();
				const JSONResult = await env.JSONKV.get<Record<string, any>>(_jsonKey, "json");
				if (JSONResult) {
					return await generateResult(_jsonKey, _badgeKey, JSONResult, url, env, true, Date.now() - start);
				}
			}

			const start = Date.now();
			const response = await fetch(url, { });

			if (!response.ok) {
				const headers = response.headers;
				const status = response.status;
				// @ts-ignore
				return new Response(await response.arrayBuffer(), {
					headers,
					status
				});
			}

			const value: Record<string, any> = await response.json();
			await env.JSONKV.put(_jsonKey, compressToBase64(JSON.stringify(value)), {
				expirationTtl: 86400
			})

			return await generateResult(_jsonKey, _badgeKey, value, url, env, false, Date.now() - start);
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
	JSONKV: KVNamespace;
	BADGEKV: KVNamespace;
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

