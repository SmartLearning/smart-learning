/**
 * Developed by Yakup Kaya (yakupkaya@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('focusMe', FocusMeDirective);

    function FocusMeDirective($timeout) {
        return {
            restrict: 'AC',
            link: function (_scope, _element) {
                $timeout(function () {
                    _element[0].focus();
                }, 500);
            }
        };
    }


})(angular);

