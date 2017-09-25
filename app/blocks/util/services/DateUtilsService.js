/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 *
 * Convert Date Fields into Date Objects
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .service('DateUtils', DateUtilsService);

    DateUtilsService.$inject = ['$filter'];
    /* @ngInject */
    function DateUtilsService($filter) {
        this.convertLocalDateToServer = convertLocalDateToServer;
        this.convertLocalDateFromServer = convertLocalDateFromServer;
        this.convertDateTimeFromServer = convertDateTimeFromServer;
        this.formatWithoutSeconds = formatWithoutSeconds;
        this.formatShort = formatShort;
        this.format = format;
        this.fromServer = fromServer;
        this.toServer = toServer;
        this.pureData = pureData;
        this.getFormattedDate = getFormattedDate;
        // common date format for all date input fields
        this.dateformat = format;

        ///////////////////////////////////////////////////

        function convertLocalDateToServer(date) {
            if (date) {
                return $filter('date')(date, serverFormat(), 'UTC');
            } else {
                return null;
            }
        }

        function getFormattedDate(date, dateFormat) {
            if (date) {
                return angular.isUndefined(dateFormat) ? $filter('date')(date, format()) : $filter('date')(date, dateFormat);
            }
            return null;
        }

        function convertLocalDateFromServer(date, format) {
            if (date) {
                var dateLongValue = Date.parse(date);
                return getFormattedDate(dateLongValue, format);
            }
            return null;
        }

        function convertStringDateToServer(date) {
            if (date) {
                var dateLongValue = Date.parse(date);
                return getFormattedDate(dateLongValue, serverFormat());
            }
            return null;
        }

        function convertDateTimeFromServer(date) {
            if (date) {
                return new Date(date);
            } else {
                return null;
            }
        }

        function changeDate(item, fields) {
            if (item.modifiedAt) {
                item.untouchedModifiedAt = item.modifiedAt;
                item.modifiedAt = convertLocalDateFromServer(item.modifiedAt);
            }

            if (item.createdAt) {
                item.untouchedCreatedAt = item.createdAt;
                item.createdAt = convertLocalDateFromServer(item.createdAt);
            }

            if (angular.isArray(fields)) {
                angular.forEach(fields, iterateField);
            }

            //////////////////////////////////////////////////

            function iterateField(row) {
                if (item[row]) {
                    item[row + 'Touched'] = convertLocalDateFromServer(item[row]);
                }
            }
        }

        function changeToServerDate(item, fields) {
            if (item.modifiedAt) {
                if (angular.isString(item.modifiedAt)) {
                    item.modifiedAt = convertStringDateToServer(item.modifiedAt);
                } else {
                    item.modifiedAt = convertLocalDateToServer(item.modifiedAt);
                }
            }

            if (item.createdAt) {
                if (angular.isString(item.createdAt)) {
                    item.createdAt = convertStringDateToServer(item.createdAt);
                } else {
                    item.createdAt = convertLocalDateToServer(item.createdAt);
                }
            }

            if (angular.isArray(fields)) {
                angular.forEach(fields, iterateField);
            }

            //////////////////////////////////////////////////

            function iterateField(row) {
                var value = item[row];
                if (value) {
                    if (angular.isString(value)) {
                        value = convertStringDateToServer(value);
                    } else {
                        value = convertLocalDateToServer(value);
                    }

                    item[row] = value;
                }
            }
        }

        function pureData(data) {
            return angular.fromJson(angular.toJson(data));
        }

        function fromServer(data, fields) {
            if (!data) {
                return {};
            }

            data = angular.fromJson(data);

            return searchForAllDates(data, false, fields);
        }

        function toServer(data, fields) {
            if (!data) {
                return '';
            }
            data = searchForAllDates(data, true, fields);
            return angular.toJson(data);
        }

        function removeAngularObjects(data) {
            return angular.fromJson(angular.toJson(data));
        }

        function searchForAllDates(data, toServer, fields) {
            if (angular.isObject(data)) {
                if (toServer) {
                    data=removeAngularObjects(data);
                    changeToServerDate(data, fields);
                } else {
                    changeDate(data, fields);
                }
                angular.forEach(data, onIterate);
            }
            return data;

            /////////////////////////////////////////

            function onIterate(item) {
                searchForAllDates(item, toServer, fields);
            }
        }

        function formatWithoutSeconds() {
            return 'EEEE, dd LLLL yyyy, HH:mm';
        }

        function formatShort() {
            return 'yyyy.MM.dd HH:mm';
        }

        function format() {
            return 'EEEE, dd LLLL yyyy, HH:mm:ss';
        }

        function serverFormat() {
            return "yyyy-MM-dd'T'HH:mm:ss.sss'Z'"
        }
    }

})(angular);
