/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var inject = require('gulp-inject');
var es = require('event-stream');
var gulpIf = require('gulp-if');
var order = require('gulp-order');
var naturalSort = require('gulp-natural-sort');
var angularFileSort = require('gulp-angular-filesort');
var bowerFiles = require('main-bower-files');

var handleErrors = require('./handle-errors');
var config = require('./config');

module.exports = {
    app: app,
    vendor: vendor,
    test: test,
    troubleshoot: troubleshoot
};

////////////////////////////////////////////

function app() {
    return gulp.src(config.app + 'index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(
            gulp.src(config.app + 'app/**/*.js')
                .pipe(naturalSort())
                .pipe(angularFileSort())
                .pipe(gulpIf(config.js, order(config.jsOrder))), {relative: true}
            )
        )
        .pipe(inject(gulp.src(config.css), {relative: true}))
        .pipe(gulp.dest(config.app));
}

function vendor() {
    return gulp.src(config.app + 'index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(
            gulp.src(bowerFiles(), {read: false})
                .pipe(naturalSort())
                .pipe(gulpIf(config.vendorOrder, order(config.vendorOrder))), {name: 'bower', relative: true}
            )
        )
        .pipe(gulp.dest(config.app));
}

function test() {
    return gulp.src(config.test + 'karma.conf.js')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(inject(
            gulp.src(bowerFiles({includeDev: true, filter: ['**/*.js']}), {read: false})
                .pipe(naturalSort())
                .pipe(order(config.vendorOrder)),
            {
                starttag: '// bower:js',
                endtag: '// endbower',
                transform: transform
            })
        )
        .pipe(gulp.dest(config.test));

    ////////////////////////////

    function transform(filepath) {
        return '\'' + filepath.substring(1, filepath.length) + '\',';
    }
}

function troubleshoot() {
    /* this task removes the troubleshooting content from index.html*/
    return gulp.src(config.app + 'index.html')
        .pipe(plumber({errorHandler: handleErrors}))
        /* having empty src as we dont have to read any files*/
        .pipe(
            inject(
                gulp.src('', {read: false}), {
                    starttag: '<!-- inject:troubleshoot -->',
                    removeTags: true,
                    transform: transform
                }
            )
        )
        .pipe(gulp.dest(config.app));

    /////////////////////////////////

    function transform() {
        return '<!-- Angular views -->';
    }
}
