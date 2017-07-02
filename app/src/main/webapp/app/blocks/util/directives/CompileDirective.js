/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('compile', compileDirective);

    compileDirective.$inject = [];
    /* @ngInject */
    function compileDirective() {
        return link;

        ///////////

        function link(scope, element, attrs) {
            try {
                element.html(attrs.compile);
            } catch (e) {
                console.log(e);
                element.html('Error Occurred');
            }
        }
    }

})(angular);
