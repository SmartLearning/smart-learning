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
            ], true
        );

        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');
        // jhipster-needle-angularjs-add-interceptor JHipster will add new application http interceptor here

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
