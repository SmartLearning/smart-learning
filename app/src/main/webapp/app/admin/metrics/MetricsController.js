/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.metrics')
        .controller('MetricsController', MetricsController);

    MetricsController.$inject = [
        '$scope',
        '$mdDialog',
        'Metrics'
    ];

    function MetricsController($scope, $mdDialog, Metrics) {
        var vm = this;

        vm.metrics = {};
        vm.refresh = refresh;
        vm.refreshThreadDumpData = refreshThreadDumpData;
        vm.servicesStats = {};
        vm.updatingMetrics = true;

        vm.refresh();

        $scope.$watch('vm.metrics', onWatch);

        ///////////////////////////////////////////////////////////

        function onWatch(newValue) {
            vm.servicesStats = {};
            angular.forEach(newValue.timers, onTimer);

            ////////////////////////////////////////////////////

            function onTimer(value, key) {
                if (key.indexOf('web.rest') !== -1 || key.indexOf('service') !== -1) {
                    vm.servicesStats[key] = value;
                }
            }

        }

        function refresh() {
            vm.updatingMetrics = true;
            Metrics.getMetrics().then(onSuccess, onError);

            ///////////////////////////////////////////////////

            function onSuccess(promise) {
                vm.metrics = promise;
                vm.updatingMetrics = false;
            }

            function onError(promise) {
                vm.metrics = promise.data;
                vm.updatingMetrics = false;
            }
        }

        function refreshThreadDumpData() {
            Metrics.threadDump().then(onSuccess);

            ///////////////////////////////////////////////////

            function onSuccess(data) {
                $mdDialog.open({
                    templateUrl: 'app/admin/metrics/MetricsMonitoringView.html',
                    controller: 'MetricsMonitoringController',
                    controllerAs: 'vm',
                    locals: {
                        threadDump: data
                    }
                });
            }
        }


    }
})(angular);
