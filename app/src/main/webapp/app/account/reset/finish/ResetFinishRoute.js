/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular.module('reset.finish')
        .run(runResetFinish);

    runResetFinish.$inject = ['routerHelper'];
    /* @ngInject */
    function runResetFinish(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'finish',
                config: {
                    url: '/finish?key',
                    parent: 'reset',
                    data: {
                        authorities: [],
                        pageTitle: 'reset.finish.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/account/reset/finish/ResetFinishView.html',
                            controller: 'ResetFinishController',
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
        $translatePartialLoader.addPart('reset');
        return $translate.refresh();
    }
})(angular);
