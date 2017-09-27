/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('smartApp')
        .run(runApp);

    runApp.$inject = ['routerHelper'];

    /* @ngInject */
    function runApp(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'app',
                config: {
                    abstract: true,
                    data: {
                        authorities: [],
                        pageTitle: 'app.title'
                    },
                    resolve: {
                        initialization: initialization,
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
        $translatePartialLoader.addPart('global');
        return $translate.refresh();
    }

    initialization.$inject = [
        '$rootScope',
        '$state',
        '$stateParams'
    ];

    /* @ngInject */
    function initialization($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
})(angular);
