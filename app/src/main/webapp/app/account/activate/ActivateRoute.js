/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular.module('account.activate')
        .run(runActivate);

    runActivate.$inject = ['routerHelper'];
    /* @ngInject */
    function runActivate(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'activate',
                config: {
                    url: '/activate?key',
                    parent: 'account',
                    data: {
                        authorities: [],
                        pageTitle: 'activate.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/account/activate/ActivateView.html',
                            controller: 'ActivateController',
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
        $translatePartialLoader.addPart('activate');
        return $translate.refresh();
    }
})(angular);

