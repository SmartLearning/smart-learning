/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('StorageUtil', StorageUtilService);

    StorageUtilService.$inject = ['$window'];
    /* @ngInject */
    function StorageUtilService($window) {
        this.get = get;
        this.save = save;
        this.remove = remove;
        this.clearAll = clearAll;

        ////////////////

        function get(key) {
            return JSON.parse($window.localStorage.getItem(key));
        }

        function save(key, data) {
            $window.localStorage.setItem(key, JSON.stringify(data));
        }

        function remove(key) {
            $window.localStorage.removeItem(key);
        }

        function clearAll() {
            $window.localStorage.clear();
        }
    }

})(angular);
