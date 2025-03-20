# Code to PDF Converter via LaTeX

This project offers a tool written in TypeScript to convert a folder containing several code files into a PDF document via LaTeX.
It provides three npm commands for different actions: generating a .tex file, generating a .pdf file, and a combination of both.

## Installation

1. Make sure Node.js is installed on your system.
2. Ensure that you have the necessary LaTeX libraries installed (in particular, tcolorbox and its dependencies, which might not be installed by default).
3. Clone this repository to your machine :
```bash
git clone https://github.com/Faywyn/code2pdf
cd code2pdf
npm install
```

## Configuration

Modifiable settings (`config.ts`)
```TS
export const PROJECT_PATH: string = "path/to/project";   // Better if absolut

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

// To edit file format (title, descr, ...), edit tex files in latexFiles/ folder
```

## Usage

- To generate a `.tex` file from the code files :
```bash
npm run tex
```
- To generate a PDF file from the generated `.tex` file :
```bash
npm run pdf
```
- To do both at once:
```bash
npm run texpdf
```

The files (.tex and .pdf) will be in the output folder.

## Examples
Here’s an [example](https://github.com/Faywyn/code2pdf/blob/main/exemples/Faywynnn.nvim.lua.pdf)
