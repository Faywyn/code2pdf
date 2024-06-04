//@ts-ignore
import { readFileSync } from "fs";
import { File, Tree } from "./types"
import { buildGlobalTree, buildTrees } from "./index";
import { EXT_MAP } from "./config";

/**
 * Get valid ext
 * @param l {string}
 * @returns {string}
 */
function extLanguage(l: string): string {
  if (Object.keys(EXT_MAP).includes(l))
    return EXT_MAP[l]
  return l
}

/**
 * Return valid latex text (like replace _ with \_)
 */
function texText(l: string): string {
  return l.replaceAll("_", "\\_");
}

/**
 * Generate latex tree text
 * @param tree {Tree}
 * @param depth {number} need to be 0 first
 * @param displayLine {boolean}
 */
export function generateLatexTree(tree: Tree, depth: number, displayLine: boolean): string {
  let latexCode = `.${depth} ${texText(tree.name)} $ref$.\n`;
  if (tree.isLast)
    latexCode = latexCode.replace(tree.name, `\\textcolor{blue}{${texText(tree.name)}}`);
  if (!tree.name.endsWith("/") && displayLine)
    latexCode = latexCode.replace("$ref$", `\\DTcomment{\\pageref{${tree.abs.replace(/[^a-z]+/gi, '').slice(-20, -1)}}}`)
  latexCode = latexCode.replace("$ref$", "")


  tree.subTree.forEach(subTree => {
    latexCode += generateLatexTree(subTree, depth + 1, displayLine);
  });

  if (depth === 1)
    return latexCode.split("\n").slice(0, -1).join("\n");
  return latexCode
}

/**
 * Generate latex page
 * @param file {File}
 * @returns {string}
 */
export function generateLatexPage(file: File): string {
  const latexTree = generateLatexTree(file.tree, 1, false);

  let pageContent: string = readFileSync("./src/latexFiles/page.tex", { encoding: "utf8" });
  pageContent = pageContent.replace("%%dirtree%%", latexTree);
  pageContent = pageContent.replace("%%code%%", file.content);
  pageContent = pageContent.replace("%%name%%", texText(file.name));
  pageContent = pageContent.replace("%%language%%", extLanguage(file.extension.replace(".", "")))
  pageContent = pageContent.replace("%%ref%%", file.abs.replace(/[^a-z]+/gi, '').slice(-20, -1))

  return pageContent
}

/**
 * Generate latex file content
 * @param path {string} path to project
 * @returns {string}
 */
export function generateLatexProject(path: string): string {
  const files = buildTrees(path);
  const filesContent = files.map(f => generateLatexPage(f));
  const globalTree: string = generateLatexTree(buildGlobalTree(path), 1, true)

  let pageContent: string = readFileSync("./src/latexFiles/output.tex", { encoding: "utf8" })
  pageContent = pageContent.replace("%%globalTree%%", globalTree)
  pageContent = pageContent.replace("%%documentContent%%", filesContent.join(" \\newpage "))

  return pageContent;
}
