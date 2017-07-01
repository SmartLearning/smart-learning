/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.settings')
        .run(runSettings);

    runSettings.$inject = [
        'routerHelper',
        'AccountConstants'
    ];
    /* @ngInject */
    function runSettings(routerHelper, AccountConstants) {
        routerHelper.configureStates(getStates(AccountConstants));
    }

    function getStates(AccountConstants) {
        return [
            {
                state: 'settings',
                config: {
                    url: '/settings',
                    parent: 'app',
                    data: {
                        authorities: AccountConstants.getAllRoles(),
                        pageTitle: 'settings.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/account/settings/SettingsView.html',
                            controller: 'SettingsController',
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
        $translatePartialLoader.addPart('settings');
        return $translate.refresh();
    }
})(angular);
