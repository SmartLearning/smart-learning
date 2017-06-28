/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('datetime', datetimeDirective);

    datetimeDirective.$inject = ['moment'];
    /* @ngInject */
    function datetimeDirective(moment) {
        return {
            link: link,
            require: '^ngModel',
            restrict: 'A',
            scope: {
                datetime: '@'
            }
        };

        //////////////////

        function link(scope, elm, attrs, ctrl) {
            var dateFormat = attrs.datetime;

            ctrl.$formatters.unshift(
                function (modelValue) {
                    if (!dateFormat || !modelValue) {
                        return '';
                    }
                    console.log(modelValue, moment(modelValue, 'yyyy/MM/dd HH:mm:ss z'));
                    return dateFormat;
                }
            );

            ctrl.$parsers.unshift(
                function (viewValue) {
                    var date = moment(viewValue, dateFormat);
                    return (date && date.isValid() && date.year() > 1950) ? date.toDate() : '';
                }
            );
        }
    }

})(angular);
