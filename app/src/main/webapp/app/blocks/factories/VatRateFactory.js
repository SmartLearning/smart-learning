/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('VatRate', VatRateFactory);

    VatRateFactory.$inject = ['$resource'];
    /* @ngInject */
    function VatRateFactory($resource) {
        var url = 'catalog/api/vat-rates';
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
