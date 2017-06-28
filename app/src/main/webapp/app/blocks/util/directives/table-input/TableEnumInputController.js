/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .controller('TableEnumInputController', TableEnumInputController);

    TableEnumInputController.$inject = [
        '$mdDialog',
        '$q',
        'config'
    ];
    /* @ngInject */
    function TableEnumInputController($mdDialog, $q, config) {
        var vm = this;

        vm.config = config || {};
        vm.items = [];
        vm.page = -1;
        vm.busy = false;

        vm.onSearch = search;
        vm.dismiss = dismiss;
        vm.apply = apply;
        vm.onItemClick = onItemClick;
        vm.displayField = displayField;

        activate();

        //////////////////////////////////

        function activate() {
            var initialData = {
                size: 10,
                minLength: 0,
                displayField: 'text',
                method: angular.noop,
                hint: 'global.customDataTable.query_hint',
                pagination: true,
                selectedField: false //if it is set to false, it means the whole data will be returned
            };
            vm.config = angular.merge(initialData, vm.config);
        }

        function search(query, resetPage) {
            if (vm.busy) {
                vm.busy = false;
                return $q.resolve(vm.items);
            }

            vm.busy = true;

            if (!resetPage && vm.config.pagination) {
                vm.page++;
            } else {
                vm.page = 0;
            }

            return vm.config.method(
                {size: vm.config.size, page: vm.page},
                query
            ).then(onSuccess, onError);

            //////////////////////////////////////

            function onSuccess(data) {
                vm.busy = data.length === 0;

                if (resetPage) {
                    vm.items.splice(0, vm.items.length)
                }
                if (angular.isFunction(vm.config.onBeforeAdd)) {
                    vm.config.onBeforeAdd(data);
                }
                vm.items.push.apply(vm.items, data);

                return vm.items;
            }

            function onError(error) {
                vm.busy = false;
                console.error(error);
            }
        }

        function onItemClick(event, item) {
            if (item.disabled) {
                event.stopPropagation();
                event.preventDefault();
            }
        }

        function displayField(item) {
            if (angular.isFunction(vm.config.displayField)) {
                return vm.config.displayField(item);
            }

            return item[vm.config.displayField];
        }

        function apply() {
            var data = vm.model;

            if (vm.config.selectedField !== false) {
                data = data[vm.config.selectedField];
            }

            $mdDialog.hide(data);
        }

        function dismiss() {
            $mdDialog.cancel();
        }
    }

})(angular);
