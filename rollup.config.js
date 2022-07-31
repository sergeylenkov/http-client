const commonjs = require('rollup-plugin-commonjs');
const external = require('rollup-plugin-peer-deps-external');
const resolve = require('rollup-plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');

module.exports = {
  input: 'src/index.ts',
  output: {
    dir: 'build/lib',
    format: 'cjs',
  },
  plugins: [
    typescript({
      exclude: [
        '**/*.test.js',
        '**/*.test.ts',
      ],
    }),
    external(),
    resolve(),
    commonjs(),
    json()
  ],
};
