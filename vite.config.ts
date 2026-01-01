
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  // On ne met pas publicDir: '.' ici pour éviter que Vite ne boucle sur lui-même.
  // Les fichiers à la racine (manifest.json, sw.js) seront gérés par le build si nécessaire
  // ou par Vercel via vercel.json.
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
