/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('onEnterKey', OnEnterKeyDirective);

    OnEnterKeyDirective.$inject = [];
    /* @ngInject */
    function OnEnterKeyDirective() {
        return directive;

        ////////////////////////////////////////////////////////////

        function directive(scope, element, attrs) {
            element.bind("keydown keypress", listener);

            /////////////////////////////////////////////////////////

            function listener(event) {
                var keyCode = event.which || event.keyCode;
                if (keyCode === 13) {
                    scope.$apply(apply);
                    event.preventDefault();
                }

                //////////////////////////////////////////////////

                function apply() {
                    scope.$eval(attrs.onEnterKey);
                }
            }
        }
    }

})(angular);
