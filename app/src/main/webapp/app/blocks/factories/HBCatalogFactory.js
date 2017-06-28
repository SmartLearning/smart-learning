/**
 * Developed by Yakup Kaya (yakupkaya@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('HBCatalog', HBCatalogFactory);

    HBCatalogFactory.$inject = ['$resource'];
    /* @ngInject */
    function HBCatalogFactory($resource) {
        var url = 'catalog/api/catalog-types';
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
