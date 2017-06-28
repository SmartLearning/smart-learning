/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('HBProductType', HBProductTypeFactory);

    HBProductTypeFactory.$inject = ['$resource'];
    /* @ngInject */
    function HBProductTypeFactory($resource) {
        var url = 'matching/api/hb-product-types';
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
