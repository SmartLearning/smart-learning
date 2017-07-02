/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.password')
        .run(passwordSettings);

    passwordSettings.$inject = [
        'routerHelper',
        'AccountConstants'
    ];
    /* @ngInject */
    function passwordSettings(routerHelper, AccountConstants) {
        routerHelper.configureStates(getStates(AccountConstants));
    }

    function getStates(AccountConstants) {
        return [
            {
                state: 'password',
                config: {
                    url: '/password',
                    parent: 'app',
                    data: {
                        authorities: AccountConstants.getAllRoles(),
                        pageTitle: 'password.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/account/password/PasswordView.html',
                            controller: 'PasswordController',
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
        $translatePartialLoader.addPart('password');
        return $translate.refresh();
    }
})(angular);
