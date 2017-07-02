/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('autocompleteInfiniteScroll', AutocompleteInfiniteScrollDirective);

    AutocompleteInfiniteScrollDirective.$inject = ['$interval'];
    /* @ngInject */
    function AutocompleteInfiniteScrollDirective($interval) {
        return {
            link: link,
            restrict: 'A'
        };

        function link(scope, el, attrs) {
            var now = new Date().getTime();

            var interval = $interval(checkTillExists, 100);

            ///////////////////////////////////////

            function checkTillExists() {
                var rep = angular.element(document.getElementsByClassName("md-virtual-repeat-scroller"));

                if (rep === null || rep.length === 0) {
                    return;
                }

                $interval.cancel(interval);

                rep.on('scroll', onScroll);

                scope.$on('$destroy', removeEvent);

                //////////////////////////////////////

                function removeEvent() {
                    rep.off('scroll', onScroll);
                }

                function onScroll(evt) {
                    if (rep[0].scrollTop + rep[0].offsetHeight >= rep[0].scrollHeight) {
                        var time = new Date().getTime();
                        if (time - now > 100) {
                            now = time;
                            scope.$apply(apply);
                        }
                    }

                    /////////////////////////////////

                    function apply() {
                        scope.$eval(attrs.autocompleteInfiniteScroll);
                    }
                }
            }
        }
    }

})(angular);

