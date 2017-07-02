/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.analyzes')
        .controller('AnalyzesController', AnalyzesController);

    AnalyzesController.$inject = [
        '$scope',
        '$mdDialog',
        'Analyzes'
    ];
    /* @ngInject */
    function AnalyzesController($scope, $mdDialog, Analyzes) {
        var vm = this;

        vm.refresh = refresh;
        vm.refreshThreadDumpData = refreshThreadDumpData;
        vm.cachesStats = {};
        vm.analyzes = {};
        vm.servicesStats = {};
        vm.updatingAnalyzes = true;

        activate();

        ////////////////

        function activate() {
            vm.refresh();

            $scope.$watch('vm.analyzes', onWatch);

            /////////////////////////////////////////////////

            function onWatch(newValue) {
                vm.servicesStats = {};
                vm.cachesStats = {};
                angular.forEach(newValue.timers, onTimer);

                /////////////////////////////////////////////////

                function onTimer(value, key) {
                    if (key.indexOf('web.rest') !== -1 || key.indexOf('service') !== -1) {
                        vm.servicesStats[key] = value;
                    }
                    if (key.indexOf('net.sf.ehcache.Cache') !== -1) {
                        // remove gets or puts
                        var index = key.lastIndexOf('.');
                        var newKey = key.substr(0, index);

                        // Keep the name of the domain
                        index = newKey.lastIndexOf('.');
                        vm.cachesStats[newKey] = {
                            'name': newKey.substr(index + 1),
                            'value': value
                        };
                    }
                }
            }
        }

        function refresh() {
            vm.updatingAnalyzes = true;
            Analyzes.getAnalyzes().then(onSuccess, onError);

            //////////////////////////////////////////////////////

            function onSuccess(promise) {
                vm.analyzes = promise;
                vm.updatingAnalyzes = false;
            }

            function onError(promise) {
                vm.analyzes = promise.data;
                vm.updatingAnalyzes = false;
            }
        }

        function refreshThreadDumpData() {
            Analyzes.threadDump().then(onShow);

            /////////////////////////////////////////////

            function onShow(data) {
                $mdDialog.show(
                    {
                        templateUrl: 'app/admin/analyzes/AnalyzesModalView.html',
                        controller: 'AnalyzesModalController',
                        controllerAs: 'vm',
                        locals: {
                            threadDump: data
                        }
                    }
                );
            }
        }
    }

})(angular);
