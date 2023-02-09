import type { BuildConfig, LocalState } from "../build";
import type { StateArray } from "../configs/state";
import type { EVENTS } from "../configs/events";
import type { ESBUILD } from "../types";

import { EXTERNALS_NAMESPACE } from "./external";
import { HTTP_RESOLVE } from "./http";
import { parsePackageName } from "../utils/parse-package-name";

import { getCDNUrl, DEFAULT_CDN_HOST } from "../utils/util-cdn";
import { isBareImport } from "../utils/path";

/** Alias Plugin Namespace */
export const ALIAS_NAMESPACE = "alias-globals";

/**
 * Checks if a package has an alias
 * 
 * @param id The package to find an alias for 
 * @param aliases An object with package as the key and the package alias as the value, e.g. { "fs": "memfs" }
 */
export const isAlias = (id: string, aliases = {}) => {
  if (!isBareImport(id)) return false;

  const aliasKeys = Object.keys(aliases);
  const path = id.replace(/^node\:/, "");
  const pkgDetails = parsePackageName(path);

  return aliasKeys.find((it: string): boolean => {
    return pkgDetails.name === it; // import 'foo' & alias: { 'foo': 'bar@5.0' }
  });
};

/**
 * Resolution algorithm for the esbuild ALIAS plugin 
 * 
 * @param aliases An object with package as the key and the package alias as the value, e.g. { "fs": "memfs" }
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
export const ALIAS_RESOLVE = (aliases = {}, host = DEFAULT_CDN_HOST, events: typeof EVENTS) => {
  return async (args: ESBUILD.OnResolveArgs): Promise<ESBUILD.OnResolveResult> => {
    const path = args.path.replace(/^node\:/, "");
    const { path: argPath } = getCDNUrl(path);

    if (isAlias(argPath, aliases)) {
      const pkgDetails = parsePackageName(argPath);
      const aliasPath = aliases[pkgDetails.name];
      return HTTP_RESOLVE(host, events)({
        ...args,
        path: aliasPath
      });
    }
  };
};

/**
 * Esbuild ALIAS plugin 
 * 
 * @param aliases An object with package as the key and the package alias as the value, e.g. { "fs": "memfs" }
 * @param host The default host origin to use if an import doesn't already have one
 * @param logger Console log
 */
export const ALIAS = (events: typeof EVENTS, state: StateArray<LocalState>, config: BuildConfig): ESBUILD.Plugin => {
  // Convert CDN values to URL origins
  const { origin: host } = !/:/.test(config?.cdn) ? getCDNUrl(config?.cdn + ":") : getCDNUrl(config?.cdn);
  const aliases = config.alias ?? {};
  return {
    name: ALIAS_NAMESPACE,
    setup(build) {
      // Intercept import paths starting with "http:" and "https:" so
      // esbuild doesn't attempt to map them to a file system location.
      // Tag them with the "http-url" namespace to associate them with
      // this plugin.
      build.onResolve({ filter: /^node\:.*/ }, (args) => {
        if (isAlias(args.path, aliases))
          return ALIAS_RESOLVE(aliases, host, events)(args);

        return {
          path: args.path,
          namespace: EXTERNALS_NAMESPACE,
          external: true
        };
      });

      // We also want to intercept all import paths inside downloaded
      // files and resolve them against the original URL. All of these
      // files will be in the "http-url" namespace. Make sure to keep
      // the newly resolved URL in the "http-url" namespace so imports
      // inside it will also be resolved as URLs recursively.
      build.onResolve({ filter: /.*/ }, ALIAS_RESOLVE(aliases, host, events));
      build.onResolve({ filter: /.*/, namespace: ALIAS_NAMESPACE }, ALIAS_RESOLVE(aliases, host, events));
    },
  };
};