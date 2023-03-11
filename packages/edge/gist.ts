import { Octokit } from "npm:octokit";
import { path, dispatchEvent, LOGGER_ERROR, LOGGER_WARN } from "@bundlejs/core/src/index.ts";
import { Velo } from "https://deno.land/x/velo/mod.ts";
import { ESBUILD } from "../core/src/types.ts";

import { bytesToBase64 } from "npm:byte-base64";

const { extname } = path;

export const GIST_CACHE = Velo.builder<string, string>().capacity(10).lru().ttl(120_000).build();
export const octokit = new Octokit({
  auth: Deno.env.get('GITHUB_AUTH_TOKEN')
})

export const BUNDLE_FILE_PATH = "index.js";
export async function setFile(url: string, files: ESBUILD.OutputFile[]) {
  const newUrl = new URL(url);
  newUrl.hostname = "deno.bundlejs.dev";

  try {
    const filesObj = Object.fromEntries(
      files.map(x => { 
        const path = x.path.replace(/^\.|\//g, "").replace(/[^\w-_.]/g, "");
        return [
          path, 
          { 
            content: (
              /\.(wasm|png|jpg|jpeg)/.exec(extname(path)) ? 
                bytesToBase64(x.contents) : 
                x.text
            ) ?? "[bundlejs] Empty file..." 
          } 
        ]
      })
    );
    const result = (
      await octokit.request('POST /gists', {
        description: `Result of ${newUrl.href}`,
        'public': true,
        files: {
          ...filesObj,
          // [BUNDLE_FILE_PATH]: {
          //   content: text
          // },
          'README.md': {
            content: `Hey 👋, this is a gist which stores the final bundle results of the bundlejs api, learn more on the website https://bundlejs.com. This is the result of ${newUrl.href}.`
          }
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        },
      })
    ).data;
    
    const fileId = result.id;
    const fileUrl = result.url;
    const fileHTMLUrl = result.html_url;
    if (fileId) GIST_CACHE.set(fileId, filesObj[BUNDLE_FILE_PATH].content);
    return {
      fileId, 
      fileUrl, 
      fileHTMLUrl 
    };
  } catch(e) {
    dispatchEvent(LOGGER_ERROR, e);
  }
}

export async function listFiles(page = 0) {
  return ( 
    await octokit.request('GET /gists/public', {
      page,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  ).data
}

export async function getFile(id: string) {
  const rawFile = GIST_CACHE.get(id);
  if (rawFile) return rawFile;
  const req = await octokit.request('GET /gists/{gist_id}', {
    gist_id: id,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  const data = req.data;
  const result = data.files![BUNDLE_FILE_PATH]!;
  if (result.truncated && result.raw_url) {
    return await fetch(result.raw_url).then(res => res.text());
  }

  return result?.content;
}

export function deleteFile(id: string) {
  if (GIST_CACHE.has(id)) GIST_CACHE.remove(id);
  return octokit.request('DELETE /gists/{gist_id}', {
    gist_id: id,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
}

export async function clearFiles() {
  let page = 0;
  while (true) {
    try {
      const files = await listFiles(page);
      if (files.length <= 0) break;
      
      console.log()

      for (const file of files) {
        await deleteFile(file.id)
      }

      page ++;
    } catch (e) {
      dispatchEvent(LOGGER_WARN, e);

      break;
    }
  }
}