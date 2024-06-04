import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    minify:false
  },
  plugins: [
    svelte({
      emitCss:false
    }),
    webExtension({
      manifest: generateManifest,
      additionalInputs:['html/viewer.html','html/index.html'],
      watchFilePaths: ["package.json", "manifest.json"],
    }),
  ],
});
