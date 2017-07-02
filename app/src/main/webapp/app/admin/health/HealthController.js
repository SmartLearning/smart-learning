/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.health')
        .controller('HealthController', HealthController);

    HealthController.$inject = [
        '$mdDialog',
        'Health'
    ];
    /* @ngInject */
    function HealthController($mdDialog, Health) {
        var vm = this;

        vm.addHealthObject = addHealthObject;
        vm.flattenHealthData = flattenHealthData;
        vm.getModuleName = getModuleName;
        vm.hasSubSystem = hasSubSystem;
        vm.isHealthObject = isHealthObject;
        vm.refresh = refresh;
        vm.showHealth = showHealth;
        vm.transformHealthData = transformHealthData;
        vm.separator = '.';
        vm.updatingHealth = true;
        vm.pagination = {
            page: 1,
            size: 10,
            sort: ['url,desc'],
            options: [
                10,
                25,
                50,
                100
            ]
        };
        vm.headers = [
            {
                text: 'health.service.title',
                cellTemplateUrl: 'app/admin/health/cells/ServiceCellTemplateView.html',
                baseName: baseName,
                subSystemName: subSystemName
            },
            {
                text: 'health.status.title',
                cellTemplateUrl: 'app/admin/health/cells/StatusCellTemplateView.html',
                getLabelClass: getLabelClass
            },
            {
                text: 'health.details.title',
                cellTemplateUrl: 'app/admin/health/cells/DetailsCellTemplateView.html',
                showHealth: showHealth
            }
        ];

        activate();

        ////////////////

        function activate() {
            vm.refresh();
        }

        function addHealthObject(result, isLeaf, healthObject, name) {

            var healthData = {
                'name': name
            };
            var details = {};
            var hasDetails = false;

            angular.forEach(
                healthObject, function (value, key) {
                    if (key === 'status' || key === 'error') {
                        healthData[key] = value;
                    } else {
                        if (!vm.isHealthObject(value)) {
                            details[key] = value;
                            hasDetails = true;
                        }
                    }
                }
            );

            // Add the of the details
            if (hasDetails) {
                angular.extend(healthData, {'details': details});
            }

            // Only add nodes if they provide additional information
            if (isLeaf || hasDetails || healthData.error) {
                result.push(healthData);
            }
            return healthData;
        }

        function baseName(name) {
            if (name) {
                var split = name.split('.');
                return split[0];
            }
        }

        function flattenHealthData(result, path, data) {
            angular.forEach(
                data, function (value, key) {
                    if (vm.isHealthObject(value)) {
                        if (vm.hasSubSystem(value)) {
                            vm.addHealthObject(result, false, value, vm.getModuleName(path, key));
                            vm.flattenHealthData(result, vm.getModuleName(path, key), value);
                        } else {
                            vm.addHealthObject(result, true, value, vm.getModuleName(path, key));
                        }
                    }
                }
            );
            return result;
        }

        function getModuleName(path, name) {
            var result;
            if (path && name) {
                result = path + vm.separator + name;
            } else if (path) {
                result = path;
            } else if (name) {
                result = name;
            } else {
                result = '';
            }
            return result;
        }

        function hasSubSystem(healthObject) {
            var result = false;
            angular.forEach(
                healthObject, function (value) {
                    if (value && value.status) {
                        result = true;
                    }
                }
            );
            return result;
        }

        function isHealthObject(healthObject) {
            var result = false;
            angular.forEach(
                healthObject, function (value, key) {
                    if (key === 'status') {
                        result = true;
                    }
                }
            );
            return result;
        }

        function refresh() {
            vm.updatingHealth = true;
            vm.promise = Health.checkHealth().then(
                function (response) {
                    vm.data = vm.transformHealthData(response);
                    vm.totalItems = vm.data.length;
                    vm.updatingHealth = false;
                }, function (response) {
                    vm.data = vm.transformHealthData(response.data);
                    vm.totalItems = vm.data.length;
                    vm.updatingHealth = false;
                }
            ).$promise;
        }

        function getLabelClass(statusState) {
            if (statusState === 'UP') {
                return 'md-primary';
            } else {
                return 'md-danger';
            }
        }


        function showHealth(model) {
            $mdDialog.show({
                templateUrl: 'app/admin/health/dialogs/ShowHealthView.html',
                controller: 'ShowHealthController',
                controllerAs: 'vm',
                locals: {
                    model: model,
                    baseName: baseName,
                    subSystemName: subSystemName
                }
            });
        }

        function subSystemName(name) {
            if (name) {
                var split = name.split('.');
                split.splice(0, 1);
                var remainder = split.join('.');
                return remainder ? ' - ' + remainder : '';
            }
        }

        function transformHealthData(data) {
            var response = [];
            vm.flattenHealthData(response, null, data);
            return response;
        }
    }

})(angular);
