// Karma configuration
// http://karma-runner.github.io/0.13/config/configuration-file.html

var sourcePreprocessors = ['coverage'];
var gulpConfig = require("../../../gulp/config");

function isDebug() {
    return process.argv.indexOf('--debug') >= 0;
}

if (isDebug()) {
    // Disable JS minification if Karma is run with debug option.
    sourcePreprocessors = [];
}

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: 'src/test/javascript/'.replace(/[^/]+/g, '..'),

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'src/main/webapp/bower_components/jquery/dist/jquery.js',
            'src/main/webapp/bower_components/moment/moment.js',
            'src/main/webapp/bower_components/angular/angular.js',
            'src/main/webapp/bower_components/angular-translate/angular-translate.js',
            'src/main/webapp/bower_components/messageformat/messageformat.js',
            'src/main/webapp/bower_components/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.js',
            'src/main/webapp/bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js',
            'src/main/webapp/bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
            'src/main/webapp/bower_components/angular-animate/angular-animate.js',
            'src/main/webapp/bower_components/angular-aria/angular-aria.js',
            'src/main/webapp/bower_components/angular-cache-buster/angular-cache-buster.js',
            'src/main/webapp/bower_components/angular-clipboard/angular-clipboard.js',
            'src/main/webapp/bower_components/angular-cookies/angular-cookies.js',
            'src/main/webapp/bower_components/angular-lazy-img/release/angular-lazy-img.js',
            'src/main/webapp/bower_components/angular-material/angular-material.js',
            'src/main/webapp/bower_components/angular-messages/angular-messages.js',
            'src/main/webapp/bower_components/angular-mocks/angular-mocks.js',
            'src/main/webapp/bower_components/angular-moment/angular-moment.js',
            'src/main/webapp/bower_components/angular-resource/angular-resource.js',
            'src/main/webapp/bower_components/angular-sanitize/angular-sanitize.js',
            'src/main/webapp/bower_components/angular-scenario/angular-scenario.js',
            'src/main/webapp/bower_components/angular-timeago/dist/angular-timeago.js',
            'src/main/webapp/bower_components/angular-ui-router/release/angular-ui-router.js',
            'src/main/webapp/bower_components/rangy/rangy-core.js',
            'src/main/webapp/bower_components/bardjs/dist/bard-ngRouteTester.js',
            'src/main/webapp/bower_components/bardjs/dist/bard.js',
            'src/main/webapp/bower_components/angularjs-camelCase-human/camelcase-browser.js',
            'src/main/webapp/bower_components/json3/lib/json3.js',
            'src/main/webapp/bower_components/angular-loading-bar/build/loading-bar.js',
            'src/main/webapp/bower_components/angular-ui-mask/dist/mask.js',
            'src/main/webapp/bower_components/angular-material-data-table/dist/md-data-table.js',
            'src/main/webapp/bower_components/mdPickers/dist/mdPickers.min.js',
            'src/main/webapp/bower_components/ng-device-detector/ng-device-detector.js',
            'src/main/webapp/bower_components/ng-file-upload/ng-file-upload.js',
            'src/main/webapp/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
            'src/main/webapp/bower_components/ng-letter-avatar/ngletteravatar.js',
            'src/main/webapp/bower_components/ngstorage/ngStorage.js',
            'src/main/webapp/bower_components/oclazyload/dist/ocLazyLoad.js',
            'src/main/webapp/bower_components/rangy/rangy-classapplier.js',
            'src/main/webapp/bower_components/rangy/rangy-highlighter.js',
            'src/main/webapp/bower_components/rangy/rangy-selectionsaverestore.js',
            'src/main/webapp/bower_components/rangy/rangy-serializer.js',
            'src/main/webapp/bower_components/rangy/rangy-textrange.js',
            'src/main/webapp/bower_components/re-tree/re-tree.js',
            'src/main/webapp/bower_components/sinon/lib/sinon.js',
            'src/main/webapp/bower_components/textAngular/dist/textAngular-sanitize.js',
            'src/main/webapp/bower_components/textAngular/dist/textAngular.js',
            'src/main/webapp/bower_components/textAngular/dist/textAngularSetup.js',
            'src/main/webapp/bower_components/angular-dynamic-locale/src/tmhDynamicLocale.js',
            // endbower
            gulpConfig.app + 'app/**/AppModule.js',
            gulpConfig.app + 'app/**/admin/AdminModule.js',
            gulpConfig.app + 'app/**/admin/AdminRoute.js',
            gulpConfig.app + 'app/**/*Module.js',
            gulpConfig.app + 'app/**/*Constants.js',
            gulpConfig.app + 'app/**/*Provider.js',
            gulpConfig.app + 'app/**/AppConfig.js',
            gulpConfig.app + 'app/**/*Config.js',
            gulpConfig.app + 'app/**/AppRoute.js',
            gulpConfig.app + 'app/**/*Route.js',
            gulpConfig.app + 'app/**/*Service.js',
            gulpConfig.app + 'app/**/*Factory.js',
            gulpConfig.app + 'app/**/*Filter.js',
            gulpConfig.app + 'app/**/*Directive.js',
            gulpConfig.app + 'app/**/*Component.js',
            gulpConfig.app + 'app/**/*Interceptor.js',
            gulpConfig.app + 'app/**/*Handler.js',
            gulpConfig.app + 'app/**/*Controller.js',
            gulpConfig.app + 'app/**/*.js',
            gulpConfig.app + 'app/**/*.html',
            gulpConfig.app + 'i18n/**/*.js',
            gulpConfig.test + 'spec/helpers/Module.js',
            gulpConfig.test + 'spec/helpers/HttpBackend.js',
            gulpConfig.test + '!**/!(karma.conf|protractor.conf).js'
        ],


        // list of files / patterns to exclude
        exclude: ['src/test/javascript/e2e/**'],

        preprocessors: {
            './**/*.js': sourcePreprocessors
        },

        reporters: [
            'dots',
            'junit',
            'coverage',
            'progress'
        ],

        junitReporter: {
            outputFile: '../build/test-results/karma/TESTS-results.xml'
        },

        coverageReporter: {
            dir: 'build/test-results/coverage',
            reporters: [
                {type: 'lcov', subdir: 'report-lcov'}
            ]
        },

        // web server port
        port: 9876,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        // to avoid DISCONNECTED messages when connecting to slow virtual machines
        browserDisconnectTimeout: 10000, // default 2000
        browserDisconnectTolerance: 1, // default 0
        browserNoActivityTimeout: 4 * 60 * 1000 //default 10000
    });
};
