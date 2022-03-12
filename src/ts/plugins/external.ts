import type { Plugin } from 'esbuild';

import { encode } from "../util/encode-decode";
import { getCDNHost } from '../util/loader';

export const EMPTY_EXPORT = encode(`export default {}`);
export const PolyfillMap = {
    "console": 'console-browserify',
    "constants": 'constants-browserify',
    "crypto": 'crypto-browserify',
    "http": 'http-browserify',
    "buffer": 'buffer',
    "Dirent": "dirent",
    "vm": 'vm-browserify',
    "zlib": 'zlib-browserify',
    "assert": 'assert',
    "child_process": 'child_process',
    "cluster": 'child_process',
    "dgram": 'dgram',
    "dns": 'dns',
    "domain": 'domain-browser',
    "events": 'events',
    "https": 'https',
    "module": 'module',
    "net": 'net',
    "path": 'path-browserify',
    "punycode": 'punycode',
    "querystring": 'querystring',
    "readline": 'readline',
    "repl": 'repl',
    "stream": 'stream',
    "string_decoder": 'string_decoder',
    "sys": 'sys',
    "timers": 'timers',
    "tls": 'tls',
    "tty": 'tty-browserify',
    "url": 'url',
    "util": 'util',
    "_shims": '_shims',
    "_stream_duplex": '_stream_duplex',
    "_stream_readable": '_stream_readable',
    "_stream_writable": '_stream_writable',
    "_stream_transform": '_stream_transform',
    "_stream_passthrough": '_stream_passthrough',
    process: 'process/browser',
    fs: 'memfs',
    os: 'os-browserify/browser',
    'v8': "v8",
    "node-inspect": "node-inspect",
    "_linklist": "_linklist",
    "_stream_wrap": "_stream_wrap"
};

export const PolyfillKeys = Object.keys(PolyfillMap);
export const DeprecatedAPIs = ["v8/tools/codemap", "v8/tools/consarray", "v8/tools/csvparser", "v8/tools/logreader", "v8/tools/profile_view", "v8/tools/profile", "v8/tools/SourceMap", "v8/tools/splaytree", "v8/tools/tickprocessor-driver", "v8/tools/tickprocessor", "node-inspect/lib/_inspect", "node-inspect/lib/internal/inspect_client ", "node-inspect/lib/internal/inspect_repl", "_linklist", "_stream_wrap"];
export const ExternalPackages = ['chokidar', 'yargs', 'fsevents', `worker_threads`, "assert/strict", "async_hooks", "diagnostics_channel", "http2", "fs/promises", "inspector", "perf_hooks", "timers/promises", "trace_events", "v8", "wasi", ...DeprecatedAPIs, ...PolyfillKeys];

// Based on https://github.com/egoist/play-esbuild/blob/7e34470f9e6ddcd9376704cd8b988577ddcd46c9/src/lib/esbuild.ts#L51
export const isExternal = (id: string, external: string[] = []) => {
    return [...ExternalPackages, ...external].find((it: string): boolean => {
        if (it === id) return true; // import 'foo' & external: ['foo']
        if (id.startsWith(`${it}/`)) return true; // import 'foo/bar.js' & external: ['foo']
        return false;
    });
}

export const ALIAS_NAMESPACE = 'alias-globals';
export const EXTERNALS_NAMESPACE = 'external-globals';
export const EXTERNAL = (external: string[] = []): Plugin => {
    return {
        name: EXTERNALS_NAMESPACE,
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
                let path = args.path.replace(/^node\:/, "");
                let { argPath } = getCDNHost(path);
                if (isExternal(argPath, external)) {
                    return {
                        path: argPath,
                        namespace: EXTERNALS_NAMESPACE,
                        external: true
                    };
                }
            });

            build.onLoad({ filter: /.*/, namespace: EXTERNALS_NAMESPACE }, (args) => {
                return {
                    pluginName: EXTERNALS_NAMESPACE,
                    contents: EMPTY_EXPORT,
                    warnings: [
                        {
                            text: `${args.path} is marked as an external module and will be ignored.`,
                            location: null,
                            details: `"${args.path}" is a built-in node module thus can't be bundled by https://bundle.js.org, sorry about that.`
                        }
                    ]
                };
            });
        },
    };
};