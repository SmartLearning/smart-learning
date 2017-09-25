/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .config(localStorageConfig);

    localStorageConfig.$inject = [
        '$localStorageProvider',
        '$sessionStorageProvider'
    ];
    /* @ngInject */
    function localStorageConfig($localStorageProvider, $sessionStorageProvider) {
        $localStorageProvider.setKeyPrefix('smart-');
        $sessionStorageProvider.setKeyPrefix('smart-');
    }
})(angular);
