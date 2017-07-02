/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

'use strict';

var gulp = require('gulp');
var argv = require('yargs').default({env: 'qa'}).argv;//setting default enviroment to qa for testing
var KarmaServer = require('karma').Server;
var plumber = require('gulp-plumber');
var protractor = require('gulp-protractor').protractor;
var gutil = require('gulp-util');
var gulpIf = require('gulp-if');
var eslint = require('gulp-eslint');

var handleErrors = require('./handle-errors');
var config = require('./config');
var util = require('./utils');

var configObj = {
    configFile: config.test + 'protractor.conf.js'
};

module.exports = {
    karma: karma,
    protractor: runProtractor,
    eslint: {
        run: runEslint,
        fix: eslintFix
    }
};

////////////////////////////////

function karma(done) {
    new KarmaServer({
        configFile: __dirname + '/../' + config.test + 'karma.conf.js',
        singleRun: true
    }, done).start();
}

function runProtractor() {
    configObj['args'] = [];//to be able to add multiple parameters

    if (argv.suite) {
        configObj['args'].push('--suite', argv.suite);
    }

    return gulp.src([])
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(protractor(configObj))
        .on('error', onError);

    //////////////////////////////

    function onError() {
        gutil.log('E2E Tests failed');
        process.exit(1);
    }
}

function runEslint() {
    return gulp.src(
        [
            'gulpfile.js',
            config.app + 'app/**/*.js'
        ]
    )
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
}

function eslintFix() {
    return gulp.src(config.app + 'app/**/*.js')
        .pipe(plumber({errorHandler: handleErrors}))
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(gulpIf(util.isLintFixed, gulp.dest(config.app + 'app')));
}
