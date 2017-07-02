/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('splashScreen', splashScreen);

    splashScreen.$inject = ['$filter'];
    /* @ngInject */
    function splashScreen($filter) {
        return {
            replace: true,
            restrict: 'E',
            template: (function () {
                var dot = '<div class="loader--dot"></div>';
                var format = '<md-content ng-cloak class="splash-screen md-primary-bg">' +
                    '<div class="loader">{0}<div class="loader--text"></div></div>' +
                    '</md-content>';

                for (var i = 0; i < 2; i++) {
                    dot += dot;
                }

                return $filter('format')(format, dot);
            })()
        };
    }

})(angular);
