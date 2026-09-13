/// <reference types="vite/client" />

// On déclare les variables du .env pour que `import.meta.env.VITE_...`
// soit typé, et qu'une faute de frappe se voie à la compilation.
interface ImportMetaEnv {
  readonly VITE_POKEAPI_URL: string;
  readonly VITE_POKEAPI_SPRITES_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
