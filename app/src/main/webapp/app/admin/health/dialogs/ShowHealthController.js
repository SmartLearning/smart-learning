/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.health')
        .controller('ShowHealthController', ShowHealthController);

    ShowHealthController.$inject = [
        '$mdDialog',
        'model',
        'baseName',
        'subSystemName'
    ];
    /* @ngInject */
    function ShowHealthController($mdDialog, model, baseName, subSystemName) {
        var vm = this;

        vm.close = close;
        vm.model = model;
        vm.baseName = baseName;
        vm.subSystemName = subSystemName;
        vm.headers = [
            {
                text: 'health.details.name',
                field: 'field'
            },
            {
                text: 'health.details.value',
                get: function (row) {
                    if (angular.isArray(row.value)) {
                        return row.value.join('<br />');
                    } else if (angular.isObject(row.value)) {
                        return Object.keys(row.value).map(onIterateObject).join('<br />');
                    }

                    return row.value;
                    ///////////////////////////////

                    function onIterateObject(key) {
                        return key + ':' + row.value[key];
                    }
                }
            },
            {
                text: 'health.details.error',
                get: function () {
                    return model.error;
                }
            }
        ];

        activate();

        ////////////////

        function activate() {
            vm.data = [];
            angular.forEach(model.details, onIterateDetails);
            vm.totalItems = vm.data.length;

            ////////////////////////////////

            function onIterateDetails(value, key) {
                vm.data.push({
                    value: value,
                    field: key
                });
            }
        }

        function close() {
            $mdDialog.cancel();
        }
    }

})(angular);
