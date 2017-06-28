/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular.module('account.login')
        .run(runLogin);

    runLogin.$inject = ['routerHelper'];
    /* @ngInject */
    function runLogin(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'login',
                config: {
                    url: '/login',
                    parent: 'account',
                    data: {
                        pageTitle: 'layout.sidebar.login'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/account/login/LoginView.html',
                            controller: 'LoginController',
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
        $translatePartialLoader.addPart('login');
        return $translate.refresh();
    }
})(angular);
