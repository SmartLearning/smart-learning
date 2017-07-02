/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.user')
        .run(runUser);

    runUser.$inject = [
        'routerHelper',
        'AccountConstants'
    ];
    /* @ngInject */
    function runUser(routerHelper, AccountConstants) {
        routerHelper.configureStates(getStates(AccountConstants));
    }

    function getStates(AccountConstants) {
        return [
            {
                state: 'user',
                config: {
                    url: '/users',
                    abstract: true,
                    parent: 'admin',
                    data: {
                        authorities: AccountConstants.getAllRoles(true),
                        pageTitle: 'user.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/user/UserView.html',
                            controller: 'UserController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language
                    }
                }
            }
        ];
    }

    language.$inject = [
        '$translate',
        '$translatePartialLoader'
    ];
    /* @ngInject */
    function language($translate, $translatePartialLoader) {
        $translatePartialLoader.addPart('user');
        return $translate.refresh();
    }
})(angular);
