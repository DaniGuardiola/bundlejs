import type { BuildOptions } from "esbuild-wasm";

/** The compression algorithim to use, there are currently 2 options "gzip" and "brotli" */
export type CompressionType = "gzip" | "brotli";
export type BundleConfigOptions = { 
    esbuild?: BuildOptions,
    compression?: {
        type: CompressionType,
        quality: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11
    } | CompressionType
};

export const DefaultConfig: BundleConfigOptions = {
    "compression": "gzip",
    "esbuild": {
        "target": ["esnext"],
        "format": "esm",
        "bundle": true,
        "minify": true,
        "color": true,

        "treeShaking": true,
        "platform": "browser",
        "globalName": "bundledCode",

        "logLevel": "info",
        "sourcemap": false,
        "incremental": false,
    }
}

export const DefaultConfigStr = JSON.stringify(DefaultConfig);