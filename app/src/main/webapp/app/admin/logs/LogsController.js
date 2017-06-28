/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.logs')
        .controller('LogsController', LogsController);

    LogsController.$inject = ['Logs'];
    /* @ngInject */
    function LogsController(Logs) {
        var vm = this;

        vm.changeLevel = changeLevel;

        activate();

        ////////////////

        function activate() {
            vm.loggers = Logs.findAll();
        }

        function changeLevel(name, level) {
            Logs.changeLevel(
                {
                    name: name,
                    level: level
                }, function () {
                    vm.loggers = Logs.findAll();
                }
            );
        }
    }

})(angular);
