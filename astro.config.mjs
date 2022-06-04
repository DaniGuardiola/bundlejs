import { defineConfig } from "astro/config";
import serviceWorker from 'astro-service-worker';

import * as path from "node:path";
import { lookupCollection } from '@iconify/json';

import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import AutoImport from 'unplugin-auto-import/vite';

import PluginMonacoEditor from "vite-plugin-monaco-editor";
const MonacoEditorPlugin = PluginMonacoEditor.default;

import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

import { outDir } from "./shared.config.cjs";

import compress from "astro-compress";
import { h, s } from "hastscript";

const { icons: fluentIcons } = await lookupCollection("fluent");
const IconLink = fluentIcons["link-24-regular"];
const IconArrow = fluentIcons["arrow-up-right-24-regular"];

const __dirname = path.resolve(path.dirname(""));

// https://astro.build/config
export default defineConfig({
  outDir,
  build: {
    // Example: Generate `page.html` instead of `page/index.html` during build.
    format: "file"
  },
  site: "https://bundlejs.com",
  markdown: {
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-autolink-headings",
        {
          behavior: "append",
          content: [
            s("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: IconLink.width,
              height: IconLink.height,
              viewBox: `0 0 ${IconLink.width} ${IconLink.height}`,
              class: "icon"
            }, [IconLink.body])
          ],
          test: ['h2', 'h3', 'h4', 'h5', 'h6', 'details', 'summary', 'astro-root']
        },
      ],
      ["rehype-external-links", {
        target: "_blank",
        rel: ["noopener"],
        content: [
          s("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: IconArrow.width,
            height: IconArrow.height,
            viewBox: `0 0 ${IconArrow.width} ${IconArrow.height}`,
            class: "icon",
            "rehype-icon": "arrow-up-right-24-regular",
          }, [IconArrow.body])
        ]
      }]
    ],
    // remarkPlugins: [],
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: "github-dark",
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: false
    }
  },
  integrations: [
    solid(),
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }),
    sitemap(),
    // compress(),
    // serviceWorker({
    //   workbox: {
    //       globDirectory: destFolder,
    //       globPatterns: [
    //           "**/*.{html,js,css}",
    //           "/js/*.ttf",
    //           "/favicon/*.svg",
    //           "!/js/index.min.css",
    //       ],
    //       ignoreURLParametersMatching: [/index\.html\?(.*)/, /\\?(.*)/],
    //       cleanupOutdatedCaches: true,
    //       // Define runtime caching rules.
    //       runtimeCaching: [
    //           {
    //               // Match any request that starts with https://api.producthunt.com, https://api.countapi.xyz, https://opencollective.com, etc...
    //               urlPattern:
    //                   /^https:\/\/((?:api\.producthunt\.com)|(?:api\.countapi\.xyz)|(?:opencollective\.com)|(?:discus\.bundlejs\.com)|(?:analytics\.bundlejs\.com))/,
    //               // Apply a network-first strategy.
    //               handler: "NetworkFirst",
    //               method: "GET",
    //               options: {
    //                 cacheableResponse: {
    //                   statuses: [0, 200]
    //                 },
    //               }
    //           },
    //           {
    //               // Match any request that ends with .png, .jpg, .jpeg, .svg, etc....
    //               urlPattern:
    //                   /workbox\-(.*).js|\.(?:png|jpg|jpeg|svg|webp|map|wasm|json|ts|css)$|^https:\/\/(?:cdn\.polyfill\.io)/,
    //               // Apply a stale-while-revalidate strategy.
    //               handler: "StaleWhileRevalidate",
    //               method: "GET",
    //               options: {
    //                   cacheableResponse: {
    //                       statuses: [0, 200]
    //                   }
    //               }
    //           },
    //         ]
    //   }
    // })
  ],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    worker: {
      format: "iife"
    },
    ssr: {
      external: ["svgo"]
    },
    plugins: [
      AutoImport({
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
            extension: 'tsx'
          })
        ]
      }),
      Icons({
        autoInstall: true,
        compiler: 'solid',
        defaultClass: "icon"
      }),
      MonacoEditorPlugin({
        languageWorkers: [],
        customWorkers: [
          { label: "typescript", entry: path.join(__dirname, "./src/scripts/workers/typescript") },
          { label: "json", entry: path.join(__dirname, "./src/scripts/workers/json") },
          { label: "editor", entry: path.join(__dirname, "./src/scripts/workers/editor") },
        ]
      })
    ]
  }
});