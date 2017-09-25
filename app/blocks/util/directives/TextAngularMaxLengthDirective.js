/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('textAngularMaxLength', textAngularMaxLength);

    textAngularMaxLength.$inject = [];
    /* @ngInject */
    function textAngularMaxLength() {
        return {
            require: 'ngModel',
            link: link
        };

        ///////////////////////

        function link(scope, element, attrs, ctrl) {

            ctrl.$validators.textAngularMaxLength = textAngularMaxLength;

            ////////////////////////////////////////

            function textAngularMaxLength(modelValue, viewValue) {

                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }

                if (attrs.textAngularMaxLength && attrs.textAngularMaxLength.length > 0) {
                    return viewValue.length <= parseInt(attrs.textAngularMaxLength);
                }

                return true;
            }

        }

    }

})(angular);
