/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('authInterceptor', authInterceptorFactory);

    authInterceptorFactory.$inject = [
        '$localStorage',
        '$sessionStorage'
    ];
    /* @ngInject */
    function authInterceptorFactory($localStorage, $sessionStorage) {
        return {
            request: request
        };

        ////////////////

        function request(config) {
            /*jshint camelcase: false */
            config.headers = config.headers || {};
            var token = $localStorage.authenticationToken || $sessionStorage.authenticationToken;

            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }

            return config;
        }
    }

})(angular);
