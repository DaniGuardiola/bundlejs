import type { CommonConfigOptions, ESBUILD, ROLLUP } from "./types";

import { VIRTUAL_FS } from "./plugins/virtual-fs";
import { EXTERNAL } from "./plugins/external";
import { ALIAS } from "./plugins/alias";
import { HTTP } from "./plugins/http";
import { CDN } from "./plugins/cdn";

import { EVENTS } from "./configs/events";
import { createConfig } from "./configs/config";
import { PLATFORM_AUTO } from "./configs/platform";
import { createState, getState, setState } from "./configs/state";

import { FileSystem, getFile, setFile, getResolvedPath } from "./utils/filesystem";
import { createNotice } from "./utils/create-notice";
import { DEFAULT_CDN_HOST } from "./utils/util-cdn";
import { init } from "./init";

/**
 * Local state available to all plugins
 */
export type LocalState = {
  /**
   * Assets are files during the build process that esbuild can't handle natively, 
   * e.g. fetching web workers using the `new URL("...", import.meta.url)`
   */
  assets?: ESBUILD.OutputFile[],

  /**
   * Array storing the [getter, setter] of the global state
   */
  GLOBAL?: [typeof getState, typeof setState],

  [key: string]: any
}

export type BuildConfig = CommonConfigOptions & {
  /** Enable using rollup for treeshaking. Only works while the `esbuild.treeShaking` option is true */
  rollup?: ROLLUP.OutputOptions | boolean,

  /** esbuild config options https://esbuild.github.io/api/#build-api */
  esbuild?: ESBUILD.BuildOptions,

  /** The default CDN to import packages from */
  cdn?: "https://unpkg.com" | "https://esm.run" | "https://cdn.esm.sh" | "https://cdn.esm.sh" | "https://cdn.skypack.dev" | "https://cdn.jsdelivr.net/npm" | "https://cdn.jsdelivr.net/gh" | "https://deno.land/x" | "https://raw.githubusercontent.com" | "unpkg" | "esm.run" | "esm.sh" | "esm" | "skypack" | "jsdelivr" | "jsdelivr.gh" | "github" | "deno" | (string & {}),

  /** Aliases for replacing packages with different ones, e.g. replace "fs" with "memfs", so, it can work on the web, etc... */
  alias?: Record<string, string>,

  /**
   * Enables converting ascii logs to HTML so virtual consoles can handle the logs and print with color
   */
  ascii?: "html" | "html-and-ascii" | "ascii",

  /**
   * A virtual file system where you can input files, get, set and read files
   */
  filesystem?: {
    /** Virtual Filesystem Storage */
    files?: typeof FileSystem,

    /**
     * Retrevies file from virtual file system storage in either string or uint8array buffer format
     * 
     * @param path path of file in virtual file system storage
     * @param type format to retrieve file in, buffer and string are the 2 option available
     * @param importer an absolute path to use to determine a relative file path
     * @returns file from file system storage in either string format or as a Uint8Array buffer
     */
    get?: typeof getFile,

    /**
     * Writes file to filesystem in either string or uint8array buffer format
     * 
     * @param path path of file in virtual file system storage
     * @param content contents of file to store, you can store buffers and/or strings
     * @param importer an absolute path to use to determine a relative file path
     */
    set?: typeof setFile,

    /**
     * Resolves path to a file in the virtual file system storage 
     * 
     * @param path the relative or absolute path to resolve to
     * @param importer an absolute path to use to determine relative file paths
     * @returns resolved final path
     */
    resolve?: typeof getResolvedPath,

    /**
     * Clear all files from the virtual filesystem storage
     */
    clear?: typeof FileSystem.clear,
  },

  /**
   * Documentation: https://esbuild.github.io/api/#entry-points
   */
  entryPoints?: ESBUILD.BuildOptions["entryPoints"]
};

/**
 * Default build config
 */
export const BUILD_CONFIG: BuildConfig = {
  "entryPoints": ["/index.tsx"],
  "cdn": DEFAULT_CDN_HOST,

  "esbuild": {
    "color": true,
    "globalName": "BundledCode",

    "logLevel": "info",
    "sourcemap": false,
    "incremental": false,

    "target": ["esnext"],
    "format": "esm",
    "bundle": true,
    "minify": true,

    "treeShaking": true,
    "platform": "browser"
  },

  "ascii": "ascii",
  filesystem: {
    files: FileSystem,
    get: getFile,
    set: setFile,
    resolve: getResolvedPath,
    clear: () => FileSystem.clear(),
  },
  init: {
    platform: PLATFORM_AUTO
  }
};

export type BuildResult = (ESBUILD.BuildResult | ESBUILD.BuildIncremental) & {
  outputs: ESBUILD.OutputFile[];
  contents: ESBUILD.OutputFile[];
};

export async function build(opts: BuildConfig = {}): Promise<BuildResult> {
  if (!getState("initialized"))
    EVENTS.emit("init.loading");

  const CONFIG = createConfig("build", opts);
  const STATE = createState<LocalState>({ assets: [], GLOBAL: [getState, setState] });
  const [get] = STATE;

  const { platform, ...initOpts } = CONFIG.init ?? {};
  const { build: bundle } = await init(platform, initOpts);
  const { define = {}, loader = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};

  // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
  let outputs: ESBUILD.OutputFile[] = [];
  let contents: ESBUILD.OutputFile[] = [];
  let result: ESBUILD.BuildResult | ESBUILD.BuildIncremental;

  try {
    try {
      const key = `p.env.NODE_ENV`.replace("p.", "process.");
      result = await bundle({
        entryPoints: CONFIG?.entryPoints ?? [],
        loader: {
          '.png': 'file',
          '.jpeg': 'file',
          '.ttf': 'file',
          '.svg': 'text',
          '.html': 'text',
          '.scss': 'css'
        },
        define: {
          "__NODE__": `false`,
          [key]: `"production"`,
          ...define
        },
        write: false,
        outdir: "/",
        plugins: [
          ALIAS(EVENTS, STATE, CONFIG),
          EXTERNAL(EVENTS, STATE, CONFIG),
          HTTP(EVENTS, STATE, CONFIG),
          CDN(EVENTS, STATE, CONFIG),
          VIRTUAL_FS(EVENTS, STATE, CONFIG),
        ],
        ...esbuildOpts,
      });
    } catch (e) {
      if (e.errors) {
        // Log errors with added color info. to the virtual console
        const asciMsgs = [...await createNotice(e.errors, "error", false)];
        const htmlMsgs = [...await createNotice(e.errors, "error")];

        EVENTS.emit("logger.error", asciMsgs, htmlMsgs);

        const message = (htmlMsgs.length > 1 ? `${htmlMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
        EVENTS.emit("logger.error", message);
        return;
      } else throw e;
    }

    // Create an array of assets and actual output files, this will later be used to calculate total file size
    outputs = await Promise.all(
      [...get()["assets"]]
        .concat(result?.outputFiles as ESBUILD.OutputFile[])
    );

    contents = await Promise.all(
      outputs
        ?.map(({ path, text, contents }): ESBUILD.OutputFile => {
          if (/\.map$/.test(path))
            return null;

          // For debugging reasons, if the user chooses verbose, print all the content to the Shared Worker console
          if (esbuildOpts?.logLevel == "verbose") {
            const ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
            if (ignoreFile) {
              EVENTS.emit("logger.log", "Output File: " + path);
            } else {
              EVENTS.emit("logger.log", "Output File: " + path + "\n" + text);
            }
          }

          return { path, text, contents };
        })

        // Remove null output files
        ?.filter(x => ![undefined, null].includes(x))
    );

    // Ensure a fresh filesystem on every run
    // FileSystem.clear();

    return {
      /** 
       * The output and asset files without unnecessary croft, e.g. `.map` sourcemap files 
       */
      contents,

      /**
       * The output and asset files with `.map` sourcemap files 
       */
      outputs,

      ...result
    };
  } catch (e) { }
}