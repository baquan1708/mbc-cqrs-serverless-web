import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/packages/master/index.ts',
    styles: 'src/packages/master/styles.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  publicDir: 'public',
  loader: {
    '.css': 'css',
  },
  esbuildOptions(options) {
    options.jsx = 'automatic'
    return options
  },
})
