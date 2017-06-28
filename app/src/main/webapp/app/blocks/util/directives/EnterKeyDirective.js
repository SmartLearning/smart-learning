/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('onEnterKey', onEnterKeyDirective);

    onEnterKeyDirective.$inject = [];
    /* @ngInject */
    function onEnterKeyDirective() {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                var keyCode = event.which || event.keyCode;
                if (keyCode === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.onEnterKey);
                    });
                    event.preventDefault();
                }
            });
        }
    }

})(angular);
