/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .filter('object', ObjectFilter)
        .filter('showObject', ShowObjectFilter);

    function ObjectFilter() {
        return objectFilter;

        ////////////////

        function objectFilter(input, path, asArray) {
            if (angular.isString(path)) {
                path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
                path = path.replace(/^\./, '');           // strip a leading dot
                var pathArr = path.split('.');
                var value = angular.extend({}, input);
                angular.forEach(
                    pathArr, function (item) {
                        try {

                            var val = asArray ? [] : '';
                            if (angular.isArray(value)) {
                                angular.forEach(
                                    value, function (current, index) {
                                        if (asArray) {
                                            val.push(current[item]);
                                        } else {
                                            val += current[item] + (index < value.length - 1 ? ',' : '');
                                        }
                                    }
                                );
                            } else {
                                var current = value[item];
                                if (asArray && !angular.isArray(current)) {
                                    val = [current];
                                } else {
                                    val = current;
                                }
                            }

                            value = val;
                        } catch (e) {
                            if (asArray) {
                                value = [];
                            } else {
                                value = '';
                            }
                        }
                    }
                );
            }
            return value;
        }
    }

    ShowObjectFilter.$inject = ['$filter'];
    /* @ngInject */
    function ShowObjectFilter($filter) {
        return showObject;

        ////////////////

        function showObject(input, layout) {
            var format = $filter('format');
            var output = '';
            var container = '<div class="configuration" layout="{1}" layout-align="center start">{0}</div>';
            var data = '<div class="md-list-item-text" layout="row" layout-align="{2}"><strong>{0}:</strong><div layout-margin>{1}</div></div>';

            if (angular.isObject(input)) {
                angular.forEach(
                    input, function (value, key) {
                        if (angular.isObject(value)) {
                            output += format(data, key, showObject(angular.extend({}, value, 'start start'), 'column'));
                        } else {
                            output += format(data, key, value, 'center center');
                        }
                    }
                );
            }

            return format(container, output, (layout ? layout : 'column'));
        }
    }

})(angular);
