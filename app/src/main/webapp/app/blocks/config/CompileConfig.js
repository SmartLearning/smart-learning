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
    function compileConfig($compileProvider, ENV) {
        // disable debug data on prod profile to improve performance
        if (ENV === 'prod') {
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
