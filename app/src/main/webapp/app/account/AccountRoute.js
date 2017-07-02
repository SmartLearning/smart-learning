/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.account')
        .run(runAccount);

    runAccount.$inject = ['routerHelper'];
    /* @ngInject */
    function runAccount(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'account',
                config: {
                    url: '/account',
                    abstract: true,
                    parent: 'app',
                    data: {
                        authorities: []
                    }
                }
            }
        ];
    }
})(angular);
