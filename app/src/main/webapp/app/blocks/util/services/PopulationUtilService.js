/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('PopulationUtil', PopulationUtilService);

    PopulationUtilService.$inject = [];
    /* @ngInject */
    function PopulationUtilService() {
        this.populateBy = populateBy;

        /////////////////////////////////////////////

        /**
         *
         * @param deferred which you need to resolve or invoke error
         * @param factoryFunc the function which you need to get data from, it has to define Array<ENTITY> methodName(Array[String])
         * @param localProperty the property that you need to convert it from the object
         * @param remoteConvertedProperty the property that you has same value of localProperty
         * @param remoteProperty the property that you need to replace it with localProperty
         * @param convertedProperty the property name that you want to put in your entity after getting from remote
         * @returns {Function}
         */
        function populateBy(deferred, factoryFunc, localProperty, remoteConvertedProperty, remoteProperty, convertedProperty) {
            return function (result) {
                var temp = result.data || result;
                var data = angular.isArray(temp) ? temp : [temp];

                var ids = {};
                angular.forEach(data, onResultSuccess, ids);

                var keys = Object.keys(ids);

                if (keys.length === 0) {
                    deferred && deferred.resolve(result);
                    return;
                }

                var func = factoryFunc(keys);
                var scope = func;
                var then = func.then;

                if (func.$promise) {
                    scope = func.$promise;
                    then = scope.then;
                }

                then.apply(scope, [
                    onThen,
                    deferred && deferred.reject
                ]);

                /////////////////////////////////

                function onResultSuccess(entity) {
                    var vm = this;
                    var val = fetchNestedObject(entity, localProperty);

                    if (angular.isUndefined(val) || val == null) {
                        return;
                    }

                    if (!vm[val]) {
                        vm[val] = [];
                    }
                    vm[val].push(entity);
                }

                function onThen(items) {
                    angular.forEach(items, iterateOnItems);
                    deferred && deferred.resolve(result);

                    ///////////////////////////////

                    function iterateOnItems(response) {
                        var val = fetchNestedObject(response, remoteConvertedProperty);
                        var rows = ids[val];
                        angular.forEach(rows, iterateOnRow);

                        /////////////////////////////////

                        function iterateOnRow(item) {
                            var key = convertedProperty || localProperty;
                            setValue(item, key + 'Attached', response);
                            setValue(item, key, fetchNestedObject(response, remoteProperty));
                        }
                    }
                }

                /**
                 * @obj: the json object to change
                 * @access: string dot separates route to value
                 * @value: new value
                 */
                function setValue(obj, access, value) {
                    if (angular.isString(access)) {
                        access = access.split('.');
                    }
                    if (access.length > 1) {
                        setValue(obj[access.shift()], access, value);
                    } else {
                        obj[access[0]] = value;
                    }
                }

                function fetchNestedObject(item, key) {
                    if (item == null || !angular.isString(key)) {
                        return item;
                    }

                    var value = angular.copy(item);
                    var nestedKeys = key.split('.');
                    angular.forEach(nestedKeys, fetchValue, value);

                    return value;

                    //////////////////////////////////////

                    function fetchValue(key) {
                        if (value) {
                            value = value[key];
                        }
                    }
                }
            };
        }
    }

})(angular);
