export type File = {
  name: string,
  extension: string,
  content: string,
  tree: Tree,
  abs: string,
}

export type Tree = {
  name: string,
  abs: string,
  isLast: boolean,
  subTree: Tree[],
}
