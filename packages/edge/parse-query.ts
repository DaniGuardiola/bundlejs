import { deepAssign, lzstring } from "@bundlejs/core";

const { decompressFromURL } = lzstring;

/**
 * Treeshake exports/imports. It allows for specifing multiple exports per package, through this syntax
 * ```ts
 * "[{ x,y,z }],[*],[* as X],[{ type xyz }]" 
 * // to
 * export { x, y, z } from "...";
 * export * from "...";
 * export * as X from "...";
 * export { type xyz } from "...";
 * ```
 * where the square brackets represent seperate packages, and everything inside the squarebrackets,
 * are the exported methods, types, etc...
 */
export const parseTreeshakeExports = (str: string) =>
  (str ?? "").split(/\],/).map((str) => str.replace(/\[|\]/g, ""));

/**
 * Get cleaned up module name
 * e.g. "@okikio/animate" -> okikioAnimate
 */
export const getModuleName = (str: string) => 
  str.split(/(?:-|_|\/)/g)
    .map((x, i) => i > 0 && x.length > 0 ? (x[0].toUpperCase() + x.slice(1)) : x)
    .join("")
    .replace(/[^\w\s]/gi, "")

// Inspired by https://github.com/solidjs/solid-playground
/**
* Converts URL's into code. It allows for specifing multiple exports per package, through this syntax
* ```ts
* "/?q=(import)@okikio/emitter,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,(import)@okikio/animate,@okikio/animate,@okikio/animate,@okikio/animate,@okikio/animate&treeshake=[T],[{+animate+}],[{+animate+as+B+}],[*+as+TR],[{+type+animate+}],[*],[{+animate+as+A+}],[*+as+PR],[{+animate+}]&share=MYewdgziA2CmB00QHMAUAiAwiG6CUQA" 
* // to
* // Click Build for the Bundled, Minified & Gzipped package size
* import T from "@okikio/emitter";
* import { animate } from "@okikio/animate";
* import { animate as B } from "@okikio/animate";
* import * as TR from "@okikio/animate";
* import { type animate } from "@okikio/animate";
* export * from "@okikio/animate";
* export { animate as A } from "@okikio/animate";
* export * as PR from "@okikio/animate";
* export { animate } from "@okikio/animate";
* console.log("Cool")
* ```
* - `q` represents the module, e.g. react, vue, etc... You can add `(import)` in-front of a specific module to make it an import instead of an export
* - `treeshake` represents the exports to treeshake. Read more about this here, {@link parseTreeshakeExports}
* - `share` represents all other code that isn't export/import
*/
export const parseShareURLQuery = (shareURL: URL) => {
  try {
    const counts = new Map<string, number>();
    const searchParams = shareURL.searchParams;
    let result = "";
    const query = searchParams.get("query") || searchParams.get("q");
    const treeshake = searchParams.get("treeshake");
    if (query) {
      const queryArr = query.trim().split(",");
      const treeshakeArr = parseTreeshakeExports((treeshake ?? "").trim());
      const queryArrLen = queryArr.length;
      result += (
        "// Click Build for the Bundled, Minified & Compressed package size\n" +
        queryArr
          .map((q, i) => {
            const treeshakeExports =
              treeshakeArr[i] && treeshakeArr[i].trim() !== "*"
                ? treeshakeArr[i].trim().split(",").join(", ")
                : "*";
            const [, ,
              declaration = "export",
              module
            ] = /^(\((.*)\))?(.*)/.exec(q)!;
            console.log({
              declaration,
              treeshakeExports,
              module,
              treeshakeArr,
              queryArrLen,
              i
            })

            if (!(counts.has(module))) counts.set(module, 0);
            const count = (counts.set(module, counts.get(module)! + 1).get(module)! - 1);
            const countStr = count <= 0 ? "" : count;
            
            return `${declaration} ${treeshakeExports}${treeshakeExports === "*" && !treeshakeArr[i] && queryArrLen > 0 ? ` as ${getModuleName(module + countStr)}` : ""} from ${JSON.stringify(
              module
            )};`;
          })
          .join("\n")
      );
      if (queryArr.length === 1 && (treeshake ?? "").trim().length <= 0) {
        const [, ,
          declaration = "export",
          module
        ] = /^(\((.*)\))?(.*)/.exec(queryArr[0])!;

        if (!(counts.has(module))) counts.set(module, 0);
        const count = counts.get(module)! - 1;
        const countStr = count <= 0 ? "" : count;
        // countStr

        result += `\n${declaration} { default ${declaration === "import" ? `as ${getModuleName(module + "Default" + countStr)} ` : "" }} from ${JSON.stringify(
          module
        )};`;
      }
    }

    const share = searchParams.get("share");
    if (share) result += "\n" + decompressFromURL(share.trim());

    const plaintext = searchParams.get("text");
    if (plaintext) {
      result += "\n" + JSON.parse(
        /**    
         * Support users wrapping/not-wrapping plaintext in a string, 
         * e.g. 
         * ```md
         * 
         * 
         * /?text="console.log(document)\nconsole.log(window)"
         * and
         * /?text=console.log(document)\nconsole.log(window)
         * 
         * 
         * are the same, they result in 
         * ```ts
         * console.log(document)
         * console.log(window)
         * ```
        */
        /^["']/.test(plaintext) && /["']$/.test(plaintext) ? plaintext : JSON.stringify("" + plaintext).replace(/\\\\/g, "\\")
      );
    }

    return result.trim();
  } catch (e) { 
    console.warn(e);
  }
};


/**
* Converts URL's into config. 
* - `config` represents the JSON config
*/
export const parseConfig = (shareURL: URL) => {
  try {
    const searchParams = shareURL.searchParams;
    const config = searchParams.get("config") ?? "{}";
    return deepAssign({}, JSON.parse(config ? config : "{}"));
  } catch (e) { 
    console.warn(e);
  }
};