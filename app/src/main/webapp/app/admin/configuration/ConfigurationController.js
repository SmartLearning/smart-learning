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

        vm.configurations = null;
        vm.properties = null;

        activate();

        ////////////////

        function activate() {
            Configuration.get().then(onPropertiesSuccess);
            Configuration.getEnv().then(onEnvSuccess);

            /////////////////////////////////////

            function onPropertiesSuccess(data) {
                vm.properties = data;
            }

            function onEnvSuccess(data) {
                vm.configurations = data;
            }
        }
    }

})(angular);
