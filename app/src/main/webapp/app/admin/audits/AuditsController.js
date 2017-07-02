/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.audits')
        .controller('AuditsController', AuditsController);

    AuditsController.$inject = [
        'moment',
        '$mdpDatePicker',
        'Audits',
        'ResponseUtil'
    ];
    /* @ngInject */
    function AuditsController(moment, $mdpDatePicker, Audits, ResponseUtil) {
        var vm = this;
        var format = 'YYYY-MM-DD';

        vm.today = today;
        vm.loadAll = loadAll;
        vm.onPageChange = onPageChange;
        vm.onReorder = onReorder;
        vm.clearFilter = clearFilter;
        vm.previousMonth = previousMonth;
        vm.showDatePicker = showDatePicker;
        vm.fromDate = null;
        vm.toDate = null;
        vm.data = [];
        vm.pagination = {
            page: 1,
            size: 10,
            sort: ['timestamp,desc'],
            options: [
                10,
                25,
                50,
                100
            ]
        };
        vm.headers = [
            {
                text: 'audits.principal.title',
                field: 'principal'
            },
            {
                text: 'audits.type.title',
                field: 'type'
            },
            {
                text: 'audits.timestamp.title',
                field: 'timestampTouched'
            },
            {
                text: 'audits.message.title',
                cellTemplateUrl: 'app/admin/audits/MessageCellTemplateView.html'
            }
        ];

        activate();

        ////////////////

        function activate() {
            clearFilter();
        }

        function loadAll() {
            Audits.query(
                {
                    page: vm.pagination.page - 1,
                    size: vm.pagination.size,
                    sort: vm.pagination.sort,
                    fromDate: vm.fromDate,
                    toDate: vm.toDate
                }, onSuccess
            );

            ////////////////////////////////

            function onSuccess(result, headers) {
                vm.data = result;
                vm.links = ResponseUtil.parseLink(headers('link'));
                vm.totalItems = headers('X-Total-Count');
            }
        }

        function onPageChange(page, size) {
            vm.pagination.page = page || vm.pagination.page;
            vm.pagination.size = size || vm.pagination.size;
            vm.loadAll();
        }

        function onReorder(order) {
            vm.pagination.sort = ResponseUtil.buildSort(order);
            vm.loadAll();
        }

        // Date picker configuration
        function today() {
            vm.toDate = moment().local().startOf('day').format(format);
        }

        function previousMonth() {
            vm.fromDate = moment().local().subtract(1, 'months').startOf('day').format(format);
        }

        function showDatePicker(ev, key) {
            $mdpDatePicker(new Date(), {targetEvent: ev}).then(onSetDateSuccess);

            /////////////////////////

            function onSetDateSuccess(date) {
                vm[key] = moment(date).local().startOf('day').format(format);
            }
        }


        function clearFilter() {
            vm.today();
            vm.previousMonth();
            vm.loadAll();
        }
    }

})(angular);
