/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('showValidation', showValidationDirective);

    showValidationDirective.$inject = [];
    /* @ngInject */
    function showValidationDirective() {
        return {
            restrict: 'A',
            require: 'form',
            link: link
        };

        ////////////////

        function link(scope, element) {
            element.find('.form-group').each(
                function () {
                    var $formGroup = angular.element(this);
                    var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

                    if ($inputs.length > 0) {
                        $inputs.each(
                            function () {
                                var $input = angular.element(this);
                                scope.$watch(
                                    function () {
                                        return $input.hasClass('ng-invalid') && $input.hasClass('ng-dirty');
                                    }, function (isInvalid) {
                                        $formGroup.toggleClass('has-error', isInvalid);
                                    }
                                );
                            }
                        );
                    }
                }
            );
        }
    }
})(angular);
