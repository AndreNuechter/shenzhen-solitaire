import { defineConfig } from 'vite';
import { ViteMinifyPlugin as minifyHTML } from 'vite-plugin-minify';
import pugPlugin from 'vite-plugin-pug';

export default defineConfig({
    plugins: [
        pugPlugin(),
        minifyHTML({}),
    ],
    build: {
        emptyOutDir: true,
        outDir: './docs',
        assetsDir: './',
        // we dont want hashes on the output files
        rollupOptions: {
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].[ext]',
                assetFileNames: '[name].[ext]',
            },
        },
    },
    base: './',
    worker: {
        /* We dont want a hash on the worker file,
        so that the service worker is updated and
        not a new one added on each build,
        which would lock the cache */
        rollupOptions: {
            output: {
                entryFileNames: '[name].js',
            },
        },
    },
    define: {
        // these vars are used to bust the browser cache after a new build
        'process.env.appName': JSON.stringify('wargame'),
        'process.env.appVersion': JSON.stringify(Date.now()),
    },
});