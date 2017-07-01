/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.util')
        .factory('Account', AccountFactory);

    AccountFactory.$inject = ['$resource'];
    /* @ngInject */
    function AccountFactory($resource) {
        var url = '/api';
        return $resource(
            url + '/account',
            {},
            {
                'register': {
                    method: 'POST',
                    url: url + '/register'
                },
                'get': {
                    method: 'GET',
                    isArray: false
                }
            }
        );
    }

})(angular);
