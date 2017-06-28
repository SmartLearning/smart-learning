/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('errorSrc', ErrorSrcDirective);

    ErrorSrcDirective.$inject = [];
    /* @ngInject */
    function ErrorSrcDirective() {
        return {
            link: link,
            scope: {}
        };

        /////////////////////

        function link(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.errorSrc) {
                    attrs.$set('src', attrs.errorSrc);
                }
            });
        }
    }

})(angular);
