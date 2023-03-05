import ob from "./rollup-plugins/rollup-plugin-ob";
export default {
  input: './src/a.js',
  output: {
    file: './dist-rollup/a.js',
    sourcemap: true,
    format: 'cjs'
  },
  plugins: [
    ob({include: /.*\.js/})
  ]
};
