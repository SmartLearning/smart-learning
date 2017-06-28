/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.configuration')
        .controller('ConfigurationController', ConfigurationController);

    ConfigurationController.$inject = ['Configuration'];
    /* @ngInject */
    function ConfigurationController(Configuration) {
        var vm = this;

        vm.allConfiguration = null;
        vm.configuration = null;

        activate();

        ////////////////

        function activate() {
            Configuration.get().then(
                function (configuration) {
                    vm.configuration = configuration;
                }
            );
            Configuration.getEnv().then(
                function (configuration) {
                    vm.allConfiguration = configuration;
                }
            );
        }
    }

})(angular);
