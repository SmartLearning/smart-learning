/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.audits')
        .factory('Audits', AuditsFactory);

    AuditsFactory.$inject = ['$resource'];
    /* @ngInject */
    function AuditsFactory($resource) {
        return $resource(
            'api/audits/:id', {}, {
                'get': {
                    method: 'GET',
                    isArray: true
                },
                'query': {
                    method: 'GET',
                    isArray: true,
                    params: {
                        fromDate: null,
                        toDate: null
                    }
                }
            }
        );
    }

})(angular);
