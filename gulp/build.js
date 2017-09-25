'use strict';

var fs = require('fs');
var gulp = require('gulp');
var lazypipe = require('lazypipe');
var footer = require('gulp-footer');
var sourcemaps = require('gulp-sourcemaps');
var rev = require('gulp-custom-rev');
var htmlmin = require('gulp-htmlmin');
var ngAnnotate = require('gulp-ng-annotate');
var prefix = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var jsonMinify = require('gulp-jsonminify');
var useref = require('gulp-useref');
var revReplace = require("gulp-rev-replace");
var plumber = require('gulp-plumber');
var gulpIf = require('gulp-if');
var handleErrors = require('./handle-errors');
var util = require('./utils');
var es = require('event-stream');

var config = require('./config');

var initTask = lazypipe()
    .pipe(sourcemaps.init, {loadMaps: true})
    .pipe(footer, ';');
var jsTask = lazypipe()
    .pipe(ngAnnotate)
    .pipe(uglify);
var jsonTask = lazypipe()
    .pipe(jsonMinify);
var cssTask = lazypipe()
    .pipe(prefix)
    .pipe(cssnano);

module.exports = {
    app: app
};

//////////////////////////////////

function app() {
    var templates = fs.readFileSync(config.tmp + '/templates.js');
    var manifest = gulp.src(config.revManifest);

    return es.merge(
        gulp.src(
            [
                config.app + '**/*.html',
                '!' + config.app + 'app/**/*.html',
                '!' + config.app + 'swagger-ui/**/*',
                '!' + config.bower + '**/*.html'
            ]
        )
            .pipe(plumber({errorHandler: handleErrors}))
            //init sourcemaps and prepend semicolon
            .pipe(useref({}, initTask))
            //append html templates
            .pipe(gulpIf('**/main-app.js', footer(templates)))
            .pipe(gulpIf('*.js', jsTask()))
            .pipe(gulpIf('*.css', cssTask()))
            .pipe(gulpIf('*.html', htmlmin({collapseWhitespace: true})))
            .pipe(gulpIf('**/*.!(html)', rev(util.parseVersion())))
            .pipe(revReplace({manifest: manifest}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.dist)),

        gulp.src(config.dist + '**/*.json')
            .pipe(plumber({errorHandler: handleErrors}))
            .pipe(gulpIf('**/*.json', jsonTask()))
            .pipe(gulp.dest(config.dist))
    );
}
