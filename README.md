# Convertisseur code en PDF via LaTeX

Ce projet propose un outil écrit en TypeScript pour convertir un dossier contenant
plusieurs fichiers de code en un document PDF en passant par LaTeX. Il offre trois
commandes npm pour différentes actions : la génération de fichier .tex, la génération de
fichier .pdf et une combinaison des deux.

## Installation

1. Assurez-vous d'avoir Node.js installé sur votre système.
2. Assurez-vous de posséder les librairies LaTex nécessaire (en
particulier `tcolorbox` et ses dépendances qui peuvent ne pas être installés par défaut)
3. Clonez ce dépôt sur votre machine :
```bash
git clone https://github.com/Faywynnn/code2pdf
cd code2pdf
npm install
```

## Configuration

Paramètre modificables (`config.ts`)
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

## Utilisation

- Pour générer un fichier `.tex` à partir des fichiers:
```bash
npm run tex
```
- Pour générer un fichier PDF à partir du fichier .tex généré:
```bash
npm run pdf
```
- Pour faire les deux à la fois:
```bash
npm run texpdf
```

Les fichiers (.tex et .pdf) seront dans le dossier `output`

## Exemples
Voic un premier [exemple](https://github.com/Faywynnn/code2pdf/blob/main/exemples/Faywynnn.nvim.lua.pdf)
