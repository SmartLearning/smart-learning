'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

var serve = require('./gulp/serve');
var clean = require('./gulp/clean');
var copy = require('./gulp/copy');
var tasks = require('./gulp/task');
var constant = require('./gulp/constant');
var inject = require('./gulp/inject');
var test = require('./gulp/test');
var build = require('./gulp/build');
var config = require('./gulp/config');

////////////////////////////////////

gulp.task('clean:all', clean.all);

gulp.task('clean:css', clean.css);

gulp.task('copy', [
    'copy:i18n',
    'copy:fonts',
    'copy:common'
]);

gulp.task('copy:i18n', copy.i18n);

gulp.task('copy:languages', copy.languages);

gulp.task('copy:fonts', copy.fonts);

gulp.task('copy:common', copy.common);

gulp.task('copy:images', copy.images);

gulp.task('sass', ['clean:css'], tasks.sass);

gulp.task('styles', ['sass'], tasks.styles);

gulp.task('images', tasks.compressImages);

gulp.task('inject', runInject);

gulp.task('inject:dep', [
    'inject:test',
    'inject:vendor'
]);

gulp.task('inject:app', inject.app);

gulp.task('inject:vendor', inject.vendor);

gulp.task('inject:test', inject.test);

gulp.task('inject:troubleshoot', inject.troubleshoot);

gulp.task('assets:prod', [
    'images',
    'styles',
    'html',
    'copy:images'
], runBuild);

gulp.task('html', tasks.cacheHtml);

gulp.task('ngconstant:dev', constant.dev);

gulp.task('ngconstant:prod', constant.prod);

// check app for eslint errors
gulp.task('eslint', test.eslint.run);

// check app for eslint errors anf fix some of them
gulp.task('eslint:fix', test.eslint.fix);

gulp.task('test', [
    'inject:test',
    'ngconstant:dev'
], test.karma);

/*to run individual suites pass `gulp protractor suite suiteName`
 for enviroment "gulp pratractor"
 also "gulp protractor --suite logout" for both*/
gulp.task('protractor', test.protractor);

gulp.task('itest', ['protractor']);

gulp.task('watch', tasks.watch);

gulp.task('install', runInstall);

gulp.task('serve:run', runServe);

gulp.task('serve:listen', serve);

gulp.task('build:app', build.app);

gulp.task('build', ['clean:all'], onBuildSuccess);

gulp.task('default', ['build']);

///////////////////////////////

function runInject() {
    runSequence('inject:dep', 'inject:app');
}

function runInstall() {
    runSequence([
        'inject:dep',
        'ngconstant:dev',
        'sass',
        'copy:languages',
        'inject:app',
        'inject:troubleshoot'
    ]);
}

function runServe(cb) {
    runSequence([
        'install'
    ], 'serve:listen', cb);
}

function runBuild(cb) {
    runSequence('build:app', cb);
}

function onBuildSuccess(cb) {
    runSequence(
        [
            'copy',
            'inject:vendor',
            'ngconstant:prod',
            'copy:languages',
            'inject:app',
            'inject:troubleshoot',
            'assets:prod'
        ], cb
    );
}
