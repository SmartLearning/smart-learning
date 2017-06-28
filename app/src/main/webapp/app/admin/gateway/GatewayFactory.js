/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.gateway')
        .factory('Gateway', GatewayFactory);

    GatewayFactory.$inject = ['$resource'];
    /* @ngInject */
    function GatewayFactory($resource) {
        return $resource(
            'api/gateway/routes/:id', {}, {
                'query': {
                    method: 'GET',
                    isArray: true
                },
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return data;
                    }
                },
                'update': {method: 'PUT'}
            }
        );
    }

})(angular);
