/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('CustomTableUtil', CustomTableUtilService);

    CustomTableUtilService.$inject = [];
    /* @ngInject */
    function CustomTableUtilService() {
        this.convertOrderToColumnAndOrder = convertOrderToColumnAndOrder;
        this.getValue = getValue;
        this.getFieldValue = getFieldValue;
        this.setValue = setValue;

        ////////////////

        function convertOrderToColumnAndOrder(order) {
            if (!order) {
                return order;
            }
            var sortOrder = order.charAt(0) == '-' ? 'desc' : 'asc';
            var sortColumn = order.charAt(0) == '-' ? order.substr(1) : order;
            return {
                column: sortColumn,
                order: sortOrder
            };
        }

        function setValue(model, fieldName, value) {
            fieldName = fieldName.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            fieldName = fieldName.replace(/^\./, '');           // strip a leading dot
            var a = fieldName.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (i == n - 1) {
                    model[k] = value;
                    return true;
                }
                if (!model) {
                    model = {};
                }
                if (k in model) {
                    model = model[k];
                } else {
                    return false;
                }
            }
            return false;
        }

        function getValue(model, fieldName) {
            //field name is not set then i can't get value
            if (!fieldName) {
                return null;
            }
            if (!fieldName) {
                return null;
            }
            fieldName = fieldName.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            fieldName = fieldName.replace(/^\./, '');           // strip a leading dot
            var a = fieldName.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                if (!model) {
                    return null;
                }
                var k = a[i];
                if (k in model) {
                    model = model[k];
                } else {
                    return;
                }
            }
            return model;
        }

        function getFieldValue(model, header) {
            if (angular.isObject(header) && angular.isFunction(header.get)) {
                return header.get(model);
            }

            return getValue(model, header.field);
        }
    }

})(angular);
