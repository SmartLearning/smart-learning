/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.health')
        .run(runHealth);

    runHealth.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runHealth(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'health',
                config: {
                    url: '/health',
                    parent: 'admin',
                    data: {
                        pageTitle: 'health.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/health/HealthView.html',
                            controller: 'HealthController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language
                    },
                    menu: {
                        icon: 'fa fa-heartbeat fa-md-size',
                        text: 'global.menu.admin.health',
                        order: 4
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
        $translatePartialLoader.addPart('health');
        return $translate.refresh();
    }
})(angular);
