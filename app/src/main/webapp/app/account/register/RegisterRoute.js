/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.register')
        .run(runRegister);

    runRegister.$inject = ['routerHelper'];
    /* @ngInject */
    function runRegister(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'register',
                config: {
                    url: '/register',
                    parent: 'account',
                    data: {
                        authorities: [],
                        pageTitle: 'register.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/account/register/RegisterView.html',
                            controller: 'RegisterController',
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
        $translatePartialLoader.addPart('account');
        return $translate.refresh();
    }
})(angular);
