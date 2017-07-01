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
                'ngResource',
                'ngCookies',
                'ngAria',
                'ngCacheBuster',
                'ngFileUpload',
                'ui.mask',
                'ui.router',
                'infinite-scroll',
                'angular-loading-bar',
                'oc.lazyLoad',
                'md.data.table',
                'ngAnimate',
                'ui.tree',
                'textAngular',
                'ng.deviceDetector',
                'angularLazyImg',
                'angular-clipboard',
                'app.admin',
                'app.layout',
                'app.blocks',
                'app.account',
                'app.home'
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
