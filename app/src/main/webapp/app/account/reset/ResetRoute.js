/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular.module('account.reset')
        .run(runReset);

    runReset.$inject = ['routerHelper'];
    /* @ngInject */
    function runReset(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'reset',
                config: {
                    url: '/reset',
                    parent: 'account',
                    abstract: true,
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
