const schema = {"type":"object","properties":{"rollup":{"description":"Enable using rollup for treeshaking. Only works while the `esbuild.treeShaking` option is true","anyOf":[{"$ref":"#/definitions/OutputOptions"},{"type":"boolean"}]},"esbuild":{"$ref":"#/definitions/BuildOptions","description":"esbuild config options https://esbuild.github.io/api/#build-api"},"cdn":{"description":"The default CDN to import packages from","anyOf":[{"allOf":[{"type":"object","properties":{}},{"type":"string"}]},{"enum":["deno","esm","esm.run","esm.sh","github","https://cdn.esm.sh","https://cdn.jsdelivr.net/gh","https://cdn.jsdelivr.net/npm","https://cdn.skypack.dev","https://deno.land/x","https://esm.run","https://raw.githubusercontent.com","https://unpkg.com","jsdelivr","jsdelivr.gh","skypack","unpkg"],"type":"string"}]},"alias":{"$ref":"#/definitions/Record<string,string>","description":"Aliases for replacing packages with different ones, e.g. replace \"fs\" with \"memfs\", so, it can work on the web, etc..."},"compression":{"description":"The compression algorithim to use, there are currently 3 options \"gzip\", \"brotli\", and \"lz4\".\nYou can also configure the quality of the compression using an object, \ne.g.\n```ts\n{\n ...\n \"compression\": {\n   \"type\": \"brotli\",\n   \"quality\": 5\n }\n}\n```","anyOf":[{"description":"You can configure the quality of the compression using an object, \ne.g.\n```ts\n{\n ...\n \"compression\": {\n   \"type\": \"brotli\",\n   \"quality\": 5\n }\n}\n```","type":"object","properties":{"type":{"$ref":"#/definitions/CompressionType","description":"The compression algorithim to use, there are currently 3 options \"gzip\", \"brotli\", and \"lz4\""},"quality":{"description":"Compression quality ranging from 1 to 11","enum":[1,10,11,2,3,4,5,6,7,8,9],"type":"number"}}},{"enum":["brotli","gzip","lz4"],"type":"string"}]},"ascii":{"description":"Enables converting ascii logs to HTML so virtual consoles can handle the logs and print with color","enum":["ascii","html","html-and-ascii"],"type":"string"},"filesystem":{"description":"A virtual file system where you can input files, get, set and read files","type":"object","properties":{"files":{"$ref":"#/definitions/Map<string,Uint8Array>","description":"Virtual Filesystem Storage"},"get":{"description":"Retrevies file from virtual file system storage in either string or uint8array buffer format","type":"object"},"set":{"description":"Writes file to filesystem in either string or uint8array buffer format","type":"object"},"resolve":{"description":"Resolves path to a file in the virtual file system storage","type":"object"},"clear":{"description":"Clear all files from the virtual filesystem storage","type":"object"}}},"init":{"description":"Configures how esbuild-wasm is initialized","allOf":[{"$ref":"#/definitions/InitializeOptions"},{"type":"object","properties":{"platform":{"$ref":"#/definitions/PLATFORM"}}}]},"entryPoints":{"description":"Documentation: https://esbuild.github.io/api/#entry-points","anyOf":[{"type":"array","items":{"type":"string"}},{"$ref":"#/definitions/Record<string,string>"}]}},"definitions":{"OutputOptions":{"type":"object","properties":{"amd":{"anyOf":[{"allOf":[{"type":"object","properties":{"autoId":{"type":"boolean","enum":[false]},"id":{"type":"string"}}},{"type":"object","properties":{"define":{"type":"string"}}}]},{"allOf":[{"type":"object","properties":{"autoId":{"type":"boolean","enum":[true]},"basePath":{"type":"string"},"id":{"type":"undefined"}}},{"type":"object","properties":{"define":{"type":"string"}}}]},{"allOf":[{"type":"object","properties":{"autoId":{"type":"boolean","enum":[false]},"id":{"type":"undefined"}}},{"type":"object","properties":{"define":{"type":"string"}}}]}]},"assetFileNames":{"type":["string","object"]},"banner":{"type":["string","object"]},"chunkFileNames":{"type":["string","object"]},"compact":{"type":"boolean"},"dir":{"type":"string"},"dynamicImportFunction":{"type":"string"},"entryFileNames":{"type":["string","object"]},"esModule":{"type":"boolean"},"exports":{"enum":["auto","default","named","none"],"type":"string"},"extend":{"type":"boolean"},"externalLiveBindings":{"type":"boolean"},"file":{"type":"string"},"footer":{"type":["string","object"]},"format":{"$ref":"#/definitions/ModuleFormat"},"freeze":{"type":"boolean"},"generatedCode":{"anyOf":[{"$ref":"#/definitions/GeneratedCodeOptions"},{"enum":["es2015","es5"],"type":"string"}]},"globals":{"anyOf":[{"type":"object","additionalProperties":{"type":"string"}},{"type":"object"}]},"hoistTransitiveImports":{"type":"boolean"},"indent":{"type":["string","boolean"]},"inlineDynamicImports":{"type":"boolean"},"interop":{"anyOf":[{"enum":["auto","default","defaultOnly","esModule",false,true]},{"type":"object"}]},"intro":{"type":["string","object"]},"manualChunks":{"anyOf":[{"type":"object","additionalProperties":{"type":"array","items":{"type":"string"}}},{"type":"object"}]},"minifyInternalExports":{"type":"boolean"},"name":{"type":"string"},"namespaceToStringTag":{"type":"boolean"},"noConflict":{"type":"boolean"},"outro":{"type":["string","object"]},"paths":{"anyOf":[{"$ref":"#/definitions/Record<string,string>"},{"type":"object"}]},"plugins":{"type":"array","items":{"anyOf":[{"$ref":"#/definitions/OutputPlugin"},{"enum":[false],"type":"boolean"}]}},"preferConst":{"type":"boolean"},"preserveModules":{"type":"boolean"},"preserveModulesRoot":{"type":"string"},"sanitizeFileName":{"type":["object","boolean"]},"sourcemap":{"enum":[false,"hidden","inline",true]},"sourcemapBaseUrl":{"type":"string"},"sourcemapExcludeSources":{"type":"boolean"},"sourcemapFile":{"type":"string"},"sourcemapPathTransform":{"type":"object"},"strict":{"type":"boolean"},"systemNullSetters":{"type":"boolean"},"validate":{"type":"boolean"}}},"ModuleFormat":{"enum":["amd","cjs","commonjs","es","esm","iife","module","system","systemjs","umd"],"type":"string"},"GeneratedCodeOptions":{"type":"object","properties":{"preset":{"$ref":"#/definitions/GeneratedCodePreset"},"arrowFunctions":{"type":"boolean"},"constBindings":{"type":"boolean"},"objectShorthand":{"type":"boolean"},"reservedNamesAsProps":{"type":"boolean"},"symbols":{"type":"boolean"}}},"GeneratedCodePreset":{"enum":["es2015","es5"],"type":"string"},"Record<string,string>":{"type":"object"},"OutputPlugin":{"type":"object","properties":{"name":{"type":"string"},"augmentChunkHash":{"type":"object"},"generateBundle":{"type":"object"},"outputOptions":{"type":"object"},"renderChunk":{"type":"object"},"renderDynamicImport":{"type":"object"},"renderError":{"type":"object"},"renderStart":{"type":"object"},"resolveAssetUrl":{"type":"object"},"resolveFileUrl":{"type":"object"},"resolveImportMeta":{"type":"object"},"writeBundle":{"type":"object"},"banner":{"type":["string","object"]},"cacheKey":{"type":"string"},"footer":{"type":["string","object"]},"intro":{"type":["string","object"]},"outro":{"type":["string","object"]}}},"BuildOptions":{"type":"object","properties":{"bundle":{"description":"Documentation: https://esbuild.github.io/api/#bundle","type":"boolean"},"splitting":{"description":"Documentation: https://esbuild.github.io/api/#splitting","type":"boolean"},"preserveSymlinks":{"description":"Documentation: https://esbuild.github.io/api/#preserve-symlinks","type":"boolean"},"outfile":{"description":"Documentation: https://esbuild.github.io/api/#outfile","type":"string"},"metafile":{"description":"Documentation: https://esbuild.github.io/api/#metafile","type":"boolean"},"outdir":{"description":"Documentation: https://esbuild.github.io/api/#outdir","type":"string"},"outbase":{"description":"Documentation: https://esbuild.github.io/api/#outbase","type":"string"},"external":{"description":"Documentation: https://esbuild.github.io/api/#external","type":"array","items":{"type":"string"}},"loader":{"description":"Documentation: https://esbuild.github.io/api/#loader","type":"object","additionalProperties":{"enum":["base64","binary","copy","css","dataurl","default","file","js","json","jsx","text","ts","tsx"],"type":"string"}},"resolveExtensions":{"description":"Documentation: https://esbuild.github.io/api/#resolve-extensions","type":"array","items":{"type":"string"}},"mainFields":{"description":"Documentation: https://esbuild.github.io/api/#main-fields","type":"array","items":{"type":"string"}},"conditions":{"description":"Documentation: https://esbuild.github.io/api/#conditions","type":"array","items":{"type":"string"}},"write":{"description":"Documentation: https://esbuild.github.io/api/#write","type":"boolean"},"allowOverwrite":{"description":"Documentation: https://esbuild.github.io/api/#allow-overwrite","type":"boolean"},"tsconfig":{"description":"Documentation: https://esbuild.github.io/api/#tsconfig","type":"string"},"outExtension":{"description":"Documentation: https://esbuild.github.io/api/#out-extension","type":"object","additionalProperties":{"type":"string"}},"publicPath":{"description":"Documentation: https://esbuild.github.io/api/#public-path","type":"string"},"entryNames":{"description":"Documentation: https://esbuild.github.io/api/#entry-names","type":"string"},"chunkNames":{"description":"Documentation: https://esbuild.github.io/api/#chunk-names","type":"string"},"assetNames":{"description":"Documentation: https://esbuild.github.io/api/#asset-names","type":"string"},"inject":{"description":"Documentation: https://esbuild.github.io/api/#inject","type":"array","items":{"type":"string"}},"banner":{"description":"Documentation: https://esbuild.github.io/api/#banner","type":"object","additionalProperties":{"type":"string"}},"footer":{"description":"Documentation: https://esbuild.github.io/api/#footer","type":"object","additionalProperties":{"type":"string"}},"incremental":{"description":"Documentation: https://esbuild.github.io/api/#incremental","type":"boolean"},"entryPoints":{"description":"Documentation: https://esbuild.github.io/api/#entry-points","anyOf":[{"type":"array","items":{"type":"string"}},{"$ref":"#/definitions/Record<string,string>"}]},"stdin":{"$ref":"#/definitions/StdinOptions","description":"Documentation: https://esbuild.github.io/api/#stdin"},"plugins":{"description":"Documentation: https://esbuild.github.io/plugins/","type":"array","items":{"$ref":"#/definitions/Plugin"}},"absWorkingDir":{"description":"Documentation: https://esbuild.github.io/api/#working-directory","type":"string"},"nodePaths":{"description":"Documentation: https://esbuild.github.io/api/#node-paths","type":"array","items":{"type":"string"}},"watch":{"description":"Documentation: https://esbuild.github.io/api/#watch","anyOf":[{"$ref":"#/definitions/WatchMode"},{"type":"boolean"}]},"sourcemap":{"description":"Documentation: https://esbuild.github.io/api/#sourcemap","enum":["both","external",false,"inline","linked",true]},"legalComments":{"description":"Documentation: https://esbuild.github.io/api/#legal-comments","enum":["eof","external","inline","linked","none"],"type":"string"},"sourceRoot":{"description":"Documentation: https://esbuild.github.io/api/#source-root","type":"string"},"sourcesContent":{"description":"Documentation: https://esbuild.github.io/api/#sources-content","type":"boolean"},"format":{"$ref":"#/definitions/Format","description":"Documentation: https://esbuild.github.io/api/#format"},"globalName":{"description":"Documentation: https://esbuild.github.io/api/#global-name","type":"string"},"target":{"description":"Documentation: https://esbuild.github.io/api/#target","anyOf":[{"type":"array","items":{"type":"string"}},{"type":"string"}]},"supported":{"$ref":"#/definitions/Record<string,boolean>","description":"Documentation: https://esbuild.github.io/api/#supported"},"platform":{"$ref":"#/definitions/Platform","description":"Documentation: https://esbuild.github.io/api/#platform"},"mangleProps":{"$ref":"#/definitions/RegExp","description":"Documentation: https://esbuild.github.io/api/#mangle-props"},"reserveProps":{"$ref":"#/definitions/RegExp","description":"Documentation: https://esbuild.github.io/api/#mangle-props"},"mangleQuoted":{"description":"Documentation: https://esbuild.github.io/api/#mangle-props","type":"boolean"},"mangleCache":{"$ref":"#/definitions/Record<string,string|false>","description":"Documentation: https://esbuild.github.io/api/#mangle-props"},"drop":{"description":"Documentation: https://esbuild.github.io/api/#drop","type":"array","items":{"enum":["console","debugger"],"type":"string"}},"minify":{"description":"Documentation: https://esbuild.github.io/api/#minify","type":"boolean"},"minifyWhitespace":{"description":"Documentation: https://esbuild.github.io/api/#minify","type":"boolean"},"minifyIdentifiers":{"description":"Documentation: https://esbuild.github.io/api/#minify","type":"boolean"},"minifySyntax":{"description":"Documentation: https://esbuild.github.io/api/#minify","type":"boolean"},"charset":{"$ref":"#/definitions/Charset","description":"Documentation: https://esbuild.github.io/api/#charset"},"treeShaking":{"description":"Documentation: https://esbuild.github.io/api/#tree-shaking","type":"boolean"},"ignoreAnnotations":{"description":"Documentation: https://esbuild.github.io/api/#ignore-annotations","type":"boolean"},"jsx":{"description":"Documentation: https://esbuild.github.io/api/#jsx","enum":["preserve","transform"],"type":"string"},"jsxFactory":{"description":"Documentation: https://esbuild.github.io/api/#jsx-factory","type":"string"},"jsxFragment":{"description":"Documentation: https://esbuild.github.io/api/#jsx-fragment","type":"string"},"define":{"description":"Documentation: https://esbuild.github.io/api/#define","type":"object","additionalProperties":{"type":"string"}},"pure":{"description":"Documentation: https://esbuild.github.io/api/#pure","type":"array","items":{"type":"string"}},"keepNames":{"description":"Documentation: https://esbuild.github.io/api/#keep-names","type":"boolean"},"color":{"description":"Documentation: https://esbuild.github.io/api/#color","type":"boolean"},"logLevel":{"$ref":"#/definitions/LogLevel","description":"Documentation: https://esbuild.github.io/api/#log-level"},"logLimit":{"description":"Documentation: https://esbuild.github.io/api/#log-limit","type":"number"},"logOverride":{"$ref":"#/definitions/Record<string,LogLevel>","description":"Documentation: https://esbuild.github.io/api/#log-override"}}},"StdinOptions":{"type":"object","properties":{"contents":{"type":"string"},"resolveDir":{"type":"string"},"sourcefile":{"type":"string"},"loader":{"$ref":"#/definitions/Loader"}}},"Loader":{"enum":["base64","binary","copy","css","dataurl","default","file","js","json","jsx","text","ts","tsx"],"type":"string"},"Plugin":{"type":"object","properties":{"name":{"type":"string"},"setup":{"type":"object"}}},"WatchMode":{"type":"object","properties":{"onRebuild":{"type":"object"}}},"Format":{"enum":["cjs","esm","iife"],"type":"string"},"Record<string,boolean>":{"type":"object"},"Platform":{"enum":["browser","neutral","node"],"type":"string"},"RegExp":{"type":"object","properties":{"source":{"type":"string"},"global":{"type":"boolean"},"ignoreCase":{"type":"boolean"},"multiline":{"type":"boolean"},"lastIndex":{"type":"number"},"flags":{"type":"string"},"sticky":{"type":"boolean"},"unicode":{"type":"boolean"},"dotAll":{"type":"boolean"}}},"Record<string,string|false>":{"type":"object"},"Charset":{"enum":["ascii","utf8"],"type":"string"},"LogLevel":{"enum":["debug","error","info","silent","verbose","warning"],"type":"string"},"Record<string,LogLevel>":{"type":"object"},"CompressionType":{"description":"The compression algorithim to use, there are currently 3 options \"gzip\", \"brotli\", and \"lz4\"","enum":["brotli","gzip","lz4"],"type":"string"},"Map<string,Uint8Array>":{"type":"object","properties":{"size":{"type":"number"},"__@toStringTag@23":{"type":"string"}}},"InitializeOptions":{"type":"object","properties":{"wasmURL":{"description":"The URL of the \"esbuild.wasm\" file. This must be provided when running\nesbuild in the browser.","type":"string"},"wasmModule":{"$ref":"#/definitions/WebAssembly.Module","description":"The result of calling \"new WebAssembly.Module(buffer)\" where \"buffer\"\nis a typed array or ArrayBuffer containing the binary code of the\n\"esbuild.wasm\" file.\n\nYou can use this as an alternative to \"wasmURL\" for environments where it's\nnot possible to download the WebAssembly module."},"worker":{"description":"By default esbuild runs the WebAssembly-based browser API in a web worker\nto avoid blocking the UI thread. This can be disabled by setting \"worker\"\nto false.","type":"boolean"}}},"WebAssembly.Module":{"type":"object"},"PLATFORM":{"description":"`@bundlejs/core`'s supported platforms","enum":["browser","deno","node"],"type":"string"}},"$schema":"http://json-schema.org/draft-07/schema#"}; export default schema;