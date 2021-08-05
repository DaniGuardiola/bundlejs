import { Plugin } from 'esbuild';
import { CDN_NAMESPACE } from './cdn';
import path from 'path';

export const HOST = 'https://cdn.skypack.dev/';
export const BARE = (): Plugin => {
    return {
        name: 'bare',
        setup(build) {
            build.onResolve({ filter: /.*/ }, (args) => {
                if (/^(?!\.).*/.test(args.path) && !path.isAbsolute(args.path)) {
                    let argPath = args.path.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:/, "");
                    let host = HOST;
                    if (/^skypack\:/.test(args.path)) {
                        host = `https://cdn.skypack.dev/`;
                    } else if (/^(esm\.sh|esm)\:/.test(args.path)) {
                        host = `https://cdn.esm.sh/`;
                    } else if (/^unpkg\:/.test(args.path)) {
                        host = `https://unpkg.com/`;
                    } else if (/^(jsdelivr|esm\.run)\:/.test(args.path)) {
                        host = `https://cdn.jsdelivr.net/npm/`;
                    }

                    return {
                        path: argPath,
                        namespace: CDN_NAMESPACE,
                        pluginData: {
                            parentUrl: host,
                        },
                    };
                }
            });
        },
    };
};