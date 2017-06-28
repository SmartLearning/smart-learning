/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.util')
        .factory('Account', AccountFactory);

    AccountFactory.$inject = ['$resource', '$http'];
    /* @ngInject */
    function AccountFactory($resource, $http) {
        var resource = $resource(
            '/api/account', {}, {
                'get': {
                    method: 'GET',
                    params: {},
                    isArray: false,
                    interceptor: {
                        response: function (response) {
                            // expose response
                            return response;
                        }
                    }
                }
            }
        );

        resource.registerMerchant = registerMerchant;

        return resource;

        function registerMerchant(signUpDetail) {
            return $http.post("api/register", signUpDetail);
        }
    }

})(angular);
