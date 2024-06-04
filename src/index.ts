import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
//@ts-ignore
import { Tree, File } from "./types"
import { generateLatexProject } from './latex';
import { FILE_TAG, IGNORE_FILES, IGNORE_FOLDERS, PROJECT_PATH } from './config';



// ----- CONFIG -----
// See config in config.ts file
// ----- CONFIG -----


/**
 * Get all files in a directory
 * @param directoryPath {string}
 * @returns {string[]}
 */
export function listFilesRecursively(directoryPath: string): string[] {
  let files: string[] = [];

  readdirSync(directoryPath).forEach(item => {
    const itemPath = path.join(directoryPath, item);

    if (lstatSync(itemPath).isDirectory()) {
      files = files.concat(listFilesRecursively(itemPath));
    } else {
      files.push(itemPath);
    }
  });

  return files.map(x => x.replace(PROJECT_PATH, "").replaceAll("_", "\\_"))
}

/**
 * Create tree for the file
 * @param file {string} file path from the project
 * @param project {string} absolut path
 * @returns {Tree}
 */
export function buildTree(file: string, project: string): Tree {
  const fileStep: string[] = file.split("/").filter(x => x !== "");
  const current = project.split("/").pop() || "" + "/";

  if (fileStep.length === 0) {
    return {
      name: current,
      abs: project,
      isLast: false,
      subTree: [],
    }
  }

  if (file === FILE_TAG) {
    return {
      name: current,
      abs: project,
      isLast: true,
      subTree: []
    }
  }

  const step = fileStep[0];
  let t: Tree = {
    name: current + (lstatSync(project).isDirectory() ? "/" : ""),
    subTree: [],
    isLast: false,
    abs: project
  }

  readdirSync(project).forEach(x => {
    const fullPath = `${project}/${x}`;

    if (x === step && fileStep.length === 1) {
      t.subTree.push(buildTree(FILE_TAG, fullPath));
    }
    else if (x === step) {
      t.subTree.push(buildTree(file.replace("/" + x, ""), fullPath))
    }
    else {
      t.subTree.push({
        name: x + (lstatSync(project + "/" + x).isDirectory() ? "/" : ""),
        subTree: [],
        isLast: false,
        abs: project + "/" + x
      })
    }
  });

  return sortGlobalTree(t);
}

/**
 * Build tree for each file in project
 * @param path {string}
 * @returns {File[]}
 */
export function buildTrees(path: string): File[] {
  return listFilesRecursively(path).map((f): File => {
    const name = f.split("/").pop() || "";
    return {
      content: readFileSync(path + f, { encoding: "utf8" }),
      extension: f.split(".").pop() || "",
      name,
      abs: path + f,
      tree: buildTree(f, path),
    }
  })
    .filter(x => !IGNORE_FILES.includes(x.name))
    .filter(x => !IGNORE_FOLDERS.map(k => x.abs.split("/").includes(k)).reduce((a, b) => a || b))
}

/**
 * Build the tree of the project
 * @param path {string} project path
 * @returns {Tree}
 */
export function buildGlobalTree(path: string): Tree {
  const name = path.split("/").pop() || "";

  if (!lstatSync(path).isDirectory()) {
    return {
      name,
      subTree: [],
      isLast: false,
      abs: path
    }
  }

  let tree: Tree = {
    name: name + "/",
    isLast: false,
    subTree: [],
    abs: path
  }

  readdirSync(path).forEach(x => {
    tree.subTree.push(buildGlobalTree(path + "/" + x))
  })

  return sortGlobalTree(tree);
}

/**
 * Sort first tree layer (folders first then files)
 * @param tree {Tree}
 * @returns {Tree} 
 */
export function sortTree(tree: Tree): Tree {
  let sortFolders = tree.subTree
    .filter(x => x.name.endsWith("/"))
    .filter(x => !IGNORE_FOLDERS.includes(x.name.replace("/", "")))
    .sort((a, b) => a.name.replace("/", "").localeCompare(b.name.replace("/", "")))
  let sortFiles = tree.subTree
    .filter(x => !x.name.endsWith("/"))
    .filter(x => !IGNORE_FILES.includes(x.name))
    .sort((a, b) => a.name.localeCompare(b.name))

  sortFiles.forEach(x => sortFolders.push(x))
  tree.subTree = sortFolders

  return tree;
}

/**
 * Sort a tree (folders first, then files)
 * @param tree {Tree}
 * @returns {Tree}
 */
export function sortGlobalTree(tree: Tree): Tree {
  tree.subTree = tree.subTree.map(x => sortGlobalTree(x));

  let sortFolders = tree.subTree
    .filter(x => x.name.endsWith("/"))
    .filter(x => !IGNORE_FOLDERS.includes(x.name.replace("/", "")))
    .sort((a, b) => a.name.replace("/", "").localeCompare(b.name.replace("/", "")))
  let sortFiles = tree.subTree
    .filter(x => !x.name.endsWith("/"))
    .filter(x => !IGNORE_FILES.includes(x.name))
    .sort((a, b) => a.name.localeCompare(b.name))

  sortFiles.forEach(x => sortFolders.push(x))
  tree.subTree = sortFolders

  return tree;
}

/**
 * Create latex file
 * @param input {string}
 * @returns {void}
 */
export function buildLatexFile(input: string): void {
  if (!existsSync(__dirname + "/../output"))
    mkdirSync(__dirname + "/../output")

  const fileContent = generateLatexProject(input);
  writeFileSync(__dirname + "/../output/index.tex", fileContent);
}

buildLatexFile(PROJECT_PATH)
