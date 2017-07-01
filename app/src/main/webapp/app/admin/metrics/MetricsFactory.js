/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.metrics')
        .factory('Metrics', MetricsFactory);

    MetricsFactory.$inject = ['$http'];
    /* @ngInject */
    function MetricsFactory($http) {
        return {
            getMetrics: getMetrics,
            threadDump: threadDump
        };

        /////////////////////////////////////////////////////

        function getMetrics() {
            return $http.get('management/metrics').then(onSuccess);

            //////////////////////////////////////////////////////////////

            function onSuccess(response) {
                return response.data;
            }
        }

        function threadDump() {
            return $http.get('management/dump').then(onSuccess);

            //////////////////////////////////////////////////////////////

            function onSuccess(response) {
                return response.data;
            }
        }
    }
})(angular);
