/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('sort', sortDirective)
        .directive('sortBy', sortByDirective);

    function sortDirective() {
        return {
            restrict: 'A',
            controller: SortController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                predicate: '=sort',
                ascending: '=',
                callback: '&'
            }
        };
    }

    SortController.$inject = [
        '$scope',
        '$element'
    ];
    /* @ngInject */
    function SortController($scope, $element) {
        var vm = this;

        vm.applyClass = applyClass;
        vm.resetClasses = resetClasses;
        vm.sort = sort;
        vm.triggerApply = triggerApply;

        $scope.$watchGroup(
            [
                'vm.predicate',
                'vm.ascending'
            ], vm.triggerApply
        );
        vm.triggerApply();

        function applyClass(element) {
            var thisIcon = element.find('span.glyphicon');
            var sortIcon = 'glyphicon-sort';
            var sortAsc = 'glyphicon-sort-by-attributes';
            var sortDesc = 'glyphicon-sort-by-attributes-alt';
            var remove = sortIcon + ' ' + sortDesc;
            var add = sortAsc;

            if (!vm.ascending) {
                remove = sortIcon + ' ' + sortAsc;
                add = sortDesc;
            }

            vm.resetClasses();
            thisIcon.removeClass(remove);
            thisIcon.addClass(add);
        }

        function resetClasses() {
            var allThIcons = $element.find('span.glyphicon');
            var sortIcon = 'glyphicon-sort';
            var sortAsc = 'glyphicon-sort-by-attributes';
            var sortDesc = 'glyphicon-sort-by-attributes-alt';

            allThIcons.removeClass(sortAsc + ' ' + sortDesc);
            allThIcons.addClass(sortIcon);
        }

        function sort(field) {
            if (field !== vm.predicate) {
                vm.ascending = true;
            } else {
                vm.ascending = !vm.ascending;
            }
            vm.predicate = field;
            $scope.$apply();
            vm.callback();
        }

        function triggerApply(values) {
            vm.resetClasses();
            if (values && values[0] !== '_score') {
                vm.applyClass($element.find('th[sort-by=\'' + values[0] + '\']'));
            }
        }
    }

    function sortByDirective() {
        return {
            restrict: 'A',
            scope: false,
            require: '^sort',
            link: link
        };

        /////////////////////

        function link(scope, element, attrs, parentCtrl) {
            element.bind(
                'click', function () {
                    parentCtrl.sort(attrs.sortBy);
                }
            );
        }
    }
})(angular);
