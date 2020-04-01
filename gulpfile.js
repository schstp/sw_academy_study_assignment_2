'use strict';

var gulp = require('gulp'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    postcss = require('gulp-postcss'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    rimraf = require('rimraf');

sass.compiler = require('node-sass');
var reload = browserSync.reload;

var paths = {
    src: {
        html: 'src/*.html',
        scss: 'src/scss/main.scss',
        js: 'src/js/main.js',
        img: 'src/img/**/*.*',
        forms: 'src/forms/*.json',
    },

    build: {
        html: 'build/',
        css: 'build/css/',
        js: 'build/js/',
        img: 'build/img/',
        forms: 'build/forms/'
    },

    watch: {
        html: 'src/**/*.html',
        scss: 'src/scss/**/*.scss',
        js: 'src/js/**/*.js',
        img: 'src/img/**/*.*',
        forms: 'src/forms/*.json'
    },

    clean: './build',
};

var config = {
    server: {
        baseDir: './build'
    },
    host: 'localhost',
    port: 9000,
    browser: ['google-chrome-stable', 'firefox'],
    logPrefix: 'frontend-gulp'
};


function html(cb) {
    gulp.src(paths.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(paths.build.html))
        .pipe(reload({stream: true}));

    cb();
}


function css(cb) {
    gulp.src(paths.src.scss)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build.css))
        .pipe(reload({stream: true}));

    cb();
}


function js(cb) {
    gulp.src(paths.src.js)
        .pipe(sourcemaps.init())
        .pipe(rigger())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.build.js))
        .pipe(reload({stream: true}));

    cb();
}


function img(cb) {
    gulp.src(paths.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true,
        }))
        .pipe(gulp.dest(paths.build.img))
        .pipe(reload({stream: true}));

    cb();
}


function forms(cb) {
    gulp.src(paths.src.forms)
        .pipe(gulp.dest(paths.build.forms))
        .pipe(reload({stream: true}));

    cb();
}


function watch(cb) {
    gulp.watch(paths.watch.html, html);
    gulp.watch(paths.watch.scss, css);
    gulp.watch(paths.watch.js, js);
    gulp.watch(paths.watch.img, img);
    gulp.watch(paths.watch.forms, forms);

    cb();
}


function clean(cb) {
    rimraf(paths.clean, cb);
}


function webserver(cb) {
    browserSync.init(config);

    cb();
}


const build = gulp.parallel(html, css, js, img, forms);

exports.html = html;
exports.css = css;
exports.js = js;
exports.img = img;
exports.build = build;
exports.watch = watch;
exports.clean = clean;
exports.default = gulp.series(build, webserver, watch);
