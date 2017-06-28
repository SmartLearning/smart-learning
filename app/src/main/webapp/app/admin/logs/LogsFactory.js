/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.logs')
        .factory('Logs', LogsFactory);

    LogsFactory.$inject = ['$resource'];
    /* @ngInject */
    function LogsFactory($resource) {
        return $resource(
            'api/logs', {}, {
                'findAll': {
                    method: 'GET',
                    isArray: true
                },
                'changeLevel': {method: 'PUT'}
            }
        );
    }

})(angular);
