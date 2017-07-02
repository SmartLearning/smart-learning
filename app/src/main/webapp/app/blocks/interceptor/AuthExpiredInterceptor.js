/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('authExpiredInterceptor', authExpiredInterceptorFactory);

    authExpiredInterceptorFactory.$inject = [
        '$q',
        '$injector',
        '$localStorage',
        '$sessionStorage'
    ];
    /* @ngInject */
    function authExpiredInterceptorFactory($q, $injector, $localStorage, $sessionStorage) {
        return {
            responseError: responseError
        };

        //////////////////////////////////////////////////

        function responseError(response) {
            if (response.status === 401) {
                //saveImportantLocalStorage();
                //$localStorage.$reset();
                $sessionStorage.$reset();
                delete $localStorage.authenticationToken;
                delete $sessionStorage.authenticationToken;
                var Principal = $injector.get('Principal');
                if (Principal.isAuthenticated()) {
                    var Auth = $injector.get('Auth');
                    Auth.authorize(true);
                }
            }
            return $q.reject(response);
        }
    }

})(angular);
