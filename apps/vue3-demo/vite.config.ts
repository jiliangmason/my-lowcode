import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
import legacy from '@vitejs/plugin-legacy';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { viteMockServe } from 'vite-plugin-mock';
import styleImport from 'vite-plugin-style-import';
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin';
import eslintPlugin from 'vite-plugin-eslint';

const browserslist = ['defaults', 'not IE 11', 'chrome > 48'];

function createVitePlugins(env: any) {
  const isMock = env.VITE_APP_USE_MOCK === 'true';

  const vitePlugins = [
    vue(),
    legacy({
      targets: browserslist,
    }),
    styleImport({
      libs: [
        {
          libraryName: '@zyx/vue3-components',
          esModule: true,
          resolveStyle: (name) => {
            return `@zyx/vue3-components/es/${name}/style`;
          },
        },
      ],
    }),
  ];
  // eslint
  if (!['prod', 'beta'].includes(env.VITE_ENV)) {
    vitePlugins.push(eslintPlugin());
  }
  // vite-plugin-mock
  isMock &&
    vitePlugins.push(
      viteMockServe({
        ignore: /^\_/,
        mockPath: 'mock',
        localEnabled: true,
        prodEnabled: false,
        injectCode: `
          import { setupProdMockServer } from './mock/_createProductionServer.ts';
          setupProdMockServer();
          `,
      }),
    );

  return vitePlugins;
}

function createBaseUrl(env: any) {
  switch (env.VITE_ENV) {
    case 'prod':
      return '';
    case 'beta':
      return '';
    default:
      return '/';
  }
}

// https://vitejs.dev/config/
export default ({ mode }: any) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: createBaseUrl(process.env),
    server: {
      host: '0.0.0.0',
    },
    build: {
      outDir: 'build',
      // sourcemap: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false, // 打包时删除console
          drop_debugger: true, // 打包时删除 debugger
          pure_funcs: ['console.log'],
        },
        output: {
          // 去掉注释内容
          comments: true,
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
      },
    },
    plugins: createVitePlugins(process.env),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve('src/assets/styles/base.less')}";`,
          },
          javascriptEnabled: true,
        },
      },
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: browserslist,
          }),
          postcsspxtoviewport({
            viewportWidth: 414, // (Number) 视窗的宽度，对应的是我们设计稿的宽度
            unitPrecision: 3, // (Number) 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
            selectorBlackList: ['.ignore'], // (Array) 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
            minPixelValue: 1, // (Number) 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
            mediaQuery: false, // (Boolean) 允许在媒体查询中转换`px`
          }),
        ],
      },
    },
  });
};
