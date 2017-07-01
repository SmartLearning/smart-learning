/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.util')
        .factory('AuthServer', AuthServerFactory);

    AuthServerFactory.$inject = [
        '$http',
        '$localStorage',
        '$sessionStorage',
        '$q',
        'Principal'
    ];
    /* @ngInject */
    function AuthServerFactory($http, $localStorage, $sessionStorage, $q, Principal) {
        return {
            getToken: getToken,
            hasValidToken: hasValidToken,
            login: login,
            loginHb: loginHb,
            loginWithToken: loginWithToken,
            storeAuthenticationToken: storeAuthenticationToken,
            logout: logout,
            checkAuthenticationToken: checkAuthenticationToken
        };

        ////////////////

        function getToken() {
            return $localStorage.authenticationToken || $sessionStorage.authenticationToken;
        }

        function hasValidToken() {
            var token = this.getToken();
            return token && token.expires && token.expires > new Date().getTime();
        }

        function login(credentials) {
            var data = {
                username: credentials.username,
                password: credentials.password,
                authenticationType: credentials.authType,
                rememberMe: credentials.rememberMe
            };
            return $http.post('/api/authenticate', data).success(authenticateSuccess(data.rememberMe));
        }

        function loginHb(token) {
            return $http.post('/hb/' + token).success(authenticateSuccess(true));
        }

        function authenticateSuccess(rememberMe) {
            return onSuccess;

            /////////////////////////////////////////

            function onSuccess(data, status, headers) {
                return checkAuthenticationToken(headers, rememberMe);
            }
        }

        function checkAuthenticationToken(headers, rememberMe) {
            var bearerToken = headers('Authorization');
            if (angular.isDefined(bearerToken) && bearerToken.slice(0, 7) === 'Bearer ') {
                var jwt = bearerToken.slice(7, bearerToken.length);
                storeAuthenticationToken(jwt, rememberMe);
                return jwt;
            }
        }

        function loginWithToken(jwt, rememberMe) {
            var deferred = $q.defer();

            if (jwt !== undefined) {
                storeAuthenticationToken(jwt, rememberMe);
                deferred.resolve(jwt);
            }
            else {
                deferred.reject();
            }

            return deferred.promise;
        }

        function storeAuthenticationToken(jwt, rememberMe) {
            if (rememberMe) {
                $localStorage.authenticationToken = jwt;
            } else {
                $sessionStorage.authenticationToken = jwt;
            }
        }

        function logout() {
            $localStorage.$reset();
            $sessionStorage.$reset();
            delete $localStorage.authenticationToken;
            delete $sessionStorage.authenticationToken;
        }
    }

})(angular);
