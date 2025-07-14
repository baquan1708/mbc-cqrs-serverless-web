import { defineConfig } from 'tsup'
import { exec } from 'child_process'

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
  // This function will be called after a successful build.
  onSuccess: async () => {
    console.log('Build successful! Running post-build steps...')
    // If you need to run your original Node.js script, you can do it like this:
    exec('node ./postbuild.js', (err, stdout, stderr) => {
      if (err) {
        console.error('Error during post-build:', stderr)
        return
      }
      console.log(stdout)
    })
  },
})
