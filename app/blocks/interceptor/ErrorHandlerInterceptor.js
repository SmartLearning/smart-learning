/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('errorHandlerInterceptor', errorHandlerInterceptorFactory);

    errorHandlerInterceptorFactory.$inject = [
        '$q',
        '$rootScope'
    ];
    /* @ngInject */
    function errorHandlerInterceptorFactory($q, $rootScope) {
        return {
            responseError: responseError
        };

        ////////////////

        function responseError(response) {
            if (!angular.isObject(response.config) || response.config.broadcast !== false) {
                if (response.status !== 401 || !angular.isString(response.data.path) || response.data.path.indexOf('/api/account') < 0) {
                    $rootScope.$emit('smartApp.httpError', response);
                }
            }

            return $q.reject(response);
        }
    }

})(angular);
