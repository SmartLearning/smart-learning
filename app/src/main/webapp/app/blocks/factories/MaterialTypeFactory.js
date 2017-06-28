/**
 * Developed by Yakup Kaya (yakupkaya@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('MaterialType', MaterialTypeFactory);

    MaterialTypeFactory.$inject = ['$resource'];
    /* @ngInject */
    function MaterialTypeFactory($resource) {
        var url = 'catalog/api/material-types';
        return $resource(
            url,
            {},
            {
                search: {
                    url: url + '/search',
                    method: 'POST',
                    isArray: true
                }
            }
        );
    }

})(angular);
