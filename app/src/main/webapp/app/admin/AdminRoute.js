/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('app.admin')
        .run(runAdmin);

    runAdmin.$inject = [
        'routerHelper',
        'AccountConstants'
    ];
    /* @ngInject */
    function runAdmin(routerHelper, AccountConstants) {
        routerHelper.configureStates(getStates(AccountConstants));
    }

    function getStates(AccountConstants) {
        return [
            {
                state: 'admin',
                config: {
                    url: '/admin',
                    parent: 'app',
                    abstract: true,
                    data: {
                        authorities: AccountConstants.getAllRoles(true),
                        menu: {
                            groupOrder: 10
                        }
                    }
                }
            }
        ];
    }
})(angular);

