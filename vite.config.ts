import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  // Storybook / dev — modo normal
  if (mode === 'development') {
    return {
      plugins: [react()],
    };
  }

  // Build de librería para npm
  return {
    plugins: [
      react(),
      dts({
        tsconfigPath: './tsconfig.build.json',
        rollupTypes: true,
        outDir: 'dist',
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'UnityUI',
        formats: ['es', 'cjs'],
        fileName: (format) => `unityui.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        // React y styled-components son peerDependencies — no van en el bundle
        external: ['react', 'react-dom', 'react/jsx-runtime', 'styled-components'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'styled-components': 'styled',
          },
        },
      },
      sourcemap: true,
      copyPublicDir: false,
    },
  };
});
