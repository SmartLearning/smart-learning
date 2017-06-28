(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('localeOrderBy', LocaleOrderBy);

    LocaleOrderBy.$inject = [];
    /* @ngInject */
    function LocaleOrderBy() {
        return compare;

        ////////////////

        function compare(items, field) {
            var filtered = [];

            angular.forEach(items, onPush);

            filtered.sort(onSort);

            return filtered;

            function onSort(a, b) {
                var aa = a[field].toLocaleLowerCase();
                var bb = b[field].toLocaleLowerCase();
                return aa.localeCompare(bb)
            }

            function onPush(item) {
                filtered.push(item);
            }

        }
    }

})(angular);
