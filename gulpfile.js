const {
    src,
    dest,
    parallel,
    watch
} = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const express = require('express');
const htmlreplace = require('gulp-html-replace');
const webpack = require('webpack-stream');
const jeditor = require('gulp-json-editor');
const webpackConfig = require('./webpack.config.js');

const randomInt = (max, min) => Math.trunc(Math.random() * max) - min;
const proverbs = [
    'At the gambling table, there are no fathers and sons.',
    'Reform a gambler. Cure leprosy.',
    'A pack of cards is the devil’s prayer-book.',
    'Rich gamblers and old trumpeters are rare.',
    'Luck never gives; it only lends.',
    'Before you gamble: Know the rules, the stakes and predetermine the quitting time.'
];

const htmlRoot = 'src/pug/index.pug';
const style = 'src/scss/index.scss';
const devDir = 'dev';
const deployDir = 'docs';

function html() {
    return src(htmlRoot)
        .pipe(pug())
        .pipe(dest(`${devDir}/`));
}

function htmlProd() {
    return src(htmlRoot)
        .pipe(pug())
        .pipe(htmlreplace({
            js: { src: 'index.js', tpl: '<script src="%s" defer></script>' }
        }))
        .pipe(dest(`${deployDir}/`));
}

function css() {
    return src(style)
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(dest(`${devDir}/css`));
}

function cssProd() {
    return src(style)
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(dest(`${deployDir}/css`));
}

function js() {
    return src('src/js/**/*.js')
        .pipe(webpack(webpackConfig))
        .pipe(dest(`${deployDir}/`));
}

function pwaAssets() {
    src('src/images/*.png')
        .pipe(dest(`${deployDir}/images`));
    return src('src/manifest.json')
        .pipe(jeditor((json) => {
            json.start_url = '/shenzhen-solitaire/';
            return json;
        }))
        .pipe(dest(`${deployDir}/`));
}

function watchCSSAndHTML() {
    watch(style, css);
    watch('src/pug/*.pug', html);
}

function serve() {
    const app = express();
    app.use(express.static('src'));
    app.use(express.static(devDir));
    // eslint-disable-next-line no-console
    app.listen(3000, () => console.log(proverbs[randomInt(proverbs.length, 0)]));
}

exports.default = parallel(html, css, serve, watchCSSAndHTML);
exports.bundle = parallel(htmlProd, cssProd, js, pwaAssets);