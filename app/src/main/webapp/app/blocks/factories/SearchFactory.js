/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .factory('Search', SearchFactory);

    SearchFactory.$inject = ['$resource'];
    /* @ngInject */
    function SearchFactory($resource) {
        var url = 'search/api';
        return $resource(
            url,
            {},
            {
                variants: {
                    url: url + '/variants/:dummyProducts',
                    method: 'POST',
                    isArray: true
                },
                top: {
                    url: url + '/searches/top/:size/:field/:dummyProducts',
                    method: 'POST'
                },
                products: {
                    url: url + '/products/:dummyProducts',
                    method: 'POST',
                    isArray: true
                }
            }
        );
    }

})(angular);
