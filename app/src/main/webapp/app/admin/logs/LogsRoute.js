/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.logs')
        .run(runLogs);

    runLogs.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runLogs(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'logs',
                config: {
                    url: '/logs',
                    parent: 'admin',
                    data: {
                        pageTitle: 'logs.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/logs/LogsView.html',
                            controller: 'LogsController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language
                    },
                    menu: {
                        icon: 'list',
                        text: 'global.menu.admin.logs',
                        order: 5
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
        $translatePartialLoader.addPart('logs');
        return $translate.refresh();
    }
})(angular);
