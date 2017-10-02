/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .config(httpConfig);

    httpConfig.$inject = [
        '$urlRouterProvider',
        '$httpProvider',
        'httpRequestInterceptorCacheBusterProvider',
        '$urlMatcherFactoryProvider'
    ];
    /* @ngInject */
    function httpConfig($urlRouterProvider, $httpProvider,
                        httpRequestInterceptorCacheBusterProvider, $urlMatcherFactoryProvider) {

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist(
            [
                /.*api.*/,
                /.*protected.*/
            ], false
        );

        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');

        $urlMatcherFactoryProvider.type(
            'boolean', {
                name: 'boolean',
                decode: decode,
                encode: encode,
                equals: equals,
                is: is,
                pattern: /bool|true|0|1/
            }
        );

        //////////////////////////////////////////

        function decode(val) {
            return val === true || val === 'true';
        }

        function encode(val) {
            return val ? 1 : 0;
        }

        function equals(a, b) {
            return this.is(a) && a === b;
        }

        function is(val) {
            return [
                    true,
                    false,
                    0,
                    1
                ].indexOf(val) >= 0;
        }
    }
})(angular);
