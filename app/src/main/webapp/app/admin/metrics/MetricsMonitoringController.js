(function () {
    'use strict';

    angular
        .module('admin.metrics')
        .controller('MetricsMonitoringController', MetricsMonitoringController);

    MetricsMonitoringController.$inject = [
        '$mdDialog',
        'threadDump'
    ];
    /* @ngInject */
    function MetricsMonitoringController($mdDialog, threadDump) {
        var vm = this;

        vm.cancel = cancel;
        vm.getLabelClass = getLabelClass;
        vm.threadDump = threadDump;
        vm.threadDumpAll = 0;
        vm.threadDumpBlocked = 0;
        vm.threadDumpRunnable = 0;
        vm.threadDumpTimedWaiting = 0;
        vm.threadDumpWaiting = 0;

        angular.forEach(threadDump, function (value) {
            if (value.threadState === 'RUNNABLE') {
                vm.threadDumpRunnable += 1;
            } else if (value.threadState === 'WAITING') {
                vm.threadDumpWaiting += 1;
            } else if (value.threadState === 'TIMED_WAITING') {
                vm.threadDumpTimedWaiting += 1;
            } else if (value.threadState === 'BLOCKED') {
                vm.threadDumpBlocked += 1;
            }
        });

        vm.threadDumpAll = vm.threadDumpRunnable + vm.threadDumpWaiting +
            vm.threadDumpTimedWaiting + vm.threadDumpBlocked;

        function cancel() {
            $mdDialog.cancel();
        }

        function getLabelClass(threadState) {
            switch (threadState) {
                case 'RUNNABLE':
                    return 'label-success';
                    break;
                case 'WAITING':
                    return 'label-info';
                    break;
                case 'TIMED_WAITING':
                    return 'label-warning';
                    break;
                case 'BLOCKED':
                    return 'label-danger';
                    break;
            }
        }
    }
})();
