/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.blocks')
        .directive('hasAnyAuthority', hasAnyAuthority)
        .directive('hasAuthority', hasAuthority);

    hasAnyAuthority.$inject = ['Principal'];
    /* @ngInject */
    function hasAnyAuthority(Principal) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            var authorities = attrs.hasAnyAuthority.replace(/\s+/g, '').split(',');

            var setVisible = function () {
                    element.removeClass('ng-hide');
                },
                setHidden = function () {
                    element.addClass('ng-hide');
                },
                defineVisibility = function (reset) {
                    var result;
                    if (reset) {
                        setVisible();
                    }

                    result = Principal.hasAnyAuthority(authorities);
                    if (result) {
                        setVisible();
                    } else {
                        setHidden();
                    }
                };

            if (authorities.length > 0) {
                defineVisibility(true);

                scope.$watch(
                    function () {
                        return Principal.isAuthenticated();
                    }, function () {
                        defineVisibility(true);
                    }
                );
            }
        }
    }

    hasAuthority.$inject = ['Principal'];
    /* @ngInject */
    function hasAuthority(Principal) {
        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            var authority = attrs.hasAuthority.replace(/\s+/g, '');

            var setVisible = function () {
                    element.removeClass('ng-hide');
                },
                setHidden = function () {
                    element.addClass('ng-hide');
                },
                defineVisibility = function (reset) {

                    if (reset) {
                        setVisible();
                    }

                    Principal.hasAuthority(authority)
                        .then(
                            function (result) {
                                if (result) {
                                    setVisible();
                                } else {
                                    setHidden();
                                }
                            }
                        );
                };

            if (authority.length > 0) {
                defineVisibility(true);

                scope.$watch(
                    function () {
                        return Principal.isAuthenticated();
                    }, function () {
                        defineVisibility(true);
                    }
                );
            }
        }
    }

})(angular);
