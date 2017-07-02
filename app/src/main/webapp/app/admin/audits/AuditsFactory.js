/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.audits')
        .factory('Audits', AuditsFactory);

    AuditsFactory.$inject = [
        '$resource',
        'DateUtils'
    ];
    /* @ngInject */
    function AuditsFactory($resource, DateUtils) {
        return $resource(
            'management/audits/:id',
            {},
            {
                'get': {
                    method: 'GET',
                    isArray: true,
                    transformResponse: function (data) {
                        return DateUtils.fromServer(data, ['timestamp']);
                    }
                },
                'query': {
                    method: 'GET',
                    isArray: true,
                    params: {
                        fromDate: null,
                        toDate: null
                    },
                    transformResponse: function (data) {
                        return DateUtils.fromServer(data, ['timestamp']);
                    }
                }
            }
        );
    }

})(angular);
