'use strict';

var gulp = require('gulp');
var rev = require('gulp-rev');
var plumber = require('gulp-plumber');
var es = require('event-stream');
var flatten = require('gulp-flatten');
var replace = require('gulp-replace');
var bowerFiles = require('main-bower-files');
var changed = require('gulp-changed');

var handleErrors = require('./handle-errors');
var config = require('./config');

module.exports = {
    i18n: i18n,
    languages: languages,
    fonts: fonts,
    common: common,
    swagger: swagger,
    images: images
};

////////////////////////////////////////////

function i18n() {
    return gulp.src(config.app + 'i18n/**')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.dist + 'i18n/'))
        .pipe(gulp.dest(config.dist + 'i18n/'));
}

function languages() {
    var locales = config.languages.map(iterateOnLanguage);
    return gulp.src(locales)
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.app + 'i18n/'))
        .pipe(gulp.dest(config.app + 'i18n/'));

    ////////////////////////////////////

    function iterateOnLanguage(locale) {
        return config.bower + 'angular-i18n/angular-locale_' + locale + '.js';
    }
}

function fonts() {
    return es.merge(
        gulp.src(config.app + 'content/**/*.{woff,woff2,svg,ttf,eot,otf}')
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(changed(config.dist + 'content/fonts/'))
            .pipe(flatten())
            .pipe(rev())
            .pipe(gulp.dest(config.dist + 'content/fonts/'))
            .pipe(rev.manifest(config.revManifest, {
                base: config.dist,
                merge: true
            }))
            .pipe(gulp.dest(config.dist))
    );
}

function common() {
    return gulp.src(
        [
            config.app + 'robots.txt',
            config.app + 'favicon.ico',
            config.app + '.htaccess'
        ],
        {dot: true}
    )
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.dist))
        .pipe(gulp.dest(config.dist));
}

function swagger() {
    return es.merge(
        gulp.src([
            config.bower + 'swagger-ui/dist/**',
            '!' + config.bower + 'swagger-ui/dist/index.html',
            '!' + config.bower + 'swagger-ui/dist/swagger-ui.min.js',
            '!' + config.bower + 'swagger-ui/dist/swagger-ui.js'
        ])
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(changed(config.swaggerDist))
            .pipe(gulp.dest(config.swaggerDist)),
        gulp.src(config.app + 'swagger-ui/index.html')
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(changed(config.swaggerDist))
            .pipe(replace('../bower_components/swagger-ui/dist/', ''))
            .pipe(replace('swagger-ui.js', 'lib/swagger-ui.min.js'))
            .pipe(gulp.dest(config.swaggerDist)),
        gulp.src(config.bower + 'swagger-ui/dist/swagger-ui.min.js')
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(changed(config.swaggerDist + 'lib/'))
            .pipe(gulp.dest(config.swaggerDist + 'lib/'))
    );
}

function images() {
    return gulp.src(bowerFiles({filter: ['**/*.{gif,jpg,png}']}), {base: config.bower})
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(changed(config.dist + 'bower_components'))
        .pipe(gulp.dest(config.dist + 'bower_components'));
}
