/**
 * Developed by Yakup Kaya (yakupkaya@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('Tag', TagFactory);

    TagFactory.$inject = [
        '$resource',
        'CrudUtils'
    ];
    /* @ngInject */
    function TagFactory($resource, CrudUtils) {
        var url = 'product/api/tags';
        return $resource(
            url,
            {},
            angular.merge(
                {
                    search: {
                        url: url + '/search',
                        method: 'POST',
                        isArray: true
                    },
                    findByIds: {
                        url: url + '/names/:ids',
                        method: 'GET',
                        isArray: false
                    }
                },
                CrudUtils.getAll()
            )
        );
    }

})(angular);
