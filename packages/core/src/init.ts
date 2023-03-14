import type * as ESBUILD from "esbuild-wasm";

import type { Platform } from "./configs/platform";
import { PLATFORM_AUTO } from "./configs/platform";

import { getState, setState } from "./configs/state";
import { getEsbuild } from "./utils/get-esbuild";
import { INIT_COMPLETE, INIT_ERROR, INIT_START, dispatchEvent } from "./configs/events";

/**
 * Configures how esbuild running in wasm is initialized 
 */
export type InitOptions = ESBUILD.InitializeOptions & { platform?: Platform };

export async function init(platform = PLATFORM_AUTO, opts: ESBUILD.InitializeOptions = {}) {
  try {
    if (!getState("initialized")) {
      setState("initialized", true);
      dispatchEvent(INIT_START);

      const esbuild = await getEsbuild(platform);
      setState("esbuild", esbuild);
      if (
        platform !== "node" &&
        platform !== "deno"
      ) {
        // if ("wasmModule" in opts) {
        //   await esbuild.initialize(opts);
        // } else if ("wasmURL" in opts) { 
        //   await esbuild.initialize(opts);
        // } 

        await esbuild.initialize(opts);
        // else {
        //   const { default: ESBUILD_WASM } = await import("./wasm");
        //   await esbuild.initialize({
        //     wasmModule: new WebAssembly.Module(await ESBUILD_WASM()),
        //     ...opts
        //   });
        // }
      }

      dispatchEvent(INIT_COMPLETE);
    }

    return getState("esbuild");
  } catch (error) {
    dispatchEvent(INIT_ERROR, error);
    console.error(error);
  }
}