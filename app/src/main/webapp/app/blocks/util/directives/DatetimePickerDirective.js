/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    var defaultDateFormat = 'DD.MM.YYYY';

    angular.module('app.blocks')
        .directive('datetimePicker', DatetimePickerDirective)
        .config(ConfigureTimePicker);

    ConfigureTimePicker.$inject = ['$mdDateLocaleProvider'];
    /* @ngInject */
    function ConfigureTimePicker($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = formatDate;
        $mdDateLocaleProvider.parseDate = parseDate;

        function parseDate(dateString) {
            var m = moment(dateString, defaultDateFormat, true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        }

        function formatDate(date) {
            if (moment(date).isValid()) {
                return moment(date).format(defaultDateFormat);
            }
            return null;
        }
    }

    DatetimePickerDirective.$inject = [];
    /* @ngInject */
    function DatetimePickerDirective() {
        return {
            bindToController: true,
            controller: DatetimePickerController,
            controllerAs: 'vm',
            restrict: 'E',
            templateUrl: 'app/blocks/util/directives/DatetimePickerView.html',
            scope: {
                value: '=',
                showDate: '=?',
                showTime: '=?',
                maxDate: '=?',
                label: '@',
                format: '=?',
                minDate: '=?'
            },
            link: initConf
        };

        function initConf(scope, element, attrs) {
            if (attrs.showTime === null) {
                attrs.showTime = true;
            }
            if (attrs.showDate === null) {
                attrs.showDate = true;
            }

            scope.timePickerOptions = {
                step: 15,
                timeFormat: 'H:i'
            };

        }
    }

    DatetimePickerController.$inject = [
        '$filter',
        '$scope'
    ];
    /* @ngInject */
    function DatetimePickerController($filter, $scope) {
        var vm = this;

        vm.format = vm.format || defaultDateFormat;

        vm.showDate = vm.showDate || true;
        vm.showTime = vm.showTime || true;

        if (vm.value) {
            vm.timeValue = $scope.value;
            vm.dateValue = $scope.value;
        } else {
            vm.timeValue = null;
            vm.dateValue = null;
        }

        $scope.$watch('vm.timeValue', combineDateTime);
        $scope.$watch('vm.dateValue', combineDateTime);
        $scope.$watch('vm.value', valueChanged);

        function valueChanged(newValue) {
            if (!newValue) {
                vm.timeValue = null;
                vm.dateValue = null;
            }
        }

        function combineDateTime(newValue, oldValue) {
            if (oldValue !== null && newValue === null) {
                if (vm.dateValue === null) {
                    vm.timeValue = null;
                    vm.dateValue = null;
                    vm.value = undefined;
                }
            }

            if (vm.dateValue) {
                vm.value = vm.dateValue;
                if (vm.timeValue === null) {
                    var now = new Date();
                    vm.value.setHours(now.getHours());
                    vm.value.setMinutes(now.getMinutes());
                }
            }

            if (vm.timeValue) {
                if (vm.dateValue === null) {
                    vm.value = new Date();
                }
                vm.timeValueStr = formatTime(vm.timeValue);
                var timeParts = vm.timeValueStr.split(':');
                vm.value.setHours(timeParts[0]);
                vm.value.setMinutes(timeParts[1]);
            }

            if (vm.value === null) {
                vm.timeValue = null;
                vm.dateValue = null;
            } else {
                vm.timeValue = vm.value;
                vm.dateValue = vm.value;
            }

        }

        function formatTime(date) {
            return $filter('date')(date, "HH:mm");
        }

    }
})(angular);
