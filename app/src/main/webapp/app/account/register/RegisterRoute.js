/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('account.register')
        .run(run);

    run.$inject = ['routerHelper'];
    /* @ngInject */
    function run(routerHelper) {
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
                            templateUrl: 'app/account/register/SignUpView.html',
                            controller: 'SignUpController',
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
        $translatePartialLoader.addPart('register');
        return $translate.refresh();
    }
})(angular);
