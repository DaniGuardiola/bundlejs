import { TextEncoder as Encoder, TextDecoder as Decoder } from 'text-encoding-shim';

globalThis.TextEncoder = Encoder;
globalThis.TextDecoder = Decoder;

globalThis.performance = globalThis.performance ?? { now: Date.now };
globalThis.location = globalThis.location ?? new URL("http://localhost:3000/");

import wasmModule from '../../core/lib/esbuild.wasm?module';
;
import { build, setFile, deepAssign, useFileSystem, createConfig, compress } from "../../core/lib/index.mjs";
import { createNotice } from "../../core/lib/index.mjs";

import { parseShareURLQuery, parseConfig } from "./_parse-query.mjs";

import styleText from "./_style.mjs";

const FileSystem = useFileSystem();
const timeFormatter = new Intl.RelativeTimeFormat("en", {
	style: "narrow",
	numeric: "auto",
});

const inputModelResetValue = [
	'export * from "@okikio/animate";'
].join("\n");

export const config = {
	runtime: 'edge', // this is a pre-requisite
};

// import { ESBUILD_SOURCE_WASM } from "../../core/lib/index.mjs"
// let WASM_MODULE;
// let wasmModule;
export default async function handler(req) {
	try {
		const fs = await FileSystem;
		const start = performance.now();

		const url = new URL(req.url);
		console.log(url.href)

		if (url.pathname === "/favicon.ico")
			return Response.redirect("https://bundlejs.com/favicon/favicon.ico");

		const initialValue = parseShareURLQuery(url) || inputModelResetValue;
		const { init: _, entryPoints: _2, ascii: _3, ...initialConfig } = parseConfig(url) || {};

		setFile(fs, "/index.tsx", initialValue);

		const metafileQuery = url.searchParams.has("metafile");
		const analysisQuery = url.searchParams.has("analysis");

		const fileQuery = url.searchParams.has("file");
		const badgeQuery = url.searchParams.has("badge");

		const enableMetafile = analysisQuery ||
			metafileQuery ||
			Boolean(initialConfig?.analysis);

		const polyfillQuery = url.searchParams.has("polyfill");

		// if (!WASM_MODULE) WASM_MODULE = await ESBUILD_SOURCE_WASM();
		// if (!wasmModule) wasmModule = new WebAssembly.Module(WASM_MODULE);
		const configObj = deepAssign({
			polyfill: polyfillQuery,
			compression: createConfig("compress", initialConfig.compression)
		}, initialConfig, {
			entryPoints: ["/index.tsx"],
			esbuild: enableMetafile ? {
				metafile: enableMetafile
			} : {},
			init: {
				platform: "browser",
				worker: false,
				wasmModule
			},
		});
		console.log({ configObj })

		const result = await build(configObj, FileSystem);
		const end = performance.now();

		const headers = Object.entries({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET"
		})

		if (metafileQuery && result?.metafile) {
			return new Response(JSON.stringify(result.metafile), {
				status: 200,
				headers: [
					...headers,
					['Cache-Control', 'max-age=30, s-maxage=30, public'],
					['Content-Type', 'application/json']
				],
			})
		}

		if (fileQuery) {
			const fileBundle = result.contents[0];
			return new Response(fileBundle.contents, {
				status: 200,
				headers: [
					['Cache-Control', 'max-age=30, s-maxage=30, public'],
					['Content-Type', 'text/javascript']
				],
			})
		}

		const { content: _content, ...size } = await compress(result.contents.map((x) => x.contents), configObj.compression);

		if (badgeQuery) {
			const detailedBadge = url.searchParams.get("badge")?.includes("detail");
			const urlQuery = encodeURIComponent(`https://bundlejs.com/${url.search}`);
			const query = url.searchParams.get("q") ?? "@okikio/animate";
			console.log({
				q: query
			})
			const detailBadgeText = detailedBadge ?
				encodeURIComponent(`${size.uncompressedSize} `) + "-->" + encodeURIComponent(` `) :
				"";
			const detailBadgeName = `bundlejs${detailedBadge ? encodeURIComponent(` (${query})`) : ""
				}`;
			const imgUrl = new URL(
				`https://img.shields.io/badge/${detailBadgeName}-${detailBadgeText}${encodeURIComponent(`${size.compressedSize} (gzip)`)
				}-blue?link=${urlQuery}`
			);
			const badgeStyle = url.searchParams.get("badge-style");
			if (badgeStyle) {
				imgUrl.searchParams.append("style", badgeStyle);
			}
			const imgShield = await fetch(imgUrl.href).then(res => res.text());
			return new Response(imgShield, {
				status: 200,
				headers: [
					...headers,
					['Cache-Control', 'max-age=30, s-maxage=30, public'],
					['Content-Type', 'image/svg+xml']
				],
			})
		}

		const duration = (end - start) / 1000;
		const { init: _init, ...printableConfig } = createConfig("build", configObj);
		return new Response(JSON.stringify({
			query: decodeURIComponent(url.search),
			rawQuery: encodeURIComponent(url.search),
			config: printableConfig,
			input: initialValue,
			size,
			time: timeFormatter.format(duration, "seconds"),
			rawTime: duration * 1000,
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
			...(result?.warnings?.length > 0 ? { warnings: [...await createNotice(result.warnings, "warning", false)] } : {})
		}), {
			status: 200,
			headers: [
				...headers,
				['Cache-Control', 'max-age=30, s-maxage=30, public'],
				['Content-Type', 'application/json']
			],
		})
	} catch (e) {
		console.error(e)

		if (e && typeof e === "object" && "msgs" in e) {
			try {
				// console.log("Reached error", styleText)
				return new Response([
					`<style>${styleText}</style>`,
					`<pre>${(e.msgs).join("\n")}</pre>`
				].join(""),
					{
						status: 404,
						headers: [
							['Content-Type', 'text/html']
						]
					}
				)
			} catch (e) {
				console.log({ msgsError: e })
			}
		}

		return new Response(
			JSON.stringify({ error: (e).toString() }),
			{ status: 400, }
		)
	}
}