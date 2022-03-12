// Based on https://github.com/hardfist/neo-tools/blob/main/packages/bundler/src/plugins/http.ts
import type { OutputFile, Plugin } from 'esbuild';

import { getRequest } from '../util/cache';
import { decode } from '../util/encode-decode';
import { getCDNHost, inferLoader, isBareImport } from '../util/loader';

import { urlJoin } from "../util/path";
import { CDN_RESOLVE } from './cdn';

export async function fetchPkg(url: string, logger = console.log) {
    try {
        let response = await getRequest(url);
        if (!response.ok)
            throw new Error(`[getRequest] Failed to load ${response.url} (${response.status} code)`);
        logger("Fetch " + url, "info");
        
        return {
            url: response.url,
            content: new Uint8Array(await response.arrayBuffer()),
        };
    } catch (err) { 
        throw new Error(`[getRequest] Failed at request (${url}) \n${err}`);
    }
}

export const HTTP_NAMESPACE = 'http-url';
export const HTTP = (assets: OutputFile[] = [], logger: (messages: string[] | any, type?: "error" | "warning" | any) => void): Plugin => {
    return {
        name: HTTP_NAMESPACE,
        setup(build) {
            // Intercept import paths starting with "http:" and "https:" so
            // esbuild doesn't attempt to map them to a file system location.
            // Tag them with the "http-url" namespace to associate them with
            // this plugin.
            build.onResolve({ filter: /^https?:\/\// }, args => {
                return {
                    path: args.path,
                    namespace: HTTP_NAMESPACE,
                };
            });

            // We also want to intercept all import paths inside downloaded
            // files and resolve them against the original URL. All of these
            // files will be in the "http-url" namespace. Make sure to keep
            // the newly resolved URL in the "http-url" namespace so imports
            // inside it will also be resolved as URLs recursively.
            build.onResolve({ filter: /.*/, namespace: HTTP_NAMESPACE }, args => {
                let argPath = args.path.replace(/\/$/, "/index"); // Some packages use "../../" with the assumption that "/" is equal to "/index.js", this is supposed to fix that bug
                let path = urlJoin(args.pluginData?.url, "../", argPath);
                if (!argPath.startsWith(".")) {
                    let { origin } = new URL(path);
                    if (isBareImport(argPath)) {
                        return CDN_RESOLVE(origin)(args);
                    } else {
                        return {
                            path: getCDNHost(argPath, origin).url,
                            namespace: HTTP_NAMESPACE,
                            pluginData: { pkg: args.pluginData?.pkg },
                        };
                    }
                }

                return {
                    path, 
                    namespace: HTTP_NAMESPACE,
                    pluginData: { pkg: args.pluginData?.pkg },
                };
            });

            // When a URL is loaded, we want to actually download the content
            // from the internet. This has just enough logic to be able to
            // handle the example import from https://cdn.esm.sh/ but in reality this
            // would probably need to be more complex.
            build.onLoad({ filter: /.*/, namespace: HTTP_NAMESPACE }, async (args) => {
                const { content, url } = await fetchPkg(args.path, logger);
                const rgx = /new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g;
                const code = decode(content);
                const matches = Array.from(code.matchAll(rgx));

                const promises = [];
                for (const [, m] of matches) {
                    promises.push(
                        (async () => {
                            let url = new URL("./", args.path).toString();
                            let { content: asset } = await fetchPkg(urlJoin(url, m), logger);
                            assets.push({
                                path: m,
                                contents: asset,
                                get text() {
                                    return decode(asset);
                                }
                            })
                        })()
                    );
                }

                await Promise.all(promises);
                
                return {
                    contents: content,
                    loader: inferLoader(url),
                    pluginData: { url, pkg: args.pluginData?.pkg },
                };
            });
        },
    };
};