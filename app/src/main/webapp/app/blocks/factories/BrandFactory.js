/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('Brand', BrandFactory);

    BrandFactory.$inject = ['$resource'];
    /* @ngInject */
    function BrandFactory($resource) {
        var url = 'catalog/api/brands';
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
