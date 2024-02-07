export const PROJECT_PATH: string = __dirname.split("/").slice(0, -1).join("/") + "/nvim.lua";   // Better if absolut

export const IGNORE_FILES: string[] = [".DS_Store", ".gitignore" /* as exemple */]
export const IGNORE_FOLDERS: string[] = [".git"]

// Link ext to lstlisting valid ones or create yours 
export const EXT_MAP: { [key: string]: string } = {
  "ts": "C",
  "tex": "TEX",
  "c": "C",
  "cpp": "CPP",
  "lua": "[5.0]Lua"
};

// Edit only if needed
export const FILE_TAG: string = "fibzec-0vyhfi-zedJij"

// To edit file format (title, descr, ...), edit files in latexFiles/ folder

