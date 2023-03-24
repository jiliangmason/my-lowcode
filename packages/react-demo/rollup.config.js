import { defineConfig } from 'rollup';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import { nodeResolve as resolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import image from '@rollup/plugin-image';
import { babel } from '@rollup/plugin-babel';
import svg from 'rollup-plugin-svg';
import { name } from './package.json';

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  axios: 'axios',
  moment: 'moment',
  lodash: '_',
  classnames: 'classnames',
};

export default defineConfig([
  {
    input: ['./index.ts'],
    external: [
      'react',
      'react-dom',
      'axios',
      'moment',
      'lodash',
      'classnames',
    ],
    plugins: [
      typescript(),
      resolve({
        extensions: ['.tsx', '.ts', '.js'],
      }),
      postcss({
        plugins: [autoprefixer(), cssnano()],
      }),
      babel({
        babelHelpers: 'runtime',
        babelrc: false,
        exclude: '**/node_modules/**',
        presets: ['@babel/preset-react', '@babel/preset-env', '@babel/preset-typescript'],
        plugins: [
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-syntax-object-rest-spread',
          '@babel/plugin-transform-react-jsx',
          [
            '@babel/plugin-transform-runtime',
            {
              // absoluteRuntime: false,
              // corejs: 3,
              // helpers: false,
              // regenerator: false,
              // useESModules: true,
            },
          ],
        ],
        // by default the Babel defaults of .js, .jsx, .es6, .es, .mjs. are used
        extensions: [...DEFAULT_EXTENSIONS, '.ts', 'tsx'],
      }),
      commonjs(),
      image(),
      svg(),
    ],
    output: [
      {
        name,
        file: './dist/index.js',
        format: 'umd',
        globals,
      },
      {
        name,
        file: './es/index.js',
        format: 'esm',
        globals,
      },
      {
        name,
        file: './lib/index.cjs',
        format: 'commonjs',
        globals,
      },
    ],
  },
  {
    input: ['./index.d.ts'],
    output: [
      {
        file: './lib/index.d.ts',
        format: 'esm',
      },
    ],
    plugins: [
      dts({
        respectExternal: true,
      }),
    ],
  },
]);
