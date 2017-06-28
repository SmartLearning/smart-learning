/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .controller('ProcessErrorUtilController', ProcessErrorUtilController);

    ProcessErrorUtilController.$inject = [
        '$mdDialog',
        'processId',
        'Process'
    ];
    /* @ngInject */
    function ProcessErrorUtilController($mdDialog, processId, Process) {
        var vm = this;

        vm.errors = [];
        vm.busy = false;
        vm.pagination = {
            page: -1,
            size: 5
        };
        vm.nextPage = nextPage;
        vm.cancel = cancel;

        activate();

        ////////////////

        function activate() {
            nextPage();
        }

        function nextPage() {
            if (vm.busy) {
                return;
            }
            vm.busy = true;
            Process.getAllErrors(
                processId,
                {
                    page: ++vm.pagination.page,
                    size: vm.pagination.size
                }
            ).then(
                function (item) {
                    vm.busy = (vm.pagination.size * (vm.pagination.page + 1)) >= item.headers('X-Total-Count');
                    vm.errors = vm.errors.concat(item.data);
                }
            ).catch(
                function (error) {
                    console.error(arguments);
                }
            )
        }

        function cancel() {
            $mdDialog.hide();
        }
    }

})(angular);
