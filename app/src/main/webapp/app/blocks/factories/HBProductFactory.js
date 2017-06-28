/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('HBProduct', HBProductFactory);

    HBProductFactory.$inject = ['$resource'];
    /* @ngInject */
    function HBProductFactory($resource) {
        var url = 'matching/api/hb-product';
        return $resource(
            url,
            {},
            {
                byBarcode: {
                    url: url + '/by-barcode/:barcode',
                    method: 'GET',
                    isArray: false
                },
                search: {
                    url: url + '/search',
                    method: 'POST',
                    isArray: true
                }
            }
        );
    }

})(angular);
