/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .config(alertConfig);

    alertConfig.$inject = ['AlertProvider'];
    /* @ngInject */
    function alertConfig(AlertProvider) {
        // set below to true to make alerts look like toast
        AlertProvider.showAsToast(false);
    }
})(angular);
