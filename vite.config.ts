import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { InputPluginOption } from 'rollup';

/**
 * change all `"/[url]"` behind `src` and `href` to `"./[url]"`
 */
function RelativePathPlugin(): InputPluginOption {
  return {
    name: 'useRelativePathPlugin',
    generateBundle(_, bundle) {
      for (const file of Object.keys(bundle)) {
        if (file.indexOf('index.html') !== -1) {
          const asset = bundle[file];
          // @ts-ignore asset.source is not in type
          asset.source = asset.source.replaceAll(
            /(src|href)="\/([^"]*)"/g,
            '$1="./$2"'
          );
        }
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      plugins: [RelativePathPlugin()],
    },
  },
});
