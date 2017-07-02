/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.analyzes')
        .factory('Analyzes', AnalyzeFactory);

    AnalyzeFactory.$inject = ['$http'];
    /* @ngInject */
    function AnalyzeFactory($http) {
        return {
            getAnalyzes: getAnalyzes,
            threadDump: threadDump
        };

        ////////////////

        function getAnalyzes() {
            return $http.get('metrics/metrics').then(
                function (response) {
                    return response.data;
                }
            );
        }

        function threadDump() {
            return $http.get('dump').then(
                function (response) {
                    return response.data;
                }
            );
        }
    }

})(angular);
