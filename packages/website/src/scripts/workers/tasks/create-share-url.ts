/// <reference lib="webworker" />

import { createFile } from "./create-file";

import { parseConfig } from "./parse-config";
import { DefaultConfig } from "../../configs/options";

import { serialize } from "../../utils/serialize-javascript";
import { configModelResetValue } from "../../utils/get-initial";
import { deepAssign, deepDiff, lzstring } from "@bundlejs/core/src/index";
import ts from "typescript";

const { compressToURL } = lzstring;
export async function createShareURL(fileName: string, content: string, _config = configModelResetValue) {
  const source = await createFile(fileName, content);
  const config = await parseConfig(_config);

  // Basically only keep the config options that have changed from the default
  const changedConfig = deepDiff(DefaultConfig, deepAssign({}, DefaultConfig, config));
  const changedEntries = Object.keys(changedConfig);

  // Collect the first few import and export statements
  const ImportExportStatements = [];

  // Back to Back Import
  let BackToBackImportExport = true;

  source.forEachChild(
    (node: ts.ImportDeclaration | ts.ExportDeclaration) => {
      const isImport =
        node.kind == ts.SyntaxKind.ImportDeclaration;
      const isExport =
        node.kind == ts.SyntaxKind.ExportDeclaration;
      if (!BackToBackImportExport) return;

      BackToBackImportExport = (isImport || isExport) && Boolean(node.moduleSpecifier);
      if (BackToBackImportExport) {
        const clause = isImport ?
          (node as ts.ImportDeclaration)?.importClause :
          (node as ts.ExportDeclaration)?.exportClause;

        ImportExportStatements.push({
          kind: isImport ? "import" : "export",
          clause: clause?.getText?.() ?? "*",
          module: node?.moduleSpecifier?.getText?.(),
          assert: node?.assertClause?.getText?.() ?? "",
          pos: {
            start: node.pos,
            end: node.end,
          },
        });
      }
    }
  );

  // Remove import and export statements
  let remainingCode = source.getFullText();
  [...ImportExportStatements].map(({ pos }) => {
    const { start, end } = pos;
    const snippet = remainingCode.substring(start, end);
    return snippet;
  }).forEach((snippet) => {
    remainingCode = remainingCode.replace(snippet, "");
  });

  // Collect import/export statements and create URL from them
  let modules = "";
  let treeshake = "";
  ImportExportStatements.forEach((v) => {
    modules +=
      (v.kind == "import" ? "(import)" : "") +
      v.module.replace(/^["']|["']$/g, "") +
      ",";

    treeshake +=
      "[" +
      v.clause
        .split(",")
        .map((s) => s.trim())
        .join(",") +
      "],";
  });

  modules = modules.replace(/,$/, "").trim();
  treeshake = treeshake.replace(/\]\,$/, "]").trim();
  remainingCode = remainingCode.trim();

  const url = new URL(self.location.origin.toString());
  if (modules.length > 0) url.searchParams.set("q", modules);
  if (treeshake.replace(/\[\*\]|\,/g, "").length > 0) {
    url.searchParams.set("treeshake", treeshake);
  }

  // If there is any remaining code convert it to a share URL
  if (remainingCode.length > 0) {
    const compressedURL = compressToURL(remainingCode);
    if (compressedURL.length > remainingCode.length)
      url.searchParams.set("text", JSON.stringify(remainingCode));
    else
      url.searchParams.set("share", compressToURL(remainingCode));
  }

  if (changedConfig && changedEntries?.length) {
    console.log(serialize(changedConfig));
    url.searchParams.set("config", serialize(changedConfig, { unsafe: true, ignoreFunction: true }));
  }

  // Remove decodeURIComponent(), to allow for sharing on social media platforms
  return decodeURIComponent(url.toString());
}

export default createShareURL;