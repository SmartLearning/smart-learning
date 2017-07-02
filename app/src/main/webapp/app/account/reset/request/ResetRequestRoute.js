/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular.module('reset.request')
        .run(runResetRequest);

    runResetRequest.$inject = ['routerHelper'];
    /* @ngInject */
    function runResetRequest(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'request',
                config: {
                    url: '/request',
                    parent: 'reset',
                    data: {
                        authorities: [],
                        pageTitle: 'reset.request.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/account/reset/request/ResetRequestView.html',
                            controller: 'ResetRequestController',
                            controllerAs: 'vm'
                        }
                    }
                }
            }
        ];
    }
})(angular);
