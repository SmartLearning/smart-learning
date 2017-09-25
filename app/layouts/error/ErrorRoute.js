/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.layout')
        .run(runLayout);

    runLayout.$inject = ['routerHelper'];
    /* @ngInject */
    function runLayout(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'layout',
                config: {
                    url: '/layout',
                    parent: 'app',
                    abstract: true,
                    data: {
                        authorities: []
                    }
                }
            },
            {
                state: 'layout.denied',
                config: {
                    url: '/error/denied',
                    data: {
                        pageTitle: 'layout.error.denied'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/layouts/error/AccessDeniedView.html'
                        }
                    }
                }
            },
            {
                state: 'layout.error',
                config: {
                    url: '/error',
                    data: {
                        pageTitle: 'layout.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/layouts/error/ErrorView.html'
                        }
                    }
                }
            }
        ];
    }

})(angular);
