/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('ResponseUtil', ResponseUtilService);

    ResponseUtilService.$inject = [];
    /* @ngInject */
    function ResponseUtilService() {
        this.parseLink = parseLink;
        this.buildSort = buildSort;

        ////////////////

        function parseLink(header) {
            if (header.length === 0) {
                throw new Error('input must not be of zero length');
            }

            // Split parts by comma
            var parts = header.split(',');
            var links = {};
            // Parse each part into a named link
            angular.forEach(parts, partsFunc);

            return links;

            function partsFunc(p) {
                var section = p.split(';');
                if (section.length !== 2) {
                    throw new Error('section could not be split on ";"');
                }
                var url = section[0].replace(/<(.*)>/, '$1').trim();
                var queryString = {};
                url.replace(
                    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
                    function ($0, $1, $2, $3) {
                        queryString[$1] = $3;
                    }
                );
                var page = queryString.page;
                if (angular.isString(page)) {
                    page = parseInt(page);
                }
                var name = section[1].replace(/rel="(.*)"/, '$1').trim();
                links[name] = page;
            }
        }

        function buildSort(orderBy) {
            if (orderBy && angular.isString(orderBy)) {
                var predicate = orderBy;
                var reverse = false;
                if (orderBy.indexOf('-') !== -1) {
                    predicate = orderBy.split('-')[1];
                    reverse = true;
                }

                return [predicate + ',' + (reverse ? 'asc' : 'desc')];
            }

            return [];
        }

    }

})(angular);
