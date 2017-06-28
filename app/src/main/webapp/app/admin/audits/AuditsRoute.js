/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.audits')
        .run(runAudits);

    runAudits.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runAudits(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'audits',
                config: {
                    url: '/audits',
                    parent: 'admin',
                    data: {
                        pageTitle: 'audits.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/audits/AuditsView.html',
                            controller: 'AuditsController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language
                    },
                    menu: {
                        icon: 'report_problem',
                        text: 'global.menu.admin.audits',
                        order: 1
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
        $translatePartialLoader.addPart('audits');
        return $translate.refresh();
    }
})(angular);
