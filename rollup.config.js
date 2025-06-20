import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/client/index.js',
  output: {
    file: 'dist/index.js',
    format: 'iife',
    sourcemap: false
  },
  plugins: [
    terser()
  ]
};
