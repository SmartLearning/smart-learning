/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module(
            'smartApp', [
                'yaru22.angular-timeago',
                'ngMaterial',
                'ngStorage',
                'ngMessages',
                'ngLetterAvatar',
                'ngSanitize',
                'tmh.dynamicLocale',
                'pascalprecht.translate',
                'camelCaseToHuman',
                'ngResource',
                'ngCookies',
                'ngAria',
                'ngCacheBuster',
                'ngFileUpload',
                'ui.router',
                'infinite-scroll',
                'angular-loading-bar',
                'oc.lazyLoad',
                'md.data.table',
                'ngAnimate',
                'textAngular',
                'ng.deviceDetector',
                'angularLazyImg',
                'angular-clipboard',
                'app.layout',
                'app.blocks',
                'app.home',
                'app.course'
            ]
        )
        .run(run);

    run.$inject = [
        'StateHandler',
        'TranslationHandler'
    ];

    /* @ngInject */
    function run(StateHandler, TranslationHandler) {
        StateHandler.initialize();
        TranslationHandler.initialize();
    }
})(angular);
