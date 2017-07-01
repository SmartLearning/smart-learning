/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.logs')
        .controller('LogsController', LogsController);

    LogsController.$inject = [
        '$filter',
        'Logs'
    ];
    /* @ngInject */
    function LogsController($filter, Logs) {
        var vm = this;

        vm.realData = [];
        vm.data = [];
        vm.loadAll = loadAll;
        vm.onPageChange = onPageChange;
        vm.onReorder = onReorder;
        vm.onFilter = onFilter;
        vm.pagination = {
            page: 1,
            size: 10,
            sort: ['name,desc'],
            options: [
                10,
                25,
                50,
                100
            ]
        };
        vm.headers = [
            {
                text: 'logs.name.title',
                field: 'name'
            },
            {
                text: 'logs.level.title',
                cellTemplateUrl: 'app/admin/logs/ButtonsCellTemplateView.html',
                changeLevel: changeLevel,
                buttons: [
                    {
                        activeClass: 'md-raised md-primary md-hue-1',
                        text: 'logs.buttons.trace',
                        value: 'TRACE'
                    },
                    {
                        activeClass: 'md-raised md-primary md-hue-3',
                        text: 'logs.buttons.debug',
                        value: 'DEBUG'
                    },
                    {
                        activeClass: 'md-raised md-accent',
                        text: 'logs.buttons.info',
                        value: 'INFO'
                    },
                    {
                        activeClass: 'md-raised md-warn md-hue-1',
                        text: 'logs.buttons.warn',
                        value: 'WARN'
                    },
                    {
                        activeClass: 'md-raised md-warn md-hue-3',
                        text: 'logs.buttons.error',
                        value: 'ERROR'
                    }
                ]
            }
        ];

        activate();

        ////////////////

        function activate() {
            vm.promise = Logs.findAll(onSuccess).$promise;

            //////////////////////////////////////////////////////

            function onSuccess(result) {
                vm.realData = result;
                vm.loadAll();
            }
        }


        function onFilter() {
            vm.pagination.page = 1;
            vm.loadAll();
        }

        function loadAll() {
            var order = vm.pagination.sort || [vm.headers[0].field];

            var orderBy = $filter('orderBy');
            var filter = $filter('filter');
            var data = angular.copy(vm.realData);

            angular.forEach(order, onOrder);
            data = filter(data, vm.filter);
            vm.totalItems = data.length;

            var start = (vm.pagination.page - 1) * vm.pagination.size;
            data = data.slice(start, start + vm.pagination.size);

            vm.data.length = 0;
            vm.data.push.apply(vm.data, data);

            ////////////////////////////////////////////////////

            function onOrder(order) {
                data = orderBy(data, order.split(',')[0].replace('-', ''), order.indexOf('desc') === -1);
            }
        }

        function onPageChange(page, count) {
            vm.pagination.page = page;
            vm.pagination.size = count;
            vm.loadAll();
        }

        function onReorder(order) {
            vm.order = order;
            vm.loadAll();
        }

        function changeLevel(model, level) {
            if (model.level === level) {
                return;
            }
            vm.promise = Logs.changeLevel(
                {
                    name: model.name,
                    level: level
                }, activate
            ).$promise;
        }
    }

})(angular);
