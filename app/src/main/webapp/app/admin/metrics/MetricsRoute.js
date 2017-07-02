/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.metrics')
        .run(runMetrics);

    runMetrics.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runMetrics(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'metrics',
                config: {
                    url: '/metrics',
                    parent: 'admin',
                    data: {
                        pageTitle: 'metrics.title',
                        menu: {
                            icon: 'equalizer',
                            text: 'global.menu.admin.metrics',
                            order: 2
                        }
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/metrics/MetricsView.html',
                            controller: 'MetricsController',
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
        $translatePartialLoader.addPart('metrics');
        return $translate.refresh();
    }
})(angular);
