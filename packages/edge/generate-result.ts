import type { Redis } from "https://deno.land/x/upstash_redis/mod.ts";
import type { BundleResult } from "./bundle.ts";

import { bytesToBase64 } from "byte-base64";

import { LOGGER_INFO, dispatchEvent, getEsbuild, ansi } from "@bundlejs/core/src/index.ts";
import { getFile } from "./gist.ts";
import { headers } from "./mod.ts";
import styleText from "./style.ts";

export const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
})

export const docs = {
  docs: `/?docs - Takes you to some docs for the API`,
  examples: [
    "(new) /?badge or /?badge=detailed",
    "(new) /?badge-style=for-the-badge",
    "(new) /?badge-raster",
    "(new) /?file",
    "(new) /?polyfill",
    `(new) /?analysis or /?analyze=verbose`,
    "(new) /?metafile",
    `(new) /?minify=false`,
    `(new) /?sourcemap=inline`,
    `(new) /?format=iife`,
    `(new) /?warnings`,
    `(new) /?raw`,
    "~~~",
    `/?q=spring-easing,(import)@okikio/emitter,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,@okikio/animate,typescript@beta,vue,react`,
    `/?treeshake=[SpringEasing],[T],[{ animate }],[{ animate as B }],[* as TR],[{ type animate }],[*],[*],[*],[*]`,
    `/?text="export * as PR18 from \"@okikio/animate\";\nexport { animate as animate2 } from \"@okikio/animate\";"`,
    `/?share=MYewdgziA2CmB00QHMAUAiAwiG6CUQA`,
    `/?config={"cdn":"skypack","compression":"brotli","esbuild":{"format":"cjs","minify":false,"treeShaking":false}}`,
  ],
  basics: [
    `(new) /?badge - Generates a badge (if you want more details, set \`?badge=detailed\` you will get the uncompressed size and the mobules being bundled listed)`,
    `(new) /?badge-style - Various badge styles supported by http://shields.io (https://shields.io/#:~:text=PREFIX%3E%26suffix%3D%3CSUFFIX%3E-,Styles,-The%20following%20styles)`,
    `(new) /?badge-raster - The badge but as a png image`,
    `(new) /?file - Resulting bundled code(you can actually import this into your javascript file and start using it https://stackblitz.com/edit/vitejs-vite-iquaht?file=src%2Fmain.ts&terminal=dev)`,
    `(new) /?polyfill - Polyfill Node built-ins`,
    `(new) /?analysis or /?analyze - Esbuild generate visual analysis https://esbuild.github.io/api/#analyze`,
    `(new) /?metafile - Esbuild bundle metafile which can be used w / https://esbuild.github.io/analyze/ (hoping to have this built-in in the future)`,
    `(new) /?minify - Esbuild minify https://esbuild.github.io/api/#minify`,
    `(new) /?sourcemap - Esbuild sourcemap https://esbuild.github.io/api/#source-maps`,
    `(new) /?format - Esbuild format https://esbuild.github.io/api/#format`,
    `(new) /?warnings - Lists warning for a particular bundle`,
    `(new) /?raw - The raw result of the bundle (meant for experiments and/or testing)`,
    "~~~",
    `/?q or /?query - Represents the module, e.g. react, vue, etc... You can add (import) in-front of a specific module to make it an import instead of an export`,
    `/?treeshake - Represents the export/imports to treeshake. The treeshake syntax allows for specifying multiple exports per package (check the example above). The square brackets represent seperate packages, and everything inside the square brackets, are the exported methods, types, etc...`,
    `/?text - Represents the input code as a string (it's meant for short strings, we recommend using \`/?share\` for longer strings)`,
    `/?share - Represents \`compressed\` string version of the input code (it's used for large input code)`,
    `/?config - Represents the configurations to use when building the bundle (the docs cover the config in detail https://blog.okikio.dev/documenting-an-online-bundler-bundlejs#heading-configuration)`,
  ],
}

function sanitizeShieldsIO(str: string) {
  return str
    .replace(/\-/g, "--")
    .replace(/\_/g, "__")
    .replace(/\s/g, "_")
}

export async function generateResult(badgeKey: string, value: BundleResult, url: URL, redis: Redis, cached: boolean, duration: number) {
  const noCache = ["/no-cache", "/clear-cache", "/delete-cache"].includes(url.pathname);

  const analysisQuery = url.searchParams.has("analysis") ||
    url.searchParams.has("analyze");
  const metafileQuery = url.searchParams.has("metafile");
  const fileQuery = url.searchParams.has("file");
  const badgeQuery = url.searchParams.has("badge");
  const warningsQuery = url.searchParams.has("warnings") || url.searchParams.has("warning");
  const rawQuery = url.searchParams.has("raw");

  const badgeResult = url.searchParams.get("badge");
  const badgeStyle = url.searchParams.get("badge-style");

  const badgeRasterQuery = url.searchParams.has("badge-raster");

  if (badgeQuery) {
    const { size } = value;
    const detailedBadge = badgeResult?.includes("detail");
    const urlQuery = encodeURIComponent(`https://bundlejs.com/${url.search}`);
    const query = (url.searchParams.get("q") || url.searchParams.get("query")) ?? "spring-easing";
    const detailBadgeText = sanitizeShieldsIO(
      detailedBadge ? `${size.uncompressedSize} -> ` : ""
    );
    const detailBadgeName = sanitizeShieldsIO(
      `bundlejs${detailedBadge ? ` (${value.version ? value.version : value.versions?.join(", ") ?? query})` : ""}`
    );
    const imgUrl = new URL(
      `https://${badgeRasterQuery ? "raster.shields.io" : "img.shields.io"}/badge/${detailBadgeName}-${detailBadgeText}${sanitizeShieldsIO(`${size.compressedSize} (gzip)`)
      }-blue?cacheSeconds=60&link=${urlQuery}`
    );

    if (badgeStyle) { imgUrl.searchParams.append("style", badgeStyle); }
    dispatchEvent(LOGGER_INFO, imgUrl.href)

    const imgFetch = await fetch(imgUrl);
    if (!imgFetch.ok) return imgFetch;

    const imgShield = badgeRasterQuery ? new Uint8Array(await imgFetch.arrayBuffer()) : await imgFetch.text();
    await redis.set<string>(badgeKey, typeof imgShield === "string" ? imgShield : bytesToBase64(imgShield), { ex: 7200 })

    return new Response(imgShield, {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', `max-age=${noCache ? 30 : 7200}, s-maxage=30, public`],
        ['Content-Type', badgeRasterQuery ? "image/png" : 'image/svg+xml']
      ],
    })
  }

  if (fileQuery) {
    const { fileId } = value;
    const fileResult = fileId ? await getFile(fileId) ?? "" : "";
    if (!fileId) {
      throw new Error("The fileId was empty 🤔, hmm...maybe try again later, if this error persists please create an issue on https://github.com/okikio/bundlejs.")
    }
    return new Response(fileResult, {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', `max-age=${noCache ? 30 : 7200}, s-maxage=30, public`],
        ['Content-Type', 'text/javascript']
      ],
    })
  }

  if (analysisQuery && value.metafile) {
    const { analyzeMetafile } = await getEsbuild();

    const verboseAnlysis = (url.searchParams.get("analysis") || url.searchParams.get("analyze")) === "verbose";
    return new Response(
      generateHTMLMessages([
        ansi(
          (
            await analyzeMetafile(value.metafile, {
              color: true,
              verbose: verboseAnlysis
            })
          ) 
        )
      ]), 
      {
        status: 200,
        headers: [
          ...headers,
          ['Cache-Control', `max-age=${noCache ? 30 : 1800}, s-maxage=30, public`],
          ['Content-Type', 'text/html']
        ],
      }
    )
  }

  if (metafileQuery && value.metafile) {
    return new Response(JSON.stringify(value.metafile), {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', `max-age=${noCache ? 30 : 1800}, s-maxage=30, public`],
        ['Content-Type', 'application/json']
      ],
    })
  }

  if (warningsQuery) {
    return new Response(generateHTMLMessages(value.warnings ?? ["No warnings for this bundle"]),
      {
        status: 200,
        headers: [
          ...headers,
          ['Cache-Control', `max-age=30, s-maxage=30, public`],
          ['Content-Type', 'text/html']
        ]
      }
    )
  }

  if (rawQuery) {
    return new Response(JSON.stringify(value), {
      status: 200,
      headers: [
        ...headers,
        ['Cache-Control', `max-age=30, s-maxage=30, public`],
        ['Content-Type', 'application/json']
      ],
    });
  }

  const { metafile: _metafile, warnings: _warnings, ...usefulInfo } = value;
  const finalResult = {
    ...usefulInfo,
    ...(url.search === "" ? docs : ""),
    ...(
      cached ? {
        time: timeFormatter.format(duration / 1000, "seconds"),
        rawTime: duration
      } : {}
    )
  };
  
  return new Response(JSON.stringify(finalResult), {
    status: 200,
    headers: [
      ...headers,
      ['Cache-Control', 'max-age=7200, s-maxage=30, public'],
      ['Content-Type', 'application/json']
    ],
  })
}

export function generateHTMLMessages(msgs: string[]) {
  return [
    `<style>${styleText}</style>`,
    `<pre>${msgs.join("\n")}</pre>`
  ].join("");
}