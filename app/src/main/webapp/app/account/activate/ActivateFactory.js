/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.activate')
        .factory('Activate', ActivateFactory);

    ActivateFactory.$inject = ['$resource'];

    function ActivateFactory($resource) {
        return $resource('api/activate', {}, {
            'get': {method: 'GET', params: {}, isArray: false}
        });
    }
})(angular);
