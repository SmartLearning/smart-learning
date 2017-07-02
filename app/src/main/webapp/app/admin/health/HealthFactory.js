/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.health')
        .factory('Health', HealthFactory);

    HealthFactory.$inject = ['$http'];
    /* @ngInject */
    function HealthFactory($http) {
        return {
            checkHealth: checkHealth
        };

        ////////////////

        function checkHealth() {
            return $http.get('management/health').then(
                function (response) {
                    return response.data;
                }
            );
        }
    }

})(angular);
