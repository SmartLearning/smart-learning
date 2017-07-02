/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('SidenavUtil', SidenavUtilService);

    SidenavUtilService.$inject = ['$rootScope', '$q', '$mdSidenav', '$mdCompiler'];
    /* @ngInject */
    function SidenavUtilService($rootScope, $q, $mdSidenav, $mdCompiler) {
        var deferred = null;
        this.show = show;
        this.cancel = cancel;
        this.hide = hide;

        ////////////////

        function show(componentId, options) {
            if ($mdSidenav(componentId).isOpen()) {
                return deferred.promise;
            }
            deferred = $q.defer();

            deferred.componentId = componentId;
            $mdCompiler.compile(options).then(function (compiledData) {
                var sideNav = angular.element(document.getElementById(componentId));
                sideNav.html(compiledData.link($rootScope.$new(true)));
                //sideNav.css("z-index",1000);
                $mdSidenav(componentId).open();
            });

            return deferred.promise;
        }

        function hide(response) {
            if (deferred) {
                deferred.resolve(response);
            }

            $mdSidenav(deferred.componentId).close();
        }

        function cancel(error) {
            if (deferred) {
                deferred.reject(error);
            }

            $mdSidenav(deferred.componentId).close();
        }
    }

})(angular);
