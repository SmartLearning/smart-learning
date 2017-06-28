/**
 * Developed by Navid Ghahremani (ghahramani.navid@gmail.com)
 */

(function (angular) {
    'use strict';

    angular
        .module('admin.analyzes')
        .run(runAnalyzes);

    runAnalyzes.$inject = [
        'routerHelper'
    ];
    /* @ngInject */
    function runAnalyzes(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'analyzes',
                config: {
                    url: '/analyzes',
                    parent: 'admin',
                    data: {
                        pageTitle: 'analyzes.title'
                    },
                    views: {
                        'content@': {
                            templateUrl: 'app/admin/analyzes/AnalyzesView.html',
                            controller: 'AnalyzesController',
                            controllerAs: 'vm'
                        }
                    },
                    resolve: {
                        language: language
                    },
                    menu: {
                        icon: 'graphic_eq',
                        text: 'global.menu.admin.analyzes',
                        order: 6
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
        $translatePartialLoader.addPart('analyzes');
        return $translate.refresh();
    }
    
})(angular);
