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

        vm.cachesStats = {};
        vm.analyzes = {};
        vm.refresh = refresh;
        vm.refreshThreadDumpData = refreshThreadDumpData;
        vm.servicesStats = {};
        vm.updatingAnalyzes = true;

        activate();

        ////////////////

        function activate() {
            vm.refresh();

            $scope.$watch(
                'vm.analyzes', function (newValue) {
                    vm.servicesStats = {};
                    vm.cachesStats = {};
                    angular.forEach(
                        newValue.timers, function (value, key) {
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
                    );
                }
            );
        }

        function refresh() {
            vm.updatingAnalyzes = true;
            Analyzes.getAnalyzes().then(
                function (promise) {
                    vm.analyzes = promise;
                    vm.updatingAnalyzes = false;
                }, function (promise) {
                    vm.analyzes = promise.data;
                    vm.updatingAnalyzes = false;
                }
            );
        }

        function refreshThreadDumpData() {
            Analyzes.threadDump().then(
                function (data) {
                    $mdDialog.show(
                        {
                            templateUrl: 'app/admin/analyzes/AnalyzesModalView.html',
                            controller: 'AnalyzesModalController',
                            controllerAs: 'vm',
                            resolve: {
                                threadDump: function () {
                                    return data;
                                }
                            }
                        }
                    );
                }
            );
        }
    }

})(angular);
