/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var flatten = require('gulp-flatten');
var expect = require('gulp-expect-file');
var rev = require('gulp-rev');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var htmlMin = require('gulp-htmlmin');
var templateCache = require('gulp-angular-templatecache');
var imageMin = require('gulp-imagemin');
var es = require('event-stream');

var handleErrors = require('./handle-errors');
var config = require('./config');

module.exports = {
    sass: compileSass,
    styles: styles,
    cacheHtml: html,
    compressImages: images,
    watch: watch
};

/////////////////////////////

function compileSass() {
    return es.merge(
        gulp.src(config.sassSrc)
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(expect(config.sassSrc))
            .pipe(changed(config.cssDir, {extension: '.css'}))
            .pipe(sass({includePaths: config.bower}).on('error', sass.logError))
            .pipe(gulp.dest(config.cssDir)),
        gulp.src(config.bower + '**/fonts/**/*.{woff,woff2,svg,ttf,eot,otf}')
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(changed(config.app + 'content/fonts'))
            .pipe(flatten())
            .pipe(gulp.dest(config.app + 'content/fonts'))
    );
}

function styles() {
    return gulp.src(config.app + 'content/css')
        .pipe(browserSync.reload({stream: true}));
}

function html() {
    return gulp.src(config.app + 'app/**/*.html')
        .pipe(htmlMin({collapseWhitespace: true}))
        .pipe(templateCache(
            {
                module: config.moduleName,
                root: 'app/',
                moduleSystem: 'IIFE'
            }
        ))
        .pipe(gulp.dest(config.tmp));
}

function images() {
    return gulp.src(config.app + 'content/images/**')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.dist + 'content/images'))
        .pipe(
            imageMin(
                {
                    optimizationLevel: 5,
                    progressive: true,
                    interlaced: true
                }
            )
        )
        .pipe(rev())
        .pipe(gulp.dest(config.dist + 'content/images'))
        .pipe(
            rev.manifest(
                config.revManifest, {
                    base: config.dist,
                    merge: true
                }
            )
        )
        .pipe(gulp.dest(config.dist))
        .pipe(browserSync.reload({stream: true}));
}

function watch() {
    gulp.watch('bower.json', ['install']);
    gulp.watch(
        [
            'gulpfile.js',
            'build.gradle'
        ],
        ['ngconstant:dev']
    );
    gulp.watch(config.sassSrc, ['styles']);
    gulp.watch(config.app + 'content/images/**', ['images']);
    gulp.watch(config.app + 'app/**/*.js', ['inject:app']);
    gulp.watch(
        [
            config.app + '*.html',
            config.app + 'app/**',
            config.app + 'i18n/**'
        ]
    ).on('change', browserSync.reload);
}
