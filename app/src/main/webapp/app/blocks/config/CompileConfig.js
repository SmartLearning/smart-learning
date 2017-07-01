/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .config(compileConfig);

    compileConfig.$inject = [
        '$compileProvider',
        'ENV'
    ];
    /* @ngInject */
    function compileConfig($compileProvider, DEBUG_INFO_ENABLED) {
        // disable debug data on prod profile to improve performance
        if (!DEBUG_INFO_ENABLED) {
            $compileProvider.debugInfoEnabled(false);
        }
        /*
         If you wish to debug an application with this information
         then you should open up a debug console in the browser
         then call this method directly in this console:

         angular.reloadWithDebugInfo();
         */
    }
})(angular);
