/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.gateway')
        .controller('GatewayController', GatewayController);

    GatewayController.$inject = ['Gateway'];
    /* @ngInject */
    function GatewayController(Gateway) {
        var vm = this;

        vm.gatewayRoutes = null;
        vm.refresh = refresh;
        vm.updatingRoutes = null;

        activate();

        ////////////////

        function activate() {
            vm.refresh();
        }

        function refresh() {
            vm.updatingRoutes = true;
            Gateway.query(
                function (result) {
                    vm.gatewayRoutes = result;
                    vm.updatingRoutes = false;
                }
            );
        }
    }

})(angular);
